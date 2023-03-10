/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { HardhatRuntimeEnvironment } from "hardhat/types"
import deployment from "../deployment/deployments.json"
// import { BridgeUpgradeable } from "../typechain";
import { BigNumber } from "ethers"
import fs from "fs"

const deployments: IDeployment = deployment

export interface IDeployment {
  [key: string | number]: {
    [key: string]: {
      proxy?: string
      implementation?: Array<string>
      address: string
      creationTime?: number
      updatedTime?: Array<number>
    }
  }
}
export interface IBridgeConfig {
  [key: string]: BridgeConfig
}
export interface BridgeConfig {
  chainID: string
  initialRelayers: Array<string>
  quorum: string
  expiry: string
}

export async function recordAllDeployments(
  network: string,
  contractName: string,
  implementationAddr: string
) {
  deployments[network][contractName] = {
    address: implementationAddr,
    creationTime: Date.now(),
  }

  return deployments
}

export async function writeFile(path: string, data: any) {
  fs.writeFileSync(path, JSON.stringify(data))
}

export async function writeDeployData(
  network: string,
  contractName: string,
  address: string
): Promise<IDeployment> {
  const writeData = await recordAllDeployments(network, contractName, address)

  fs.writeFileSync("./deployment/deployments.json", JSON.stringify(writeData))

  return writeData
}

// export async function verify(
//   proxyAddr: string,
//   hre: HardhatRuntimeEnvironment
// ) {
//   const implementationAddr =
//     await hre.upgrades.erc1967.getImplementationAddress(proxyAddr);
//   console.log("Contract Verification Started", implementationAddr);
//   try {
//     await hre.run("verify:verify", {
//       address: implementationAddr,
//     });
//   } catch (err) {
//     console.error(err);
//   }
//   console.log("Contract Verification Ended");
// }

export const toHex = (
  covertThis: BigNumber | number | string,
  padding: any,
  hre: HardhatRuntimeEnvironment
): string => {
  //This checks if padding < convertThis, then error is not thrown in ethers-v5
  if (hre.ethers.utils.hexlify(covertThis).length > 2 * padding + 2)
    return hre.ethers.utils.hexlify(covertThis)

  return hre.ethers.utils.hexZeroPad(
    hre.ethers.utils.hexlify(covertThis),
    padding
  )
}

export const createResourceID = (
  contractAddress: string,
  chainID: number,
  hre: HardhatRuntimeEnvironment
): string => {
  return toHex(contractAddress + toHex(chainID, 0, hre).substr(2), 32, hre)
}
