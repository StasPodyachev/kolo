// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IStore.sol";

contract Store is IStore, Ownable {
    mapping(uint256 => address) private deals;
    mapping(uint256 => mapping(address => uint256)) private buyers;
    mapping(uint256 => uint256) private sellerCollaterals;
    mapping(uint256 => uint256) private buyerCollaterals;

    mapping(bytes => mapping(address => bool)) private accsess;

    function createDeal(uint256 dealId) external payable {
        deals[dealId] = msg.sender;
        sellerCollaterals[dealId] = msg.value;
    }

    function depositBuyer(uint256 dealId, address buyer) external payable {
        buyers[dealId][buyer] += msg.value;
    }

    function depositBuyerCollateral(uint256 dealId) external payable {
        buyerCollaterals[dealId] = msg.value;
    }

    function transferSellerCollateral(uint256 dealId, address to)
        external
        returns (uint256)
    {
        // TODO: Security
        payable(to).transfer(sellerCollaterals[dealId]);

        return sellerCollaterals[dealId];
    }

    function transferBuyerCollateral(uint256 dealId, address to)
        external
        returns (uint256)
    {
        // TODO: Security
        payable(to).transfer(buyerCollaterals[dealId]);

        return buyerCollaterals[dealId];
    }

    function transfer(
        uint256 dealId,
        address buyer,
        address to
    ) external {
        // TODO: security
        payable(to).transfer(buyers[dealId][buyer]);
        buyers[dealId][buyer] = 0;
    }

    function addAccsess(uint256 dealId) external payable {}

    function checkAccsess(uint256 dealId) external payable {}
}
