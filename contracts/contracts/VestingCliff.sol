// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VestingWallet} from "./VestingWallet.sol";
import {VestingWalletCliff} from "./VestingWalletCliff.sol";

/**
 * @dev Concrete (deployable) version of {VestingWalletCliff}.
 * Used by The Dog House when a vesting schedule has a cliff period.
 */
contract VestingCliff is VestingWalletCliff {
    constructor(
        address beneficiary,
        uint64 startTimestamp,
        uint64 durationSeconds,
        uint64 cliffSeconds
    )
        payable
        VestingWallet(beneficiary, startTimestamp, durationSeconds)
        VestingWalletCliff(cliffSeconds)
    {}
}
