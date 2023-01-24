// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IStore.sol";

contract Store is IStore, Ownable {
    mapping(uint256 => address) private deals;
    mapping(uint256 => mapping(address => uint256)) private buyers;
    mapping(uint256 => uint256) private sellerCollaterals;

    function createDeal(uint256 dealId) external payable {
        deals[dealId] = msg.sender;
        sellerCollaterals[dealId] = msg.value;
    }

    function depositBuyer(uint256 dealId, address buyer) external payable {
        buyers[dealId][buyer] += msg.value;
    }

    function withdrawBuyer(uint256 dealId, address buyer) external {
        // TODO: security
        // TODO: Transfer

        buyers[dealId][buyer] = 0;
    }
}
