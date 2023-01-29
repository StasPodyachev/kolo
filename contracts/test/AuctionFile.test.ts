import { ethers, waffle } from "hardhat"
import { BigNumber, constants, Wallet } from "ethers"
import { AuctionFile } from "../typechain/AuctionFile"
import { Factory } from "../typechain/Factory"
import { expect } from "chai"
import { auctionFileFixture } from "./shared/fixtures"

const createFixtureLoader = waffle.createFixtureLoader

describe("AuctionFile", () => {
  let wallet: Wallet, other: Wallet

  let auctionFile: AuctionFile
  let factory: Factory

  let loadFixture: ReturnType<typeof createFixtureLoader>

  before("create fixture loader", async () => {
    ;[wallet, other] = await (ethers as any).getSigners()
    loadFixture = createFixtureLoader([wallet, other])
  })

  beforeEach("deploy fixture", async () => {
    ; ({ auctionFile, factory } = await loadFixture(auctionFileFixture))

  })

  describe("#create", async () => {
    it("should create deal", async () => {

      await expect(auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, Date.now() + 1000, "0x", { value: BigNumber.from("100000000000000000") }
      ))
        .to.be.revertedWith("AuctionFile: Caller does not have a store");

      await factory.createStore();
      await expect(auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, Date.now() + 1000, "0x", { value: BigNumber.from("100000000000000000") }
      ))
        .to.emit(auctionFile, "DealCreated")
        .withArgs(1, wallet.address);

      // WRONG PARAMS
      await expect(auctionFile.create("NAME", "DESCRIPTION", 0, 100000000000, Date.now() + 1000, "0x", { value: BigNumber.from("100000000000000000") }
      ))
        .to.be.revertedWith("AuctionFile: Wrong params");

      await expect(auctionFile.create("NAME", "DESCRIPTION", 100000000000, 100000000000, Date.now() + 1000, "0x", { value: BigNumber.from("100000000000000000") }
      ))
        .to.be.revertedWith("AuctionFile: Wrong params");

      await expect(auctionFile.create("NAME", "DESCRIPTION", 1000000000000, 100000000000, Date.now() + 1000, "0x", { value: BigNumber.from("100000000000000000") }
      ))
        .to.be.revertedWith("AuctionFile: Wrong params");

      await expect(auctionFile.create("NAME", "DESCRIPTION", 1000000000000, 100000000000, Date.now() - 1000, "0x", { value: BigNumber.from("100000000000000000") }
      ))
        .to.be.revertedWith("AuctionFile: Wrong params");


      // WRONG COLLATERAL
      await expect(auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, Date.now() + 1000, "0x", { value: BigNumber.from("10000000000000000") }
      ))
        .to.be.revertedWith("AuctionFile: Wrong collateral");
    })

    // it("fails if store is not created", async () => {
    //   await expect(auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, Date.now() + 1000, "0x", { value: BigNumber.from("100000000000000000") }
    //   ))
    //     .to.be.revertedWith("AuctionFile: Caller does not have a store");
    // })

    // it("fails if wrong collateral was passed", async () => {


    //   await factory.createStore();

    // })

  })
})
