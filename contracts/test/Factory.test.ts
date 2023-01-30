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
    ;({ factory } = await loadFixture(factoryFixture))
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
  })
})

/* 0x
0000000000000000000000000000000000000000000000000000000000000080
0000000000000000000000000000000000000000000000000000000000000001
00000000000000000000000000000000000000000000000000000000000000e0
0000000000000000000000000000000000000000000000000000000000000002
000000000000000000000000000000000000000000000000000000000000002e
516d6264456d467533414b33674b6352504e6a576f3971646b74714772766a66
4d325a696577414e6b4855574d4b000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000004
6e616d6500000000000000000000000000000000000000000000000000000000

*/
