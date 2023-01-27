// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IStore.sol";
import "./interfaces/integrations/IIntegration.sol";

contract Store is IStore, Ownable {
    mapping(uint256 => address) private deals;
    mapping(uint256 => mapping(address => uint256)) private buyers;
    mapping(uint256 => uint256) private sellerCollaterals;
    mapping(uint256 => uint256) private buyerCollaterals;

    uint256[] private dealsArr;

    function getIntegration(uint256 dealId) external view returns (address) {
        return deals[dealId];
    }

    function createDeal(uint256 dealId) external payable {
        deals[dealId] = msg.sender;
        sellerCollaterals[dealId] = msg.value;
        dealsArr.push(dealId);
    }

    function depositBuyerCollateral(uint256 dealId) external payable {
        buyerCollaterals[dealId] = msg.value;
    }

    function depositBuyer(uint256 dealId, address buyer) external payable {
        buyers[dealId][buyer] += msg.value;
    }

    function withdrawBuyer(uint256 dealId, address buyer) external {
        payable(buyer).transfer(buyers[dealId][buyer]);
        buyers[dealId][buyer] = 0;
    }

    function getDeal(uint256 dealId)
        external
        view
        returns (IIntegration.DealParams memory)
    {
        address intgr = deals[dealId];
        return IIntegration(intgr).getDeal(dealId);
    }

    function getAllDeals()
        external
        view
        returns (IIntegration.DealParams[] memory result)
    {
        uint256 size = dealsArr.length;
        result = new IIntegration.DealParams[](size);

        uint256 dealId;
        address intgr;
        for (uint256 i = 0; i < size; i++) {
            dealId = dealsArr[i];
            intgr = deals[dealId];
            result[i] = IIntegration(intgr).getDeal(dealId);
        }
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

    function transferWinToSeller(
        uint256 dealId,
        address buyer,
        address seller
    ) external {
        payable(seller).transfer(
            sellerCollaterals[dealId] + buyers[dealId][buyer]
        );

        sellerCollaterals[dealId] = 0;
        buyers[dealId][buyer] = 0;
    }

    function transferWinToBuyer(uint256 dealId, address buyer) external {
        payable(buyer).transfer(
            buyerCollaterals[dealId] + buyers[dealId][buyer]
        );

        buyerCollaterals[dealId] = 0;
        buyers[dealId][buyer] = 0;
    }
}
