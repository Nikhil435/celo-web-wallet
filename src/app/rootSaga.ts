import { combineReducers, Reducer } from '@reduxjs/toolkit'
import { call, spawn } from 'redux-saga/effects'
import { connectToForno } from 'src/blockchain/provider'
import { config } from 'src/config'
import { exchangeTokenReducer, exchangeTokenSaga } from 'src/features/exchange/exchangeToken'
import { feedFetchPoller, fetchFeedReducer, fetchFeedSaga } from 'src/features/feed/fetch'
import { setPinReducer, setPinSaga } from 'src/features/pincode/pincode'
import { sendTokenReducer, sendTokenSaga } from 'src/features/send/sendToken'
import { createWalletReducer, createWalletSaga } from 'src/features/wallet/createWallet'
import { fetchBalancesReducer, fetchBalancesSaga } from 'src/features/wallet/fetchBalances'
import { importWallet, importWalletSaga } from 'src/features/wallet/importWallet'
import { loadWalletSaga } from 'src/features/wallet/storage'
import { SagaState } from 'src/utils/saga'

function* init() {
  yield call(connectToForno)
  if (config.defaultAccount) {
    yield call(importWallet, config.defaultAccount)
  }
}

// All regular sagas must be included here
const sagas = [importWalletSaga, loadWalletSaga, feedFetchPoller]

// All monitored sagas must be included here
export const monitoredSagas: {
  [name: string]: { saga: any; reducer: Reducer<SagaState> }
} = {
  createWallet: {
    saga: createWalletSaga,
    reducer: createWalletReducer,
  },
  fetchBalances: {
    saga: fetchBalancesSaga,
    reducer: fetchBalancesReducer,
  },
  sendToken: {
    saga: sendTokenSaga,
    reducer: sendTokenReducer,
  },
  fetchFeed: {
    saga: fetchFeedSaga,
    reducer: fetchFeedReducer,
  },
  exchangeToken: {
    saga: exchangeTokenSaga,
    reducer: exchangeTokenReducer,
  },
  setPin: {
    saga: setPinSaga,
    reducer: setPinReducer,
  },
}

// TODO This dynamic combination of reducers causes the typings to be lost,
// but if the reducers are listed manually, there's a circular definition causing errors.
export const monitoredSagaReducers = combineReducers(
  Object.keys(monitoredSagas).reduce(
    (acc: { [name: string]: Reducer<SagaState> }, sagaName: string) => {
      acc[sagaName] = monitoredSagas[sagaName].reducer
      return acc
    },
    {}
  )
)

export function* rootSaga() {
  yield spawn(init)
  for (const s of sagas) {
    yield spawn(s)
  }
  for (const m of Object.values(monitoredSagas)) {
    yield spawn(m.saga)
  }
}
