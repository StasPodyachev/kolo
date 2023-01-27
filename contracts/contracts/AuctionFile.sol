// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IAuctionFile.sol";
import "./interfaces/IIntegration.sol";
import "./interfaces/IStore.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/INotary.sol";

import {SizeOf} from "./libs/seriality/SizeOf.sol";
import {TypesToBytes} from "./libs/seriality/TypesToBytes.sol";

contract AuctionFile is IAuctionFile, IIntegration, Ownable {
    IFactory public _factory;
    INotary public _notary;

    uint256 public _periodDispute = 5 days;

    uint256 public _colletoralAmount = 1e17;
    uint256 public _colletoralPercent = 1e17;

    mapping(uint256 => AuctionFileParams) private deals;
    mapping(uint256 => ChatParams[]) private chats;
    mapping(uint256 => mapping(address => uint256)) private bids;
    mapping(uint256 => BidParams[]) private bidHistory;
    mapping(uint256 => address[]) private bidBuyers;
    mapping(address => mapping(bytes => bool)) private _accsess;

    uint256 id;

    function setPeriodDispute(uint256 value) external onlyOwner {
        _periodDispute = value;
    }

    function setColletoralAmount(uint256 value) external onlyOwner {
        _colletoralAmount = value;
    }

    function setColletoralPercent(uint256 value) external onlyOwner {
        _colletoralPercent = value;
    }

    function setFactory(address factory) external onlyOwner {
        _factory = IFactory(factory);
    }

    function setNotary(address notary) external onlyOwner {
        _notary = INotary(notary);
    }

    function getDeal(uint256 dealId)
        external
        view
        returns (DealParams memory deal)
    {
        AuctionFileParams memory params = deals[dealId];

        uint256 size = SizeOf.sizeOfString(params.name) +
            SizeOf.sizeOfString(params.description) +
            SizeOf.sizeOfBytes(params.cid) +
            6 *
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
        TypesToBytes.uintToBytes(offset, params.priceStart, data);
        offset += 32;
        TypesToBytes.uintToBytes(offset, params.priceForceStop, data);
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
        deal = DealParams({id: dealId, _type: 0, data: data});
    }

    function sendMessage(uint256 dealId, string calldata message) external {
        AuctionFileParams memory deal = deals[dealId];
        require(deal.priceStart != 0, "AuctionFile: Id not found");

        require(
            deal.status != AuctionStatus.CLOSE &&
                deal.status != AuctionStatus.CANCEL,
            "AuctionFile: Wrong status"
        );

        chats[dealId].push(
            ChatParams({
                timestamp: block.timestamp,
                message: message,
                sender: msg.sender
            })
        );
    }

    function create(
        string calldata name,
        string calldata description,
        uint256 priceStart,
        uint256 priceForceStop,
        uint256 dateExpire,
        bytes calldata cid
    ) external payable returns (uint256) {
        address storeAddress = _factory.getStore(msg.sender);

        require(
            storeAddress != address(0),
            "AuctionFile: Caller does not have a store"
        );

        require(
            msg.value >= (priceStart * _colletoralPercent) / 1e18 &&
                msg.value >= _colletoralAmount,
            "AuctionFile: Wrong colletoral"
        );

        require(priceStart != 0, "AuctionFile: Wrong priceStart");

        deals[++id] = AuctionFileParams({
            name: name,
            description: description,
            collateralAmount: msg.value,
            price: 0,
            priceForceStop: priceForceStop,
            priceStart: priceStart,
            dateExpire: dateExpire,
            seller: msg.sender,
            buyer: address(0),
            cid: cid,
            status: AuctionStatus.OPEN
        });

        _factory.addDeal(id, storeAddress);

        IStore(storeAddress).createDeal{value: msg.value}(id);
        this.addAccsess(id, msg.sender);

        emit DealCreated(id, msg.sender);

        return id;
    }

    function bid(uint256 dealId) external payable {
        AuctionFileParams memory deal = deals[dealId];

        require(deal.priceStart != 0, "AuctionFile: Id not found");

        require(deal.status == AuctionStatus.OPEN, "AuctionFile: Wrong status");

        require(
            deal.seller != msg.sender,
            "AuctionFile: Seller cannot be a buyer"
        );

        require(block.timestamp < deal.dateExpire, "AuctionFile: Time is up");

        uint256 currentBid = bids[dealId][msg.sender] + msg.value;

        require(currentBid >= deal.priceStart, "AuctionFile: Wrong amount");

        require(
            currentBid > deal.price,
            "AuctionFile: Current bid cannot be less then previous bid"
        );

        address storeAddress = _factory.getStore(deal.seller);
        IStore(storeAddress).depositBuyer{value: msg.value}(dealId, msg.sender);

        deal.price = currentBid;
        deal.buyer = msg.sender;

        bids[dealId][msg.sender] = currentBid;

        bidHistory[dealId].push(
            BidParams({
                timestamp: block.timestamp,
                buyer: msg.sender,
                bid: currentBid
            })
        );

        bidBuyers[dealId].push(msg.sender);

        if (currentBid >= deal.priceForceStop) {
            _finalizeForce(dealId, msg.sender, IStore(storeAddress));
            deal.status = AuctionStatus.FINALIZE;
        }
    }

    function cancel(uint256 dealId) external {
        AuctionFileParams memory deal = deals[dealId];

        require(deal.priceStart != 0, "AuctionFile: Id not found");
        require(
            deal.seller == msg.sender,
            "AuctionFile: Caller is not a seller"
        );
        require(
            deal.buyer == address(0),
            "AuctionFile: Auction already have a bid"
        );

        deal.status = AuctionStatus.CANCEL;

        emit DealCanceled(dealId, msg.sender);
    }

    function dispute(uint256 dealId) external payable {
        AuctionFileParams memory deal = deals[dealId];
        require(deal.priceStart != 0, "AuctionFile: Id not found");

        require(deal.buyer == msg.sender, "AuctionFile: Caller is not a buyer");
        require(
            block.timestamp < deal.dateExpire + _periodDispute,
            "AuctionFile: Time for dispute is up"
        );

        require(
            deal.status == AuctionStatus.FINALIZE,
            "AuctionFile: Wrong status"
        );

        require(
            msg.value == deal.collateralAmount,
            "AuctionFile: Wrong colletoral"
        );

        address storeAddress = _factory.getStore(deal.seller);
        IStore(storeAddress).depositBuyerCollateral{value: msg.value}(dealId);

        deal.status = AuctionStatus.DISPUTE;

        _notary.chooseNotaries(dealId);
    }

    function finalize(uint256 dealId) external {
        AuctionFileParams memory deal = deals[dealId];
        require(deal.priceStart != 0, "AuctionFile: Id not found");

        require(
            block.timestamp > deal.dateExpire,
            "AuctionFile: Date is not expire"
        );

        require(
            deal.status == AuctionStatus.OPEN,
            "AuctionFile: Auction is not open"
        );

        address storeAddress = _factory.getStore(deal.seller);

        if (deal.buyer == address(0)) {
            IStore(storeAddress).transferSellerCollateral(dealId, deal.seller);
            deal.status = AuctionStatus.CLOSE;

            return;
        }

        _finalizeForce(dealId, deal.buyer, IStore(storeAddress));
        deal.status = AuctionStatus.FINALIZE;
    }

    function _finalizeForce(
        uint256 dealId,
        address buyerAddress,
        IStore store
    ) internal {
        _withdrawBids(dealId, buyerAddress, store);
        this.addAccsess(dealId, buyerAddress);
    }

    function _withdrawBids(
        uint256 dealId,
        address buyer,
        IStore store
    ) internal {
        address[] memory buyers = bidBuyers[dealId];

        for (uint256 i = 0; i < buyers.length; i++) {
            if (buyers[i] == buyer) continue;

            store.withdrawBuyer(dealId, buyers[i]);
        }
    }

    function finalizeDispute(uint256 dealId, IIntegration.DisputeWinner winner)
        external
    {
        AuctionFileParams memory deal = deals[dealId];
        require(deal.priceStart != 0, "AuctionFile: Id not found");

        require(
            deal.status == AuctionStatus.DISPUTE,
            "AuctionFile: Wrong status"
        );

        address storeAddress = _factory.getStore(deal.seller);
        IStore store = IStore(storeAddress);

        if (winner == IIntegration.DisputeWinner.Buyer) {
            store.transferBuyerCollateral(dealId, deal.buyer);
            store.transfer(dealId, deal.buyer, deal.buyer);
        } else {
            store.transferSellerCollateral(dealId, deal.seller);
            store.transfer(dealId, deal.buyer, deal.seller);
        }

        deal.status = AuctionStatus.CLOSE;
    }

    function close(uint256 dealId) external {
        AuctionFileParams memory deal = deals[dealId];
        require(deal.priceStart != 0, "AuctionFile: Id not found");
        require(
            deal.status == AuctionStatus.FINALIZE,
            "AuctionFile: Wrong status"
        );
        require(
            block.timestamp > deal.dateExpire + _periodDispute,
            "AuctionFile: Time for dispute"
        );

        address storeAddress = _factory.getStore(deal.seller);
        IStore store = IStore(storeAddress);

        store.transferSellerCollateral(dealId, deal.seller);
        store.transfer(dealId, deal.buyer, deal.seller);

        deal.status = AuctionStatus.CLOSE;
    }

    function getBidHistory(uint256 dealId)
        external
        view
        returns (BidParams[] memory)
    {
        BidParams[] memory result = bidHistory[dealId];

        if (result.length == 0) {
            BidParams[] memory res = new BidParams[](5);

            res[0] = BidParams({
                timestamp: block.timestamp - 100,
                bid: 1e18,
                buyer: 0xA93DD4D2b1F555069a9D0f1E1b19030F63e4bE41
            });

            res[1] = BidParams({
                timestamp: block.timestamp - 50,
                bid: 5e18,
                buyer: 0x0dD6392662B132bA11e02cd5Cd628DfedF95c6f4
            });

            res[2] = BidParams({
                timestamp: block.timestamp - 30,
                bid: 6e18,
                buyer: 0xA93DD4D2b1F555069a9D0f1E1b19030F63e4bE41
            });

            res[3] = BidParams({
                timestamp: block.timestamp - 15,
                bid: 7e18,
                buyer: 0x4dDf68F76aaBf2CC2DF3b9Db3BBEC26508e59a6c
            });

            res[4] = BidParams({
                timestamp: block.timestamp,
                bid: 10e18,
                buyer: 0xA93DD4D2b1F555069a9D0f1E1b19030F63e4bE41
            });

            return res;
        }

        return result;
    }

    function getChat(uint256 dealId)
        external
        view
        returns (ChatParams[] memory)
    {
        ChatParams[] memory res = new ChatParams[](5);

        res[0] = ChatParams({
            timestamp: block.timestamp - 100,
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            sender: 0xA93DD4D2b1F555069a9D0f1E1b19030F63e4bE41
        });

        res[1] = ChatParams({
            timestamp: block.timestamp - 50,
            message: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
            sender: 0x0dD6392662B132bA11e02cd5Cd628DfedF95c6f4
        });

        res[2] = ChatParams({
            timestamp: block.timestamp - 30,
            message: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
            sender: 0xA93DD4D2b1F555069a9D0f1E1b19030F63e4bE41
        });

        res[3] = ChatParams({
            timestamp: block.timestamp - 15,
            message: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
            sender: 0x4dDf68F76aaBf2CC2DF3b9Db3BBEC26508e59a6c
        });

        res[4] = ChatParams({
            timestamp: block.timestamp,
            message: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
            sender: 0xA93DD4D2b1F555069a9D0f1E1b19030F63e4bE41
        });

        return res;
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
