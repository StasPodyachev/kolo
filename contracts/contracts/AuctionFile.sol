// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IAuctionFile.sol";
import "./interfaces/IStore.sol";

contract AuctionFile is IAuctionFile {
    IFactory public _factory;

    uint256 public _periodDelivery = 2 days;
    uint256 public _periodDispute = 5 days;
    uint256 public _colletoralPercent = 1e17;

    mapping(uint256 => AuctionFileParams) private files;
    mapping(address => uint256) private bids;

    uint256 id;

    function setPeriodDelivery(uint256 value) external payable onlyOwner {
        _periodDelivery = value;
    }

    function setPeriodDispute(uint256 value) external payable onlyOwner {
        _periodDispute = value;
    }

    function setFactory(IFactory factory) external onlyOwner {
        _factory = factory;
    }

    function create(
        string name,
        string description,
        uint256 priceStart,
        uint256 priceForceStop,
        uint256 price,
        uint256 dateExpire
    ) external payable returns (uint256 dealId) {
        require(
            _factory.stores[msg.sender] != address(0),
            "AuctionFile: Caller does not have a store"
        );

        require(
            msg.value == (price * _colletoralPercent) / 1e18,
            "AuctionFile: Wrong colletoral"
        );

        files[++id] = AuctionFileParams({
            name: name,
            description: description,
            price: price,
            priceForceStop: priceForceStop,
            priceStart: priceStart,
            dateExpire: dateExpire,
            seller: msg.sender,
            buyer: address(0),
            lastBid: 0,
            status: AuctionStatus.OPEN
        });

        _factory.addDeal(id);

        address storeAddress = _factory.stores[msg.sender];
        IStore(storeAddress).createDeal{value: msg.value}(id);

        emit DealCreated(dealId, msg.sender);
    }

    function bid(uint256 dealId) external payable {
        AuctionFileParams file = files[dealId];

        require(file.price != 0, "AuctionFile: Id not found");
        require(
            file.seller != msg.sender,
            "AuctionFile: Seller cannot be a buyer"
        );

        uint256 currentBid = bids[msg.sender] + msg.value;

        require(
            currentBid > file.lastBid,
            "AuctionFile: Current bid cannot be less then previous bid"
        );

        //check priceForceStop

        address storeAddress = _factory.stores[file.seller];
        IStore(storeAddress).depositBuyer{value: msg.value}(dealId, msg.sender);

        file.lastBid = currentBid;
        file.buyer = msg.sender;

        bids[msg.sender] = currentBid;
    }

    function cancel(uint256 dealId) external payable {
        AuctionFileParams file = files[dealId];

        require(file.price != 0, "AuctionFile: Id not found");
        require(
            file.seller == msg.sender,
            "AuctionFile: Caller is not a seller"
        );
        require(
            file.buyer != address(0),
            "AuctionFile: Auction already have a bid"
        );

        file.status = AuctionStatus.CANCEL;

        emit DealCanceled(dealId, msg.sender);
    }

    function finalize(uint256 dealId) external {}

    function dispute(uint256 dealId) external payable {
        AuctionFileParams file = files[dealId];

        require(file.price != 0, "AuctionFile: Id not found");
        require(file.buyer == msg.sender, "AuctionFile: Caller is not a buyer");

        // check collatoral

        address storeAddress = _factory.stores[file.seller];
        IStore(storeAddress).depositBuyer{value: msg.value}(dealId, msg.sender);

        file.status = AuctionStatus.DISPUTE;

        //chose notary
    }
}
