// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IIntegration.sol";

interface IFactory {
    event StoreCreated(address store, address wallet);

    function createStore() external returns (address storeAddress);

    function addDeal(uint256 dealId, address storeAddress) external;

    function getStore(address wallet) external view returns (address store);

    function getStore(uint256 dealId) external view returns (address store);

    function getDeal(uint256 dealId)
        external
        view
        returns (IIntegration.DealParams memory);

    function getAllDeals()
        external
        view
        returns (IIntegration.DealParams[] memory result);

    function registerIntegration(uint256 type_, address addr) external;
}
