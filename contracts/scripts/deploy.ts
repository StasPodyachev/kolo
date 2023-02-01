import deployment from "../deployment/deployments.json"
import { IDeployment } from "./utils"
const deployments: IDeployment = deployment
import "hardhat-deploy"
import "hardhat-deploy-ethers"

import { deployNames } from "./constants"
import { writeDeployData } from "./utils"

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

const contracts: ContractDeploy[] = [
  {
    contractName: deployNames.FACTORY,
  },
  {
    contractName: deployNames.TREASURY,
  },
  {
    contractName: deployNames.AUCTION_FILE,
  },
  {
    contractName: deployNames.SIMPLE_TRADE_FILE,
  },
  {
    contractName: deployNames.NOTARY,
  },
  {
    contractName: deployNames.CHAT,
  },
  {
    contractName: deployNames.MOCK_EXCHANGE,
  },

  // dao
  {
    contractName: deployNames.KOLO_TOKEN,
  },
  {
    contractName: deployNames.TIME_LOCK,
    args: [1000, [], [], "0xF552f5223D3f7cEB580fA92Fe0AFc6ED8c09179b"],
  },
  {
    contractName: deployNames.GOVERNOR,
    args: getArgs,
  },

  // ########
]

export async function main() {
  for (let i in contracts) {
    const contract = contracts[i]

    if (contract.networks && !contract.networks[CHAIN_ID]) continue

    console.log(`Deploying started - ${contract.contractName}`)

    await deployContract(
      contract.contractName,
      contract.nameFile,
      typeof contract?.args === "function" ? contract.args() : contract.args
    )

    console.log(`Deployed success - ${contract.contractName}`)
    console.log("-------------------------------------------\n")
  }
}

export async function deployContract(
  contractName: string,
  nameFile?: string,
  args?: any
) {
  const contractFactory = await ethers.getContractFactory(
    nameFile ?? contractName,
    WALLET
  )

  console.log(`Contract for deployment Started`)

  let contract

  if (args) {
    contract = await contractFactory.deploy(...args)
  } else {
    contract = await contractFactory.deploy()
  }

  await contract.deployed()
  await writeDeployData(CHAIN_ID, contractName, contract.address)

  console.log("Contract Deployment Ended")
  console.log("***************************************")
}

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error)
//     process.exit(1)
//   })
