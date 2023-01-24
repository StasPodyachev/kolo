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

    /// @notice Emitted when a dispute is created
    event DisputeCreated(uint256 id);
}
