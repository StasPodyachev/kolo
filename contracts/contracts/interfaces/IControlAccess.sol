// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IControlAccess {
    function checkAccess(bytes calldata cid, address wallet)
        external
        view
        returns (uint8);

    function checkAccess(
        bytes32[] calldata cid,
        uint8 size,
        address wallet
    ) external view returns (uint8);
}
