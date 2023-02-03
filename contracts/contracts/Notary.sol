// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/INotary.sol";
import "./interfaces/IStore.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/integrations/IIntegration.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract Notary is INotary, Ownable {
    IFactory public _factory;

    mapping(address => uint256) private deposits;
    mapping(uint256 => uint256) private penaltyByDeal;
    mapping(uint256 => mapping(address => bool)) private notaries;
    mapping(address => uint256) private currNotaries;

    mapping(uint256 => address[]) private votesForBuyer;
    mapping(uint256 => address[]) private votesForSeller;

    mapping(address => INotary.VoteParams[]) private _notaryDeal;

    address[] notariesArr;

    uint256 public _minDeposit = 1e18;
    uint256 public _consensusCount = 2;
    uint256 public _countInvaitedNotary = 4;

    uint256 public _penalty = 1e18;

    function setFactory(address factory) external onlyOwner {
        _factory = IFactory(factory);
    }

    function setPenalty(uint256 value) external onlyOwner {
        require(_penalty <= _minDeposit, "Notary: Wrong amount");
        _penalty = value;
    }

    function setMinDeposit(uint256 value) external onlyOwner {
        _minDeposit = value;
    }

    function setConsensusCount(uint256 value) external onlyOwner {
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

        if (currNotaries[msg.sender] == 0) {
            notariesArr.push(msg.sender);
            currNotaries[msg.sender] = notariesArr.length;
        }
    }

    function withdraw(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Notary: Not enough balance");

        payable(msg.sender).transfer(amount);
        deposits[msg.sender] -= amount;

        if (deposits[msg.sender] == 0) {
            delete notariesArr[currNotaries[msg.sender] - 1];
            currNotaries[msg.sender] = 0;
        }
    }

    /**
     * @param mark True is vote for buyer, False - for seller
     */
    function vote(uint256 dealId, bool mark) external {
        require(notaries[dealId][msg.sender], "Notary: No accsess");

        require(
            votesForBuyer[dealId].length < _consensusCount ||
                votesForSeller[dealId].length < _consensusCount,
            "Notary: Enough votes"
        );

        deposits[msg.sender] -= penaltyByDeal[dealId];

        if (mark) {
            votesForBuyer[dealId].push(msg.sender);
        } else {
            votesForSeller[dealId].push(msg.sender);
        }

        if (
            votesForBuyer[dealId].length == _consensusCount ||
            votesForSeller[dealId].length == _consensusCount
        ) {
            address storeAddress = _factory.getStore(dealId);
            IStore store = IStore(storeAddress);
            IIntegration.DisputeWinner winner;
            uint256 serviceFee;

            if (votesForBuyer[dealId].length == _consensusCount) {
                uint256 collateral = store.getSellerCollateral(dealId);
                uint256 reward = collateral / votesForBuyer[dealId].length;

                for (uint256 i = 0; i < votesForBuyer[dealId].length; i++) {
                    deposits[votesForBuyer[dealId][i]] +=
                        penaltyByDeal[dealId] +
                        reward;
                }

                serviceFee =
                    penaltyByDeal[dealId] *
                    votesForSeller[dealId].length +
                    (collateral - reward * votesForBuyer[dealId].length);

                winner = IIntegration.DisputeWinner.Buyer;
            } else if (votesForSeller[dealId].length == _consensusCount) {
                uint256 collateral = store.getBuyerCollateral(dealId);
                uint256 reward = collateral / votesForSeller[dealId].length;

                for (uint256 i = 0; i < votesForSeller[dealId].length; i++) {
                    deposits[votesForSeller[dealId][i]] +=
                        penaltyByDeal[dealId] +
                        reward;
                }

                serviceFee =
                    penaltyByDeal[dealId] *
                    votesForBuyer[dealId].length +
                    (collateral - reward * votesForSeller[dealId].length);

                winner = IIntegration.DisputeWinner.Seller;
            }

            payable(_factory.treasury()).transfer(serviceFee);

            address integration = store.getIntegration(dealId);
            IIntegration(integration).finalizeDispute(dealId, winner);
        }
    }

    function getDealIDbyNotary(address notary)
        external
        view
        returns (INotary.VoteParams[] memory)
    {
        return _notaryDeal[notary];
    }

    function chooseNotaries(uint256 dealId) external {
        require(
            _factory.integrationExist(msg.sender),
            "Notary: Only integration"
        );

        penaltyByDeal[dealId] = _penalty;

        _generateRandomNotaries(dealId);
    }

    function _generateRandomNotaries(uint256 dealId) internal {
        uint256 min = _countInvaitedNotary < notariesArr.length
            ? _countInvaitedNotary
            : notariesArr.length;
        uint256 max = notariesArr.length;

        address storeAddress = _factory.getStore(dealId);
        IStore store = IStore(storeAddress);
        IIntegration integration = IIntegration(store.getIntegration(dealId));

        uint256 i;
        uint256 count;

        while (count < min) {
            uint256 rnd = _random(max, i++);

            if (
                notaries[dealId][notariesArr[rnd]] ||
                deposits[notariesArr[rnd]] < _minDeposit
            ) continue;

            notaries[dealId][notariesArr[rnd]] = true;
            IIntegration(integration).addAccess(dealId, notariesArr[rnd]);
            count++;
        }
    }

    function _random(uint256 max, uint256 salt)
        internal
        view
        returns (uint256)
    {
        // sha3 and now have been deprecated
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, salt)
                )
            ) % max;
    }
}
