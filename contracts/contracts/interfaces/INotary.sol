// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

interface INotary {
    struct VoteParams {
        uint256 dealId;
        uint8 status; // 0 - no status, 1 - win, 2 - lose
        uint8 mark; // 0 - no mark, 1 - yes, 2 - no
    }

    function setPenalty(uint256 value) external;

    function setMinDeposit(uint256 value) external;

    function setConsensusCount(uint256 value) external;

    function setCountInvitedNotary(uint256 value) external;

    function deposit() external payable;

    function withdraw(uint256 amount) external;

    function vote(uint256 dealId, bool mark) external;

    function chooseNotaries(uint256 dealId) external;

    function getDealIDbyNotary(address notary)
        external
        view
        returns (INotary.VoteParams[] memory);
}
