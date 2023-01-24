// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IFactory.sol";

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

        storeAddress = deploy(address(this), msg.sender);
        stores[msg.sender] = storeAddress;

        emit StoreCreated(storeAddress, msg.sender);
    }

    function addDeal(uint256 dealId) external {
        deals[dealId] = msg.sender;
    }
}
