// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IFactory {
    event StoreCreated(address store, address wallet);

    function createStore() external returns (address storeAddress);

    function addDeal(uint256 dealId, address storeAddress) external;

    function getStore(address wallet) external view returns (address store);

    function getStore(uint256 dealId) external view returns (address store);
}
