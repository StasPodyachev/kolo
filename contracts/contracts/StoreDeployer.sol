// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

import "./interfaces/IStoreDeployer.sol";
import "./interfaces/IFactory.sol";

import "./Store.sol";

/**
 * @title Store deploying functionality
 **/
abstract contract StoreDeployer is IStoreDeployer {
    struct Parameters {
        address factory;
    }

    Parameters public override parameters;

    /**
     * @notice Deploying a new store
     *
     * @dev Deploys a store with the given parameters by transiently setting
     * the parameters storage slot and then clearing it after deploying the store.
     * @param factory The contract address of the factory
     * @return storeAddress Address of a new store
     */
    function deploy(address factory) internal returns (address storeAddress) {
        parameters = Parameters({factory: factory});
        storeAddress = address(new Store());

        delete parameters;
    }
}
