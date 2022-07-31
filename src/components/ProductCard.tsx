import React from 'react'
import { Badge, Button, Card, Group, Image, Text } from '@mantine/core'
import { IconMapPin } from '@tabler/icons'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { Product } from '../hooks/marketplace/useMarketplace'
import { useWallet } from '../hooks/useWallet'

interface ProductCardProps {
  product: Product
  onBuy: (product: Product) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuy }) => {
  const { account } = useWallet()

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={product.image} height={160} alt="Norway" />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{product.name}</Text>
        <Badge color="red" variant="light">
          {product.sold} SOLD
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        {product.description}
      </Text>

      <Group position="apart" mt="md" mb="xs">
        <Text size="sm" weight="bold">
          by {product.owner}
        </Text>
        <Group spacing={4}>
          <IconMapPin size={15} />
          <Text align="end" size="xs">
            {product.location}
          </Text>
        </Group>
      </Group>

      {account?.accountId !== product.owner && (
        <Button
          variant="gradient"
          color="blue"
          fullWidth
          mt="md"
          radius="md"
          onClick={() => onBuy(product)}
        >
          Buy for {formatNearAmount(product.price.toString(), 2)} NEAR
        </Button>
      )}
    </Card>
  )
}

export default ProductCard
