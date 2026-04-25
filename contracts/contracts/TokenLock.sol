// SPDX-License-Identifier: MIT
// The Dog House — TokenLock (style mirrors OpenZeppelin VestingWallet)

pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @dev A token lock is a singleton escrow contract for ERC-20 tokens. A user
 * deposits an `amount` of `token` together with an `unlockAt` timestamp; the
 * funds cannot be withdrawn until `block.timestamp >= unlockAt`.
 *
 * Unlike {VestingWallet}, no portion of the funds is releasable before the
 * unlock time — the lock is binary (locked / unlocked). Locks may be
 * extended (push the unlock time later) but never shortened.
 *
 * Each lock has its own `owner` (the address that may withdraw, extend, or
 * transfer the lock). Multiple users may have many independent locks in this
 * single contract; locks are addressed by a numeric `id` returned from
 * {createLock}.
 *
 * The contract maintains aggregate accounting so the dashboard can render
 * leaderboards on-chain without an external indexer:
 *
 *   - {tokens}  + {totalLocked(token)} → top-locked tokens
 *   - {lockers} + {totalLockedBy(user)} → top lockers
 *
 * Aggregates track CURRENTLY locked amount, decremented on withdraw.
 *
 * NOTE: When using this contract with rebase or fee-on-transfer tokens,
 * the lock records the amount actually received by this contract, not the
 * amount requested. Subsequent rebases of an already-locked token are NOT
 * reflected in {totalLocked} — the leaderboard reflects deposits, not
 * mark-to-market value.
 *
 * NOTE: Token ownership transfer ({transferLockOwnership}) reassigns the
 * lock's contribution to the per-user leaderboard from the previous owner
 * to the new owner.
 */
