// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

interface INotary {
    function deposit() external;

    function withdraw() external;

    function vote() external;

    function chooseNotaries(uint256 dealId) external;

    function disputResult(uint256 dealId) external returns (uint8 result);
}
