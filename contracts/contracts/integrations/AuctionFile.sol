// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

import "../interfaces/integrations/IAuctionFile.sol";
import "../interfaces/integrations/IIntegration.sol";
import "../interfaces/IStore.sol";
import "../interfaces/IFactory.sol";
import "../interfaces/INotary.sol";
import "../interfaces/IChat.sol";

import "hardhat/console.sol";

contract AuctionFile is IAuctionFile, IIntegration, Ownable {
    IFactory public _factory;
    IChat public _chat;
    INotary public _notary;

    uint256 public _periodDispute = 5 days;

    uint256 public _collateralAmount = 1e17;
    uint256 public _collateralPercent = 1e17;
    uint256 public _serviceFee = 2e16;

    mapping(uint256 => AuctionFileParams) private deals;
    mapping(uint256 => mapping(address => uint256)) private bids;
    mapping(uint256 => BidParams[]) private bidHistory;
    mapping(uint256 => address[]) private bidBuyers;
    mapping(address => mapping(bytes => bool)) private _accsess;

    function setServiceFee(uint256 value) external onlyOwner {
        _serviceFee = value;
    }

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
        _chat = IChat(_factory.chat());
    }

    function setNotary(address notary) external onlyOwner {
        _notary = INotary(notary);
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
        AuctionFileParams memory params = deals[dealId];

        deal = DealParams({
            id: dealId,
            _type: 0,
            data: abi.encode(params),
            integration: address(this),
            store: _factory.getStore(params.seller)
        });
    }

    function sendMessage(uint256 dealId, string calldata message) external {
        AuctionFileParams memory deal = deals[dealId];
        require(deal.priceStart != 0, "AuctionFile: Id not found");

        require(
            deal.status != AuctionStatus.CLOSE &&
                deal.status != AuctionStatus.CANCEL,
            "AuctionFile: Wrong status"
        );

        _chat.sendMessage(dealId, message, msg.sender);
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
            msg.value >= (priceStart * _collateralPercent) / 1e18 &&
                msg.value >= _collateralAmount,
            "AuctionFile: Wrong collateral"
        );

        require(
            priceStart != 0 &&
                priceStart < priceForceStop &&
                dateExpire > block.timestamp,
            "AuctionFile: Wrong params"
        );

        uint256 id = _factory.addDeal(storeAddress);

        deals[id] = AuctionFileParams({
            id: id,
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

        IStore(storeAddress).createDeal{value: msg.value}(id);
        _chat.sendSystemMessage(id, "Deal created.");

        emit DealCreated(id, msg.sender);

        return id;
    }

    function bid(uint256 dealId) external payable {
        AuctionFileParams storage deal = deals[dealId];

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

        _chat.sendSystemMessage(
            dealId,
            string(abi.encodePacked("Bid added by ", deal.buyer))
        );

        emit BidCreated(dealId, deal.buyer, deal.price);

        if (currentBid >= deal.priceForceStop) {
            _finalize(deal, IStore(storeAddress));
        }
    }

    function cancel(uint256 dealId) external {
        AuctionFileParams storage deal = deals[dealId];

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

        _chat.sendSystemMessage(dealId, "Deal canceled.");

        emit DealCanceled(dealId, msg.sender);
    }

    function dispute(uint256 dealId) external payable {
        AuctionFileParams storage deal = deals[dealId];
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
            "AuctionFile: Wrong collateral"
        );

        address storeAddress = _factory.getStore(deal.seller);
        IStore(storeAddress).depositBuyerCollateral{value: msg.value}(dealId);

        deal.status = AuctionStatus.DISPUTE;

        _notary.chooseNotaries(dealId);
        _chat.sendSystemMessage(dealId, "Dispute started.");
    }

    function finalize(uint256 dealId) external {
        AuctionFileParams storage deal = deals[dealId];
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
            IStore(storeAddress).transferWinToSeller(
                dealId,
                address(0),
                deal.seller,
                _serviceFee
            );

            deal.status = AuctionStatus.CLOSE;
            _chat.sendSystemMessage(dealId, "Deal closed.");

            return;
        }

        _finalize(deal, IStore(storeAddress));
    }

    function _finalize(AuctionFileParams storage deal, IStore store) internal {
        _withdrawBids(deal.id, deal.buyer, store);
        this.addAccsess(deal.id, deal.buyer);

        deal.status = AuctionStatus.FINALIZE;
        deal.dateExpire = block.timestamp;

        _chat.sendSystemMessage(deal.id, "Deal finalized.");
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
        require(msg.sender == address(_notary), "AuctionFile: Only notary");

        AuctionFileParams storage deal = deals[dealId];
        require(deal.priceStart != 0, "AuctionFile: Id not found");

        require(
            deal.status == AuctionStatus.DISPUTE,
            "AuctionFile: Wrong status"
        );

        address storeAddress = _factory.getStore(deal.seller);
        IStore store = IStore(storeAddress);

        if (winner == IIntegration.DisputeWinner.Buyer) {
            store.transferWinToBuyer(dealId, deal.buyer);
        } else {
            store.transferWinToSeller(
                dealId,
                deal.buyer,
                deal.seller,
                _serviceFee
            );
        }

        deal.status = AuctionStatus.CLOSE;

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

    function receiveReward(uint256 dealId) external {
        AuctionFileParams storage deal = deals[dealId];
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

        store.transferWinToSeller(dealId, deal.buyer, deal.seller, _serviceFee);

        deal.status = AuctionStatus.CLOSE;

        _chat.sendSystemMessage(dealId, "Dispute closed.");
    }

    function getBidHistory(uint256 dealId)
        external
        view
        returns (BidParams[] memory)
    {
        return bidHistory[dealId];
    }

    function addAccsess(uint256 dealId, address wallet) external {
        require(msg.sender == address(_notary), "AuctionFile: Only notary");

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

    function checkAccsess(
        bytes32[] calldata cid,
        uint8 size,
        address wallet
    ) external view returns (uint8) {
        return this.checkAccsess(bytes.concat(cid[0]), wallet);
    }
}
