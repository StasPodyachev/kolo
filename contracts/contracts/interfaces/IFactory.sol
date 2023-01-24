// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IFactory {
    event StoreCreated(address store, address wallet);

    function createAlp() external returns (address storeAddress);

    function addDeal(uint256 dealId) external;
}
