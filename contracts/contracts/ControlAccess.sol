// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.9;
pragma abicoder v2;

import "./interfaces/IControlAccess.sol";

/**
 * @title Kolo control access
 *
 * This contract stores all messages of all deals
 *
 */
abstract contract ControlAccess {
    /// @dev Holds a mapping of wallet to cids.
    mapping(address => mapping(bytes => bool)) private _accsess;

    /// @dev Adds an access a mapping of wallet to cids.
    function _addAccess(address wallet, bytes storage cid) internal {
        _accsess[wallet][cid] = true;
    }

    function checkAccess(bytes calldata cid, address wallet)
        external
        view
        returns (uint8)
    {
        return _accsess[wallet][cid] ? 1 : 0;
    }

    function checkAccess(
        bytes32[] calldata cid,
        uint8 size,
        address wallet
    ) external view returns (uint8) {
        size -= 32;
        bytes memory tmp = new bytes(size);

        // TODO: change to assembly

        for (uint256 i = 0; i < size; i++) {
            tmp[i] = cid[1][i];
        }

        return this.checkAccess(bytes.concat(cid[0], tmp), wallet);

        //QmbdEmFu3AK3gKcRPNjWo9qdktqGrvjfM2ZiewANkHUWMK
        //QmbdEmFu3AK3gKcRPNjWo9qdktqGrvjfM2ZiewANkHUWMK
    }
}
