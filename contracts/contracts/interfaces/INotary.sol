// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

interface INotary {
    function setFactory(address factory) external;

    function setPenalty(uint256 value) external;

    function setMinDeposit(uint256 value) external;

    function setConsensusCount(uint256 value) external;

    function setCountInvitedNotary(uint256 value) external;

    function deposit() external payable;

    function withdraw(uint256 amount) external;

    function withdrawFee(uint256 amount) external;

    function vote(uint256 dealId, bool mark) external;

    function chooseNotaries(uint256 dealId) external;
}
