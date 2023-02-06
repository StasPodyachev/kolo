import deployment from "../deployment/deployments.json"
import { IDeployment } from "./utils"
const deployments: IDeployment = deployment
import "hardhat-deploy"
import "hardhat-deploy-ethers"

import { deployNames } from "./constants"
import { AuctionFile, Chat, Factory } from "../typechain"
import { utils } from "ethers"

const CHAIN_ID: string = network.config.chainId
const WALLET = new ethers.Wallet(network.config.accounts[0], ethers.provider)

interface ContractDeploy {
  contractName: string
  nameFile?: string
  args?: any
  networks?: any
}

const getArgs = () => [
  deployments[CHAIN_ID][deployNames.KOLO_TOKEN].address,
  deployments[CHAIN_ID][deployNames.TIME_LOCK].address,
  51,
  45818,
  1,
]

export async function main() {
  const factory = (await getKnowContractAt(deployNames.FACTORY)) as Factory

  const calldata = factory.interface.encodeFunctionData("registerIntegration", [
    0,
    "0x95D8a76c158c8B5A3A4935F186f37D083f2516e9",
  ])

  console.log(calldata)

  const res = await factory.getDeal(35)

  const item = utils.defaultAbiCoder.decode(
    [
      "tuple(uint256, string, string, uint256, uint256, uint256, uint256, address, address, uint256, uint256, bytes, uint256)",
    ],
    res.data
  )[0]

  // console.log(item)
  console.log(item[3].toString())
  console.log(item[4].toString())
  console.log(item[5].toString())
  console.log(item[6].toString())
  console.log(item[7].toString())
  console.log(item[8].toString())
  console.log(item[9].toString())

  console.log(item[10].toString())

  // const cid: string = item[6].toString
  // console.log(utils.formatEther(cid))

  const auction = (await getKnowContractAt(
    deployNames.AUCTION_FILE
  )) as AuctionFile

  // const cidArr = [
  //   "0x" + cid.substring(2, 66),
  //   "0x" + cid.substring(66) + "000000000000000000000000000000000000",
  // ]

  //console.log(cidArr, cid)

  // const check = await auction["checkAccess(bytes32[],uint8,address)"](
  //   cidArr,
  //   46,
  //   "0xF552f5223D3f7cEB580fA92Fe0AFc6ED8c09179b"
  // )

  //await auction.finalize(30)

  //console.log(check)
}

async function getContractAt(name: string, address: string) {
  const contractFactory = await ethers.getContractFactory(name, WALLET)

  return contractFactory.attach(address)
}

async function getKnowContractAt(name: string) {
  const contractFactory = await ethers.getContractFactory(name, WALLET)
  const contractDeployed = deployments[CHAIN_ID][name]

  return contractFactory.attach(contractDeployed.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

// 0x516d65664270773777366768566250333839595338684a4e6d4a653355737142
// 0x516d65664270773777366768566250333839595338684a4e6d4a653355737142

// 0x516d65664270773777366768566250333839595338684a4e6d4a65335573714261696d3168527674484376645233

// 0x516d63763639435347766453376f556835315769384474487a7972584273484a
// 0x4739426175503362334343425769000000000000000000000000000000000000
