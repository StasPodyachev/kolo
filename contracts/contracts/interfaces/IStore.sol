// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

interface IStore {
    function createDeal(uint256 dealId) external payable;

    function depositBuyer(uint256 dealId, address buyer) external payable;

    function depositBuyerCollateral(uint256 dealId) external payable;

    function withdrawBuyer(uint256 dealId, address buyer) external;

    function getSellerCollateral(uint256 dealId)
        external
        view
        returns (uint256);

    function getBuyerCollateral(uint256 dealId) external view returns (uint256);

    function transferWinToSeller(
        uint256 dealId,
        address buyer,
        address seller
    ) external;

    function transferWinToBuyer(uint256 dealId, address buyer) external;

    function addAccsess(uint256 dealId, address wallet) external;

    function checkAccsess(uint256 dealId, address wallet) external;

    function getIntegration(uint256 dealId) external view returns (address);
}
