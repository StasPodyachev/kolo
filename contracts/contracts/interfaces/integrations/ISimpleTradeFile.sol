// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IIntegration.sol";
import "./../IChat.sol";
import "./../INotary.sol";

interface ISimpleTradeFile {
    enum SimpleTradeFileStatus {
        OPEN,
        CANCEL,
        CLOSE,
        DISPUTE,
        FINALIZE
    }

    struct SimpleTradeFileParams {
        uint256 id;
        string name;
        string description;
        uint256 price;
        uint256 collateralAmount;
        address seller;
        address buyer;
        uint256 dateExpire;
        uint256 dateDispute;
        bytes cid;
        SimpleTradeFileStatus status;
    }

    struct ConfigureParams {
        uint256 periodDispute;
        uint256 collateralAmount;
        uint256 collateralPercent;
    }

    event DisputeCreated(uint256 id);
    event DealCreated(uint256 dealId, address sender);
    event DealCanceled(uint256 dealId, address sender);
    event DealFinalized(uint256 dealId);
    event DealClosed(uint256 dealId);

    function getIntegrationInfo()
        external
        view
        returns (ConfigureParams memory);

    function setChat(IChat chat) external;

    function setNotary(INotary chat) external;

    function setPeriodDispute(uint256 value) external;

    function setCollateralAmount(uint256 value) external;

    function sendMessage(uint256 dealId, string calldata message) external;

    function create(
        string calldata name,
        string calldata description,
        uint256 price,
        uint256 dateExpire,
        bytes calldata cid
    ) external payable returns (uint256);

    function buy(uint256 dealId) external payable;

    function cancel(uint256 dealId) external;

    function dispute(uint256 dealId) external payable;

    function receiveReward(uint256 dealId) external;
}
