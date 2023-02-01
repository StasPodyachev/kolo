import { ethers, waffle, network } from "hardhat"
import { BigNumber, constants, utils, Wallet } from "ethers"
import { AuctionFile } from "../typechain/AuctionFile"
import { Factory } from "../typechain/Factory"
import { Chat } from "../typechain/Chat"
import { Treasury } from "../typechain/Treasury"

import { expect } from "chai"
import { auctionFileFixture } from "./shared/fixtures"
import { moveBlocks } from "./utils/move-blocks"
import { moveTime } from "./utils/move-time"
import { time } from "@nomicfoundation/hardhat-network-helpers";

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
    ; ({ auctionFile, factory } = await loadFixture(async () => {
      const { auctionFile, factory } = await auctionFileFixture()

      return { auctionFile, factory }
    }))
  })

  describe("#create", () => {
    it("should create store", async () => {
      await factory.createStore()
      const storeAddress = await factory["getStore(address)"](wallet.address);

      await expect(auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, Date.now() + 1000, "0x", { value: BigNumber.from("100000000000000000") }
      ))
        .to.emit(auctionFile, "DealCreated")
        .withArgs(1, wallet.address)

      expect(await factory["getStore(uint256)"](1))
        .to.be.eq(storeAddress);

      await expect(factory.getDeal(1))
        .to.be.not.reverted;
      await expect(factory.getAllDeals())
        .to.be.not.reverted;
    })

    it("fails if store is not created", async () => {
      await expect(auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, Date.now() + 1000, "0x", { value: BigNumber.from("100000000000000000") }
      ))
        .to.be.revertedWith("AuctionFile: Caller does not have a store");
    })

    it("fails if wrong collateral was passed", async () => {

      await factory.createStore();

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

      await factory.createStore();

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

      await factory.createStore();

      await expect(
        auctionFile.create(
          "NAME",
          "DESCRIPTION",
          0,
          100000000000,
          (Date.now() / 1000) | 0,
          "0x",
          { value: BigNumber.from("100000000000000000") }
        )
      ).to.be.revertedWith("AuctionFile: Wrong params")
    })

    it("fails if priceStart equals priceForceStop", async () => {

      await factory.createStore()

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
      await factory.createStore()

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, Date.now() + 1000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await expect(auctionFile.cancel(1))
        .to.emit(auctionFile, "DealCanceled")
        .withArgs(1, wallet.address)
    })

    it("fails if id not found", async () => {
      await factory.createStore()

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, Date.now() + 1000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await expect(auctionFile.cancel(1000))
        .to.revertedWith("AuctionFile: Id not found");
    })

    it("fails if caller is not a seller", async () => {
      await factory.createStore()

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, Date.now() + 1000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await expect(auctionFile.connect(other).cancel(1))
        .to.revertedWith("AuctionFile: Caller is not a seller");
    })

    it("fails if auction already have a bid", async () => {
      await factory.createStore()

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, Date.now() + 1000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await expect(auctionFile.connect(other).bid(1, {
        value: BigNumber.from("10000000000")
      }))
        .to.emit(auctionFile, "BidCreated")
        .withArgs(1, other.address, BigNumber.from("10000000000"))

      await expect(auctionFile.cancel(1))
        .to.revertedWith("AuctionFile: Auction already have a bid");
    })
  })

  describe("#bid", () => {
    it("should create bid", async () => {
      await factory.connect(other).createStore()

      await auctionFile.connect(other).create("NAME", "DESCRIPTION", 10000000000, 100000000000, Date.now() + 1000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await expect(auctionFile.bid(1, {
        value: BigNumber.from("10000000000")
      }))
        .to.emit(auctionFile, "BidCreated")
        .withArgs(1, wallet.address, BigNumber.from("10000000000"))

      const bids = await auctionFile.getBidHistory(1)
      expect(bids.length).to.eq(1)
      expect(bids[0].buyer).to.eq(wallet.address)
      expect(bids[0].bid).to.eq(BigNumber.from("10000000000"))
    })

    it("fails if seller bids", async () => {
      await factory.createStore()

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, Date.now() + 1000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await expect(auctionFile.bid(1, {
        value: BigNumber.from("10000000000")
      }))
        .to.revertedWith("AuctionFile: Seller cannot be a buyer")
    })



    it("fails if wrong deal id", async () => {

      await expect(auctionFile.bid(1000, {
        value: BigNumber.from("10000000000")
      }))
        .to.revertedWith("AuctionFile: Id not found")
    })

    it("fails if deal canceled", async () => {
      await factory.createStore()

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, Date.now() + 1000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await auctionFile.cancel(1);

      await expect(auctionFile.connect(other).bid(1, {
        value: BigNumber.from("10000000000")
      }))
        .to.revertedWith("AuctionFile: Wrong status")
    })

    it("should create bid eq priceForceStop", async () => {
      await factory.connect(other).createStore()

      await auctionFile.connect(other).create("NAME", "DESCRIPTION", 10000000000, 100000000000, Date.now() + 1000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await expect(auctionFile.bid(1, {
        value: BigNumber.from("100000000000000000")
      }))
        .to.emit(auctionFile, "DealFinalized")
        .withArgs(1)

      const bids = await auctionFile.getBidHistory(1)
      expect(bids.length).to.eq(1)
      expect(bids[0].buyer).to.eq(wallet.address)
      expect(bids[0].bid).to.eq(BigNumber.from("100000000000000000"))
    })

    it("fails if time is up", async () => {
      await factory.createStore()

      const ts = await time.latest();

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await time.increase(time.duration.hours(1));

      await expect(auctionFile.connect(other).bid(1, {
        value: BigNumber.from("10000000000")
      }))
        .to.revertedWith("AuctionFile: Time is up")
    })


    it("fails if amount is wrong", async () => {
      await factory.createStore()

      console.log("DATE JS: ", time.duration.hours(1));
      const ts = await time.latest();


      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await expect(auctionFile.connect(other).bid(1, {
        value: BigNumber.from("100000000")
      })).to.revertedWith("AuctionFile: Wrong amount");
    })


    it("fails if Current bid is less then previous bid", async () => {
      await factory.createStore()

      console.log("DATE JS: ", time.duration.hours(1));
      const ts = await time.latest();


      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await auctionFile.connect(other).bid(1, {
        value: BigNumber.from("80000000000")
      })

      await expect(auctionFile.connect(buyer).bid(1, {
        value: BigNumber.from("60000000000")
      })).to.revertedWith("AuctionFile: Current bid cannot be less then previous bid");


    })
  })


  describe("#finalize", () => {
    it("should finalize with no bids", async () => {
      await factory.createStore()

      console.log("DATE JS: ", time.duration.hours(1));
      const ts = await time.latest();


      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await time.increase(time.duration.hours(1));

      await expect(auctionFile.finalize(1))
        .to.emit(auctionFile, "DealClosed")
        .withArgs(1);
    })

    it("should finalize with bids", async () => {
      await factory.createStore()

      console.log("DATE JS: ", time.duration.hours(1));
      const ts = await time.latest();

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await auctionFile.connect(buyer).bid(1, {
        value: BigNumber.from("10000000000")
      })

      await auctionFile.connect(other).bid(1, {
        value: BigNumber.from("60000000000")
      })

      await time.increase(time.duration.hours(1));

      await expect(auctionFile.finalize(1))
        .to.emit(auctionFile, "DealFinalized")
        .withArgs(1);

      expect(await auctionFile["checkAccsess(bytes,address)"]("0x", other.address))
        .to.eq(1);
    })

    it("fails if auction is not open", async () => {
      await factory.createStore()
      const ts = await time.latest();

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await auctionFile.cancel(1);
      await time.increase(time.duration.hours(1));


      await expect(auctionFile.finalize(1))
        .to.revertedWith("AuctionFile: Auction is not open");
    })


    it("fails if id not found", async () => {
      await factory.createStore()
      const ts = await time.latest();

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await expect(auctionFile.finalize(100))
        .to.revertedWith("AuctionFile: Id not found");
    })


    it("fails if dae expire", async () => {
      await factory.createStore()
      const ts = await time.latest();

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await time.increase(time.duration.days(10));

      await expect(auctionFile.finalize(1))
        .to.revertedWith("AuctionFile: Id not found");
    })
  })


  describe("#dispute", () => {
    it("should make dispute", async () => {
      await factory.createStore()

      const ts = await time.latest();

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await auctionFile.connect(other).bid(1, {
        value: BigNumber.from("10000000000")
      })

      await time.increase(time.duration.hours(1));

      await auctionFile.finalize(1);

      await expect(auctionFile.connect(other).dispute(1, {
        value: BigNumber.from("100000000000000000")
      }))
        .to.emit(auctionFile, "DisputeCreated")
        .withArgs(1);
    })

    it("fails without finalize", async () => {
      await factory.createStore()

      const ts = await time.latest();

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await auctionFile.connect(other).bid(1, {
        value: BigNumber.from("10000000000")
      })

      await time.increase(time.duration.hours(1));

      await expect(auctionFile.connect(other).dispute(1, {
        value: BigNumber.from("100000000000000000")
      }))
        .to.revertedWith("AuctionFile: Wrong status");
    })

    it("fails if id not found", async () => {
      await expect(auctionFile.dispute(1000, {
        value: BigNumber.from("100000000000000000")
      }))
        .to.revertedWith("AuctionFile: Id not found");
    })

    it("fails if caller is not a buyer", async () => {
      await factory.createStore()

      console.log("DATE JS: ", time.duration.hours(1));
      const ts = await time.latest();

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await auctionFile.connect(other).bid(1, {
        value: BigNumber.from("10000000000")
      })

      await time.increase(time.duration.hours(1));

      await auctionFile.finalize(1);

      await expect(auctionFile.dispute(1, {
        value: BigNumber.from("100000000000000000")
      }))
        .to.revertedWith("AuctionFile: Caller is not a buyer");
    })

    it("fails if time for dispute is up", async () => {
      await factory.createStore()

      console.log("DATE JS: ", time.duration.hours(1));
      const ts = await time.latest();

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await auctionFile.connect(other).bid(1, {
        value: BigNumber.from("10000000000")
      })

      await time.increase(time.duration.hours(1));

      await auctionFile.finalize(1);
      await time.increase(time.duration.days(10));

      await expect(auctionFile.connect(other).dispute(1, {
        value: BigNumber.from("100000000000000000")
      }))
        .to.revertedWith("AuctionFile: Time for dispute is up");
    })


    it("fails if collateral is wrong", async () => {
      await factory.createStore()

      const ts = await time.latest();

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await auctionFile.connect(other).bid(1, {
        value: BigNumber.from("10000000000")
      })

      await time.increase(time.duration.hours(1));

      await auctionFile.finalize(1);
      await expect(auctionFile.connect(other).dispute(1))
        .to.revertedWith("AuctionFile: Wrong collateral");
    })
  })

  describe("#receiveReward", () => {
    it("should receiveReward", async () => {
      await factory.createStore()

      console.log("DATE JS: ", time.duration.hours(1));
      const ts = await time.latest();


      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await auctionFile.connect(other).bid(1, {
        value: BigNumber.from("10000000000")
      })

      await time.increase(time.duration.hours(1));
      await auctionFile.finalize(1);
      await time.increase(time.duration.days(6));

      await expect(auctionFile.receiveReward(1))
        .to.emit(auctionFile, "DealClosed")
        .withArgs(1);
    })

    it("fails if its time for dispute", async () => {
      await factory.createStore()

      const ts = await time.latest();

      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await auctionFile.connect(other).bid(1, {
        value: BigNumber.from("10000000000")
      })

      await time.increase(time.duration.hours(1));
      await auctionFile.finalize(1);
      //await time.increase(time.duration.days(6));

      await expect(auctionFile.receiveReward(1))
        .to.revertedWith("AuctionFile: Time for dispute");
    })

    it("fails if wrong status", async () => {
      await factory.createStore()

      console.log("DATE JS: ", time.duration.hours(1));
      const ts = await time.latest();


      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await auctionFile.connect(other).bid(1, {
        value: BigNumber.from("10000000000")
      })

      await expect(auctionFile.receiveReward(1))
        .to.revertedWith("AuctionFile: Wrong status");
    })

    it("fails if id not found", async () => {
      await factory.createStore()

      console.log("DATE JS: ", time.duration.hours(1));
      const ts = await time.latest();


      await auctionFile.create("NAME", "DESCRIPTION", 10000000000, 100000000000, ts + 2000, "0x", {
        value: BigNumber.from("100000000000000000")
      })

      await auctionFile.connect(other).bid(1, {
        value: BigNumber.from("10000000000")
      })

      await expect(auctionFile.receiveReward(1000))
        .to.revertedWith("AuctionFile: Id not found");
    })


  })

  describe("#getDeal", () => {
    let storeAddress: any
    beforeEach("create storage", async () => {
      const tx = await factory.createStore()
      const receipt = await tx.wait()
      storeAddress = receipt.events?.[2].args?.store
    })

    it("correct serialize", async () => {
      const name = "NAME"
      const description = "DESCRIPTION"
      const priceStart = 10000000000
      const priceForceStop = 100000000000
      const dateExpire = Date.now() + 1000
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
          "tuple(uint256, string, string, uint256, uint256, uint256, uint256, address, address, uint256, bytes, uint256)",
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
            cid,
            0,
          ],
        ]
      )

      expect(deal.id).to.be.equal(1)
      expect(deal._type).to.be.equal(0)
      expect(deal.data).to.be.equal(data)
      expect(deal.integration).to.be.equal(auctionFile.address)
      expect(deal.store).to.be.equal(storeAddress)

      // const res = coder.decode(
      //   [
      //     "tuple(uint256, string, string, uint256, uint256, uint256, uint256, address, address, uint256, bytes, uint256)",
      //   ],
      //   "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002540be400000000000000000000000000000000000000000000000000000000174876e800000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000f552f5223d3f7ceb580fa92fe0afc6ed8c09179b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000186016c27680000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e414d4500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b4445534352495054494f4e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e516d6264456d467533414b33674b6352504e6a576f3971646b74714772766a664d325a696577414e6b4855574d4b000000000000000000000000000000000000"
      // )
    })
  })
})
