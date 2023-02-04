// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IDispute {
    event DisputeCreated(uint256 id);
    event DisputeClosed(uint256 id);

    function setPeriodDispute(uint256 value) external;
}
