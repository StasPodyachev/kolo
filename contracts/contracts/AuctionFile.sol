// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IAuctionFile.sol";
import "./interfaces/IStore.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/INotary.sol";

contract AuctionFile is IAuctionFile, Ownable {
    IFactory public _factory;
    INotary public _notary;

    uint256 public _periodDelivery = 2 days;
    uint256 public _periodDispute = 5 days;

    uint256 public _colletoralAmount = 1e17;
    uint256 public _colletoralPercent = 1e17;

    mapping(uint256 => AuctionFileParams) private deals;
    mapping(uint256 => mapping(address => uint256)) private bids;

    uint256 id;

    function setPeriodDelivery(uint256 value) external onlyOwner {
        _periodDelivery = value;
    }

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

    function create(
        string calldata name,
        string calldata description,
        uint256 priceStart,
        uint256 priceForceStop,
        uint256 dateExpire,
        bytes calldata cid,
        bytes calldata cidThumbnail
    ) external payable returns (uint256 dealId) {
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
            collatoralAmount: msg.value,
            price: 0,
            priceForceStop: priceForceStop,
            priceStart: priceStart,
            dateExpire: dateExpire,
            seller: msg.sender,
            buyer: address(0),
            cid: cid,
            cidThumbnail: cidThumbnail,
            status: AuctionStatus.OPEN
        });

        _factory.addDeal(id);

        IStore(storeAddress).createDeal{value: msg.value}(id);

        // Add accsess

        emit DealCreated(dealId, msg.sender);
    }

    function bid(uint256 dealId) external payable {
        AuctionFileParams memory deal = deals[dealId];

        require(deal.priceStart != 0, "AuctionFile: Id not found");

        require(
            deal.status == AuctionStatus.OPEN,
            "AuctionFile: Auction is not open"
        );

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

        if (currentBid >= deal.priceForceStop) {
            // this.finalizeForce(dealId);

            deal.status = AuctionStatus.FINALIZE;
        }
    }

    function cancel(uint256 dealId) external payable {
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

        if (block.timestamp >= deal.dateExpire) {
            deal.status = AuctionStatus.FINALIZE;
        } else if (deal.status != AuctionStatus.FINALIZE) revert();

        require(deal.buyer == msg.sender, "AuctionFile: Caller is not a buyer");
        require(
            block.timestamp <
                deal.dateExpire + _periodDispute + _periodDelivery,
            "AuctionFile: Time is up"
        );

        require(
            deal.status == AuctionStatus.FINALIZE,
            "AuctionFile: Wrong status"
        );

        require(
            msg.value == deal.collatoralAmount,
            "AuctionFile: Wrong colletoral"
        );

        address storeAddress = _factory.getStore(deal.seller);
        IStore(storeAddress).depositBuyerCollateral{value: msg.value}(dealId);

        deal.status = AuctionStatus.DISPUTE;

        _notary.chooseNotaries(dealId);
    }

    function finalizeDeal(uint256 dealId) external {
        AuctionFileParams memory deal = deals[dealId];
        require(deal.priceStart != 0, "AuctionFile: Id not found");

        require(
            block.timestamp >
                deal.dateExpire + _periodDispute + _periodDelivery,
            "AuctionFile: "
        );

        address storeAddress = _factory.getStore(deal.seller);
        IStore store = IStore(storeAddress);

        store.transferSellerCollateral(dealId, deal.seller);
        store.transfer(dealId, deal.seller, deal.buyer);

        //_returnBids(dealId); ?

        deal.status = AuctionStatus.CLOSE;
    }

    function finalizeDispute(uint256 dealId) external {
        AuctionFileParams memory deal = deals[dealId];
        require(deal.priceStart != 0, "AuctionFile: Id not found");

        require(
            deal.status == AuctionStatus.DISPUTE,
            "AuctionFile: Wrong status"
        );

        uint8 result = _notary.disputResult(dealId);

        require(result > 0, "AuctionFile: Disput is not finished");

        address storeAddress = _factory.getStore(deal.seller);
        IStore store = IStore(storeAddress);

        if (result == 1) {
            // Buyer win
            store.transferBuyerCollateral(dealId, deal.buyer);
            store.transfer(dealId, deal.buyer, deal.buyer);
        } else {
            // Buyer lose
            // reutrn colletoral Seller
            store.transferSellerCollateral(dealId, deal.seller);
            store.transfer(dealId, deal.seller, deal.buyer);
        }

        deal.status = AuctionStatus.CLOSE;
    }

    function finalizeForce(uint256 dealId) external {}

    function _returnBids(uint256 dealId) internal {}
}
