// import "hardhat-typechain";
// import "hardhat-deploy-ethers";
import "@typechain/hardhat"

import "hardhat-deploy"
import "hardhat-deploy-ethers"

import "@nomicfoundation/hardhat-toolbox"
import "hardhat-contract-sizer"
// import "hardhat-deploy";
import "hardhat-abi-exporter"
import "hardhat-gas-reporter"
import "solidity-coverage"
import * as dotenv from "dotenv"

import "@nomiclabs/hardhat-etherscan"

dotenv.config()

const config = {
  networks: {
    hardhat: {
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
      allowUnlimitedContractSize: true,
      chainId: 2,
      mining: {
        auto: true,
        interval: 100,
      },
    },
    hyperspace: {
      chainId: 3141,
      url: "https://api.hyperspace.node.glif.io/rpc/v1",
      accounts: [process.env.DEPLOY_PRIVATE_KEY],
    },
    wallaby: {
      url: "https://wallaby.node.glif.io/rpc/v0",
      chainId: 31415,
      accounts: [process.env.DEPLOY_PRIVATE_KEY],
    },
  },
  abiExporter: {
    path: "./data/abi",
    runOnCompile: true,
    clear: false,
    flat: true,
    // only: [],
    // except: []
  },
  gasReporter: {
    coinmarketcap: "",
    currency: "ETH",
  },
  defaultNetwork: "hardhat",
  mocha: {
    timeout: 100000,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
}

export default config
