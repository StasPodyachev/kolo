// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IIntegration {
    enum DisputeWinner {
        Buyer,
        Seller
    }

    struct DealParams {
        uint256 id;
        uint256 dateExpire;
        string name;
        string description;
        uint256 price;
        address seller;
        address buyer;
        // DealStatus status;
    }

    function getDeal(uint256 dealId) external returns (DealParams memory);

    function finalizeDispute(uint256 dealId, DisputeWinner winner) external;
}
