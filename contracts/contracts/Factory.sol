// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IIntegration.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/IStore.sol";

import "./StoreDeployer.sol";
import "./Store.sol";

contract Factory is IFactory, StoreDeployer, Ownable {
    mapping(address => address) private stores;
    mapping(uint256 => address) private deals;

    function createStore() external returns (address storeAddress) {
        require(
            stores[msg.sender] == address(0),
            "Factory: Store already exist"
        );

        storeAddress = deploy(address(this));
        stores[msg.sender] = storeAddress;

        emit StoreCreated(storeAddress, msg.sender);
    }

    function addDeal(uint256 dealId, address storeAddress) external {
        deals[dealId] = storeAddress;
    }

    function getStore(address wallet) external view returns (address store) {
        store = stores[wallet];
    }

    function getStore(uint256 dealId) external view returns (address store) {
        store = deals[dealId];
    }

    function getDeal(uint256 dealId)
        external
        returns (IIntegration.DealParams memory)
    {
        address storeAddress = deals[dealId];
        address intgr = IStore(storeAddress).getIntegration(dealId);

        return IIntegration(intgr).getDeal(dealId);
    }
}
