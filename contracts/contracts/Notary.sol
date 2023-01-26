// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/INotary.sol";
import "./interfaces/IStore.sol";
import "./interfaces/IFactory.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract Notary is Ownable {
    IFactory public _factory;

    mapping(address => uint256) private deposits;
    // mapping(address => uint256) private freezes;
    mapping(uint256 => uint256) private penaltyByDeal;
    mapping(uint256 => mapping(address => bool)) private notaries;
    mapping(uint256 => address[]) private votesPositive;
    mapping(uint256 => address[]) private votesNegative;

    address[] notariesArr;

    uint256 public _minDeposit = 1e18;
    uint256 public _consensusCount = 5;
    uint256 public _countInvaitedNotary = 10;

    uint256 serviceFee;

    uint256 public _penalty = 1e18;

    function setFactory(address factory) external onlyOwner {
        _factory = IFactory(factory);
    }

    function setPenalty(uint256 value) external onlyOwner {
        _penalty = value;
    }

    function setMinDeposit(uint256 value) external onlyOwner {
        _minDeposit = value;
    }

    function setConensusCount(uint256 value) external onlyOwner {
        // TODO: odd number
        _consensusCount = value;
    }

    function setCountInvitedNotary(uint256 value) external onlyOwner {
        _countInvaitedNotary = value;
    }

    function deposit() external payable {
        require(
            deposits[msg.sender] + msg.value >= _minDeposit,
            "Notary: deposit is not enough"
        );

        deposits[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Notary: Not enough balance");

        payable(msg.sender).transfer(amount);
        deposits[msg.sender] -= amount;
    }

    function withdrawFee(uint256 amount) external onlyOwner {
        require(serviceFee >= amount, "Notary: Not enough balance");

        payable(msg.sender).transfer(amount);
        serviceFee -= amount;
    }

    function vote(uint256 dealId, bool mark) external {
        require(notaries[dealId][msg.sender], "Notary: No accsess");

        require(
            votesPositive[dealId].length + votesNegative[dealId].length <
                _consensusCount,
            "Notary: Enough votes"
        );

        deposits[msg.sender] -= penaltyByDeal[dealId];

        if (mark) {
            votesPositive[dealId].push(msg.sender);
        } else {
            votesNegative[dealId].push(msg.sender);
        }

        if (
            votesPositive[dealId].length == _consensusCount ||
            votesNegative[dealId].length == _consensusCount
        ) {
            address seller = address(0);
            address storeAddress = _factory.getStore(seller);
            IStore store = IStore(storeAddress);

            if (votesPositive[dealId].length == _consensusCount) {
                // buyer win
                // collatoral seller to notary
                uint256 collateral = store.getSellerCollateral(dealId);
                uint256 reward = collateral / votesPositive[dealId].length;

                // deposit return to notries
                for (uint256 i = 0; i < votesPositive[dealId].length; i++) {
                    deposits[votesPositive[dealId][i]] +=
                        penaltyByDeal[dealId] +
                        reward;
                }

                serviceFee +=
                    penaltyByDeal[dealId] *
                    votesNegative[dealId].length +
                    (collateral - reward * votesPositive[dealId].length);

                store.transferBuyerCollateral(dealId, deal.buyer);
                store.transfer(dealId, deal.buyer, deal.buyer);
            } else if (votesNegative[dealId].length == _consensusCount) {
                // buyer loses
                // collatoral buyer to notary
                uint256 collateral = store.getBuyerCollateral(dealId);
                uint256 reward = collateral / votesNegative[dealId].length;

                // deposit return to notries
                for (uint256 i = 0; i < votesNegative[dealId].length; i++) {
                    deposits[votesNegative[dealId][i]] +=
                        penaltyByDeal[dealId] +
                        reward;
                }

                serviceFee +=
                    penaltyByDeal[dealId] *
                    votesPositive[dealId].length +
                    (collateral - reward * votesNegative[dealId].length);

                store.transferSellerCollateral(dealId, deal.seller);
                store.transfer(dealId, deal.seller, deal.buyer);
            }

            deal.status = AuctionStatus.CLOSE;
        }
    }

    // function getDisputResult(uint256 dealId)
    //     external
    //     view
    //     returns (uint8 result)
    // {
    //     if (
    //         votesPositive[dealId].length + votesNegative[dealId].length ==
    //         _consensusCount
    //     ) {
    //         return
    //             votesPositive[dealId].length > votesNegative[dealId].length
    //                 ? 1
    //                 : 2;
    //     }
    // }

    function penalty(address notary) external payable {}

    function chooseNotaries(uint256 dealId) external {
        // require

        penaltyByDeal[dealId] = _penalty; //calculatePenalty();

        address[] memory arr = _getRandomNotaries();

        for (uint256 i = 0; i < _countInvaitedNotary; i++) {
            notaries[dealId][arr[i]] = true;
        }
    }

    function _getRandomNotaries() internal returns (address[] memory) {
        //
        //  if (deposits[notaries[i]] < _penalty) continue;
    }
}
