// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VestingWallet} from "./VestingWallet.sol";
import {VestingCliff} from "./VestingCliff.sol";

/**
 * @dev Factory used by the dashboard to deploy vesting schedules.
 *
 *  - createVesting:           linear vesting (no cliff)
 *  - createVestingWithCliff:  linear vesting with a cliff
 *
 * Pure timelocks live in {TokenLock} (a separate contract) — DON'T use this
 * factory for locks.
 *
 * The factory tracks every wallet it created so the UI can list them per
 * user and globally without an indexer.
 */
contract VestingFactory {
    event VestingCreated(
        address indexed creator,
        address indexed beneficiary,
        address wallet,
        uint64 start,
        uint64 duration,
        uint64 cliff,
        uint8 kind // 0 = vesting, 1 = vestingCliff
    );

    address[] public allWallets;
    mapping(address => address[]) public walletsByBeneficiary;
    mapping(address => address[]) public walletsByCreator;

    function _track(
        address creator,
        address beneficiary,
        address wallet,
        uint64 start,
        uint64 duration,
        uint64 cliff,
        uint8 kind
    ) internal {
        allWallets.push(wallet);
        walletsByBeneficiary[beneficiary].push(wallet);
        walletsByCreator[creator].push(wallet);
        emit VestingCreated(creator, beneficiary, wallet, start, duration, cliff, kind);
    }

    function createVesting(
        address beneficiary,
        uint64 startTimestamp,
        uint64 durationSeconds
    ) external returns (address wallet) {
        require(durationSeconds > 0, "duration=0 not allowed");
        wallet = address(new VestingWallet(beneficiary, startTimestamp, durationSeconds));
        _track(msg.sender, beneficiary, wallet, startTimestamp, durationSeconds, 0, 0);
    }

    function createVestingWithCliff(
        address beneficiary,
        uint64 startTimestamp,
        uint64 durationSeconds,
        uint64 cliffSeconds
    ) external returns (address wallet) {
        require(durationSeconds > 0, "duration=0 not allowed");
        wallet = address(
            new VestingCliff(beneficiary, startTimestamp, durationSeconds, cliffSeconds)
        );
        _track(msg.sender, beneficiary, wallet, startTimestamp, durationSeconds, cliffSeconds, 1);
    }

    function allWalletsLength() external view returns (uint256) {
        return allWallets.length;
    }

    function walletsOfBeneficiary(address user) external view returns (address[] memory) {
        return walletsByBeneficiary[user];
    }

    function walletsOfCreator(address user) external view returns (address[] memory) {
        return walletsByCreator[user];
    }
}
