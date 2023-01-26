// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/INotary.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Notary is Ownable {
    mapping(address => uint256) private notaries;

    uint256 public _minDeposit = 1e18;
    uint256 public _conensusCount = 1e18;
    uint256 public _countInvaitedNotary = 1e18;

    function setMinDeposit(uint256 value) external payable onlyOwner {
        _minDeposit = value;
    }

    function setConensusCount(uint256 value) external payable onlyOwner {
        _conensusCount = value;
    }

    function setCountInvitedNotary(uint256 value) external payable onlyOwner {
        _countInvaitedNotary = value;
    }

    function deposit() external payable {
        require(
            notaries[msg.sender] + msg.value >= _minDeposit,
            "Notary: deposit is not enough"
        );

        notaries[msg.sender] += msg.value;
    }

    function withdraw() external payable {}

    function vote(uint256 dealId, bool mark) external payable {}

    function penalty(address notary) external payable {}

    function chooseNotary(uint256 dealId) external payable {}
}
