import { BigNumber } from 'ethers'
import { Balances } from 'src/features/balances/types'
import { Token } from 'src/tokens'
import { logger } from 'src/utils/logger'

export function areBalancesEmpty(balances: Balances) {
  let totalBalance = BigNumber.from(0)
  for (const tokenBalance of Object.values(balances.tokenAddrToValue)) {
    totalBalance = totalBalance.add(tokenBalance)
  }
  const { locked, pendingBlocked, pendingFree } = balances.lockedCelo
  totalBalance = totalBalance.add(locked).add(pendingBlocked).add(pendingFree)
  return totalBalance.eq(0)
}

// Does the balance have at least minValue of any token
export function hasMinTokenBalance(minValue: string, balances: Balances) {
  const minValueBn = BigNumber.from(minValue)
  for (const tokenBalance of Object.values(balances.tokenAddrToValue)) {
    if (minValueBn.lte(tokenBalance)) return true
  }
  return false
}

export function getTokenBalance(balances: Balances, token: Token) {
  if (!balances) throw new Error('No balances provided')
  if (!token) throw new Error('No token provided')
  const balance = balances.tokenAddrToValue[token.address]
  if (!balance) {
    logger.error('Cannot get balance for unknown token', token.symbol, token.address)
    return '0'
  }
  return balance
}