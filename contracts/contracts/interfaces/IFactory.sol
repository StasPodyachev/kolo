// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./integrations/IIntegration.sol";

interface IFactory {
    event StoreCreated(address store, address wallet);

    function treasury() external view returns (address);

    function chat() external view returns (address);

    function daoToken() external view returns (address);

    function createStore(address wallet)
        external
        returns (address storeAddress);

    function addDeal(address storeAddress) external returns (uint256);

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

    function integrationExist(address addr) external view returns (bool);
}
