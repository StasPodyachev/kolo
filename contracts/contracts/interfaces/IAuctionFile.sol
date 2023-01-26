// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IAuctionFile {
    struct AuctionFileParams {
        string name;
        string description;
        uint256 price;
        uint256 priceStart;
        uint256 priceForceStop;
        uint256 collatoralAmount;
        address seller;
        address buyer;
        uint256 dateExpire;
        bytes cid;
        bytes cidThumbnail;
        AuctionStatus status;
    }

    enum AuctionStatus {
        OPEN,
        CANCEL,
        CLOSE,
        DISPUTE,
        FINALIZE
    }

    event DisputeCreated(uint256 id);
    event DealCreated(uint256 dealId, address sender);
    event DealCanceled(uint256 dealId, address sender);

    function setFactory(address factory) external;

    function setPeriodDelivery(uint256 value) external;

    function setPeriodDispute(uint256 value) external;

    function setColletoralAmount(uint256 value) external;

    function create(
        string calldata name,
        string calldata description,
        uint256 priceStart,
        uint256 priceForceStop,
        uint256 dateExpire,
        uint256 cid,
        uint256 cidThumbnail
    ) external payable returns (uint256 dealId);

    function bid(uint256 dealId) external payable;

    function cancel(uint256 dealId) external payable;

    function dispute(uint256 dealId) external payable;

    function finalizeDeal(uint256 dealId) external;

    function finalizeDispute(uint256 dealId) external;

    function finalizeForce(uint256 dealId) external;
}
