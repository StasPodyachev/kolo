// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "../interfaces/integrations/IAuctionFile.sol";
import "../interfaces/integrations/IIntegration.sol";
import "../interfaces/IStore.sol";
import "../interfaces/IFactory.sol";
import "../interfaces/INotary.sol";
import "../interfaces/IChat.sol";
import "../ControlAccess.sol";

import "hardhat/console.sol";

contract AuctionFile is IAuctionFile, IIntegration, ControlAccess, Ownable {
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

    modifier onlyNotary() {
        require(msg.sender == address(_notary), "AuctionFile: Only notary");
        _;
    }

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
        params.dateDispute = params.dateExpire + _periodDispute;

        deal = DealParams({
            id: dealId,
            _type: 0,
            data: abi.encode(params),
            integration: address(this),
            store: _factory.getStore(params.seller)
        });
    }

    function getBidHistory(uint256 dealId)
        external
        view
        returns (BidParams[] memory)
    {
        return bidHistory[dealId];
    }

    function _checkStatusAndGetDeal(uint256 dealId, AuctionStatus status)
        internal
        view
        returns (AuctionFileParams storage)
    {
        AuctionFileParams storage deal = deals[dealId];
        require(deal.priceStart != 0, "AuctionFile: Id not found");
        require(deal.status == status, "AuctionFile: Wrong status");

        return deal;
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
            dateDispute: dateExpire + _periodDispute,
            status: AuctionStatus.OPEN
        });

        IStore(storeAddress).createDeal{value: msg.value}(id);
        _chat.sendSystemMessage(id, "Deal created.");

        emit DealCreated(id, msg.sender);

        return id;
    }

    function bid(uint256 dealId) external payable {
        AuctionFileParams storage deal = _checkStatusAndGetDeal(
            dealId,
            AuctionStatus.OPEN
        );

        require(
            deal.seller != msg.sender,
            "AuctionFile: Seller cannot be a buyer"
        );

        require(block.timestamp < deal.dateExpire, "AuctionFile: Time is up");
        require(msg.value >= deal.priceStart, "AuctionFile: Wrong amount");

        require(
            msg.value > deal.price,
            "AuctionFile: Current bid cannot be less then previous bid"
        );

        address storeAddress = _factory.getStore(deal.seller);
        IStore(storeAddress).depositBuyer{value: msg.value}(dealId, msg.sender);

        if (deal.price != 0) {
            IStore(storeAddress).withdrawBuyer(dealId, deal.buyer);
        }

        deal.price = msg.value;
        deal.buyer = msg.sender;

        bids[dealId][msg.sender] = msg.value;

        bidHistory[dealId].push(
            BidParams({
                timestamp: block.timestamp,
                buyer: msg.sender,
                bid: msg.value
            })
        );

        bidBuyers[dealId].push(msg.sender);

        _chat.sendSystemMessage(
            dealId,
            string(
                abi.encodePacked(
                    "Bid added by ",
                    Strings.toHexString(uint256(uint160(deal.buyer)), 20)
                )
            )
        );

        emit BidCreated(dealId, deal.buyer, deal.price);

        if (msg.value >= deal.priceForceStop) {
            _finalize(deal);
        }
    }

    function cancel(uint256 dealId) external {
        AuctionFileParams storage deal = _checkStatusAndGetDeal(
            dealId,
            AuctionStatus.OPEN
        );

        require(
            deal.seller == msg.sender,
            "AuctionFile: Caller is not a seller"
        );
        require(
            deal.buyer == address(0),
            "AuctionFile: Auction already have a bid"
        );

        deal.status = AuctionStatus.CANCEL;

        _sendSellerCollateral(dealId, deal.seller);
        _chat.sendSystemMessage(dealId, "Deal canceled.");

        emit DealCanceled(dealId, msg.sender);
    }

    function _sendSellerCollateral(uint256 dealId, address seller) internal {
        address storeAddress = _factory.getStore(seller);
        IStore(storeAddress).transferWinToSeller(
            dealId,
            address(0),
            seller,
            _serviceFee
        );
    }

    function dispute(uint256 dealId) external payable {
        AuctionFileParams storage deal = _checkStatusAndGetDeal(
            dealId,
            AuctionStatus.FINALIZE
        );

        require(deal.buyer == msg.sender, "AuctionFile: Caller is not a buyer");
        require(
            block.timestamp < deal.dateExpire + _periodDispute,
            "AuctionFile: Time for dispute is up"
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

        emit DisputeCreated(dealId);
    }

    function finalize(uint256 dealId) external {
        AuctionFileParams storage deal = _checkStatusAndGetDeal(
            dealId,
            AuctionStatus.OPEN
        );

        require(
            block.timestamp > deal.dateExpire,
            "AuctionFile: Date is not expire"
        );

        if (deal.buyer == address(0)) {
            _sendWin(deal, IIntegration.DisputeWinner.Seller);
            _chat.sendSystemMessage(dealId, "Deal closed.");

            return;
        }

        _finalize(deal);
    }

    function _finalize(AuctionFileParams storage deal) internal {
        _addAccess(deal.buyer, deal.cid);

        deal.status = AuctionStatus.FINALIZE;
        deal.dateExpire = block.timestamp;

        _chat.sendSystemMessage(deal.id, "Deal finalized.");
        emit DealFinalized(deal.id);
    }

    function finalizeDispute(uint256 dealId, IIntegration.DisputeWinner winner)
        external
        onlyNotary
    {
        AuctionFileParams storage deal = _checkStatusAndGetDeal(
            dealId,
            AuctionStatus.DISPUTE
        );

        _sendWin(deal, winner);

        _chat.sendSystemMessage(
            dealId,
            string(
                abi.encodePacked(
                    "Dispute closed, ",
                    Strings.toHexString(
                        uint256(
                            uint160(
                                winner == IIntegration.DisputeWinner.Buyer
                                    ? deal.buyer
                                    : deal.seller
                            )
                        ),
                        20
                    ),
                    " wins."
                )
            )
        );
    }

    function receiveReward(uint256 dealId) external {
        AuctionFileParams storage deal = _checkStatusAndGetDeal(
            dealId,
            AuctionStatus.FINALIZE
        );

        require(
            block.timestamp > deal.dateExpire + _periodDispute,
            "AuctionFile: Time for dispute"
        );

        _sendWin(deal, IIntegration.DisputeWinner.Seller);
    }

    function _sendWin(
        AuctionFileParams storage deal,
        IIntegration.DisputeWinner winner
    ) internal {
        address storeAddress = _factory.getStore(deal.seller);
        IStore store = IStore(storeAddress);

        if (winner == IIntegration.DisputeWinner.Seller) {
            store.transferWinToSeller(
                deal.id,
                deal.buyer,
                deal.seller,
                _serviceFee
            );
        } else {
            store.transferWinToBuyer(deal.id, deal.buyer);
        }
        _chat.sendSystemMessage(deal.id, "Deal closed.");

        deal.status = AuctionStatus.CLOSE;
        emit DealClosed(deal.id);
    }

    function addAccess(uint256 dealId, address wallet) external onlyNotary {
        _addAccess(wallet, deals[dealId].cid);
    }

    function sendMessage(uint256 dealId, string calldata message) external {
        AuctionFileParams memory deal = deals[dealId];

        require(
            deal.status != AuctionStatus.CLOSE &&
                deal.status != AuctionStatus.CANCEL,
            "AuctionFile: Wrong status"
        );

        _chat.sendMessage(dealId, message, msg.sender);
    }
}
