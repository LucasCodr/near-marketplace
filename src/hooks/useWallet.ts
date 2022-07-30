import { connect, keyStores, Near, WalletConnection } from 'near-api-js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import environment from '../utils/config'
import { formatNearAmount } from 'near-api-js/lib/utils/format'

interface UseWalletProps {
  env: 'mainnet' | 'testnet'
}

export const useWallet = ({ env }: UseWalletProps) => {
  const [near, setNear] = useState<Near | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  const nearEnv = environment(env)

  useEffect(() => {
    if (near) return

    connect(
      Object.assign(nearEnv, {
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      })
    ).then((data) => setNear(data))
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

  const login = () =>
    walletConnection()?.requestSignIn({ contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME })

  const signOut = () => {
    walletConnection()?.signOut()
    window.location.reload()
  }

  return {
    account,
    balance,
    login,
    signOut,
    nearEnv,
  }
}
