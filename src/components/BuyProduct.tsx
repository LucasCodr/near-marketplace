import React from 'react'
import { Product, useMarketplace } from '../hooks/marketplace/useMarketplace'
import { Button, Drawer, Image, Stack, Text, Textarea, TextInput } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { showNotification } from '@mantine/notifications'

interface BuyProductProps {
  product?: Product
  isOpen: boolean
  onClose: () => void
}

const BuyProduct: React.FC<BuyProductProps> = ({ product, isOpen, onClose }) => {
  const { contract } = useMarketplace()

  const mutation = useMutation(
    async () => {
      if (!product?.id) return

      contract?.buyProduct({ productId: product.id }, 100000000000000, product.price.toString())
    },
    {
      onMutate: () => {
        showNotification({
          title: 'Approve transaction...',
          message: 'Please approve the transaction on your wallet',
          loading: true,
        })
      },
    }
  )

  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      position="right"
      overlayBlur={5}
      title="Review"
      padding="xl"
      size="lg"
    >
      <Stack>
        <TextInput value={product?.name} disabled />

        <Textarea value={product?.description} disabled autosize />

        <TextInput value={product?.location} disabled />

        <Image src={product?.image} height={200} alt={product?.name} />

        <Text>You will pay {formatNearAmount(product?.price.toString() || '0', 2)} NEAR</Text>

        <Button onClick={() => mutation.mutate()}>Confirm</Button>
      </Stack>
    </Drawer>
  )
}

export default BuyProduct
