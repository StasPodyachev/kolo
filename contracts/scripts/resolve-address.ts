const hre = require("hardhat")
import { deployNames } from "./constants"
import { IDeployment } from "./utils"
import deployment from "../deployment/deployments.json"
import { AddressResolver } from "../typechain/AddressResolver"
import { utils } from "ethers"
const deployments: IDeployment = deployment

const IMPORT_ADDRESSES: string[][] = [[], []]
const MIXIN_CONTRACT_ADDRESSES: string[] = []

async function main() {
  const chainId = await hre.getChainId()

  const contracts = deployments[chainId]

  IMPORT_ADDRESSES.push(
    [
      utils.formatBytes32String(deployNames.DEFOREX),
      contracts[deployNames.DEFOREX].address,
    ],
    [
      utils.formatBytes32String(deployNames.UNISWAP_EXCHANGE),
      contracts[deployNames.UNISWAP_EXCHANGE].address,
    ],
    [
      utils.formatBytes32String(deployNames.EXTRA_PROTOCOL),
      contracts[deployNames.EXTRA_PROTOCOL].address,
    ],
    [
      utils.formatBytes32String(deployNames.AAVE_PROTOCOL),
      contracts[deployNames.AAVE_PROTOCOL].address,
    ],
    [
      utils.formatBytes32String(deployNames.INSURANCE_FUND),
      contracts[deployNames.INSURANCE_FUND].address,
    ],
    [
      utils.formatBytes32String(deployNames.LIQUIDATION_KEEPER),
      contracts[deployNames.LIQUIDATION_KEEPER].address,
    ]
  )

  MIXIN_CONTRACT_ADDRESSES.push(
    contracts[deployNames.UNISWAP_EXCHANGE].address,
    contracts[deployNames.EXTRA_PROTOCOL].address,
    contracts[deployNames.AAVE_PROTOCOL].address,
    contracts[deployNames.INSURANCE_FUND].address,
    contracts[deployNames.LIQUIDATION_KEEPER].address,
    contracts[deployNames["ALP-dfDAI"]].address,
    contracts[deployNames["ALP-dfUSDT"]].address,
    contracts[deployNames["ALP-dfUSDC"]].address,
    contracts[deployNames["ALP-dfADAI"]].address,
    contracts[deployNames["ALP-dfAUSDC"]].address
  )

  const resolver = (await hre.ethers.getContractAt(
    deployNames.ADDRESS_RESOLVER,
    deployments[chainId][deployNames.ADDRESS_RESOLVER].address
  )) as AddressResolver

  const tx = await resolver.importAddresses(
    IMPORT_ADDRESSES[0],
    IMPORT_ADDRESSES[1]
  )

  await tx.wait()

  console.log("AddressResolver success import addresses")
  await resolver.rebuildCaches(MIXIN_CONTRACT_ADDRESSES)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
