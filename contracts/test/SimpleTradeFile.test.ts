import { ethers, waffle, network } from "hardhat"
import { BigNumber, constants, utils, Wallet } from "ethers"
import { SimpleTradeFile } from "../typechain/SimpleTradeFile"
import { Factory } from "../typechain/Factory"
import { Chat } from "../typechain/Chat"
import { Treasury } from "../typechain/Treasury"

import { expect } from "chai"
import { simpleTradeFileFixture } from "./shared/fixtures"
import { moveBlocks } from "./utils/move-blocks"
import { moveTime } from "./utils/move-time"
import { time } from "@nomicfoundation/hardhat-network-helpers"

const createFixtureLoader = waffle.createFixtureLoader

describe("SimpleTradeFile", () => {
  let wallet: Wallet, other: Wallet, buyer: Wallet

  let simpleTradeFile: SimpleTradeFile
  let factory: Factory
  let chat: Chat

  let loadFixture: ReturnType<typeof createFixtureLoader>

  before("create fixture loader", async () => {
    ;[wallet, other, buyer] = await (ethers as any).getSigners()
    loadFixture = createFixtureLoader([wallet, other, buyer])
  })

  beforeEach("deploy fixture", async () => {
    ;({ simpleTradeFile, factory } = await loadFixture(async () => {
      const { simpleTradeFile, factory } = await simpleTradeFileFixture()

      return { simpleTradeFile, factory }
    }))
  })

  describe("#create", () => {
    it("should create deal", async () => {
      console.log("simpleTradeFile", simpleTradeFile.address)

      await factory.createStore()
      const storeAddress = await factory["getStore(address)"](wallet.address)

      await expect(
        simpleTradeFile.create(
          "NAME",
          "DESCRIPTION",
          10000000000,
          Date.now() + 1000,
          "0x",
          { value: BigNumber.from("100000000000000000") }
        )
      )
        .to.emit(simpleTradeFile, "DealCreated")
        .withArgs(1, wallet.address)

      expect(await factory["getStore(uint256)"](1)).to.be.eq(storeAddress)

      await expect(factory.getDeal(1)).to.be.not.reverted
      await expect(factory.getAllDeals()).to.be.not.reverted
    })

    it("fails if store is not created", async () => {
      await expect(
        simpleTradeFile.create(
          "NAME",
          "DESCRIPTION",
          10000000000,
          Date.now() + 1000,
          "0x",
          { value: BigNumber.from("100000000000000000") }
        )
      ).to.be.revertedWith("SimpleTradeFile: Caller does not have a store")
    })

    it("fails if wrong collateral was passed", async () => {
      await factory.createStore()

      await expect(
        simpleTradeFile.create(
          "NAME",
          "DESCRIPTION",
          100000000000,
          Date.now() + 1000,
          "0x",
          { value: BigNumber.from("10000000000000000") }
        )
      ).to.be.revertedWith("SimpleTradeFile: Wrong collateral")
    })

    it("fails if wrong price was passed", async () => {
      await factory.createStore()

      await expect(
        simpleTradeFile.create(
          "NAME",
          "DESCRIPTION",
          0,
          Date.now() + 1000,
          "0x",
          { value: BigNumber.from("100000000000000000") }
        )
      ).to.be.revertedWith("SimpleTradeFile: Wrong params")
    })

    it("fails if wrong dateExpire was passed", async () => {
      await factory.createStore()

      await expect(
        simpleTradeFile.create(
          "NAME",
          "DESCRIPTION",
          100000000000,
          (Date.now() / 1000) | 0,
          "0x",
          { value: BigNumber.from("100000000000000000") }
        )
      ).to.be.revertedWith("SimpleTradeFile: Wrong params")
    })
  })

  describe("#cancel", () => {
    it("should cancel bid", async () => {
      await factory.createStore()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        Date.now() + 1000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await expect(simpleTradeFile.cancel(1))
        .to.emit(simpleTradeFile, "DealCanceled")
        .withArgs(1, wallet.address)
    })

    it("fails if id not found", async () => {
      await factory.createStore()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        Date.now() + 1000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await expect(simpleTradeFile.cancel(1000)).to.revertedWith(
        "SimpleTradeFile: Id not found"
      )
    })

    it("fails if caller is not a seller", async () => {
      await factory.createStore()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        Date.now() + 1000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await expect(simpleTradeFile.connect(other).cancel(1)).to.revertedWith(
        "SimpleTradeFile: Caller is not a seller"
      )
    })
  })

  describe("#buy", () => {
    it("should buy", async () => {
      await factory.connect(other).createStore()

      await simpleTradeFile
        .connect(other)
        .create("NAME", "DESCRIPTION", 10000000000, Date.now() + 1000, "0x", {
          value: BigNumber.from("100000000000000000"),
        })

      await expect(
        simpleTradeFile.buy(1, {
          value: BigNumber.from("10000000000"),
        })
      )
        .to.emit(simpleTradeFile, "DealFinalized")
        .withArgs(1)
    })

    it("fails if seller buys", async () => {
      await factory.createStore()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        Date.now() + 1000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await expect(
        simpleTradeFile.buy(1, {
          value: BigNumber.from("10000000000"),
        })
      ).to.revertedWith("SimpleTradeFile: Seller cannot be a buyer")
    })

    it("fails if wrong deal id", async () => {
      await expect(
        simpleTradeFile.buy(1000, {
          value: BigNumber.from("10000000000"),
        })
      ).to.revertedWith("SimpleTradeFile: Id not found")
    })

    it("fails if deal canceled", async () => {
      await factory.createStore()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        Date.now() + 1000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await simpleTradeFile.cancel(1)

      await expect(
        simpleTradeFile.connect(other).buy(1, {
          value: BigNumber.from("10000000000"),
        })
      ).to.revertedWith("SimpleTradeFile: Wrong status")
    })

    it("fails if time is up", async () => {
      await factory.createStore()

      const ts = await time.latest()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await time.increase(time.duration.hours(1))

      await expect(
        simpleTradeFile.connect(other).buy(1, {
          value: BigNumber.from("10000000000"),
        })
      ).to.revertedWith("SimpleTradeFile: Time is up")
    })

    it("fails if amount is wrong", async () => {
      await factory.createStore()

      console.log("DATE JS: ", time.duration.hours(1))
      const ts = await time.latest()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await expect(
        simpleTradeFile.connect(other).buy(1, {
          value: BigNumber.from("100000000"),
        })
      ).to.revertedWith("SimpleTradeFile: Wrong amount")
    })

    it("fails if Current bid is less then previous bid", async () => {
      await factory.createStore()

      console.log("DATE JS: ", time.duration.hours(1))
      const ts = await time.latest()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await simpleTradeFile.connect(other).buy(1, {
        value: BigNumber.from("80000000000"),
      })

      await expect(
        simpleTradeFile.connect(buyer).buy(1, {
          value: BigNumber.from("60000000000"),
        })
      ).to.revertedWith(
        "SimpleTradeFile: Current bid cannot be less then previous bid"
      )
    })
  })

  describe("#finalize", () => {
    it("should finalize with no bids", async () => {
      await factory.createStore()

      console.log("DATE JS: ", time.duration.hours(1))
      const ts = await time.latest()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await time.increase(time.duration.hours(1))

      await expect(simpleTradeFile.finalize(1))
        .to.emit(simpleTradeFile, "DealClosed")
        .withArgs(1)
    })

    it("should finalize with bids", async () => {
      await factory.createStore()

      console.log("DATE JS: ", time.duration.hours(1))
      const ts = await time.latest()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await simpleTradeFile.connect(buyer).buy(1, {
        value: BigNumber.from("10000000000"),
      })

      await time.increase(time.duration.hours(1))

      await expect(simpleTradeFile.finalize(1))
        .to.emit(simpleTradeFile, "DealFinalized")
        .withArgs(1)

      expect(
        await simpleTradeFile["checkAccess(bytes,address)"]("0x", other.address)
      ).to.eq(1)
    })

    it("fails if auction is not open", async () => {
      await factory.createStore()
      const ts = await time.latest()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await simpleTradeFile.cancel(1)
      await time.increase(time.duration.hours(1))

      await expect(simpleTradeFile.finalize(1)).to.revertedWith(
        "SimpleTradeFile: Auction is not open"
      )
    })

    it("fails if id not found", async () => {
      await factory.createStore()
      const ts = await time.latest()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await expect(simpleTradeFile.finalize(100)).to.revertedWith(
        "SimpleTradeFile: Id not found"
      )
    })

    it("fails if date expire", async () => {
      await factory.createStore()
      const ts = await time.latest()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      //await time.increase(time.duration.days(10));

      await expect(simpleTradeFile.finalize(1)).to.revertedWith(
        "SimpleTradeFile: Date is not expire"
      )
    })
  })

  describe("#dispute", () => {
    it("should make dispute", async () => {
      await factory.createStore()

      const ts = await time.latest()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await simpleTradeFile.connect(other).buy(1, {
        value: BigNumber.from("10000000000"),
      })

      await time.increase(time.duration.hours(1))

      await simpleTradeFile.finalize(1)

      await expect(
        simpleTradeFile.connect(other).dispute(1, {
          value: BigNumber.from("100000000000000000"),
        })
      )
        .to.emit(simpleTradeFile, "DisputeCreated")
        .withArgs(1)
    })

    it("fails without finalize", async () => {
      await factory.createStore()

      const ts = await time.latest()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await simpleTradeFile.connect(other).buy(1, {
        value: BigNumber.from("10000000000"),
      })

      await time.increase(time.duration.hours(1))

      await expect(
        simpleTradeFile.connect(other).dispute(1, {
          value: BigNumber.from("100000000000000000"),
        })
      ).to.revertedWith("SimpleTradeFile: Wrong status")
    })

    it("fails if id not found", async () => {
      await expect(
        simpleTradeFile.dispute(1000, {
          value: BigNumber.from("100000000000000000"),
        })
      ).to.revertedWith("SimpleTradeFile: Id not found")
    })

    it("fails if caller is not a buyer", async () => {
      await factory.createStore()

      console.log("DATE JS: ", time.duration.hours(1))
      const ts = await time.latest()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await simpleTradeFile.connect(other).buy(1, {
        value: BigNumber.from("10000000000"),
      })

      await time.increase(time.duration.hours(1))

      await simpleTradeFile.finalize(1)

      await expect(
        simpleTradeFile.dispute(1, {
          value: BigNumber.from("100000000000000000"),
        })
      ).to.revertedWith("SimpleTradeFile: Caller is not a buyer")
    })

    it("fails if time for dispute is up", async () => {
      await factory.createStore()

      console.log("DATE JS: ", time.duration.hours(1))
      const ts = await time.latest()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await simpleTradeFile.connect(other).buy(1, {
        value: BigNumber.from("10000000000"),
      })

      await time.increase(time.duration.hours(1))

      await simpleTradeFile.finalize(1)
      await time.increase(time.duration.days(10))

      await expect(
        simpleTradeFile.connect(other).dispute(1, {
          value: BigNumber.from("100000000000000000"),
        })
      ).to.revertedWith("SimpleTradeFile: Time for dispute is up")
    })

    it("fails if collateral is wrong", async () => {
      await factory.createStore()

      const ts = await time.latest()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await simpleTradeFile.connect(other).buy(1, {
        value: BigNumber.from("10000000000"),
      })

      await time.increase(time.duration.hours(1))

      await simpleTradeFile.finalize(1)
      await expect(simpleTradeFile.connect(other).dispute(1)).to.revertedWith(
        "SimpleTradeFile: Wrong collateral"
      )
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
      const price = 10000000000
      const dateExpire = Date.now() + 1000
      const cid =
        "0x516d6264456d467533414b33674b6352504e6a576f3971646b74714772766a664d325a696577414e6b4855574d4b"
      const collateral = "100000000000000000"

      await simpleTradeFile.create(name, description, price, dateExpire, cid, {
        value: BigNumber.from(collateral),
      })

      const deal = await simpleTradeFile.getDeal(1)

      const coder = ethers.utils.defaultAbiCoder
      const data = coder.encode(
        [
          "tuple(uint256, string, string, uint256, uint256, uint256, address, address, uint256, bytes, uint256)",
        ],
        [
          [
            1,
            name,
            description,
            0,
            price,
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
      expect(deal._type).to.be.equal(1)
      expect(deal.data).to.be.equal(data)
      expect(deal.integration).to.be.equal(simpleTradeFile.address)
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
