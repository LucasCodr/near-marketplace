import { useWallet } from '../useWallet'
import { useMemo } from 'react'
import { Contract } from 'near-api-js'
import { CONTRACT_NAME } from '../../utils/config'

export interface Product {
  id?: string
  name: string
  description: string
  image: string
  location: string
  price: number
  owner?: string
  sold?: number
}

type MarketplaceContract = Contract & {
  getProduct: (id: { id: string }) => Promise<Product | null>
  getProducts: () => Promise<Product[]>

  buyProduct: (productId: { productId: string }, gas?: number, price?: string) => Promise<void>
  setProduct: (product: { product: Product }) => Promise<void>
}

export const useMarketplace = () => {
  const { account } = useWallet()

  const contract = useMemo(() => {
    if (!account?.accountId) return null

    return new Contract(account, CONTRACT_NAME, {
      viewMethods: ['getProduct', 'getProducts'],
      changeMethods: ['buyProduct', 'setProduct'],
    }) as MarketplaceContract
  }, [account])

  return {
    contract,
  }
}
