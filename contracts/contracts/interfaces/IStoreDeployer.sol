// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

interface IStoreDeployer {
    function parameters()
        external
        view
        returns (address factory, address wallet);
}
