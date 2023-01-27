const hre: HardhatRuntimeEnvironment = require("hardhat")

import { abi as QOUTERV2_ABI } from "@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json"

import { BigNumber, ethers } from "ethers"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { QuoterV2 } from "../types/v3"
import { BIG_1E18 } from "./constants"

const amount = BigNumber.from(10000).mul(BIG_1E18)

async function main() {
  const network = await hre.getChainId()

  const qouterv2 = (await hre.ethers.getContractAt(
    QOUTERV2_ABI,
    "0x61fFE014bA17989E743c5F6cB21bF9697530B21e"
  )) as QuoterV2

  const { amountOut } = await qouterv2.callStatic.quoteExactInputSingle({
    tokenIn: "0x2D7eB0e8802d3a530E298a1f94ce176ad6B3Ab43",
    tokenOut: "0xF6fEd63aAF618d25050e5E3d3B4c525ab2154554",
    amountIn: "1002955390562723754273",
    fee: 500,
    sqrtPriceLimitX96: 0,
  })

  console.log({
    amountOut: amountOut.toString(),
  })
}

// 11000000000000000000000

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
