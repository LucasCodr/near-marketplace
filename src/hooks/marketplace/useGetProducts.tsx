import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { Product, useMarketplace } from './useMarketplace'

interface UseGetProductsProps extends UseQueryOptions<Product[], any, Product[], any> {}

export const useGetProducts = ({ ...rest }: UseGetProductsProps) => {
  const { contract } = useMarketplace()

  return useQuery(['products', contract?.contractId], () => contract?.getProducts() ?? [], {
    ...rest,
  })
}
