// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {VestingWallet} from "./VestingWallet.sol";
import {VestingCliff} from "./VestingCliff.sol";

/**
 * @dev Factory that deploys vesting schedules and immediately funds them
 * with ERC-20 tokens (or native MON). The token address is stored on-chain
 * so any device / wallet can reconstruct the full schedule without local
 * storage.
 */
contract VestingFactory {
    using SafeERC20 for IERC20;

    event VestingCreated(
        address indexed creator,
        address indexed beneficiary,
        address indexed wallet,
        address token,      // address(0) = native MON
        uint256 amount,     // amount funded at creation (0 if funded later)
        uint64  start,
        uint64  duration,
        uint64  cliff,
        uint8   kind        // 0 = linear, 1 = cliff
    );

    address[] public allWallets;
    mapping(address => address[]) public walletsByBeneficiary;
    mapping(address => address[]) public walletsByCreator;
    /// @dev token used to fund each wallet (address(0) = native)
    mapping(address => address) public walletToken;

    // ── internal helpers ─────────────────────────────────────────────────

    function _track(
        address creator,
        address beneficiary,
        address wallet,
        address token,
        uint256 amount,
        uint64  start,
        uint64  duration,
        uint64  cliff,
        uint8   kind
    ) internal {
        allWallets.push(wallet);
        walletsByBeneficiary[beneficiary].push(wallet);
        walletsByCreator[creator].push(wallet);
        walletToken[wallet] = token;
        emit VestingCreated(creator, beneficiary, wallet, token, amount, start, duration, cliff, kind);
    }

    // ── ERC-20 vesting ───────────────────────────────────────────────────

    /**
     * @dev Deploy a linear vesting wallet and immediately fund it with
     * `amount` of `token`. Caller must have approved this contract first.
     */
    function createVesting(
        address beneficiary,
        address token,
        uint256 amount,
        uint64  startTimestamp,
        uint64  durationSeconds
    ) external returns (address wallet) {
        require(durationSeconds > 0, "duration=0");
        wallet = address(new VestingWallet(beneficiary, startTimestamp, durationSeconds));
        if (amount > 0 && token != address(0)) {
            IERC20(token).safeTransferFrom(msg.sender, wallet, amount);
        }
        _track(msg.sender, beneficiary, wallet, token, amount, startTimestamp, durationSeconds, 0, 0);
    }

    /**
     * @dev Deploy a cliff vesting wallet and immediately fund it.
     */
    function createVestingWithCliff(
        address beneficiary,
        address token,
        uint256 amount,
        uint64  startTimestamp,
        uint64  durationSeconds,
        uint64  cliffSeconds
    ) external returns (address wallet) {
        require(durationSeconds > 0, "duration=0");
        wallet = address(new VestingCliff(beneficiary, startTimestamp, durationSeconds, cliffSeconds));
        if (amount > 0 && token != address(0)) {
            IERC20(token).safeTransferFrom(msg.sender, wallet, amount);
        }
        _track(msg.sender, beneficiary, wallet, token, amount, startTimestamp, durationSeconds, cliffSeconds, 1);
    }

    // ── views ─────────────────────────────────────────────────────────────

    function allWalletsLength() external view returns (uint256) {
        return allWallets.length;
    }

    function walletsOfBeneficiary(address user) external view returns (address[] memory) {
        return walletsByBeneficiary[user];
    }

    function walletsOfCreator(address user) external view returns (address[] memory) {
        return walletsByCreator[user];
    }

    function tokenOf(address wallet) external view returns (address) {
        return walletToken[wallet];
    }
}
