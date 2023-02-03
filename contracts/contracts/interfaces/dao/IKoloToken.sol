// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IKoloToken {
    function currentAirdropFactor() external view returns (uint256 val);

    function airdrop(address wallet) external;
}
