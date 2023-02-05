// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IStore.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/IStoreDeployer.sol";
import "./interfaces/integrations/IIntegration.sol";
import "hardhat/console.sol";

/**
 * @title Store
 */
contract Store is IStore {
    /// @dev Holds a mapping of deals to integration addresses.
    mapping(uint256 => address) private deals;

    /// @dev Holds a mapping of deals to buyers to amounts.
    mapping(uint256 => mapping(address => uint256)) private buyers;

    /// @dev Holds a mapping of deals to sellers collaterals.
    mapping(uint256 => uint256) private sellerCollaterals;

    /// @dev Holds a mapping of deals to buyers collaterals.
    mapping(uint256 => uint256) private buyerCollaterals;

    /// @dev Array of all deals.
    uint256[] private dealsArr;
    IFactory _factory;

    constructor() {
        address factory = IStoreDeployer(msg.sender).parameters();
        _factory = IFactory(factory);
    }

    function getIntegration(uint256 dealId) external view returns (address) {
        return deals[dealId];
    }

    /**
     * @notice Creating a new deal
     *
     * @param dealId ID of a new deal
     * @dev this function is called when a deal is created
     */
    function createDeal(uint256 dealId) external payable {
        require(
            _factory.integrationExist(msg.sender),
            "Store: Only integration"
        );

        deals[dealId] = msg.sender;
        sellerCollaterals[dealId] = msg.value;
        dealsArr.push(dealId);
    }

    /**
     * @notice Deposit buyer collateral
     *
     * @param dealId ID of a deal
     * @dev this function is called when buyer creates a dispute
     */
    function depositBuyerCollateral(uint256 dealId) external payable {
        require(
            _factory.integrationExist(msg.sender),
            "Store: Only integration"
        );

        buyerCollaterals[dealId] = msg.value;
    }

    /**
     * @notice Buyer deposit
     *
     * @param dealId ID of a deal
     * @param buyer The buyer address
     * @dev this function is called when the buyer bid or buys
     */
    function depositBuyer(uint256 dealId, address buyer) external payable {
        require(
            _factory.integrationExist(msg.sender),
            "Store: Only integration"
        );

        buyers[dealId][buyer] += msg.value;
    }

    /**
     * @notice Buyer withdrawal
     *
     * @param dealId ID of a deal
     * @param buyer The buyer address
     * @dev this function is called when the buyer receives a refund of their bid
     */
    function withdrawBuyer(uint256 dealId, address buyer) external {
        require(
            _factory.integrationExist(msg.sender),
            "Store: Only integration"
        );

        payable(buyer).transfer(buyers[dealId][buyer]);
        buyers[dealId][buyer] = 0;
    }

    /// @notice Get deal parameters by ID
    function getDeal(uint256 dealId)
        external
        view
        returns (IIntegration.DealParams memory)
    {
        address intgr = deals[dealId];
        return IIntegration(intgr).getDeal(dealId);
    }

    /// @notice Get all deals
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

    /// @notice Get seller collateral by deal ID
    function getSellerCollateral(uint256 dealId)
        external
        view
        returns (uint256)
    {
        return sellerCollaterals[dealId];
    }

    /// @notice Get buyer collateral by deal ID
    function getBuyerCollateral(uint256 dealId)
        external
        view
        returns (uint256)
    {
        return buyerCollaterals[dealId];
    }

    /**
     * @notice Transfers a win to seller
     *
     * @param dealId ID of a deal
     * @param buyer Buyer address
     * @param seller Seller address
     * @param serviceFee Service fee
     *
     */
    function transferWinToSeller(
        uint256 dealId,
        address buyer,
        address seller,
        uint256 serviceFee,
        uint256 storageFee
    ) external {
        require(
            _factory.integrationExist(msg.sender),
            "Store: Only integration"
        );

        uint256 amount = sellerCollaterals[dealId];

        if (buyers[dealId][buyer] != 0) {
            uint256 serviceFee_ = (buyers[dealId][buyer] * serviceFee) / 1e18;
            uint256 storageFee_ = (buyers[dealId][buyer] * storageFee) / 1e18;

            payable(_factory.treasury()).transfer(serviceFee_ + storageFee_);

            amount += buyers[dealId][buyer] - serviceFee_ - storageFee_;
            buyers[dealId][buyer] = 0;
        }

        payable(seller).transfer(amount);
        sellerCollaterals[dealId] = 0;
    }

    /**
     * @notice Transfers a win to buyer
     *
     * @param dealId ID of a deal
     * @param buyer Buyer address
     *
     */
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
