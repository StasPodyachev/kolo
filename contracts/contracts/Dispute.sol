// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.9;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/integrations/IIntegration.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/IStore.sol";
import "./interfaces/IChat.sol";
import "./interfaces/INotary.sol";
import "./interfaces/IDispute.sol";

abstract contract Dispute is IDispute, Ownable {
    uint256 public _periodDispute = 5 days;

    function setPeriodDispute(uint256 value) external onlyOwner {
        _periodDispute = value;
    }

    function _dispute(
        uint256 dealId,
        uint256 collateralAmount,
        uint256 dateExpire,
        address seller,
        IFactory factory,
        INotary notary,
        IChat chat
    ) external payable {
        // AuctionFileParams storage deal = _checkStatusAndGetDeal(
        //     dealId,
        //     AuctionStatus.FINALIZE
        // );

        // require(deal.buyer == msg.sender, "AuctionFile: Caller is not a buyer");
        require(
            block.timestamp < dateExpire + _periodDispute,
            "AuctionFile: Time for dispute is up"
        );

        require(msg.value == collateralAmount, "AuctionFile: Wrong collateral");

        address storeAddress = factory.getStore(seller);
        IStore(storeAddress).depositBuyerCollateral{value: msg.value}(dealId);

        //deal.status = AuctionStatus.DISPUTE;

        notary.chooseNotaries(dealId);
        chat.sendSystemMessage(dealId, "Dispute started.");

        emit DisputeCreated(dealId);
    }

    function _finalizeDispute(
        uint256 dealId,
        address seller,
        address buyer,
        IIntegration.DisputeWinner winner,
        IFactory factory,
        IChat chat,
        uint256 serviceFee
    ) internal {
        address storeAddress = factory.getStore(seller);
        IStore store = IStore(storeAddress);

        if (winner == IIntegration.DisputeWinner.Seller) {
            //store.transferWinToSeller(dealId, buyer, seller, serviceFee);
        } else {
            store.transferWinToBuyer(dealId, buyer);
        }

        emit DisputeClosed(dealId);

        chat.sendSystemMessage(
            dealId,
            string(
                abi.encodePacked(
                    "Dispute closed",
                    winner == IIntegration.DisputeWinner.Buyer ? buyer : seller,
                    "wins."
                )
            )
        );
    }
}
