import type { NextPage } from 'next'
import { SimpleGrid, Text } from '@mantine/core'
import { useGetProducts } from '../hooks/marketplace/useGetProducts'
import { useWallet } from '../hooks/useWallet'
import ProductCard from '../components/ProductCard'
import { useState } from 'react'
import { Product } from '../hooks/marketplace/useMarketplace'
import dynamic from 'next/dynamic'

const BuyProduct = dynamic(() => import('../components/BuyProduct'), {
  ssr: false,
})

const Home: NextPage = () => {
  const { account } = useWallet()

  const [product, setProduct] = useState<Product | undefined>()

  const { data } = useGetProducts({
    enabled: true,
    staleTime: Infinity,
  })

  return (
    <>
      <BuyProduct product={product} isOpen={!!product} onClose={() => setProduct(undefined)} />
      {!!data?.length && (
        <SimpleGrid
          breakpoints={[
            { minWidth: 1220, cols: 4, spacing: 'md' },
            { minWidth: 980, cols: 3, spacing: 'md' },
            { minWidth: 755, cols: 2, spacing: 'sm' },
            { minWidth: 600, cols: 1, spacing: 'sm' },
          ]}
        >
          {data.map((product) => (
            <ProductCard product={product} key={product.id} onBuy={setProduct} />
          ))}
        </SimpleGrid>
      )}

      {!account?.accountId && <Text align="center">Connect your wallet!</Text>}
    </>
  )
}

export default Home
