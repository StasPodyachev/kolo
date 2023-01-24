// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IAuctionFile {
    struct AuctionFileParams {
        string name;
        string description;
        uint256 price;
        uint256 priceStart;
        uint256 priceForceStop;
        uint256 lastBid;
        address seller;
        address buyer;
        uint256 dateExpire;
        AuctionStatus status;
    }

    enum AuctionStatus {
        OPEN,
        CANCEL,
        CLOSE,
        DISPUTE
    }

    event DisputeCreated(uint256 id);
    event DealCreated(uint256 dealId, address sender);
    event DealCanceled(uint256 dealId, address sender);

    function setFactory(address factory) external;

    function setPeriodDelivery(uint256 value) external;

    function setPeriodDispute(uint256 value) external;

    function setColletoralPercent(uint256 value) external;

    function create(
        string calldata name,
        string calldata description,
        uint256 priceStart,
        uint256 priceForceStop,
        uint256 price,
        uint256 dateExpire
    ) external payable returns (uint256 dealId);

    function bid(uint256 dealId) external payable;

    function cancel(uint256 dealId) external payable;

    function dispute(uint256 dealId) external payable;

    function finalize(uint256 dealId) external;
}
