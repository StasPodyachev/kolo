// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

import "./interfaces/IStoreDeployer.sol";
import "./interfaces/IFactory.sol";

import "./Store.sol";

contract StoreDeployer is IStoreDeployer {
    struct Parameters {
        address factory;
    }

    /// @inheritdoc IStoreDeployer
    Parameters public override parameters;

    /// @dev Deploys a store with the given parameters by transiently setting the parameters storage slot and then
    /// clearing it after deploying the store.
    function deploy(address factory) internal returns (address storeAddress) {
        parameters = Parameters({factory: factory});
        storeAddress = address(new Store());

        Store(storeAddress).transferOwnership(msg.sender);

        delete parameters;
    }
}