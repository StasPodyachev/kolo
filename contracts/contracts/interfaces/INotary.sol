// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

interface INotary {
    struct VoteParams {
        uint256 dealId;
        uint8 status; // 0 - no status, 1 - win, 2 - lose
        bool mark; // 0 - no mark, 1 - yes, 2 - no
    }

    struct NotaryParams {
        address wallet;
        uint256 balance; // 0 - no mark, 1 - yes, 2 - no
        bool isActive; // 0 - no status, 1 - win, 2 - lose
    }

    function setPenalty(uint256 value) external;

    function setMinDeposit(uint256 value) external;

    function setConsensusCount(uint256 value) external;

    function setCountInvitedNotary(uint256 value) external;

    function deposit() external payable;

    function withdraw(uint256 amount) external;

    function vote(uint256 dealId, bool mark) external;

    function chooseNotaries(uint256 dealId) external;

    function getNotaries(uint256 dealId)
        external
        view
        returns (address[] memory);

    function getAllNotaries()
        external
        view
        returns (NotaryParams[] memory notaries_);

    function getVoteInfo(address notary)
        external
        view
        returns (INotary.VoteParams[] memory);

    function getVoteInfoForDeal(uint256 dealId, address notary)
        external
        view
        returns (INotary.VoteParams memory);

    function restart(uint256 dealId) external;

    function isDisputePossible(uint256 dealId) external view returns (bool);

    function refundPenalty(uint256 dealId) external;

    function getDeals(address notary) external view returns (uint256[] memory);
}
