import { useWallet } from './useWallet'
import { useCallback, useMemo } from 'react'
import { Contract } from 'near-api-js'
import { v4 as uuid4 } from 'uuid'
import { parseNearAmount } from 'near-api-js/lib/utils/format'

interface UseMarketplaceProps {
  env: 'mainnet' | 'testnet'
  gasPrice?: number
}

export interface Product {
  id: string
  name: string
  description: string
  image: string
  location: string
  price: number
  owner: string
  sold: number
}

type MarketplaceContract = Contract & {
  getProduct: (id: { id: string }) => Promise<Product | null>
  getProducts: () => Promise<Product[]>

  buyProduct: (productId: { productId: string }, gas?: number, price?: number) => Promise<void>
  setProduct: (product: { product: Product }) => Promise<void>
}

const GAS = 100000000000000

export const useMarketplace = ({ env, gasPrice }: UseMarketplaceProps) => {
  const { account } = useWallet({ env })

  const contract = useMemo(() => {
    if (!account?.accountId) return null

    return new Contract(account, process.env.NEXT_PUBLIC_CONTRACT_NAME as string, {
      viewMethods: ['getProduct', 'getProducts'],
      changeMethods: ['buyProduct', 'setProduct'],
    }) as MarketplaceContract
  }, [account])

  const createProduct = useCallback(
    (newProduct: Product) => {
      const product = Object.assign(newProduct, {
        id: uuid4(),
        price: parseNearAmount(newProduct.price.toString()),
      })

      return contract?.setProduct({ product })
    },
    [contract]
  )

  const getProducts = useCallback(async () => {
    return contract?.getProducts()
  }, [contract])

  const buyProduct = useCallback(
    (id: string, price: number) => {
      return contract?.buyProduct({ productId: id }, gasPrice || GAS, price)
    },
    [contract, gasPrice]
  )

  return {
    createProduct,
    getProducts,
    buyProduct,
  }
}
