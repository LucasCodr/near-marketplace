import type { ConnectConfig } from 'near-api-js'

export const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME as string

function environment(env: 'mainnet' | 'testnet'): ConnectConfig {
  switch (env) {
    case 'mainnet':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        headers: {},
      }
    case 'testnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        headers: {},
      }
    default:
      throw Error(`Unknown environment '${env}'.`)
  }
}

export default environment