contract TokenLock is Context, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Lock {
        address token;       // ERC-20 token being locked
        address owner;       // who can withdraw / extend / transfer
        uint128 amount;      // remaining amount in the lock
        uint64  unlockAt;    // unix timestamp when withdraw becomes possible
        uint64  createdAt;   // unix timestamp when the lock was created
        bool    withdrawn;   // true once amount has been fully withdrawn
    }

    /// @dev All locks ever created. Index in this array is the lock `id`.
    Lock[] private _locks;

    mapping(address user  => uint256[] ids) private _locksByOwner;
    mapping(address token => uint256[] ids) private _locksByToken;

    // ── leaderboard accounting ────────────────────────────────────────────
    /// @dev Currently-locked amount per token (across all locks).
    mapping(address token => uint256) private _totalLockedByToken;
    /// @dev Currently-locked aggregate per user (sum across all their locks,
    ///      across all tokens — comparable on a single leaderboard only when
    ///      every token has the same decimals or the UI normalises).
    mapping(address user  => uint256) private _totalLockedByUser;

    address[] private _tokens;   // unique list of tokens ever locked
    address[] private _lockers;  // unique list of users who ever created a lock
    mapping(address => bool) private _tokenSeen;
    mapping(address => bool) private _lockerSeen;

    // ── events ────────────────────────────────────────────────────────────
    event LockCreated(
        uint256 indexed id,
        address indexed owner,
        address indexed token,
        uint256 amount,
        uint64 unlockAt
    );
    event LockWithdrawn(uint256 indexed id, address indexed owner, uint256 amount);
    event LockExtended(uint256 indexed id, uint64 oldUnlockAt, uint64 newUnlockAt);
    event LockOwnerTransferred(uint256 indexed id, address indexed from, address indexed to);

    // ── errors ────────────────────────────────────────────────────────────
    error ZeroAddress();
    error ZeroAmount();
    error UnlockInPast();
    error CannotShorten();
    error NotLockOwner();
    error StillLocked();
    error AlreadyWithdrawn();
    error AmountMismatch();

    // ──────────────────────────────────────────────────────────────────────
    //                            STATE-CHANGING
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @dev Lock `amount` of `token` until `unlockAt`. Caller must have first
     * approved this contract for at least `amount` on `token`.
     *
     * Returns the new lock `id`. Emits {LockCreated}.
     */
    function createLock(
        address token,
        uint256 amount,
        uint64 unlockAt
    ) public virtual nonReentrant returns (uint256 id) {
        if (token == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (unlockAt <= block.timestamp) revert UnlockInPast();

        // Pull funds & measure actual delta so fee-on-transfer tokens lock the
        // amount that *actually arrived*, not the amount requested.
        IERC20 erc20 = IERC20(token);
        uint256 balBefore = erc20.balanceOf(address(this));
        erc20.safeTransferFrom(_msgSender(), address(this), amount);
        uint256 received = erc20.balanceOf(address(this)) - balBefore;
        if (received == 0) revert AmountMismatch();

        id = _locks.length;
        _locks.push(
            Lock({
                token: token,
                owner: _msgSender(),
                amount: uint128(received),
                unlockAt: unlockAt,
                createdAt: uint64(block.timestamp),
                withdrawn: false
            })
        );

        _locksByOwner[_msgSender()].push(id);
        _locksByToken[token].push(id);

        // Leaderboard accounting
        _totalLockedByToken[token] += received;
        _totalLockedByUser[_msgSender()] += received;
        if (!_tokenSeen[token]) {
            _tokenSeen[token] = true;
            _tokens.push(token);
        }
        if (!_lockerSeen[_msgSender()]) {
            _lockerSeen[_msgSender()] = true;
            _lockers.push(_msgSender());
        }

        emit LockCreated(id, _msgSender(), token, received, unlockAt);
    }

    /**
     * @dev Withdraw the full locked amount once the unlock time has passed.
     * Reverts with {StillLocked} before unlock. Emits {LockWithdrawn}.
     */
    function withdraw(uint256 id) public virtual nonReentrant {
        Lock storage lock = _locks[id];
        if (lock.owner != _msgSender()) revert NotLockOwner();
        if (lock.withdrawn) revert AlreadyWithdrawn();
        if (block.timestamp < lock.unlockAt) revert StillLocked();

        uint256 amount = lock.amount;
        lock.amount = 0;
        lock.withdrawn = true;

        // Leaderboard accounting (decrement currently-locked totals)
        _totalLockedByToken[lock.token] -= amount;
        _totalLockedByUser[lock.owner]  -= amount;

        IERC20(lock.token).safeTransfer(_msgSender(), amount);
        emit LockWithdrawn(id, _msgSender(), amount);
    }

    /**
     * @dev Push the unlock time later. The lock cannot be shortened or
     * unlocked early. Emits {LockExtended}.
     */
    function extendLock(uint256 id, uint64 newUnlockAt) public virtual {
        Lock storage lock = _locks[id];
        if (lock.owner != _msgSender()) revert NotLockOwner();
        if (lock.withdrawn) revert AlreadyWithdrawn();
        if (newUnlockAt <= lock.unlockAt) revert CannotShorten();

        uint64 old = lock.unlockAt;
        lock.unlockAt = newUnlockAt;
        emit LockExtended(id, old, newUnlockAt);
    }

    /**
     * @dev Transfer ownership of a lock to `newOwner`. The leaderboard
     * contribution of this lock is moved from the previous owner to the new
     * owner. Emits {LockOwnerTransferred}.
     */
    function transferLockOwnership(uint256 id, address newOwner) public virtual {
        if (newOwner == address(0)) revert ZeroAddress();
        Lock storage lock = _locks[id];
        if (lock.owner != _msgSender()) revert NotLockOwner();
        if (lock.withdrawn) revert AlreadyWithdrawn();

        address prev = lock.owner;
        uint256 amount = lock.amount;

        lock.owner = newOwner;
        _locksByOwner[newOwner].push(id);

        // Leaderboard accounting
        _totalLockedByUser[prev]     -= amount;
        _totalLockedByUser[newOwner] += amount;
        if (!_lockerSeen[newOwner]) {
            _lockerSeen[newOwner] = true;
            _lockers.push(newOwner);
        }

        emit LockOwnerTransferred(id, prev, newOwner);
    }

    // ──────────────────────────────────────────────────────────────────────
    //                                 VIEWS
    // ──────────────────────────────────────────────────────────────────────

    function locksLength() public view virtual returns (uint256) {
        return _locks.length;
    }

    function getLock(uint256 id) public view virtual returns (Lock memory) {
        return _locks[id];
    }

    function locksOf(address user) public view virtual returns (uint256[] memory) {
        return _locksByOwner[user];
    }

    function locksOfToken(address token) public view virtual returns (uint256[] memory) {
        return _locksByToken[token];
    }

    function isUnlocked(uint256 id) public view virtual returns (bool) {
        Lock storage lock = _locks[id];
        return !lock.withdrawn && block.timestamp >= lock.unlockAt;
    }

    // ── leaderboard views ─────────────────────────────────────────────────

    /// @dev Currently-locked aggregate for `token`.
    function totalLocked(address token) public view virtual returns (uint256) {
        return _totalLockedByToken[token];
    }

    /// @dev Currently-locked aggregate for `user` (summed across tokens).
    function totalLockedBy(address user) public view virtual returns (uint256) {
        return _totalLockedByUser[user];
    }

    function tokensLength() public view virtual returns (uint256) {
        return _tokens.length;
    }

    function lockersLength() public view virtual returns (uint256) {
        return _lockers.length;
    }

    function tokenAt(uint256 i) public view virtual returns (address) {
        return _tokens[i];
    }

    function lockerAt(uint256 i) public view virtual returns (address) {
        return _lockers[i];
    }

    /**
     * @dev Returns a paginated snapshot of the per-token leaderboard.
     * The arrays are returned in storage order, NOT sorted — sort client-side.
     */
    function tokenLeaderboard(uint256 offset, uint256 limit)
        public
        view
        virtual
        returns (address[] memory tokens_, uint256[] memory amounts)
    {
        uint256 n = _tokens.length;
        if (offset >= n) return (new address[](0), new uint256[](0));
        uint256 end = offset + limit > n ? n : offset + limit;
        uint256 size = end - offset;
        tokens_ = new address[](size);
        amounts = new uint256[](size);
        for (uint256 i = 0; i < size; ++i) {
            address t = _tokens[offset + i];
            tokens_[i] = t;
            amounts[i] = _totalLockedByToken[t];
        }
    }

    /**
     * @dev Returns a paginated snapshot of the per-user leaderboard.
     * The arrays are returned in storage order, NOT sorted — sort client-side.
     */
    function userLeaderboard(uint256 offset, uint256 limit)
        public
        view
        virtual
        returns (address[] memory users, uint256[] memory amounts)
    {
        uint256 n = _lockers.length;
        if (offset >= n) return (new address[](0), new uint256[](0));
        uint256 end = offset + limit > n ? n : offset + limit;
        uint256 size = end - offset;
        users = new address[](size);
        amounts = new uint256[](size);
        for (uint256 i = 0; i < size; ++i) {
            address u = _lockers[offset + i];
            users[i] = u;
            amounts[i] = _totalLockedByUser[u];
        }
    }
}
