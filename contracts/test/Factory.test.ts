import { ethers, waffle } from "hardhat"
import { constants, Wallet } from "ethers"
import { Factory } from "../typechain/Factory"
import { expect } from "chai"
import { factoryFixture } from "./shared/fixtures"

const createFixtureLoader = waffle.createFixtureLoader

describe("Factory", () => {
  let wallet: Wallet, other: Wallet

  let factory: Factory

  let loadFixture: ReturnType<typeof createFixtureLoader>

  before("create fixture loader", async () => {
    ;[wallet, other] = await (ethers as any).getSigners()
    loadFixture = createFixtureLoader([wallet, other])
  })

  beforeEach("deploy fixture", async () => {
    ; ({ factory } = await loadFixture(factoryFixture))
  })

  describe("#createStore", async () => {
    it("should create store and add it to list", async () => {
      expect(await factory["getStore(address)"](wallet.address)).to.be.eq(
        ethers.constants.AddressZero
      )

      await expect(factory.createStore()).to.emit(factory, "StoreCreated")

      expect(await factory["getStore(address)"](wallet.address)).to.be.not.eq(
        ethers.constants.AddressZero
      )
    })

    it("fails if store already created", async () => {
      await factory.createStore()
      await expect(factory.createStore()).to.be.revertedWith(
        "Factory: Store already exist"
      )
    })
  })

  describe("#getStore", async () => {
    it("should return zero address if store was not create", async () => {
      expect(await factory["getStore(address)"](wallet.address)).to.be.eq(
        ethers.constants.AddressZero
      )
    })

    it("should return zero address if store was not create", async () => {
      expect(await factory["getStore(uint256)"](1)).to.be.eq(
        ethers.constants.AddressZero
      )
    })
  })
})

