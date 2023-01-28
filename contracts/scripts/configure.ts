import { deployNames } from "./constants"
import deployment from "../deployment/deployments.json"
import { AuctionFile, Factory, Notary, SimpleTradeFile } from "../typechain"
import { IDeployment } from "./utils"
const deployments: IDeployment = deployment

const CHAIN_ID: string = network.config.chainId
const WALLET = new ethers.Wallet(network.config.accounts[0], ethers.provider)

const contracts: any = [
  {
    contractName: deployNames.FACTORY,
    f: factory,
  },
  {
    contractName: deployNames.AUCTION_FILE,
    f: auctionFile,
  },
  {
    contractName: deployNames.SIMPLE_TRADE_FILE,
    f: simpleTrade,
  },
  {
    contractName: deployNames.NOTARY,
    f: notary,
  },
]

export async function main() {
  for (let i in contracts) {
    const contract = contracts[i]

    if (contract.networks && !contract.networks[CHAIN_ID]) continue

    console.log(`Configuring started - ${contract.contractName}`)

    await contract.f()

    console.log(`Configured success - ${contract.contractName}`)
    console.log("-------------------------------------------")
  }
}

async function factory() {
  const auctionDeployed = deployments[CHAIN_ID][deployNames.AUCTION_FILE]
  const simpleTradeDeployed =
    deployments[CHAIN_ID][deployNames.SIMPLE_TRADE_FILE]

  const factory = (await getKnowContractAt(deployNames.FACTORY)) as Factory

  await factory.registerIntegration(0, auctionDeployed.address)
  await factory.registerIntegration(1, simpleTradeDeployed.address)
}

async function auctionFile() {
  const factoryDeployed = deployments[CHAIN_ID].Factory
  const notaryDeployed = deployments[CHAIN_ID][deployNames.NOTARY]
  const chatDeployed = deployments[CHAIN_ID][deployNames.CHAT]

  const auction = (await getKnowContractAt(
    deployNames.AUCTION_FILE
  )) as AuctionFile

  await auction.setFactory(factoryDeployed.address)
  await auction.setNotary(notaryDeployed.address)
  await auction.setChat(chatDeployed.address)
}

async function simpleTrade() {
  const factoryDeployed = deployments[CHAIN_ID].Factory
  const notaryDeployed = deployments[CHAIN_ID][deployNames.NOTARY]
  const chatDeployed = deployments[CHAIN_ID][deployNames.CHAT]

  const auction = (await getKnowContractAt(
    deployNames.SIMPLE_TRADE_FILE
  )) as SimpleTradeFile

  await auction.setFactory(factoryDeployed.address)
  await auction.setNotary(notaryDeployed.address)
  await auction.setChat(chatDeployed.address)
}

async function notary() {
  const factoryDeployed = deployments[CHAIN_ID].Factory

  const notary = (await getKnowContractAt(deployNames.NOTARY)) as Notary

  await notary.setFactory(factoryDeployed.address)
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

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error)
//     process.exit(1)
//   })
