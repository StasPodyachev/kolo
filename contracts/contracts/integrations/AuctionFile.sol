// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "../interfaces/integrations/IAuctionFile.sol";
import "../interfaces/integrations/IIntegration.sol";

import "../interfaces/dao/IKoloToken.sol";

import "../interfaces/IStore.sol";
import "../interfaces/IFactory.sol";
import "../interfaces/INotary.sol";
import "../interfaces/IChat.sol";
import "../ControlAccess.sol";

import "hardhat/console.sol";

/**
 * @title AuctionFile
 *
 * This contract stores all deals of AuctionFile type. It also allows
 * to create a deal, to bid, to cancel a deal, to create a dispute and
 * to receive rewards. Sending messages is also available.
 *
 **/
contract AuctionFile is IAuctionFile, IIntegration, ControlAccess, Ownable {
    IFactory public _factory;
    IChat public _chat;
    INotary public _notary;

    uint256 public _periodDispute = 5 days;

    uint256 public _collateralAmount = 1e17;
    uint256 public _collateralPercent = 1e17;
    uint256 public _serviceFee = 2e16;
    uint256 public _storageFee = 1e14;
    uint256 public _extraStoragePeriod = 30 days;

    /// @dev Holds a mapping of deal IDs to deals.
    mapping(uint256 => AuctionFileParams) private deals;

    /// @dev Holds a mapping of deal IDs to buyers to bids.
    mapping(uint256 => mapping(address => uint256)) private bids;

    /// @dev Holds a mapping of deal IDs to bids history.
    mapping(uint256 => BidParams[]) private bidHistory;

    /// @dev Holds a mapping of deal IDs to all buyers.
    mapping(uint256 => address[]) private bidBuyers;

    constructor(IFactory factory) {
        _factory = factory;
    }

    modifier onlyNotary() {
        require(msg.sender == address(_notary), "AuctionFile: Only notary");
        _;
    }

    function setStorageFee(uint256 value) external onlyOwner {
        _storageFee = value;
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

    function setExtraStoragePeriod(uint256 value) external onlyOwner {
        _extraStoragePeriod = value;
    }

    function setChat(IChat chat) external onlyOwner {
        _chat = chat;
    }

    function setNotary(INotary notary) external onlyOwner {
        _notary = notary;
    }

    /**
     * @notice Get integration info
     *
     * @return param This function returns periodDispute,
     * collateralPercent and collateralAmount
     */
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

    /**
     * @notice Get deal by `dealId`
     *
     * @param dealId ID of a deal
     * @return deal This function returns deal ID, deal params,
     * integration type, store address and integration address
     * @dev Deal params stores in data in bytes.
     */
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

    /**
     * @notice Get bid history by `dealId`
     *
     * @param dealId ID of a deal
     * @return bids This function returns timestamp, buyer address
     * and bid amount.
     */
    function getBidHistory(uint256 dealId)
        external
        view
        returns (BidParams[] memory)
    {
        return bidHistory[dealId];
    }

    ///  @notice Get deal by `dealId`. Deal status must be equal `status`
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

    function _airdropDao(address wallet) internal {
        IKoloToken(_factory.daoToken()).airdrop(wallet);
    }

    /**
     * @notice Creating a new deal
     *
     * @param name Name of a deal
     * @param description Description of a deal
     * @param priceStart Price at which bids start
     * @param priceForceStop Price for force purchase
     * @param dateExpire Date the deal expires
     * @param cid File bytes
     * @return id ID of a deal
     * @dev This function creates store if it does not exist.
     * File must be uploaded first
     *
     * Requirements:
     *
     * - Сollateral cannot be less then `_collateralAmount`
     * - Сollateral cannot be less then `_collateralPercent` of `priceStart`
     * - `priceStart` cannot be 0
     * - `priceStart` cannot be less then `priceStart`
     * - `dateExpire` cannot be less then now
     *
     */
    function create(
        string calldata name,
        string calldata description,
        uint256 priceStart,
        uint256 priceForceStop,
        uint256 dateExpire,
        bytes calldata cid
    ) external payable returns (uint256) {
        address storeAddress = _factory.getStore(msg.sender);

        if (storeAddress == address(0)) {
            storeAddress = _factory.createStore(msg.sender);
        }

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
        _addAccess(msg.sender, deals[id].cid);

        emit DealCreated(id, msg.sender);

        _airdropDao(msg.sender);

        return id;
    }

    /**
     * @notice Bid in a deal
     *
     * @param dealId ID of a deal
     * @dev if msg.value is greater than or equal to deal.priceForceStop,
     * then the deal is closed
     *
     * Requirements:
     *
     * - Deal status must be OPEN
     * - Cannot be called by seller
     * -  msg.value cannot be less then `priceStart`
     * - `dateExpire` cannot be less then now
     * - Current bid cannot be less then previous bid
     *
     */
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

        if (deal.price != 0) {
            IStore(storeAddress).withdrawBuyer(dealId, deal.buyer);
        }

        IStore(storeAddress).depositBuyer{value: msg.value}(dealId, msg.sender);

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

        _airdropDao(msg.sender);

        if (msg.value >= deal.priceForceStop) {
            _finalize(deal);
        }
    }

    /**
     * @notice Cancel a deal
     *
     * @param dealId ID of a deal
     * @dev Collateral amount will be refund
     *
     * Requirements:
     *
     * - Deal status must be OPEN
     * - Can only be called by seller
     * - There must be no bids in the deal
     *
     */
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
            _serviceFee,
            _storageFee
        );
    }

    /**
     * @notice Start a dispute
     *
     * @param dealId ID of a deal
     * @dev If there are not enough notaries, then the dispute is impossible
     *
     * Requirements:
     *
     * - Deal status must be FINALIZE
     * - Can only be called by buyer
     * - The current date cannot be grater then `dateExpire` + `_periodDispute`
     * - The buyer must pass the same collateral amount as the seller
     *
     */
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

        if (_notary.isDisputePossible(dealId)) {
            _notary.chooseNotaries(dealId);
            _chat.sendSystemMessage(dealId, "Dispute started.");
            deal.status = AuctionStatus.DISPUTE;

            emit DisputeCreated(dealId);
        } else {
            _chat.sendSystemMessage(dealId, "Dispute is not possible.");
            _sendWin(deal, IIntegration.DisputeWinner.Seller);
        }
    }

    /**
     * @notice Restart a dispute
     *
     * @param dealId ID of a deal
     * @dev If there are not enough notaries, then the dispute is impossible
     *
     * Requirements:
     *
     * - Deal status must be DISPUTE
     * - Can only be called by buyer
     * - The current date cannot be grater then `dateExpire` + `_periodDispute`
     *
     */
    function restartDispute(uint256 dealId) external payable {
        AuctionFileParams storage deal = _checkStatusAndGetDeal(
            dealId,
            AuctionStatus.DISPUTE
        );

        require(deal.buyer == msg.sender, "AuctionFile: Caller is not a buyer");
        require(
            block.timestamp > deal.dateExpire + _periodDispute,
            "AuctionFile: Time for dispute"
        );

        if (_notary.isDisputePossible(dealId)) {
            _chat.sendSystemMessage(dealId, "Dispute restarted.");

            _notary.restart(dealId);
            deal.dateExpire = block.timestamp;

            emit DisputeRestarted(dealId);
        } else {
            _notary.refundPenalty(dealId);
            _chat.sendSystemMessage(dealId, "Dispute is not possible.");
            _sendWin(deal, IIntegration.DisputeWinner.Seller);
        }
    }

    /**
     * @notice Finalize a deal
     *
     * @param dealId ID of a deal
     * @dev If there are no bids then the deal will be closed
     * and collateral will refund
     *
     * Requirements:
     *
     * - Deal status must be OPEN
     * - The current date cannot be less then `dateExpire`
     *
     */
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

    /**
     * @notice Finalize a dispute
     *
     * @param dealId ID of a deal
     * @param winner Seller or Buyer
     *
     * Requirements:
     *
     * - Deal status must be DISPUTE
     * - Can only be called by Notary contract
     *
     */
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

    /**
     * @notice Receive reward
     *
     * @param dealId ID of a deal
     * @dev This function transfers money to the seller and closes a deal
     *
     * Requirements:
     *
     * - Deal status must be FINALIZE
     * - The current date cannot be less then `dateExpire` + _periodDispute
     *
     */
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

    /**
     * @notice Sending win to winner
     *
     * @param deal deal structure
     * @dev This function transfers money to the winner and closes a deal
     */
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
                _serviceFee,
                _storageFee
            );
        } else {
            store.transferWinToBuyer(deal.id, deal.buyer);
        }

        _chat.sendSystemMessage(deal.id, "Deal closed.");

        deal.status = AuctionStatus.CLOSE;
        emit DealClosed(deal.id);
    }

    /// @dev Give an access to `wallet` by `dealId`.
    function addAccess(uint256 dealId, address wallet) external onlyNotary {
        _addAccess(wallet, deals[dealId].cid);
    }

    /**
     * @notice Sending message
     *
     * @param dealId ID of a deal
     * @param message Text of the message
     *
     * Requirements:
     *
     * - Deal status must be OPEN, DISPUT or FINALIZE,
     *
     */
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
