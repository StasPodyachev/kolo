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
import { Ownable, OwnableInterface } from "../typechain/Ownable"
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
  const koloTokenDeployed = deployments[CHAIN_ID][deployNames.KOLO_TOKEN]

  const factory = (await getKnowContractAt(deployNames.FACTORY)) as Factory

  await factory.setChat(chatDeployed.address)
  await factory.setTreasury(treasuryDeployed.address)
  await factory.setDaoToken(koloTokenDeployed.address)
  await factory.registerIntegration(0, auctionDeployed.address)
  await factory.registerIntegration(1, simpleTradeDeployed.address)

  await daoAccess(factory)
}

async function auctionFile() {
  const notaryDeployed = deployments[CHAIN_ID][deployNames.NOTARY]
  const chatDeployed = deployments[CHAIN_ID][deployNames.CHAT]
  const auction = (await getKnowContractAt(
    deployNames.AUCTION_FILE
  )) as AuctionFile

  await auction.setNotary(notaryDeployed.address)
  await auction.setChat(chatDeployed.address)

  await daoAccess(auction)
}

async function simpleTrade() {
  const notaryDeployed = deployments[CHAIN_ID][deployNames.NOTARY]
  const chatDeployed = deployments[CHAIN_ID][deployNames.CHAT]

  const simple = (await getKnowContractAt(
    deployNames.SIMPLE_TRADE_FILE
  )) as SimpleTradeFile

  await simple.setNotary(notaryDeployed.address)
  await simple.setChat(chatDeployed.address)

  await daoAccess(simple)
}

async function notary() {
  const notary = (await getKnowContractAt(deployNames.NOTARY)) as Notary

  await daoAccess(notary)
}

async function treasury() {
  const exchangeDeployed = deployments[CHAIN_ID][deployNames.MOCK_EXCHANGE]
  const treasury = (await getKnowContractAt(deployNames.TREASURY)) as Treasury

  await treasury.setExchange(exchangeDeployed.address)

  await daoAccess(treasury)
}

async function koloToken() {
  const treasuryDeployed = deployments[CHAIN_ID][deployNames.TREASURY]
  const auctionDeployed = deployments[CHAIN_ID][deployNames.AUCTION_FILE]
  const simpleDeployed = deployments[CHAIN_ID][deployNames.SIMPLE_TRADE_FILE]
  const notaryDeployed = deployments[CHAIN_ID][deployNames.NOTARY]
  const kolo = (await getKnowContractAt(deployNames.KOLO_TOKEN)) as KoloToken

  const BURNABLE_ROLE = await kolo.BURNABLE_ROLE()
  const AIRDROP_ROLE = await kolo.AIRDROP_ROLE()

  // TODO: fixed in contract role access ??
  await kolo.grantRole(BURNABLE_ROLE, treasuryDeployed.address)

  await kolo.grantRole(AIRDROP_ROLE, auctionDeployed.address)
  await kolo.grantRole(AIRDROP_ROLE, simpleDeployed.address)
  await kolo.grantRole(AIRDROP_ROLE, notaryDeployed.address)

  await daoAccess(kolo)
}

async function chat() {
  const chat = (await getKnowContractAt(deployNames.CHAT)) as Chat
  await daoAccess(chat)
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

async function daoAccess(contract: Ownable) {
  const timeLockDeployed = deployments[CHAIN_ID][deployNames.TIME_LOCK]
  return contract.transferOwnership(timeLockDeployed.address)
}

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error)
//     process.exit(1)
//   })
