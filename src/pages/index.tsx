import type { NextPage } from 'next'
import { Product, useMarketplace } from '../hooks/useMarketplace'
import { useEffect, useState } from 'react'
import { Badge, Button, Card, Group, Image, SimpleGrid, Text } from '@mantine/core'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { IconMapPin } from '@tabler/icons'

const Home: NextPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const { getProducts } = useMarketplace({ env: 'testnet' })

  useEffect(() => {
    getProducts().then((data) => setProducts(data ?? []))
  }, [])

  return products.length ? (
    <SimpleGrid
      breakpoints={[
        { minWidth: 980, cols: 4, spacing: 'md' },
        { maxWidth: 755, cols: 2, spacing: 'sm' },
        { maxWidth: 600, cols: 1, spacing: 'sm' },
      ]}
    >
      {products.map((product) => (
        <Card key={product.id} shadow="sm" p="lg" radius="md" withBorder>
          <Card.Section>
            <Image src={product.image} height={160} alt="Norway" />
          </Card.Section>

          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>{product.name}</Text>
            <Badge color="red" variant="light">
              {formatNearAmount(product.sold.toString(), 2)} SOLD
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

          <Button variant="gradient" color="blue" fullWidth mt="md" radius="md">
            Buy for {formatNearAmount(product.price.toString(), 2)} NEAR
          </Button>
        </Card>
      ))}
    </SimpleGrid>
  ) : (
    <Text size={36} align="center">
      Connect your wallet
    </Text>
  )
}

export default Home
