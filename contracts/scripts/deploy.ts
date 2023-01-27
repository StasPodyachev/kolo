// const hre = require("hardhat");

import "hardhat-deploy"
import "hardhat-deploy-ethers"

// const { ethers } = require("hardhat")

import { deployNames } from "./constants"
import deployment from "../deployment/deployments.json"

import { IDeployment, writeDeployData } from "./utils"
const deployments: IDeployment = deployment

let CHAIN_ID: any

interface ContractDeploy {
  contractName: string
  nameFile?: string
  args?: any
  networks?: any
}

const contracts: ContractDeploy[] = [
  {
    contractName: deployNames.FACTORY,
  },
  {
    contractName: deployNames.AUCTION_FILE,
  },
  {
    contractName: deployNames.NOTARY,
  },
]

const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

export async function main() {
  CHAIN_ID = network.config.chainId

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
    nameFile ?? contractName, wallet
  )

  console.log(`Contract for deployment Started`)

  let contract

  if (args) {
    contract = await contractFactory.deploy(...args)
  } else {
    contract = await contractFactory.deploy()
  }

  await writeDeployData(CHAIN_ID, contractName, contract.address, "")

  console.log("Contract Deployment Ended")
  console.log("***************************************")
}

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error)
//     process.exit(1)
//   })
