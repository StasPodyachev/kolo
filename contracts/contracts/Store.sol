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

    // mapping(bytes => mapping(address => bool)) private accsess;

    function getIntegration(uint256 dealId) external view returns (address) {
        return deals[dealId];
    }

    function createDeal(uint256 dealId) external payable {
        deals[dealId] = msg.sender;
        sellerCollaterals[dealId] = msg.value;
    }

    function depositBuyer(uint256 dealId, address buyer) external payable {
        buyers[dealId][buyer] += msg.value;
    }

    function withdrawBuyer(uint256 dealId, address buyer) external {
        payable(buyer).transfer(buyers[dealId][buyer]);
        buyers[dealId][buyer] = 0;
    }

    function depositBuyerCollateral(uint256 dealId) external payable {
        buyerCollaterals[dealId] = msg.value;
    }

    function getSellerCollateral(uint256 dealId)
        external
        view
        returns (uint256)
    {
        return sellerCollaterals[dealId];
    }

    function getBuyerCollateral(uint256 dealId)
        external
        view
        returns (uint256)
    {
        return buyerCollaterals[dealId];
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

    // function _addAccsess(
    //     uint256 dealId,
    //     bytes calldata cid,
    //     address wallet
    // ) internal {
    //     deals[dealId]
    //     _accsess[wallet][cid] = true;
    // }
}
