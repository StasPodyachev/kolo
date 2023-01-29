import { Percent } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import BigDecimal from 'decimal.js-light'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const NetworkContextName = 'NETWORK'

// export const IS_IN_IFRAME = window.parent !== window

// 30 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 30
export const L2_DEADLINE_FROM_NOW = 60 * 5

// transaction popup dismisal amounts
export const DEFAULT_TXN_DISMISS_MS = 25000
export const L2_TXN_DISMISS_MS = 5000

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis JSBI.BigInt
const BIPS_BASE = JSBI.BigInt(10000)

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const BIG_DEC_1E18 = new BigDecimal('1000000000000000000')

export const BIG_1E8 = 100000000
export const BIG_1E16 = 10000000000000000
export const BIG_1E18 = 1000000000000000000
export const BIG_1E20 = 100000000000000000000
