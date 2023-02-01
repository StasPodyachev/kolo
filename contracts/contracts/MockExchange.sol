// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.9;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract MockExchange {
    uint256 num = 1;
    uint256 den = 1;

    function setRate(uint256 num_, uint256 den_) external {
        num = num_;
        den = den_;
    }

    function exactInputSingle(uint256 amount, address token)
        external
        payable
        returns (uint256 amountOut)
    {
        amountOut = (amount * num) / den; // params.amountIn * rate = < 1

        IERC20(token).transfer(msg.sender, amountOut);
    }
}
