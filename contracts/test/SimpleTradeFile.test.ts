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
    ; ({ simpleTradeFile, factory, chat } = await loadFixture(async () => {
      const { simpleTradeFile, factory, chat } = await simpleTradeFileFixture()

      return { simpleTradeFile, factory, chat }
    }))
  })

  describe("#setters", () => {
    it("setServiceFee", async () => {
      await expect(simpleTradeFile.setServiceFee(111111111)).to.be.not.reverted;
      await expect(simpleTradeFile.connect(other).setServiceFee(111111111)).to.be.reverted;
    })

    it("setPeriodDispute", async () => {
      await expect(simpleTradeFile.setPeriodDispute(111111111)).to.be.not.reverted;
      await expect(simpleTradeFile.connect(other).setPeriodDispute(111111111)).to.be.reverted;

      const params = await simpleTradeFile.getIntegrationInfo()
      expect(params.periodDispute).to.eq(111111111)
    })

    it("setCollateralAmount", async () => {
      await expect(simpleTradeFile.setCollateralPercent(111111111)).to.be.not.reverted;
      await expect(simpleTradeFile.connect(other).setCollateralPercent(111111111)).to.be.reverted;

      const params = await simpleTradeFile.getIntegrationInfo()
      expect(params.collateralPercent).to.eq(111111111)
    })

    it("setCollateralAmount", async () => {
      await expect(simpleTradeFile.setCollateralAmount(111111111)).to.be.not.reverted;
      await expect(simpleTradeFile.connect(other).setCollateralAmount(111111111)).to.be.reverted;

      const params = await simpleTradeFile.getIntegrationInfo()
      expect(params.collateralAmount).to.eq(111111111)
    })
  })

  describe("#create", () => {
    it("should create deal", async () => {
      await factory.createStore()
      const storeAddress = await factory["getStore(address)"](wallet.address)

      const oldBalance = (await wallet.getBalance()).toString()
      const collateral = BigNumber.from("100000000000000000")

      const tx = await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        Date.now() + 1000,
        "0x",
        { value: collateral }
      )
      await expect(tx)
        .to.emit(simpleTradeFile, "DealCreated")
        .withArgs(1, wallet.address)

      const txRec = await tx.wait()
      const gas = txRec.gasUsed.mul(txRec.effectiveGasPrice)
      const newBalance = (await wallet.getBalance()).toString()

      expect(collateral.add(newBalance).add(gas)).to.eq(oldBalance)

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

      const collateral = BigNumber.from("100000000000000000")
      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        100000000000,
        Date.now() + 1000,
        "0x",
        {
          value: collateral,
        }
      )

      const oldBalance = (await wallet.getBalance()).toString()

      const tx = await simpleTradeFile.cancel(1);
      await expect(tx)
        .to.emit(simpleTradeFile, "DealCanceled")
        .withArgs(1, wallet.address)

      let txRec = await tx.wait()
      let gas = txRec.gasUsed.mul(txRec.effectiveGasPrice)
      const newBalanceWallet = (await wallet.getBalance()).toString()

      expect(collateral.add(oldBalance).sub(gas)).to.eq(newBalanceWallet)
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

      const price = BigNumber.from("10000000000")

      await simpleTradeFile
        .connect(other)
        .create("NAME", "DESCRIPTION", price, Date.now() + 1000, "0x", {
          value: BigNumber.from("100000000000000000"),
        })

      const oldBalanceWallet = (await wallet.getBalance()).toString()
      const tx = await simpleTradeFile.buy(1, {
        value: price,
      });

      await expect(tx)
        .to.emit(simpleTradeFile, "DealFinalized")
        .withArgs(1)

      let txRec = await tx.wait()
      let gas = txRec.gasUsed.mul(txRec.effectiveGasPrice)
      const newBalanceWallet = (await wallet.getBalance()).toString()

      expect(price.add(newBalanceWallet).add(gas)).to.eq(oldBalanceWallet)

      expect(
        await simpleTradeFile["checkAccess(bytes,address)"]("0x", wallet.address)
      ).to.eq(1)
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
      ).to.revertedWith("SimpleTradeFile: Wrong msg.value")
    })

  })

  describe("#receiveReward", () => {
    it("should receiveReward without buyer", async () => {
      await factory.createStore()

      const ts = await time.latest()
      const price = 100000000000
      const collateral = BigNumber.from("100000000000000000")

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        price,
        ts + 2000,
        "0x",
        {
          value: collateral
        }
      )

      await time.increase(time.duration.hours(1))

      const oldBalance = (await wallet.getBalance()).toString()

      const tx = await simpleTradeFile.receiveReward(1)
      await expect(tx)
        .to.emit(simpleTradeFile, "DealClosed")
        .withArgs(1)

      const txRec = await tx.wait()
      const gas = txRec.gasUsed.mul(txRec.effectiveGasPrice)
      const newBalance = (await wallet.getBalance()).toString()

      expect(collateral.add(oldBalance).sub(gas)).to.eq(newBalance)
    })

    it("should receiveReward with buyer", async () => {
      await factory.createStore()

      const ts = await time.latest()
      const price = 100000000000
      const collateral = BigNumber.from("100000000000000000")
      const fee = BigNumber.from("2000000000")

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        price,
        ts + 2000,
        "0x",
        {
          value: collateral
        }
      )

      await simpleTradeFile.connect(buyer).buy(1, {
        value: price,
      })

      await time.increase(time.duration.days(10))

      const oldBalance = (await wallet.getBalance()).toString()

      const tx = await simpleTradeFile.receiveReward(1)
      await expect(tx)
        .to.emit(simpleTradeFile, "DealClosed")
        .withArgs(1)

      const txRec = await tx.wait()
      const gas = txRec.gasUsed.mul(txRec.effectiveGasPrice)
      const newBalance = (await wallet.getBalance()).toString()

      expect(collateral.add(oldBalance).add(price).sub(gas).sub(fee)).to.eq(newBalance)

      expect(
        await simpleTradeFile["checkAccess(bytes,address)"]("0x", buyer.address)
      ).to.eq(1)
    })

    it("fails if trade is not open", async () => {
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

      await expect(simpleTradeFile.receiveReward(1)).to.revertedWith(
        "SimpleTradeFile: Error"
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

      await expect(simpleTradeFile.receiveReward(100)).to.revertedWith(
        "SimpleTradeFile: Id not found"
      )
    })

    it("fails if period for dispute yet", async () => {
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
        value: 100000000000,
      })

      await expect(simpleTradeFile.receiveReward(1)).to.revertedWith(
        "SimpleTradeFile: Error"
      )
    })
  })

  describe("#dispute", () => {
    it("should make dispute", async () => {
      await factory.createStore()

      const ts = await time.latest()
      const price = 100000000000
      const collateral = BigNumber.from("100000000000000000")

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        price,
        ts + 2000,
        "0x",
        {
          value: collateral
        }
      )

      await simpleTradeFile.connect(other).buy(1, {
        value: price,
      })

      await time.increase(time.duration.hours(1))

      const oldBalance = (await other.getBalance()).toString()

      const tx = await simpleTradeFile.connect(other).dispute(1, {
        value: collateral,
      })

      await expect(tx)
        .to.emit(simpleTradeFile, "DisputeCreated")
        .withArgs(1)

      const txRec = await tx.wait()
      const gas = txRec.gasUsed.mul(txRec.effectiveGasPrice)
      const newBalance = (await other.getBalance()).toString()

      expect(collateral.add(newBalance).add(gas)).to.eq(oldBalance)
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

      const price = 100000000000
      const ts = await time.latest()

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        price,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await simpleTradeFile.connect(other).buy(1, {
        value: price,
      })

      await expect(
        simpleTradeFile.dispute(1, {
          value: BigNumber.from("100000000000000000"),
        })
      ).to.revertedWith("SimpleTradeFile: Caller is not a buyer")
    })

    it("fails if time for dispute is up", async () => {
      await factory.createStore()

      const ts = await time.latest()
      const price = 100000000000

      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        price,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await simpleTradeFile.connect(other).buy(1, {
        value: price,
      })


      await time.increase(time.duration.days(10));

      await expect(
        simpleTradeFile.connect(other).dispute(1, {
          value: BigNumber.from("100000000000000000"),
        })
      ).to.revertedWith("SimpleTradeFile: Time for dispute is up")
    })

    it("fails if collateral is wrong", async () => {
      await factory.createStore()

      const ts = await time.latest()

      const price = 100000000000
      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        price,
        ts + 2000,
        "0x",
        {
          value: BigNumber.from("100000000000000000"),
        }
      )

      await simpleTradeFile.connect(other).buy(1, {
        value: price
      })

      await expect(simpleTradeFile.connect(other).dispute(1)).to.revertedWith(
        "SimpleTradeFile: Wrong collateral"
      )
    })
  })

  describe("#sendMessage", () => {
    it("should send message", async () => {
      await factory.createStore()

      const ts = await time.latest()

      const collateral = BigNumber.from("100000000000000000")
      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        ts + 2000,
        "0x",
        {
          value: collateral,
        }
      )
      await simpleTradeFile.sendMessage(1, "Hello!")
      const param = await chat.getChat(1)
      expect(param.length).eq(2)
      expect(param[1].message).eq("Hello!")
      expect(param[1].sender).eq(wallet.address)
    })

    it("fails if status cancel", async () => {
      await factory.createStore()

      const ts = await time.latest()

      const collateral = BigNumber.from("100000000000000000")
      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        ts + 2000,
        "0x",
        {
          value: collateral,
        }
      )

      await simpleTradeFile.cancel(1)
      await expect(simpleTradeFile.sendMessage(1, "Hello!")).to.be.revertedWith("SimpleTradeFile: Wrong status")
    })

    it("fails if status close", async () => {
      await factory.createStore()

      const ts = await time.latest()

      const collateral = BigNumber.from("100000000000000000")
      await simpleTradeFile.create(
        "NAME",
        "DESCRIPTION",
        10000000000,
        ts + 2000,
        "0x",
        {
          value: collateral,
        }
      )

      await time.increase(time.duration.hours(1))
      await simpleTradeFile.receiveReward(1)
      await expect(simpleTradeFile.sendMessage(1, "Hello!")).to.be.revertedWith("SimpleTradeFile: Wrong status")
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

      const res = await simpleTradeFile["checkAccess(bytes32[],uint8,address)"](
        [
          "0x516d6264456d467533414b33674b6352504e6a576f3971646b74714772766a66",
          "0x4d325a696577414e6b4855574d4b000000000000000000000000000000000000",
        ],
        46,
        wallet.address
      )

      expect(0).to.be.eq(res)

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
