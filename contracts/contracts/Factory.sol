// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/integrations/IIntegration.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/IStore.sol";

import "./StoreDeployer.sol";
import "./Store.sol";

/**
 * @title Kolo Factory
 */
contract Factory is IFactory, StoreDeployer, AccessControl, Ownable {
    /// @dev Holds a mapping of sellers to storeAddress.
    mapping(address => address) private stores;

    /// @dev Holds a mapping of deals to storeAddress.
    mapping(uint256 => address) private _dealStore;

    /// @dev Holds a mapping of integration types to integration addresses.
    mapping(uint256 => address) private _integrations;

    /// @dev Holds a mapping of integration addresses to integration types.
    mapping(address => uint256) private _integrationType;

    /// @dev Array of all deals
    uint256[] private deals;

    /// @dev Unique auto-incremented id for all deals
    uint256 id;

    address public treasury;
    address public chat;

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    function setChat(address _chat) external onlyOwner {
        chat = _chat;
    }

    /**
     * @notice Creating the new store
     *
     * @return storeAddress The address of the new store
     * @dev this function calls method deploy from StoreDeployer contract
     *
     * Emits a `StoreCreated` event.
     *
     */
    function createStore() external returns (address storeAddress) {
        require(
            stores[msg.sender] == address(0),
            "Factory: Store already exist"
        );

        storeAddress = deploy(address(this));
        stores[msg.sender] = storeAddress;

        emit StoreCreated(storeAddress, msg.sender);
    }

    /**
     * @notice Adding a new deal
     *
     * @param storeAddress The address of the store where deal is created
     * @return id of a new deal
     * @dev this function is called when a deal is created
     *
     * Requirements:
     *
     * - Only integration contract can call this function
     *
     */
    function addDeal(address storeAddress) external returns (uint256) {
        require(this.integrationExist(msg.sender), "Factory: Only integration");

        _dealStore[++id] = storeAddress;
        deals.push(id);

        return id;
    }

    /// @notice Get address of the store by seller
    function getStore(address wallet) external view returns (address store) {
        store = stores[wallet];
    }

    /// @notice Get address of the store by deal ID
    function getStore(uint256 dealId) external view returns (address store) {
        store = _dealStore[dealId];
    }

    /// @notice Get deal parameters by ID
    function getDeal(uint256 dealId)
        external
        view
        returns (IIntegration.DealParams memory)
    {
        address storeAddress = _dealStore[dealId];
        address intgr = IStore(storeAddress).getIntegration(dealId);

        return IIntegration(intgr).getDeal(dealId);
    }

    /// @notice Get all deals
    function getAllDeals()
        external
        view
        returns (IIntegration.DealParams[] memory result)
    {
        uint256 size = deals.length;
        result = new IIntegration.DealParams[](size);

        for (uint256 i = 0; i < size; i++) {
            result[i] = this.getDeal(deals[i]);
        }
    }

    /**
     * @notice Registering a new integration
     *
     * @param type_ Integration type
     * @param addr Integration address
     *
     */
    function registerIntegration(uint256 type_, address addr) external {
        require(
            _integrations[type_] == address(0),
            "Factory: Integration type exist"
        );

        _integrations[type_] = addr;
        _integrationType[addr] = type_ + 1;
    }

    /// @notice Check if integration exists by address
    function integrationExist(address addr) external view returns (bool) {
        return _integrationType[addr] > 0;
    }
}
