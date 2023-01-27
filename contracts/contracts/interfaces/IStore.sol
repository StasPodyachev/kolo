// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

interface IStore {
    function createDeal(uint256 dealId) external payable;

    function depositBuyer(uint256 dealId, address buyer) external payable;

    function depositBuyerCollateral(uint256 dealId) external payable;

    function withdrawBuyer(uint256 dealId, address buyer) external;

    function transfer(
        uint256 dealId,
        address buyer,
        address to
    ) external;

    function getSellerCollateral(uint256 dealId)
        external
        view
        returns (uint256);

    function getBuyerCollateral(uint256 dealId) external view returns (uint256);

    function transferBuyerCollateral(uint256 dealId, address to)
        external
        returns (uint256);

    function transferSellerCollateral(uint256 dealId, address to)
        external
        returns (uint256);

    function getIntegration(uint256 dealId) external view returns (address);

    // function addAccsess(bytes memory cid, address wallet) external;
}
