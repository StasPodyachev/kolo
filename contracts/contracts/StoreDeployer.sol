// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

import "./interfaces/IStoreDeployer.sol";
import "./interfaces/IFactory.sol";

import "./Store.sol";

contract StoreDeployer is IStoreDeployer {
    struct Parameters {
        address factory;
    }

    Parameters public override parameters;

    function deploy(address factory) internal returns (address storeAddress) {
        parameters = Parameters({factory: factory});
        storeAddress = address(new Store());

        Store(storeAddress).transferOwnership(msg.sender);

        delete parameters;
    }
}
