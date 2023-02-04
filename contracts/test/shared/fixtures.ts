import { Factory } from "../../typechain/Factory"
import { Store } from "../../typechain/Store"
import { Notary } from "../../typechain/Notary"
import { Chat } from "../../typechain/Chat"
import { Treasury } from "../../typechain/Treasury"
import { AuctionFile } from "../../typechain/AuctionFile"
import { SimpleTradeFile } from "../../typechain/SimpleTradeFile"

import { ethers } from "hardhat"
import { KoloToken } from "../../typechain"

interface FactoryFixture {
  factory: Factory
}

interface StoreFixture {
  createStore(): Promise<Store>
}

interface NotaryFixture {
  notary: Notary
}

interface KoloTokenFixture {
  koloToken: KoloToken
}

interface ChatFixture {
  chat: Chat
}

interface TreasuryFixture {
  treasury: Treasury
}

interface IntegrationFixture {
  koloToken: KoloToken
  factory: Factory
  chat: Chat
}

interface AuctionFileFixture extends IntegrationFixture {
  auctionFile: AuctionFile
  notary: Notary
}

interface SimpleTradeFileFixture extends IntegrationFixture {
  simpleTradeFile: SimpleTradeFile
  notary: Notary
}

export async function factoryFixture(): Promise<FactoryFixture> {
  const factoryFactory = await ethers.getContractFactory("Factory")
  const factory = (await factoryFactory.deploy()) as Factory

  // const { chat } = await chatFixture(factory.address)
  // const { treasury } = await treasuryFixture(factory.address)

  // factory.setTreasury(treasury.address)
  // factory.setChat(chat.address)

  return { factory }
}

export async function storeFixture(factoryAddr: string): Promise<StoreFixture> {
  const StoreFactory = await ethers.getContractFactory("Store")
  const factory = (await ethers.getContractAt(
    "Factory",
    factoryAddr
  )) as Factory

  return {
    createStore: async () => {
      // const alpDeployer = (await AlpDeployerFactory.deploy()) as TestAlpDeployer

      const tx = await factory.createStore()
      const receipt = await tx.wait()
      const storeAddr = receipt.events?.[0].args?.store as string
      const store = StoreFactory.attach(storeAddr) as Store

      return store
    },
  }
}

export async function notaryFixture(
  factoryAddr: string
): Promise<NotaryFixture> {
  const notaryFactory = await ethers.getContractFactory("Notary")
  const notary = (await notaryFactory.deploy(factoryAddr)) as Notary

  return { notary }
}

export async function koloTokenFixture(): Promise<KoloTokenFixture> {
  const Factory = await ethers.getContractFactory("KoloToken")
  const koloToken = (await Factory.deploy()) as KoloToken

  return { koloToken }
}

export async function treasuryFixture(
  factoryAddr: string
): Promise<TreasuryFixture> {
  const factory = await ethers.getContractFactory("Treasury")
  const treasury = (await factory.deploy(factoryAddr)) as Treasury

  return { treasury }
}

export async function chatFixture(factoryAddr: string): Promise<ChatFixture> {
  const factory = await ethers.getContractFactory("Chat")
  const chat = (await factory.deploy(factoryAddr)) as Chat

  return { chat }
}

export async function auctionFileFixture(): Promise<AuctionFileFixture> {
  const { factory } = await factoryFixture()
  const { chat } = await chatFixture(factory.address)
  const { notary } = await notaryFixture(factory.address)
  const { koloToken } = await koloTokenFixture()

  const auctionFactory = await ethers.getContractFactory("AuctionFile")
  const auctionFile = (await auctionFactory.deploy(
    factory.address
  )) as AuctionFile

  await factory.setDaoToken(koloToken.address)
  await factory.registerIntegration(0, auctionFile.address)

  await auctionFile.setNotary(notary.address)
  await auctionFile.setChat(chat.address)

  return { auctionFile, factory, notary, chat, koloToken }
}

export async function simpleTradeFileFixture(): Promise<SimpleTradeFileFixture> {
  const { factory } = await factoryFixture()
  const { chat } = await chatFixture(factory.address)
  const { notary } = await notaryFixture(factory.address)
  const { koloToken } = await koloTokenFixture()

  const stFactory = await ethers.getContractFactory("SimpleTradeFile")
  const st = (await stFactory.deploy(factory.address)) as SimpleTradeFile

  await st.setNotary(notary.address)
  await st.setChat(chat.address)

  await factory.setDaoToken(koloToken.address)
  await factory.registerIntegration(0, st.address)

  return { simpleTradeFile: st, factory, notary, chat, koloToken }
}
