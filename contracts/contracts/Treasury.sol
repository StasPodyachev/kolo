// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/ITreasury.sol";
import "./dao/KoloToken.sol";
import "./MockExchange.sol";

contract Treasury is ITreasury, Ownable {
    MockExchange public _exchange;

    uint256 private _rewardBurnCoef = 5e17;
    uint256 private _rewardBurnPeriod = 90 days;

    uint256 private _dateTx;
    address private _token;

    receive() external payable {}

    function setKoloToken(address token) external onlyOwner {
        _token = token;
    }

    function setExchange(MockExchange exchange) external onlyOwner {
        _exchange = exchange;
    }

    function setRewardBurnCoef(uint256 value) external onlyOwner {
        _rewardBurnCoef = value;
    }

    function setRewardBurnPeriod(uint256 value) external onlyOwner {
        _rewardBurnPeriod = value;
    }

    function burnReward() external {
        require(
            block.timestamp >= _dateTx + _rewardBurnPeriod,
            "Treasury: Wrong timestamp"
        );

        uint256 filAmount = (address(this).balance * _rewardBurnCoef) / 1e18;
        uint256 tokenAmount = _exchange.exactInputSingle(filAmount, _token);

        KoloToken(_token).burn(address(this), tokenAmount);
        _dateTx = block.timestamp;
    }

    function giveGrandToTeam(address to, uint256 amount) external onlyOwner {
        payable(to).transfer(amount);
    }
}
