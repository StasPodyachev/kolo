// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/INotary.sol";
import "./interfaces/IStore.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/integrations/IIntegration.sol";

import "./interfaces/dao/IKoloToken.sol";

import "hardhat/console.sol";

contract Notary is INotary, Ownable {
    IFactory public immutable _factory;

    mapping(address => uint256) private deposits;
    mapping(uint256 => uint256) private penaltyByDeal;
    mapping(uint256 => mapping(address => bool)) private notaries;
    mapping(uint256 => address[]) private dealNotaries;
    mapping(address => uint256[]) private notaryDeals;
    mapping(uint256 => mapping(address => bool)) private votes;

    mapping(uint256 => address[]) private votesForBuyer;
    mapping(uint256 => address[]) private votesForSeller;

    mapping(address => INotary.VoteParams[]) private _notaryDeal;

    address[] activeNotaries;
    mapping(address => uint256) private activeNotariesMap;

    uint256 public _minDeposit = 1e18;
    uint256 public _consensusCount = 2;
    uint256 public _countInvaitedNotary = 4;

    uint256 public _penalty = 1e18;

    constructor(IFactory factory) {
        _factory = factory;
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

    function _airdropDao(address wallet) internal {
        IKoloToken(_factory.daoToken()).airdrop(wallet);
    }

    function deposit() external payable {
        require(
            deposits[msg.sender] + msg.value >= _minDeposit,
            "Notary: deposit is not enough"
        );

        deposits[msg.sender] += msg.value;
        console.log("deposit", deposits[msg.sender], msg.sender);
        _addNotary(msg.sender);
    }

    function withdraw(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Notary: Not enough balance");

        payable(msg.sender).transfer(amount);
        deposits[msg.sender] -= amount;

        _removeNotary(msg.sender);
    }

    function _removeNotary(address addr) internal {
        if (deposits[addr] < _minDeposit) {
            uint256 index = activeNotariesMap[addr] - 1;
            address last = activeNotaries[activeNotaries.length - 1];

            activeNotariesMap[last] = index + 1;
            activeNotaries[index] = last;
            activeNotaries.pop();

            activeNotariesMap[addr] = 0;
        }
    }

    function _addNotary(address addr) internal {
        if (deposits[addr] >= _minDeposit && activeNotariesMap[addr] == 0) {
            activeNotaries.push(addr);
            activeNotariesMap[addr] = activeNotaries.length;
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

        votes[dealId][msg.sender] = true;

        // deposits[msg.sender] -= penaltyByDeal[dealId];
        // _removeNotary(msg.sender);

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

                    _addNotary(votesForBuyer[dealId][i]);
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

                    _addNotary(votesForSeller[dealId][i]);
                }

                serviceFee =
                    penaltyByDeal[dealId] *
                    votesForBuyer[dealId].length +
                    (collateral - reward * votesForSeller[dealId].length);

                winner = IIntegration.DisputeWinner.Seller;
            }

            address[] memory arr = getNotaries(dealId);

            for (uint256 i = 0; i < arr.length; i++) {
                if (votes[dealId][arr[i]]) continue;
                deposits[arr[i]] += penaltyByDeal[dealId];
            }

            payable(_factory.treasury()).transfer(serviceFee);

            address integration = store.getIntegration(dealId);
            IIntegration(integration).finalizeDispute(dealId, winner);
        }

        _airdropDao(msg.sender);
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

    function getNotaries(uint256 dealId)
        public
        view
        returns (address[] memory)
    {
        return dealNotaries[dealId];
    }

    function isDisputePossible() public view returns (bool) {
        return activeNotaries.length >= _countInvaitedNotary;
    }

    function getDeals(address notary) external view returns (uint256[] memory) {
        return notaryDeals[notary];
    }

    function restart(uint256 dealId) external {
        require(
            _factory.integrationExist(msg.sender),
            "Notary: Only integration"
        );

        address[] memory arr = getNotaries(dealId);
        delete dealNotaries[dealId];

        for (uint256 i = 0; i < arr.length; i++) {
            if (votes[dealId][arr[i]]) {
                dealNotaries[dealId].push(arr[i]);
                continue;
            }

            notaries[dealId][arr[i]] = false;
        }

        _generateRandomNotaries(dealId);
    }

    function refundPenalty(uint256 dealId) external {
        require(
            _factory.integrationExist(msg.sender),
            "Notary: Only integration"
        );

        address[] memory arr = getNotaries(dealId);

        for (uint256 i = 0; i < arr.length; i++) {
            if (votes[dealId][arr[i]]) {
                deposits[arr[i]] += penaltyByDeal[dealId];
            }
        }

        _generateRandomNotaries(dealId);
    }

    function _generateRandomNotaries(uint256 dealId) internal {
        uint256 min = _countInvaitedNotary < activeNotaries.length
            ? _countInvaitedNotary
            : activeNotaries.length;

        address storeAddress = _factory.getStore(dealId);
        IStore store = IStore(storeAddress);
        IIntegration integration = IIntegration(store.getIntegration(dealId));

        uint256 i;
        uint256 count;

        while (
            count < min || activeNotaries.length == dealNotaries[dealId].length
        ) {
            uint256 rnd = _random(activeNotaries.length, i++);

            if (notaries[dealId][activeNotaries[rnd]]) continue;

            deposits[activeNotaries[rnd]] -= penaltyByDeal[dealId];
            notaries[dealId][activeNotaries[rnd]] = true;

            dealNotaries[dealId].push(activeNotaries[rnd]);
            notaryDeals[activeNotaries[rnd]].push(dealId);

            IIntegration(integration).addAccess(dealId, activeNotaries[rnd]);
            _removeNotary(activeNotaries[rnd]);

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
