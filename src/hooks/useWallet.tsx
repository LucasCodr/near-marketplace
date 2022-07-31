import {
  connect,
  ConnectConfig,
  ConnectedWalletAccount,
  keyStores,
  Near,
  WalletConnection,
} from 'near-api-js'
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import environment, { CONTRACT_NAME } from '../utils/config'
import { formatNearAmount } from 'near-api-js/lib/utils/format'

type UseWalletContextData = {
  account?: ConnectedWalletAccount
  balance: string | null
  login: () => Promise<void> | undefined
  signOut: () => void
  nearEnv: ConnectConfig
}

type UseWalletProps = {
  children: ReactNode
}

const UseWalletContext = createContext({} as UseWalletContextData)

export const UseWalletProvider = ({ children }: UseWalletProps) => {
  const [near, setNear] = useState<Near | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  const nearEnv = environment('testnet')

  useEffect(() => {
    if (near) return

    connect(
      Object.assign(nearEnv, {
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      })
    ).then(setNear)
  }, [setNear, nearEnv, near])

  const walletConnection = useCallback(() => {
    return near && new WalletConnection(near, 'my-app')
  }, [near])

  const account = useMemo(() => {
    return walletConnection()?.account()
  }, [walletConnection])

  useEffect(() => {
    ;(async () => {
      if (!account?.accountId) return

      const response = await walletConnection()?.account().getAccountBalance()

      if (!response) return

      return setBalance(formatNearAmount(response.total, 2))
    })()
  }, [walletConnection, account?.accountId, setBalance])

  const login = useCallback(
    () => walletConnection()?.requestSignIn({ contractId: CONTRACT_NAME }),
    [walletConnection]
  )

  const signOut = useCallback(() => {
    walletConnection()?.signOut()
    window.location.reload()
  }, [walletConnection])

  const data = useMemo(
    (): UseWalletContextData => ({
      account,
      balance,
      nearEnv,
      login,
      signOut,
    }),
    [account, balance, login, signOut, nearEnv]
  )

  return <UseWalletContext.Provider value={data}>{children}</UseWalletContext.Provider>
}

export const useWallet = () => {
  const context = useContext(UseWalletContext)

  if (!context) throw new Error('useWallet must be inside UseWalletProvider')

  return context
}
