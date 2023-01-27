// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/integrations/IIntegration.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/IStore.sol";

import "./StoreDeployer.sol";
import "./Store.sol";

contract Factory is IFactory, StoreDeployer, Ownable {
    mapping(address => address) private stores;
    mapping(uint256 => address) private _dealStore;
    mapping(uint256 => address) private _integrations;
    uint256[] private deals;
    uint256 id;

    function createStore() external returns (address storeAddress) {
        require(
            stores[msg.sender] == address(0),
            "Factory: Store already exist"
        );

        storeAddress = deploy(address(this));
        stores[msg.sender] = storeAddress;

        emit StoreCreated(storeAddress, msg.sender);
    }

    function addDeal(address storeAddress) external returns (uint256) {
        _dealStore[++id] = storeAddress;
        deals.push(id);

        return id;
    }

    function getStore(address wallet) external view returns (address store) {
        store = stores[wallet];
    }

    function getStore(uint256 dealId) external view returns (address store) {
        store = _dealStore[dealId];
    }

    function getDeal(uint256 dealId)
        external
        view
        returns (IIntegration.DealParams memory)
    {
        address storeAddress = _dealStore[dealId];
        address intgr = IStore(storeAddress).getIntegration(dealId);

        return IIntegration(intgr).getDeal(dealId);
    }

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

    function registerIntegration(uint256 type_, address addr) external {
        require(
            _integrations[type_] == address(0),
            "Factory: Integration type exist"
        );

        _integrations[type_] = addr;
    }
}
