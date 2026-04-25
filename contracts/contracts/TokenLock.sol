// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TokenLock
 * @notice Singleton time-lock for ERC-20 tokens.
 *         Users deposit tokens with a chosen unlock timestamp; the tokens
 *         cannot be withdrawn until that time has passed. Owners may extend
 *         the lock (push the unlock time later) but never shorten it.
 *
 * @dev    All token IO uses SafeERC20. Deposits use checked-in/out math so
 *         fee-on-transfer tokens are accounted for correctly. Withdrawals are
 *         protected by ReentrancyGuard.
 *
 *         There is one global contract instance; users do NOT deploy a new
 *         contract per lock. Each lock has a numeric `id` returned by
 *         {createLock} and emitted in {LockCreated}.
 */
contract TokenLock is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Lock {
        address token;       // ERC-20 token being locked
        address owner;       // who can withdraw / extend / transfer
        uint128 amount;      // remaining amount in the lock
        uint64  unlockAt;    // unix timestamp when withdraw becomes possible
        bool    withdrawn;   // true once amount has been fully withdrawn
    }

    Lock[] private _locks;

    mapping(address user => uint256[] ids) private _locksByOwner;
    mapping(address token => uint256[] ids) private _locksByToken;

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

    error ZeroAddress();
    error ZeroAmount();
    error UnlockInPast();
    error CannotShorten();
    error NotLockOwner();
    error StillLocked();
    error AlreadyWithdrawn();
    error AmountMismatch();

    /// @notice Lock `amount` of `token` until `unlockAt`. Caller must have approved this contract.
    /// @return id The lock id used by all subsequent calls.
    function createLock(
        address token,
        uint256 amount,
        uint64 unlockAt
    ) external nonReentrant returns (uint256 id) {
        if (token == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (unlockAt <= block.timestamp) revert UnlockInPast();

        // Pull funds & measure actual delta so fee-on-transfer tokens lock the
        // amount that *actually arrived*, not the requested amount.
        IERC20 erc20 = IERC20(token);
        uint256 balBefore = erc20.balanceOf(address(this));
        erc20.safeTransferFrom(msg.sender, address(this), amount);
        uint256 received = erc20.balanceOf(address(this)) - balBefore;
        if (received == 0) revert AmountMismatch();

        id = _locks.length;
        _locks.push(
            Lock({
                token: token,
                owner: msg.sender,
                amount: uint128(received),
                unlockAt: unlockAt,
                withdrawn: false
            })
        );

        _locksByOwner[msg.sender].push(id);
        _locksByToken[token].push(id);

        emit LockCreated(id, msg.sender, token, received, unlockAt);
    }

    /// @notice Withdraw the full locked amount once the unlock time has passed.
    function withdraw(uint256 id) external nonReentrant {
        Lock storage lock = _locks[id];
        if (lock.owner != msg.sender) revert NotLockOwner();
        if (lock.withdrawn) revert AlreadyWithdrawn();
        if (block.timestamp < lock.unlockAt) revert StillLocked();

        uint256 amount = lock.amount;
        lock.amount = 0;
        lock.withdrawn = true;

        IERC20(lock.token).safeTransfer(msg.sender, amount);
        emit LockWithdrawn(id, msg.sender, amount);
    }

    /// @notice Push the unlock time later. Cannot shorten or unlock early.
    function extendLock(uint256 id, uint64 newUnlockAt) external {
        Lock storage lock = _locks[id];
        if (lock.owner != msg.sender) revert NotLockOwner();
        if (lock.withdrawn) revert AlreadyWithdrawn();
        if (newUnlockAt <= lock.unlockAt) revert CannotShorten();

        uint64 old = lock.unlockAt;
        lock.unlockAt = newUnlockAt;
        emit LockExtended(id, old, newUnlockAt);
    }

    /// @notice Transfer ownership of a lock to another address (e.g. to sell or gift it).
    function transferLockOwnership(uint256 id, address newOwner) external {
        if (newOwner == address(0)) revert ZeroAddress();
        Lock storage lock = _locks[id];
        if (lock.owner != msg.sender) revert NotLockOwner();
        if (lock.withdrawn) revert AlreadyWithdrawn();

        lock.owner = newOwner;
        _locksByOwner[newOwner].push(id);
        emit LockOwnerTransferred(id, msg.sender, newOwner);
    }

    // ---------- views ----------

    function locksLength() external view returns (uint256) {
        return _locks.length;
    }

    function getLock(uint256 id) external view returns (Lock memory) {
        return _locks[id];
    }

    function locksOf(address user) external view returns (uint256[] memory) {
        return _locksByOwner[user];
    }

    function locksOfToken(address token) external view returns (uint256[] memory) {
        return _locksByToken[token];
    }

    function isUnlocked(uint256 id) external view returns (bool) {
        return block.timestamp >= _locks[id].unlockAt && !_locks[id].withdrawn;
    }
}
