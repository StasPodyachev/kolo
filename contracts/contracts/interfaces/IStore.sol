// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

interface IStore {
    function createDeal(uint256 dealId) external payable;

    function depositBuyer(uint256 dealId, address buyer) external payable;

    function withdrawBuyer() external;
}
