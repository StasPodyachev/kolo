import { deployNames } from "./constants"
import deployment from "../deployment/deployments.json"
import {
  AuctionFile,
  Chat,
  Factory,
  KoloToken,
  Notary,
  SimpleTradeFile,
  Treasury,
} from "../typechain"
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
  {
    contractName: deployNames.NOTARY,
    f: chat,
  },
  {
    contractName: deployNames.TREASURY,
    f: treasury,
  },
  {
    contractName: deployNames.KOLO_TOKEN,
    f: koloToken,
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
  const chatDeployed = deployments[CHAIN_ID][deployNames.CHAT]
  const treasuryDeployed = deployments[CHAIN_ID][deployNames.TREASURY]

  const factory = (await getKnowContractAt(deployNames.FACTORY)) as Factory

  await factory.setChat(chatDeployed.address)
  await factory.setTreasury(treasuryDeployed.address)
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
  // await auction.setChat(chatDeployed.address)
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
  // await auction.setChat(chatDeployed.address)
}

async function notary() {
  const factoryDeployed = deployments[CHAIN_ID].Factory

  const notary = (await getKnowContractAt(deployNames.NOTARY)) as Notary

  await notary.setFactory(factoryDeployed.address)
}

async function treasury() {
  const koloDeployed = deployments[CHAIN_ID][deployNames.KOLO_TOKEN]
  const exchangeDeployed = deployments[CHAIN_ID][deployNames.MOCK_EXCHANGE]
  const treasury = (await getKnowContractAt(deployNames.TREASURY)) as Treasury

  await treasury.setKoloToken(koloDeployed.address)
  await treasury.setExchange(exchangeDeployed.address)
}

async function koloToken() {
  const treasuryDeployed = deployments[CHAIN_ID][deployNames.TREASURY]
  const kolo = (await getKnowContractAt(deployNames.KOLO_TOKEN)) as KoloToken

  const BURNABLE_ROLE = await kolo.BURNABLE_ROLE()
  await kolo.grantRole(BURNABLE_ROLE, treasuryDeployed.address)
}

async function chat() {
  const factoryDeployed = deployments[CHAIN_ID].Factory

  const chat = (await getKnowContractAt(deployNames.CHAT)) as Chat

  await chat.setFactory(factoryDeployed.address)
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
