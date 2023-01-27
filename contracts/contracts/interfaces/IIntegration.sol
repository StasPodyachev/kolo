// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IIntegration {
    enum DisputeWinner {
        Buyer,
        Seller
    }

    struct DealParams {
        uint256 id;
        uint256 _type; // 0 - AuctionFile
        bytes data; // all propertiest for target integration deal
        address integration;
        address store;
        // DealStatus status;
    }

    function getDeal(uint256 dealId) external view returns (DealParams memory);

    function finalizeDispute(uint256 dealId, DisputeWinner winner) external;

    function addAccsess(uint256 dealId, address wallet) external;

    function checkAccsess(bytes calldata cid, address wallet)
        external
        view
        returns (uint8);
}
