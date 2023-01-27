// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

import "./integrations/IIntegration.sol";

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

    function getIntegration(uint256 dealId) external view returns (address);

    function getDeal(uint256 dealId)
        external
        view
        returns (IIntegration.DealParams memory);

    function getAllDeals()
        external
        view
        returns (IIntegration.DealParams[] memory result);
}
