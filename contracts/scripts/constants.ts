import { BigNumber } from "ethers"

export const BIG_1E18 = BigNumber.from("1000000000000000000")
export const BIG_1E6 = BigNumber.from(1e6)

export const deployNames: any = {
  FACTORY: "Factory",
  AUCTION_FILE: "AuctionFile",
  SIMPLE_TRADE_FILE: "SimpleTradeFile",
  NOTARY: "Notary",
  CHAT: "Chat",
  TREASURY: "Treasury",
  GOVERNOR: "GovernorContract",
  TIME_LOCK: "TimeLock",
  KOLO_TOKEN: "KoloToken",
  MOCK_EXCHANGE: "MockExchange",
}
