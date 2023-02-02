import { Fixture, MockProvider } from "ethereum-waffle"
import { Factory } from "../../typechain/Factory"
import { Store } from "../../typechain/Store"
import { Notary } from "../../typechain/Notary"
import { Chat } from "../../typechain/Chat"
import { Treasury } from "../../typechain/Treasury"
import { AuctionFile } from "../../typechain/AuctionFile"
import { SimpleTradeFile } from "../../typechain/SimpleTradeFile"

import { ethers } from "hardhat"

interface FactoryFixture {
  factory: Factory
  chat: Chat
}

interface StoreFixture {
  store: Store
}

interface NotaryFixture {
  notary: Notary
}

interface ChatFixture {
  chat: Chat
}

interface TreasuryFixture {
  treasury: Treasury
}

interface AuctionFileFixture {
  auctionFile: AuctionFile
  factory: Factory
  notary: Notary
  chat: Chat
}

interface SimpleTradeFileFixture {
  simpleTradeFile: SimpleTradeFile
  factory: Factory
  notary: Notary
  chat: Chat
}

export async function factoryFixture(): Promise<FactoryFixture> {
  const factoryFactory = await ethers.getContractFactory("Factory")
  const factory = (await factoryFactory.deploy()) as Factory

  const { chat } = await chatFixture()
  const { treasury } = await treasuryFixture()

  factory.setTreasury(treasury.address)
  factory.setChat(chat.address)
  chat.setFactory(factory.address)

  return { factory, chat }
}

export async function storeFixture(): Promise<StoreFixture> {
  const factory = await ethers.getContractFactory("Store")
  const store = (await factory.deploy()) as Store

  return { store }
}

export async function notaryFixture(): Promise<NotaryFixture> {
  const notaryFactory = await ethers.getContractFactory("Notary")
  const notary = (await notaryFactory.deploy()) as Notary

  const { factory } = await factoryFixture()
  notary.setFactory(factory.address)

  return { notary }
}

export async function treasuryFixture(): Promise<TreasuryFixture> {
  const factory = await ethers.getContractFactory("Treasury")
  const treasury = (await factory.deploy()) as Treasury

  return { treasury }
}

export async function chatFixture(): Promise<ChatFixture> {

  const factory = await ethers.getContractFactory("Chat")
  const chat = (await factory.deploy()) as Chat

  return { chat }
}

export async function auctionFileFixture(): Promise<AuctionFileFixture> {
  const auctionFactory = await ethers.getContractFactory("AuctionFile")
  const auctionFile = (await auctionFactory.deploy()) as AuctionFile

  const { factory, chat } = await factoryFixture()
  auctionFile.setFactory(factory.address)

  const notaryFactory = await ethers.getContractFactory("Notary")
  const notary = (await notaryFactory.deploy()) as Notary
  notary.setFactory(factory.address)
  auctionFile.setNotary(notary.address)

  factory.registerIntegration(0, auctionFile.address);

  return { auctionFile, factory, notary, chat }
}

export async function simpleTradeFileFixture(): Promise<SimpleTradeFileFixture> {
  const stFactory = await ethers.getContractFactory("SimpleTradeFile")
  const st = (await stFactory.deploy()) as SimpleTradeFile

  const { factory, chat } = await factoryFixture()
  st.setFactory(factory.address)

  const notaryFactory = await ethers.getContractFactory("Notary")
  const notary = (await notaryFactory.deploy()) as Notary
  notary.setFactory(factory.address)
  st.setNotary(notary.address)

  factory.registerIntegration(0, st.address);

  return { simpleTradeFile: st, factory, notary, chat }
}
