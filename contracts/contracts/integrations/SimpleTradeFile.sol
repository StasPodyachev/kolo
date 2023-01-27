// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

import "../interfaces/integrations/ISimpleTradeFile.sol";
import "../interfaces/integrations/IIntegration.sol";
import "../interfaces/IStore.sol";
import "../interfaces/IFactory.sol";
import "../interfaces/INotary.sol";
import "../interfaces/IChat.sol";

import {SizeOf} from "../libs/seriality/SizeOf.sol";
import {TypesToBytes} from "../libs/seriality/TypesToBytes.sol";

contract SimpleTradeFileFile is ISimpleTradeFile, IIntegration, Ownable {
    IFactory public _factory;
    INotary public _notary;
    IChat public _chat;

    uint256 public _periodDispute = 5 days;

    uint256 public _collateralAmount = 1e17;
    uint256 public _collateralPercent = 1e17;

    mapping(uint256 => SimpleTradeFileParams) private deals;
    mapping(address => mapping(bytes => bool)) private _accsess;

    function setPeriodDispute(uint256 value) external onlyOwner {
        _periodDispute = value;
    }

    function setCollateralAmount(uint256 value) external onlyOwner {
        _collateralAmount = value;
    }

    function setCollateralPercent(uint256 value) external onlyOwner {
        _collateralPercent = value;
    }

    function setFactory(address factory) external onlyOwner {
        _factory = IFactory(factory);
    }

    function setNotary(address notary) external onlyOwner {
        _notary = INotary(notary);
    }

    function setChat(address chat) external onlyOwner {
        _chat = IChat(chat);
    }

    function getIntegrationInfo()
        external
        view
        returns (ConfigureParams memory)
    {
        return
            ConfigureParams({
                periodDispute: _periodDispute,
                collateralAmount: _collateralAmount,
                collateralPercent: _collateralPercent
            });
    }

    function getDeal(uint256 dealId)
        external
        view
        returns (DealParams memory deal)
    {
        SimpleTradeFileParams memory params = deals[dealId];

        uint256 size = SizeOf.sizeOfString(params.name) +
            SizeOf.sizeOfString(params.description) +
            SizeOf.sizeOfBytes(params.cid) +
            4 *
            32 +
            20 *
            2;
        uint256 offset = 0;
        bytes memory data = new bytes(size);

        // Serialize AuctionFileParams to bytes
        // 2x string
        TypesToBytes.stringToBytes(offset, bytes(params.name), data);
        offset += SizeOf.sizeOfString(params.name);
        TypesToBytes.stringToBytes(offset, bytes(params.description), data);
        offset += SizeOf.sizeOfString(params.description);

        // 4x uint256
        TypesToBytes.uintToBytes(offset, params.price, data);
        offset += 32;

        TypesToBytes.uintToBytes(offset, params.collateralAmount, data);
        offset += 32;

        // 2x address
        TypesToBytes.addressToBytes(offset, params.seller, data);
        offset += 20;
        TypesToBytes.addressToBytes(offset, params.buyer, data);
        offset += 20;

        // uint
        TypesToBytes.uintToBytes(offset, params.dateExpire, data);
        offset += 32;

        // bytes
        TypesToBytes.stringToBytes(offset, params.cid, data);
        offset += SizeOf.sizeOfBytes(params.cid);

        // uint
        TypesToBytes.uintToBytes(offset, uint256(params.status), data);
        offset += 32;
        deal = DealParams({
            id: dealId,
            _type: 0,
            data: data,
            integration: address(this),
            store: _factory.getStore(params.seller)
        });
    }

    function sendMessage(uint256 dealId, string calldata message) external {
        SimpleTradeFileParams memory deal = deals[dealId];
        require(deal.price != 0, "SimpleTradeFileFile: Id not found");

        require(
            deal.status != SimpleTradeFileStatus.CLOSE &&
                deal.status != SimpleTradeFileStatus.CANCEL,
            "SimpleTradeFileFile: Wrong status"
        );

        _chat.sendMessage(dealId, message, msg.sender);
    }

    function create(
        string calldata name,
        string calldata description,
        uint256 price,
        uint256 dateExpire,
        bytes calldata cid
    ) external payable returns (uint256) {
        address storeAddress = _factory.getStore(msg.sender);

        require(
            storeAddress != address(0),
            "SimpleTradeFileFile: Caller does not have a store"
        );

        require(
            msg.value >= (price * _collateralPercent) / 1e18 &&
                msg.value >= _collateralAmount,
            "SimpleTradeFileFile: Wrong collateral"
        );

        require(
            price != 0 && dateExpire > block.timestamp,
            "SimpleTradeFileFile: Wrong params"
        );

        uint256 id = _factory.addDeal(storeAddress);

        deals[id] = SimpleTradeFileParams({
            id: id,
            name: name,
            description: description,
            collateralAmount: msg.value,
            price: price,
            dateExpire: dateExpire,
            seller: msg.sender,
            buyer: address(0),
            cid: cid,
            status: SimpleTradeFileStatus.OPEN
        });

        IStore(storeAddress).createDeal{value: msg.value}(id);
        _chat.sendSystemMessage(id, "Deal created.");

        emit DealCreated(id, msg.sender);

        return id;
    }

    function buy(uint256 dealId) external payable {
        SimpleTradeFileParams memory deal = deals[dealId];
        require(deal.price != 0, "SimpleTradeFile: Id not found");

        require(
            deal.status == SimpleTradeFileStatus.OPEN,
            "SimpleTradeFile: Wrong status"
        );

        require(
            deal.seller != msg.sender,
            "SimpleTradeFile: Seller cannot be a buyer"
        );

        require(
            block.timestamp < deal.dateExpire,
            "SimpleTradeFile: Time is up"
        );

        require(msg.value == deal.price, "SimpleTradeFile: Wrong msg.value");

        address storeAddress = _factory.getStore(deal.seller);
        IStore(storeAddress).depositBuyer{value: msg.value}(dealId, msg.sender);

        deal.buyer = msg.sender;

        this.addAccsess(dealId, deal.buyer);
        deal.status = SimpleTradeFileStatus.FINALIZE;
        deal.dateExpire = block.timestamp;

        _chat.sendSystemMessage(
            dealId,
            string(abi.encodePacked(deal.buyer, "bought an item"))
        );
    }

    function cancel(uint256 dealId) external {
        SimpleTradeFileParams memory deal = deals[dealId];

        require(deal.price != 0, "SimpleTradeFile: Id not found");
        require(
            deal.seller == msg.sender,
            "SimpleTradeFile: Caller is not a seller"
        );
        require(
            deal.status == SimpleTradeFileStatus.OPEN,
            "SimpleTradeFile: Wrong status"
        );

        deal.status = SimpleTradeFileStatus.CANCEL;

        _chat.sendSystemMessage(dealId, "Deal canceled.");

        emit DealCanceled(dealId, msg.sender);
    }

    function dispute(uint256 dealId) external payable {
        SimpleTradeFileParams memory deal = deals[dealId];
        require(deal.price != 0, "SimpleTradeFile: Id not found");

        require(
            deal.buyer == msg.sender,
            "SimpleTradeFile: Caller is not a buyer"
        );
        require(
            block.timestamp < deal.dateExpire + _periodDispute,
            "SimpleTradeFile: Time for dispute is up"
        );

        require(
            deal.status == SimpleTradeFileStatus.FINALIZE,
            "SimpleTradeFile: Wrong status"
        );

        require(
            msg.value == deal.collateralAmount,
            "SimpleTradeFile: Wrong collateral"
        );

        address storeAddress = _factory.getStore(deal.seller);
        IStore(storeAddress).depositBuyerCollateral{value: msg.value}(dealId);

        deal.status = SimpleTradeFileStatus.DISPUTE;

        _notary.chooseNotaries(dealId);

        _chat.sendSystemMessage(dealId, "Dispute started.");
    }

    function finalizeDispute(uint256 dealId, IIntegration.DisputeWinner winner)
        external
    {
        SimpleTradeFileParams memory deal = deals[dealId];
        require(deal.price != 0, "SimpleTradeFile: Id not found");

        require(
            deal.status == SimpleTradeFileStatus.DISPUTE,
            "SimpleTradeFile: Wrong status"
        );

        address storeAddress = _factory.getStore(deal.seller);
        IStore store = IStore(storeAddress);

        if (winner == IIntegration.DisputeWinner.Buyer) {
            store.transferWinToBuyer(dealId, deal.buyer);
        } else {
            store.transferWinToSeller(dealId, deal.buyer, deal.seller);
        }

        deal.status = SimpleTradeFileStatus.CLOSE;

        _chat.sendSystemMessage(
            dealId,
            string(
                abi.encodePacked(
                    "Dispute closed",
                    winner == IIntegration.DisputeWinner.Buyer
                        ? deal.buyer
                        : deal.seller,
                    "wins."
                )
            )
        );
    }

    function finalize(uint256 dealId) external {
        SimpleTradeFileParams memory deal = deals[dealId];
        require(deal.price != 0, "SimpleTradeFile: Id not found");

        require(
            block.timestamp > deal.dateExpire,
            "SimpleTradeFile: Date is not expire"
        );

        require(
            (block.timestamp > deal.dateExpire &&
                deal.status == SimpleTradeFileStatus.OPEN) ||
                (block.timestamp > deal.dateExpire + _periodDispute &&
                    deal.status == SimpleTradeFileStatus.FINALIZE),
            "SimpleTradeFile: Error"
        );

        address storeAddress = _factory.getStore(deal.seller);

        IStore(storeAddress).transferWinToSeller(
            dealId,
            deal.buyer,
            deal.seller
        );

        deal.status = SimpleTradeFileStatus.CLOSE;

        _chat.sendSystemMessage(dealId, "Deal closed.");
    }

    function addAccsess(uint256 dealId, address wallet) external {
        // TODO: Security
        bytes memory cid = deals[dealId].cid;
        _accsess[wallet][cid] = true;
    }

    function checkAccsess(bytes calldata cid, address wallet)
        external
        view
        returns (uint8)
    {
        return _accsess[wallet][cid] ? 1 : 0;
    }
}