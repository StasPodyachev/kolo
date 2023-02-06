// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/INotary.sol";
import "./interfaces/IStore.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/integrations/IIntegration.sol";

import "./interfaces/dao/IKoloToken.sol";

import "hardhat/console.sol";

/**
 * @title Notary
 *
 * This contract stores all notaries on the service. Also it
 * keeps all the money of notaries. It also allows to become
 * a notary, to withdraw all money and to vote. When a dispute
 * starts, the integration contract should call isDisputePossible()
 * function and if it is possible chooseNotaries() must be called
 *
 **/
contract Notary is INotary, Ownable {
    IFactory public immutable _factory;

    mapping(address => uint256) private deposits;
    mapping(uint256 => uint256) private penaltyByDeal;
    mapping(uint256 => mapping(address => bool)) private notaries;
    mapping(uint256 => address[]) private dealNotaries;
    mapping(address => uint256[]) private notaryDeals;
    mapping(uint256 => address[]) private votesForBuyer;
    mapping(uint256 => address[]) private votesForSeller;
    mapping(address => uint256) private activeNotariesMap;

    mapping(address => mapping(uint256 => uint256)) private _notaryVotesMap;
    mapping(address => INotary.VoteParams[]) private _notaryVotes;

    address[] depositArr;
    mapping(address => uint256) private depositIndexes;

    address[] activeNotaries;

    uint256 public _minDeposit = 1e18;
    uint256 public _consensusCount = 2;
    uint256 public _countInvaitedNotary = 4;

    uint256 public _penalty = 1e16;

    constructor(IFactory factory) {
        _factory = factory;
    }

    function setPenalty(uint256 value) external onlyOwner {
        require(value <= _minDeposit, "Notary: Wrong amount");
        _penalty = value;
    }

    function setMinDeposit(uint256 value) external onlyOwner {
        require(_penalty <= value, "Notary: Wrong amount");
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

    function getNotaryBalance(address wallet) external view returns (uint256) {
        return deposits[wallet];
    }

    /**
     * @notice Become a notary
     * @dev To become a notary, you must make a deposit of at least
     *
     * Requirements:
     *
     * - Notary balance cannot be less then `_minDeposit`
     *
     */
    function deposit() external payable {
        require(
            deposits[msg.sender] + msg.value >= _minDeposit,
            "Notary: deposit is not enough"
        );

        if (deposits[msg.sender] == 0) {
            _addNotary(msg.sender);
        }

        deposits[msg.sender] += msg.value;
        _addActiveNotary(msg.sender);
    }

    /**
     * @notice Withdraw
     *
     * Requirements:
     *
     * - `amount`must be less then notary`s balance
     *
     */
    function withdraw(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Notary: Not enough balance");

        payable(msg.sender).transfer(amount);
        deposits[msg.sender] -= amount;

        if (deposits[msg.sender] == 0) {
            _removeNotary(msg.sender);
        }

        _removeActiveNotary(msg.sender);
    }

    function _addNotary(address addr) internal {
        depositArr.push(addr);
        depositIndexes[addr] = depositArr.length;
    }

    function _removeNotary(address addr) internal {
        uint256 index = depositIndexes[addr] - 1;
        address last = depositArr[depositArr.length - 1];

        depositIndexes[last] = index + 1;
        depositArr[index] = last;
        depositArr.pop();

        depositIndexes[addr] = 0;
    }

    /// @notice Removing notary from active notaries storage
    /// if his balance is less then `_minDeposit`
    function _removeActiveNotary(address addr) internal {
        if (deposits[addr] < _minDeposit) {
            uint256 index = activeNotariesMap[addr] - 1;
            address last = activeNotaries[activeNotaries.length - 1];

            activeNotariesMap[last] = index + 1;
            activeNotaries[index] = last;
            activeNotaries.pop();

            activeNotariesMap[addr] = 0;
        }
    }

    /// @notice Adding notary to active notaries storage
    /// if his balance is not less then `_minDeposit`
    function _addActiveNotary(address addr) internal {
        if (deposits[addr] >= _minDeposit && activeNotariesMap[addr] == 0) {
            activeNotaries.push(addr);
            activeNotariesMap[addr] = activeNotaries.length;
        }
    }

    /**
     * @notice Voting
     *
     * @param dealId ID of a deal
     * @param mark True is vote for buyer, False - for seller
     * @dev
     *
     * Requirements:
     *
     * - Notary must have access to vote
     *
     */
    function vote(uint256 dealId, bool mark) external {
        require(notaries[dealId][msg.sender], "Notary: No accsess");

        require(
            votesForBuyer[dealId].length < _consensusCount ||
                votesForSeller[dealId].length < _consensusCount,
            "Notary: Enough votes"
        );

        notaries[dealId][msg.sender] = false;

        if (mark) {
            votesForBuyer[dealId].push(msg.sender);
        } else {
            votesForSeller[dealId].push(msg.sender);
        }

        _notaryVotesMap[msg.sender][dealId] = _notaryVotes[msg.sender].length;
        _notaryVotes[msg.sender].push(
            VoteParams({dealId: dealId, status: 0, mark: mark})
        );

        bool buyerIsWin = votesForBuyer[dealId].length == _consensusCount;
        bool sellerIsWin = votesForSeller[dealId].length == _consensusCount;

        if (buyerIsWin || sellerIsWin) {
            uint256 serviceFee;
            address notary;
            address storeAddress = _factory.getStore(dealId);
            IStore store = IStore(storeAddress);
            IIntegration.DisputeWinner winner;

            if (buyerIsWin) {
                uint256 collateral = store.getSellerCollateral(dealId);
                uint256 reward = collateral / votesForBuyer[dealId].length;

                for (uint256 i = 0; i < votesForBuyer[dealId].length; i++) {
                    notary = votesForBuyer[dealId][i];
                    deposits[notary] += penaltyByDeal[dealId] + reward;

                    _addActiveNotary(notary);
                }

                serviceFee =
                    penaltyByDeal[dealId] *
                    votesForSeller[dealId].length +
                    (collateral - reward * votesForBuyer[dealId].length);

                winner = IIntegration.DisputeWinner.Buyer;
            } else if (sellerIsWin) {
                uint256 collateral = store.getBuyerCollateral(dealId);
                uint256 reward = collateral / votesForSeller[dealId].length;

                for (uint256 i = 0; i < votesForSeller[dealId].length; i++) {
                    notary = votesForSeller[dealId][i];
                    deposits[notary] += penaltyByDeal[dealId] + reward;

                    _addActiveNotary(notary);
                }

                serviceFee =
                    penaltyByDeal[dealId] *
                    votesForBuyer[dealId].length +
                    (collateral - reward * votesForSeller[dealId].length);

                winner = IIntegration.DisputeWinner.Seller;
            }

            address[] memory notariesForDeal = getNotaries(dealId);
            VoteParams storage notaryVote;

            for (uint256 i = 0; i < notariesForDeal.length; i++) {
                notary = notariesForDeal[i];
                if (notaries[dealId][notary]) {
                    deposits[notary] += penaltyByDeal[dealId];
                } else {
                    notaryVote = _notaryVotes[notary][
                        _notaryVotesMap[notary][dealId]
                    ];

                    notaryVote.status = notaryVote.mark && buyerIsWin ? 1 : 2;
                }
            }

            payable(_factory.treasury()).transfer(serviceFee);

            address integration = store.getIntegration(dealId);
            IIntegration(integration).finalizeDispute(dealId, winner);
        }

        _airdropDao(msg.sender);
    }

    /// @notice Get array of notaries by `dealId`
    function getNotaries(uint256 dealId)
        public
        view
        returns (address[] memory)
    {
        return dealNotaries[dealId];
    }

    function getAllNotaries()
        external
        view
        returns (NotaryParams[] memory notaries_)
    {
        uint256 size = depositArr.length;
        notaries_ = new NotaryParams[](size);
        uint256 balance;
        address wallet;
        for (uint256 i = 0; i < size; i++) {
            wallet = depositArr[i];
            balance = deposits[wallet];

            notaries_[i] = NotaryParams({
                wallet: wallet,
                balance: balance,
                isActive: balance >= _minDeposit
            });
        }
    }

    function getVoteInfo(address notary)
        external
        view
        returns (INotary.VoteParams[] memory)
    {
        return _notaryVotes[notary];
    }

    function getVoteInfoForDeal(uint256 dealId, address notary)
        external
        view
        returns (INotary.VoteParams memory)
    {
        return _notaryVotes[notary][_notaryVotesMap[notary][dealId]];
    }

    /**
     * @notice Сhoose Notaries
     *
     * @param dealId ID of a deal
     * @dev This function generates random notaries
     *
     * Requirements:
     *
     * - Integration contract only can call this function
     *
     */
    function chooseNotaries(uint256 dealId) external {
        require(
            _factory.integrationExist(msg.sender),
            "Notary: Only integration"
        );

        penaltyByDeal[dealId] = _penalty;

        _generateRandomNotaries(dealId, _countInvaitedNotary);
    }

    /**
     * @notice Checking is dispute possible
     *
     * @param dealId ID of a deal
     * @return bool True - possible, False - not possible
     * @dev Number of voted notaries and free active notaries
     * cannot be less then `_countInvaitedNotary`
     */
    function isDisputePossible(uint256 dealId) public view returns (bool) {
        uint256 repeat = 0;

        for (uint256 i = 0; i < votesForSeller[dealId].length; i++) {
            if (activeNotariesMap[votesForSeller[dealId][i]] > 0) repeat++;
        }

        for (uint256 i = 0; i < votesForBuyer[dealId].length; i++) {
            if (activeNotariesMap[votesForBuyer[dealId][i]] > 0) repeat++;
        }

        console.log(repeat, activeNotaries.length, _countInvaitedNotary);

        return
            (votesForBuyer[dealId].length +
                votesForSeller[dealId].length +
                activeNotaries.length -
                repeat) >= _countInvaitedNotary;
    }

    /// @notice Get array of deals by `notary` address
    function getDeals(address notary) external view returns (uint256[] memory) {
        return notaryDeals[notary];
    }

    /**
     * @notice Restart generating notaries
     *
     * @param dealId ID of a deal
     * @dev This function removes old notaries who didn't vote
     * and generates new random notaries
     *
     * Requirements:
     *
     * - Integration contract only can call this function
     *
     */
    function restart(uint256 dealId) external {
        require(
            _factory.integrationExist(msg.sender),
            "Notary: Only integration"
        );

        address[] storage arr = dealNotaries[dealId];

        for (uint256 i = 0; i < arr.length; i++) {
            if (notaries[dealId][arr[i]]) {
                notaries[dealId][arr[i]] = false;
                arr[i] = arr[arr.length - 1];
                arr.pop();
            }
        }

        _generateRandomNotaries(dealId, _countInvaitedNotary - arr.length);
    }

    /**
     * @notice Refunding penalty
     *
     * @param dealId ID of a deal
     * @dev When dispute is imposible this function refunds
     * a penalty to notaries who voted
     *
     * Requirements:
     *
     * - Integration contract only can call this function
     *
     */
    function refundPenalty(uint256 dealId) external {
        require(
            _factory.integrationExist(msg.sender),
            "Notary: Only integration"
        );

        address[] memory arr = getNotaries(dealId);

        for (uint256 i = 0; i < arr.length; i++) {
            if (!notaries[dealId][arr[i]]) {
                deposits[arr[i]] += penaltyByDeal[dealId];
            }
        }
    }

    /**
     * @notice Generating random notaries
     *
     * @param dealId ID of a deal
     * @param countIvitedNotary Number of notaries to be generated
     * @dev This function generates array of random notaries with
     * `countIvitedNotary` length, gives permission and takes the
     * amount of the penalty. This amount will be refund if notary
     * votes correctly or if despute will be impossible.
     *
     */
    function _generateRandomNotaries(uint256 dealId, uint256 countIvitedNotary)
        internal
    {
        address storeAddress = _factory.getStore(dealId);
        IStore store = IStore(storeAddress);
        IIntegration integration = IIntegration(store.getIntegration(dealId));

        uint256 i;
        uint256 count;

        while (count < countIvitedNotary) {
            uint256 rnd = _random(activeNotaries.length, i++);

            if (notaries[dealId][activeNotaries[rnd]]) continue;

            deposits[activeNotaries[rnd]] -= penaltyByDeal[dealId];
            notaries[dealId][activeNotaries[rnd]] = true;

            dealNotaries[dealId].push(activeNotaries[rnd]);
            notaryDeals[activeNotaries[rnd]].push(dealId);

            IIntegration(integration).addAccess(dealId, activeNotaries[rnd]);
            _removeActiveNotary(activeNotaries[rnd]);

            count++;
        }
    }

    /// @notice Get random number using keccak256
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
