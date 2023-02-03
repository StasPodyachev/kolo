// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IStore.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/IStoreDeployer.sol";
import "./interfaces/integrations/IIntegration.sol";
import "hardhat/console.sol";

contract Store is IStore, Ownable {
    mapping(uint256 => address) private deals;
    mapping(uint256 => mapping(address => uint256)) private buyers;
    mapping(uint256 => uint256) private sellerCollaterals;
    mapping(uint256 => uint256) private buyerCollaterals;

    uint256[] private dealsArr;
    IFactory _factory;

    constructor() {
        address factory = IStoreDeployer(msg.sender).parameters();
        _factory = IFactory(factory);
    }

    function getIntegration(uint256 dealId) external view returns (address) {
        return deals[dealId];
    }

    function createDeal(uint256 dealId) external payable {
        require(
            _factory.integrationExist(msg.sender),
            "Store: Only integration"
        );

        deals[dealId] = msg.sender;
        sellerCollaterals[dealId] = msg.value;
        dealsArr.push(dealId);
    }

    function depositBuyerCollateral(uint256 dealId) external payable {
        require(
            _factory.integrationExist(msg.sender),
            "Store: Only integration"
        );

        buyerCollaterals[dealId] = msg.value;
    }

    function depositBuyer(uint256 dealId, address buyer) external payable {
        require(
            _factory.integrationExist(msg.sender),
            "Store: Only integration"
        );

        buyers[dealId][buyer] += msg.value;
    }

    function withdrawBuyer(uint256 dealId, address buyer) external {
        require(
            _factory.integrationExist(msg.sender),
            "Store: Only integration"
        );

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
        address seller,
        uint256 serviceFee
    ) external {
        require(
            _factory.integrationExist(msg.sender),
            "Store: Only integration"
        );

        uint256 amount = sellerCollaterals[dealId];

        if (buyers[dealId][buyer] != 0) {
            uint256 fee = (buyers[dealId][buyer] * serviceFee) / 1e18;

            payable(_factory.treasury()).transfer(fee);

            amount += buyers[dealId][buyer] - fee;
            buyers[dealId][buyer] = 0;
        }

        payable(seller).transfer(amount);
        sellerCollaterals[dealId] = 0;
    }

    function transferWinToBuyer(uint256 dealId, address buyer) external {
        require(
            _factory.integrationExist(msg.sender),
            "Store: Only integration"
        );

        payable(buyer).transfer(
            buyerCollaterals[dealId] + buyers[dealId][buyer]
        );

        buyerCollaterals[dealId] = 0;
        buyers[dealId][buyer] = 0;
    }
}
