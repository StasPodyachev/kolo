const hre = require("hardhat")

import deployment from "../deployment/deployments.json"
import { main as deploy } from "./deploy"
import { main as configure } from "./configure"
import { IDeployment } from "./utils"
const deployments: IDeployment = deployment

async function main() {
  await deploy()
  await configure()
  // await verify()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
