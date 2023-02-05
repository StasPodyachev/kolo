import { ethers, waffle, network } from "hardhat"
import { BigNumber, constants, utils, Wallet } from "ethers"
import { AuctionFile } from "../typechain/AuctionFile"
import { Factory } from "../typechain/Factory"
import { Chat } from "../typechain/Chat"
import { Notary } from "../typechain/Notary"

import { expect } from "chai"
import { auctionFileFixture } from "./shared/fixtures"
import { moveBlocks } from "./utils/move-blocks"
import { moveTime } from "./utils/move-time"
import { time } from "@nomicfoundation/hardhat-network-helpers"

const createFixtureLoader = waffle.createFixtureLoader

describe("Notary", () => {
  let wallet: Wallet,
    other: Wallet,
    buyer: Wallet,
    buyer1: Wallet,
    buyer2: Wallet,
    buyer3: Wallet,
    buyer4: Wallet,
    buyer5: Wallet,
    buyer6: Wallet,
    buyer7: Wallet,
    buyer8: Wallet

  let auctionFile: AuctionFile
  let factory: Factory
  let chat: Chat
  let notary: Notary
  const BIGNUM_1E18 = BigNumber.from("1000000000000000000")

  let loadFixture: ReturnType<typeof createFixtureLoader>

  before("create fixture loader", async () => {
    ;[
      wallet,
      other,
      buyer,
      buyer1,
      buyer2,
      buyer3,
      buyer4,
      buyer5,
      buyer6,
      buyer7,
      buyer8,
    ] = await (ethers as any).getSigners()
    loadFixture = createFixtureLoader([
      wallet,
      other,
      buyer,
      buyer1,
      buyer2,
      buyer3,
      buyer4,
      buyer5,
      buyer6,
      buyer7,
      buyer8,
    ])
  })

  beforeEach("deploy fixture", async () => {
    ; ({ auctionFile, factory, notary } = await loadFixture(async () => {
      const { auctionFile, factory, notary, koloToken } =
        await auctionFileFixture()

      const AIRDROP_ROLE = await koloToken.AIRDROP_ROLE()
      await koloToken.grantRole(AIRDROP_ROLE, notary.address)
      await koloToken.grantRole(AIRDROP_ROLE, auctionFile.address)

      return { auctionFile, factory, notary }
    }))
  })

  describe("#deposit", () => {
    it("should make deposit", async () => {
      await notary.setMinDeposit(BIGNUM_1E18)

      const oldBalance = (await wallet.getBalance()).toString()

      const tx = await notary.deposit({
        value: BIGNUM_1E18,
      })
      const txRec = await tx.wait()

      const gas = txRec.gasUsed.mul(txRec.effectiveGasPrice)
      const newBalance = (await wallet.getBalance()).toString()

      expect(BIGNUM_1E18.add(newBalance).add(gas)).to.eq(oldBalance)
    })

    it("fails if deposit is not enough", async () => {
      await notary.setMinDeposit(BIGNUM_1E18)

      await expect(
        notary.deposit({
          value: BIGNUM_1E18.div(2),
        })
      ).to.revertedWith("Notary: deposit is not enough")
    })
  })

  describe("#withdraw", () => {
    it("should make withdraw", async () => {
      await notary.deposit({
        value: BIGNUM_1E18,
      })

      const oldBalance = (await wallet.getBalance()).toString()

      const tx = await notary.withdraw(BIGNUM_1E18)
      const txRec = await tx.wait()

      const gas = txRec.gasUsed.mul(txRec.effectiveGasPrice)
      const newBalance = (await wallet.getBalance()).toString()

      expect(BIGNUM_1E18.add(oldBalance).sub(gas)).to.eq(newBalance)
    })

    it("fails if balance is not enough", async () => {
      await expect(notary.withdraw(BIGNUM_1E18)).to.revertedWith(
        "Notary: Not enough balance"
      )
    })
  })

  describe("#vote", () => {
    it("should vote", async () => {
      await notary.deposit({ value: BIGNUM_1E18 })
      // await notary.connect(other).deposit({ value: BIGNUM_1E18 })
      // await notary.connect(buyer).deposit({ value: BIGNUM_1E18 })
      // //await notary.connect(buyer1).deposit({ value: BIGNUM_1E18 })
      // await notary.connect(buyer2).deposit({ value: BIGNUM_1E18 })
      // await notary.connect(buyer3).deposit({ value: BIGNUM_1E18 })
      // await notary.connect(buyer4).deposit({ value: BIGNUM_1E18 })
      // await notary.connect(buyer5).deposit({ value: BIGNUM_1E18 })
      // await notary.connect(buyer6).deposit({ value: BIGNUM_1E18 })
      // await notary.connect(buyer7).deposit({ value: BIGNUM_1E18 })
      // await notary.connect(buyer8).deposit({ value: BIGNUM_1E18 })

      const ts = await time.latest()
      await auctionFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        100000000000,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await auctionFile.connect(other).bid(1, {
        value: BigNumber.from("10000000000"),
      })

      await time.increase(time.duration.hours(1))
      await auctionFile.finalize(1)

      await auctionFile.connect(other).dispute(1, {
        value: BigNumber.from("100000000000000000"),
      })

      await notary.vote(1, true)
      // await notary.connect(other).vote(1, true)
      // await notary.connect(buyer).vote(1, true)
      // //await notary.connect(buyer1).vote(1, true)
      // await notary.connect(buyer2).vote(1, true)
      // await notary.connect(buyer3).vote(1, true)
      // await notary.connect(buyer4).vote(1, false)
      // await notary.connect(buyer5).vote(1, false)
    })
  })

  // describe("#create", () => {
  //   it("should create store", async () => {
  //     await factory.createStore()
  //     const storeAddress = await factory["getStore(address)"](wallet.address);

  //     await expect(auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, Date.now() + 1000, "0x", { value: BigNumber.from("100000000000000000") }
  //     ))
  //       .to.emit(auctionFile, "DealCreated")
  //       .withArgs(1, wallet.address)

  //     expect(await factory["getStore(uint256)"](1))
  //       .to.be.eq(storeAddress);

  //     await expect(factory.getDeal(1))
  //       .to.be.not.reverted;
  //     await expect(factory.getAllDeals())
  //       .to.be.not.reverted;
  //   })

  //   it("fails if store is not created", async () => {
  //     await expect(auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, Date.now() + 1000, "0x", { value: BigNumber.from("100000000000000000") }
  //     ))
  //       .to.be.revertedWith("AuctionFile: Caller does not have a store");
  //   })

  //   it("fails if wrong collateral was passed", async () => {

  //     await factory.createStore();

  //     await expect(
  //       auctionFile.create(
  //         "NAME",
  //         "DESCRIPTION",
  //         10000000000,
  //         100000000000,
  //         Date.now() + 1000,
  //         "0x",
  //         { value: BigNumber.from("10000000000000000") }
  //       )
  //     ).to.be.revertedWith("AuctionFile: Wrong collateral")

  //   })

  //   it("fails if wrong priceStart was passed", async () => {

  //     await factory.createStore();

  //     await expect(
  //       auctionFile.create(
  //         "NAME",
  //         "DESCRIPTION",
  //         0,
  //         100000000000,
  //         Date.now() + 1000,
  //         "0x",
  //         { value: BigNumber.from("100000000000000000") }
  //       )
  //     ).to.be.revertedWith("AuctionFile: Wrong params")
  //   })

  //   it("fails if wrong dateExpire was passed", async () => {

  //     await factory.createStore();

  //     await expect(
  //       auctionFile.create(
  //         "NAME",
  //         "DESCRIPTION",
  //         0,
  //         100000000000,
  //         (Date.now() / 1000) | 0,
  //         "0x",
  //         { value: BigNumber.from("100000000000000000") }
  //       )
  //     ).to.be.revertedWith("AuctionFile: Wrong params")
  //   })

  //   it("fails if priceStart equals priceForceStop", async () => {

  //     await factory.createStore()

  //     await expect(
  //       auctionFile.create(
  //         "NAME",
  //         "DESCRIPTION",
  //         100000000000,
  //         100000000000,
  //         Date.now() + 1000,
  //         "0x",
  //         { value: BigNumber.from("100000000000000000") }
  //       )
  //     ).to.be.revertedWith("AuctionFile: Wrong params")

  //   })
  // })
})
