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
    }

    function getDeal(uint256 dealId) external view returns (DealParams memory);

    function finalizeDispute(uint256 dealId, DisputeWinner winner) external;

    function addAccess(uint256 dealId, address wallet) external;

    function checkAccess(bytes calldata cid, address wallet)
        external
        view
        returns (uint8);

    function checkAccess(
        bytes32[] calldata cid,
        uint8 size,
        address wallet
    ) external view returns (uint8);
}
