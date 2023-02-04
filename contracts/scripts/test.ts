import deployment from "../deployment/deployments.json"
import { IDeployment } from "./utils"
const deployments: IDeployment = deployment
import "hardhat-deploy"
import "hardhat-deploy-ethers"

import { deployNames } from "./constants"
import { writeDeployData } from "./utils"
import { Chat, Factory } from "../typechain"
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

  const res = await factory.getDeal(9)

  const item = utils.defaultAbiCoder.decode(
    [
      "tuple(uint256, string, string, uint256, uint256, uint256, uint256, address, address, uint256, uint256,bytes, uint256)",
    ],
    res.data
  )[0]

  console.log(item[9].toString(), item[10].toString())

  const chat = (await getKnowContractAt(deployNames.CHAT)) as Chat

  const msgs = await chat.getChat(1)

  console.log(msgs[1])

  // 1675443780000
  // 1675443780000
  // 1675434510

  // for (let i = 0; i < msgs.length; i++) {
  //   // console.log(msgs[i].timestamp.toString())
  //   console.log(msgs[i][2])
  //   // console.log(msgs[i])
  // }
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
