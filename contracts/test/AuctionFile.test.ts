import { ethers, waffle, network } from "hardhat"
import { BigNumber, constants, Wallet } from "ethers"
import { AuctionFile } from "../typechain/AuctionFile"
import { Factory } from "../typechain/Factory"
import { Chat } from "../typechain/Chat"

import { expect } from "chai"
import { auctionFileFixture, storeFixture } from "./shared/fixtures"
import { time } from "@nomicfoundation/hardhat-network-helpers"
import { Store } from "../typechain"

const createFixtureLoader = waffle.createFixtureLoader

describe("AuctionFile", () => {
  let wallet: Wallet, other: Wallet, buyer: Wallet

  let auctionFile: AuctionFile
  let factory: Factory
  let chat: Chat

  let loadFixture: ReturnType<typeof createFixtureLoader>

  before("create fixture loader", async () => {
    ;[wallet, other, buyer] = await (ethers as any).getSigners()
    loadFixture = createFixtureLoader([wallet, other, buyer])
  })

  beforeEach("deploy fixture", async () => {
    ;({ auctionFile, factory, chat } = await loadFixture(async () => {
      const { auctionFile, factory, chat, koloToken } =
        await auctionFileFixture()

      const AIRDROP_ROLE = await koloToken.AIRDROP_ROLE()
      await koloToken.grantRole(AIRDROP_ROLE, auctionFile.address)

      return { auctionFile, factory, chat }
    }))
  })

  describe("#setters", () => {
    it("setServiceFee", async () => {
      await expect(auctionFile.setServiceFee(111111111)).to.be.not.reverted
      await expect(auctionFile.connect(other).setServiceFee(111111111)).to.be
        .reverted
    })

    it("setPeriodDispute", async () => {
      await expect(auctionFile.setPeriodDispute(111111111)).to.be.not.reverted
      await expect(auctionFile.connect(other).setPeriodDispute(111111111)).to.be
        .reverted

      const params = await auctionFile.getIntegrationInfo()
      expect(params.periodDispute).to.eq(111111111)
    })

    it("setCollateralAmount", async () => {
      await expect(auctionFile.setCollateralPercent(111111111)).to.be.not
        .reverted
      await expect(auctionFile.connect(other).setCollateralPercent(111111111))
        .to.be.reverted

      const params = await auctionFile.getIntegrationInfo()
      expect(params.collateralPercent).to.eq(111111111)
    })

    it("setCollateralAmount", async () => {
      await expect(auctionFile.setCollateralAmount(111111111)).to.be.not
        .reverted
      await expect(auctionFile.connect(other).setCollateralAmount(111111111)).to
        .be.reverted

      const params = await auctionFile.getIntegrationInfo()
      expect(params.collateralAmount).to.eq(111111111)
    })
  })

  describe("#create", () => {
    it("should create store", async () => {
      const oldBalance = (await wallet.getBalance()).toString()
      const collateral = BigNumber.from("100000000000000000")

      const tx = await auctionFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        100000000000,
        Date.now() + 1000,
        "0x",
        { value: collateral }
      )

      await expect(tx)
        .to.emit(auctionFile, "DealCreated")
        .withArgs(1, wallet.address)

      const txRec = await tx.wait()
      const gas = txRec.gasUsed.mul(txRec.effectiveGasPrice)
      const newBalance = (await wallet.getBalance()).toString()

      expect(collateral.add(newBalance).add(gas)).to.eq(oldBalance)

      // expect(await factory["getStore(uint256)"](1)).to.be.eq(store.address)

      await expect(factory.getDeal(1)).to.be.not.reverted
      await expect(factory.getAllDeals()).to.be.not.reverted
    })

    // it("fails if store is not created", async () => {
    //   await expect(
    //     auctionFile.create(
    //       "NAME",
    //       "DESCRIPTION",
    //       10000000000,
    //       100000000000,
    //       Date.now() + 1000,
    //       "0x",
    //       { value: BigNumber.from("100000000000000000") }
    //     )
    //   ).to.be.revertedWith("AuctionFile: Caller does not have a store")
    // })

    it("fails if wrong collateral was passed", async () => {
      await expect(
        auctionFile.create(
          "NAME",
          "DESCRIPTION",
          10000000000,
          100000000000,
          Date.now() + 1000,
          "0x",
          { value: BigNumber.from("10000000000000000") }
        )
      ).to.be.revertedWith("AuctionFile: Wrong collateral")
    })

    it("fails if wrong priceStart was passed", async () => {
      await expect(
        auctionFile.create(
          "NAME",
          "DESCRIPTION",
          0,
          100000000000,
          Date.now() + 1000,
          "0x",
          { value: BigNumber.from("100000000000000000") }
        )
      ).to.be.revertedWith("AuctionFile: Wrong params")
    })

    it("fails if wrong dateExpire was passed", async () => {
      await expect(
        auctionFile.create(
          "NAME",
          "DESCRIPTION",
          100,
          100000000000,
          (Date.now() / 1000) | 0,
          "0x",
          { value: BigNumber.from("100000000000000000") }
        )
      ).to.be.revertedWith("AuctionFile: Wrong params")
    })

    it("fails if priceStart equals priceForceStop", async () => {
      await expect(
        auctionFile.create(
          "NAME",
          "DESCRIPTION",
          100000000000,
          100000000000,
          Date.now() + 1000,
          "0x",
          { value: BigNumber.from("100000000000000000") }
        )
      ).to.be.revertedWith("AuctionFile: Wrong params")
    })
  })

  describe("#cancel", () => {
    it("should cancel bid", async () => {
      await auctionFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        100000000000,
        Date.now() + 1000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      const oldBalance = (await wallet.getBalance()).toString()

      const tx = await auctionFile.cancel(1)
      await expect(tx)
        .to.emit(auctionFile, "DealCanceled")
        .withArgs(1, wallet.address)

      let txRec = await tx.wait()
      let gas = txRec.gasUsed.mul(txRec.effectiveGasPrice)
      const newBalanceWallet = (await wallet.getBalance()).toString()

      expect(
        BigNumber.from("100000000000000000").add(oldBalance).sub(gas)
      ).to.eq(newBalanceWallet)
    })

    it("fails if id not found", async () => {
      await auctionFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        100000000000,
        Date.now() + 1000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await expect(auctionFile.cancel(1000)).to.revertedWith(
        "AuctionFile: Id not found"
      )
    })

    it("fails if caller is not a seller", async () => {
      await auctionFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        100000000000,
        Date.now() + 1000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await expect(auctionFile.connect(other).cancel(1)).to.revertedWith(
        "AuctionFile: Caller is not a seller"
      )
    })

    it("fails if auction already have a bid", async () => {
      await auctionFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        100000000000,
        Date.now() + 1000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await expect(
        auctionFile.connect(other).bid(1, {
          value: BigNumber.from("10000000000"),
        })
      )
        .to.emit(auctionFile, "BidCreated")
        .withArgs(1, other.address, BigNumber.from("10000000000"))

      await expect(auctionFile.cancel(1)).to.revertedWith(
        "AuctionFile: Auction already have a bid"
      )
    })
  })

  describe("#bid", () => {
    it("should create bid", async () => {
      await auctionFile
        .connect(other)
        .create(
          "NAME",
          "DESCRIPTION",
          10000000000,
          100000000000,
          Date.now() + 1000,
          "0x",
          {
            value: BigNumber.from("100000000000000000"),
          }
        )

      const oldBalanceWallet = (await wallet.getBalance()).toString()
      const bid = BigNumber.from("10000000000")

      let tx = await auctionFile.bid(1, {
        value: bid,
      })

      await expect(tx)
        .to.emit(auctionFile, "BidCreated")
        .withArgs(1, wallet.address, BigNumber.from("10000000000"))

      let txRec = await tx.wait()
      let gas = txRec.gasUsed.mul(txRec.effectiveGasPrice)
      const newBalanceWallet = (await wallet.getBalance()).toString()

      expect(bid.add(newBalanceWallet).add(gas)).to.eq(oldBalanceWallet)

      const oldBalanceBuyer = (await buyer.getBalance()).toString()

      tx = await auctionFile.connect(buyer).bid(1, {
        value: bid.add(1),
      })

      await expect(tx)
        .to.emit(auctionFile, "BidCreated")
        .withArgs(1, buyer.address, bid.add(1))

      txRec = await tx.wait()
      gas = txRec.gasUsed.mul(txRec.effectiveGasPrice)
      const newBalanceBuyer = (await buyer.getBalance()).toString()

      expect(bid.add(1).add(newBalanceBuyer).add(gas)).to.eq(oldBalanceBuyer)

      const newestBalanceWallet = (await wallet.getBalance()).toString()
      expect(bid.add(newBalanceWallet)).to.eq(newestBalanceWallet)

      const bids = await auctionFile.getBidHistory(1)
      expect(bids.length).to.eq(2)
      expect(bids[1].bid).to.eq(BigNumber.from(bid.add(1)))
      expect(bids[1].buyer).to.eq(buyer.address)

      const param = await chat.getChat(1)
      expect(param.length).eq(3)
      // expect(param[1].message).eq("Hello!")
      expect(param[1].sender).eq(constants.AddressZero)
    })

    it("fails if seller bids", async () => {
      await auctionFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        100000000000,
        Date.now() + 1000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await expect(
        auctionFile.bid(1, {
          value: BigNumber.from("10000000000"),
        })
      ).to.revertedWith("AuctionFile: Seller cannot be a buyer")
    })

    it("fails if wrong deal id", async () => {
      await expect(
        auctionFile.bid(1000, {
          value: BigNumber.from("10000000000"),
        })
      ).to.revertedWith("AuctionFile: Id not found")
    })

    it("fails if deal canceled", async () => {
      await auctionFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        100000000000,
        Date.now() + 1000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await auctionFile.cancel(1)

      await expect(
        auctionFile.connect(other).bid(1, {
          value: BigNumber.from("10000000000"),
        })
      ).to.revertedWith("AuctionFile: Wrong status")
    })

    it("should create bid eq priceForceStop", async () => {
      await auctionFile
        .connect(other)
        .create(
          "NAME",
          "DESCRIPTION",
          10000000000,
          100000000000,
          Date.now() + 1000,
          "0x",
          {
            value: BigNumber.from("100000000000000000"),
          }
        )

      await expect(
        auctionFile.bid(1, {
          value: BigNumber.from("100000000000000000"),
        })
      )
        .to.emit(auctionFile, "DealFinalized")
        .withArgs(1)

      const bids = await auctionFile.getBidHistory(1)
      expect(bids.length).to.eq(1)
      expect(bids[0].buyer).to.eq(wallet.address)
      expect(bids[0].bid).to.eq(BigNumber.from("100000000000000000"))
    })

    it("fails if time is up", async () => {
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

      await time.increase(time.duration.hours(1))

      await expect(
        auctionFile.connect(other).bid(1, {
          value: BigNumber.from("10000000000"),
        })
      ).to.revertedWith("AuctionFile: Time is up")
    })

    it("fails if amount is wrong", async () => {
      console.log("DATE JS: ", time.duration.hours(1))
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

      await expect(
        auctionFile.connect(other).bid(1, {
          value: BigNumber.from("100000000"),
        })
      ).to.revertedWith("AuctionFile: Wrong amount")
    })

    it("fails if current bid is less then previous bid", async () => {
      console.log("DATE JS: ", time.duration.hours(1))
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
        value: BigNumber.from("80000000000"),
      })

      await expect(
        auctionFile.connect(buyer).bid(1, {
          value: BigNumber.from("60000000000"),
        })
      ).to.revertedWith(
        "AuctionFile: Current bid cannot be less then previous bid"
      )
    })
  })

  describe("#finalize", () => {
    it("should finalize with no bids", async () => {
      const ts = await time.latest()
      const collateral = BigNumber.from("100000000000000000")

      await auctionFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        100000000000,
        ts + 2000,
        "0x",
        {
          value: collateral,
        }
      )

      await time.increase(time.duration.hours(1))

      const oldBalance = (await wallet.getBalance()).toString()

      const tx = await auctionFile.finalize(1)
      await expect(tx).to.emit(auctionFile, "DealClosed").withArgs(1)

      const txRec = await tx.wait()
      const gas = txRec.gasUsed.mul(txRec.effectiveGasPrice)
      const newBalance = (await wallet.getBalance()).toString()

      expect(collateral.add(oldBalance).sub(gas)).to.eq(newBalance)
    })

    it("should finalize with bids", async () => {
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

      await auctionFile.connect(buyer).bid(1, {
        value: BigNumber.from("10000000000"),
      })

      await auctionFile.connect(other).bid(1, {
        value: BigNumber.from("60000000000"),
      })

      await time.increase(time.duration.hours(1))

      await expect(auctionFile.finalize(1))
        .to.emit(auctionFile, "DealFinalized")
        .withArgs(1)

      expect(
        await auctionFile["checkAccess(bytes,address)"]("0x", other.address)
      ).to.eq(1)
    })

    it("fails if auction is not open", async () => {
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

      await auctionFile.cancel(1)
      await time.increase(time.duration.hours(1))

      await expect(auctionFile.finalize(1)).to.revertedWith(
        "AuctionFile: Wrong status"
      )
    })

    it("fails if id not found", async () => {
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

      await expect(auctionFile.finalize(100)).to.revertedWith(
        "AuctionFile: Id not found"
      )
    })

    it("fails if date expire", async () => {
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

      //await time.increase(time.duration.days(10));

      await expect(auctionFile.finalize(1)).to.revertedWith(
        "AuctionFile: Date is not expire"
      )
    })
  })

  describe("#dispute", () => {
    it("should make dispute", async () => {
      const ts = await time.latest()

      const collateral = BigNumber.from("100000000000000000")
      await auctionFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        100000000000,
        ts + 2000,
        "0x",
        {
          value: collateral,
        }
      )

      await auctionFile.connect(other).bid(1, {
        value: BigNumber.from("10000000000"),
      })

      await time.increase(time.duration.hours(1))

      await auctionFile.finalize(1)

      const oldBalance = (await other.getBalance()).toString()

      const tx = await auctionFile.connect(other).dispute(1, {
        value: BigNumber.from("100000000000000000"),
      })
      await expect(tx).to.emit(auctionFile, "DisputeCreated").withArgs(1)

      const txRec = await tx.wait()
      const gas = txRec.gasUsed.mul(txRec.effectiveGasPrice)
      const newBalance = (await other.getBalance()).toString()

      expect(collateral.add(newBalance).add(gas)).to.eq(oldBalance)
    })

    it("fails without finalize", async () => {
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

      await expect(
        auctionFile.connect(other).dispute(1, {
          value: BigNumber.from("100000000000000000"),
        })
      ).to.revertedWith("AuctionFile: Wrong status")
    })

    it("fails if id not found", async () => {
      await expect(
        auctionFile.dispute(1000, {
          value: BigNumber.from("100000000000000000"),
        })
      ).to.revertedWith("AuctionFile: Id not found")
    })

    it("fails if caller is not a buyer", async () => {
      console.log("DATE JS: ", time.duration.hours(1))
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

      await expect(
        auctionFile.dispute(1, {
          value: BigNumber.from("100000000000000000"),
        })
      ).to.revertedWith("AuctionFile: Caller is not a buyer")
    })

    it("fails if time for dispute is up", async () => {
      console.log("DATE JS: ", time.duration.hours(1))
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
      await time.increase(time.duration.days(10))

      await expect(
        auctionFile.connect(other).dispute(1, {
          value: BigNumber.from("100000000000000000"),
        })
      ).to.revertedWith("AuctionFile: Time for dispute is up")
    })

    it("fails if collateral is wrong", async () => {
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
      await expect(auctionFile.connect(other).dispute(1)).to.revertedWith(
        "AuctionFile: Wrong collateral"
      )
    })
  })

  describe("#receiveReward", () => {
    it("should receiveReward", async () => {
      const ts = await time.latest()
      const collateral = BigNumber.from("100000000000000000")
      const price = BigNumber.from("10000000000")
      const fee = BigNumber.from("200000000")

      await auctionFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        100000000000,
        ts + 2000,
        "0x",
        {
          value: collateral,
        }
      )

      await auctionFile.connect(other).bid(1, {
        value: price,
      })

      await time.increase(time.duration.hours(1))
      await auctionFile.finalize(1)
      await time.increase(time.duration.days(6))

      const oldBalanceSeller = (await wallet.getBalance()).toString()
      const oldBalanceBuyer = (await other.getBalance()).toString()

      const tx = await auctionFile.receiveReward(1)
      await expect(tx).to.emit(auctionFile, "DealClosed").withArgs(1)

      const txRec = await tx.wait()
      const gas = txRec.gasUsed.mul(txRec.effectiveGasPrice)

      const newBalanceSeller = (await wallet.getBalance()).toString()
      const newBalanceBuyer = (await other.getBalance()).toString()

      expect(
        collateral.add(oldBalanceSeller).add(price).sub(gas).sub(fee).sub(fee)
      ).to.eq(newBalanceSeller)
      expect(newBalanceBuyer).to.eq(oldBalanceBuyer)
    })

    it("fails if its time for dispute", async () => {
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
      //await time.increase(time.duration.days(6));

      await expect(auctionFile.receiveReward(1)).to.revertedWith(
        "AuctionFile: Time for dispute"
      )
    })

    it("fails if wrong status", async () => {
      console.log("DATE JS: ", time.duration.hours(1))
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

      await expect(auctionFile.receiveReward(1)).to.revertedWith(
        "AuctionFile: Wrong status"
      )
    })

    it("fails if id not found", async () => {
      console.log("DATE JS: ", time.duration.hours(1))
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

      await expect(auctionFile.receiveReward(1000)).to.revertedWith(
        "AuctionFile: Id not found"
      )
    })
  })

  describe("#sendMessage", () => {
    it("should send message", async () => {
      const ts = await time.latest()

      const collateral = BigNumber.from("100000000000000000")
      await auctionFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        100000000000,
        ts + 2000,
        "0x",
        {
          value: collateral,
        }
      )
      await auctionFile.sendMessage(1, "Hello!")
      const param = await chat.getChat(1)
      expect(param.length).eq(2)
      expect(param[1].message).eq("Hello!")
      expect(param[1].sender).eq(wallet.address)
    })

    it("fails if status cancel", async () => {
      const ts = await time.latest()

      const collateral = BigNumber.from("100000000000000000")
      await auctionFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        100000000000,
        ts + 2000,
        "0x",
        {
          value: collateral,
        }
      )

      await auctionFile.cancel(1)
      await expect(auctionFile.sendMessage(1, "Hello!")).to.be.revertedWith(
        "AuctionFile: Wrong status"
      )
    })

    it("fails if status close", async () => {
      const ts = await time.latest()

      const collateral = BigNumber.from("100000000000000000")
      await auctionFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        100000000000,
        ts + 2000,
        "0x",
        {
          value: collateral,
        }
      )

      await time.increase(time.duration.hours(1))
      await auctionFile.finalize(1)
      await expect(auctionFile.sendMessage(1, "Hello!")).to.be.revertedWith(
        "AuctionFile: Wrong status"
      )
    })
  })

  describe("#getDeal", () => {
    it("correct serialize", async () => {
      const name = "NAME"
      const description = "DESCRIPTION"
      const priceStart = 10000000000
      const priceForceStop = 100000000000
      const dateExpire = Date.now() + 1000
      const dateDispute = dateExpire + time.duration.minutes(15)

      const cid =
        "0x516d6264456d467533414b33674b6352504e6a576f3971646b74714772766a664d325a696577414e6b4855574d4b"
      const collateral = "100000000000000000"

      await auctionFile.create(
        name,
        description,
        priceStart,
        priceForceStop,
        dateExpire,
        cid,
        { value: BigNumber.from(collateral) }
      )

      const deal = await auctionFile.getDeal(1)

      const coder = ethers.utils.defaultAbiCoder
      const data = coder.encode(
        [
          "tuple(uint256, string, string, uint256, uint256, uint256, uint256, address, address, uint256, uint256,bytes, uint256)",
        ],
        [
          [
            1,
            name,
            description,
            0,
            priceStart,
            priceForceStop,
            collateral,
            wallet.address,
            ethers.constants.AddressZero,
            dateExpire,
            dateDispute,
            cid,
            0,
          ],
        ]
      )

      expect(deal.id).to.be.equal(1)
      expect(deal._type).to.be.equal(0)
      expect(deal.data).to.be.equal(data)
      expect(deal.integration).to.be.equal(auctionFile.address)
      // expect(deal.store).to.be.equal(store.address)

      // const res = coder.decode(
      //   [
      //     "tuple(uint256, string, string, uint256, uint256, uint256, uint256, address, address, uint256, bytes, uint256)",
      //   ],
      //   "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002540be400000000000000000000000000000000000000000000000000000000174876e800000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000f552f5223d3f7ceb580fa92fe0afc6ed8c09179b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000186016c27680000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e414d4500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b4445534352495054494f4e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e516d6264456d467533414b33674b6352504e6a576f3971646b74714772766a664d325a696577414e6b4855574d4b000000000000000000000000000000000000"
      // )

      // 0x516d6264456d467533414b33674b6352504e6a576f3971646b74714772766a664d325a696577414e6b4855574d4b
      // 0xd78af4f09668f4c3e8f2de44c0488804e03345acff0c0caffa03b9cfc8285033

      // await auctionFile["addAccess(bytes,address)"](
      //   "0x516d6264456d467533414b33674b6352504e6a576f3971646b74714772766a664d325a696577414e6b4855574d4b",
      //   wallet.address
      // )

      const res = await auctionFile["checkAccess(bytes32[],uint8,address)"](
        [
          "0x516d6264456d467533414b33674b6352504e6a576f3971646b74714772766a66",
          "0x4d325a696577414e6b4855574d4b000000000000000000000000000000000000",
        ],
        46,
        wallet.address
      )

      expect(1).to.be.eq(res)
    })
  })
})
