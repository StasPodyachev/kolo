import { deployNames } from "./constants";
import deployment from "../deployment/deployments.json";
import {
  AuctionFile,
  Factory, Notary,
} from "../typechain";
import { IDeployment } from "./utils";
const deployments: IDeployment = deployment;

let CHAIN_ID: string;

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
    contractName: deployNames.NOTARY,
    f: notary,
  },
];

const wallet = new ethers.Wallet(network.config.accounts[0], ethers.provider)

export async function main() {
  CHAIN_ID = await hre.getChainId();
  for (let i in contracts) {
    const contract = contracts[i];

    if (contract.networks && !contract.networks[CHAIN_ID]) continue;

    console.log(`Configuring started - ${contract.contractName}`);

    await contract.f();

    console.log(`Configured success - ${contract.contractName}`);
    console.log("-------------------------------------------");
  }
}

async function factory() {
  const factoryDeployed = deployments[CHAIN_ID].Factory;
  const auctionDeployed = deployments[CHAIN_ID][deployNames.AUCTION_FILE];

  const factoryContract = await ethers.getContractFactory(deployNames.FACTORY, wallet)

  const factory = (await ethers.getContractAt(
    "Factory",
    factoryDeployed.address
  )) as Factory;

  await factory.registerIntegration(0, auctionDeployed.address);
}

async function auctionFile() {
  const factoryDeployed = deployments[CHAIN_ID].Factory;
  const auctionFileDeployed = deployments[CHAIN_ID][deployNames.AUCTION_FILE];
  const notaryDeployed = deployments[CHAIN_ID][deployNames.NOTARY];



  const auction = (await ethers.getContractAt(
    deployNames.AUCTION_FILE,
    auctionFileDeployed.address
  )) as AuctionFile;

  await auction.setFactory(factoryDeployed.address)
  await auction.setNotary(notaryDeployed.address)
}

async function notary() {
  const factoryDeployed = deployments[CHAIN_ID].Factory;
  const notaryDeployed = deployments[CHAIN_ID][deployNames.NOTARY];

  const notary = (await ethers.getContractAt(
    deployNames.NOTARY,
    notaryDeployed.address
  )) as Notary;

  await notary.setFactory(factoryDeployed.address)
}

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error)
//     process.exit(1)
//   })
