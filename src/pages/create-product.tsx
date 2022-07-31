import { NextPage } from 'next'
import {
  Button,
  Center,
  createStyles,
  Group,
  NumberInput,
  Stack,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { Product, useMarketplace } from '../hooks/marketplace/useMarketplace'
import { useMutation } from '@tanstack/react-query'
import { useGetProducts } from '../hooks/marketplace/useGetProducts'
import { hideNotification, showNotification } from '@mantine/notifications'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { v4 as uuid4 } from 'uuid'

const useStyles = createStyles({
  form: {
    maxWidth: '440px',
    width: '100%',
  },
})

const CreateProduct: NextPage = () => {
  const { classes } = useStyles()

  const { refetch } = useGetProducts({})

  const { contract } = useMarketplace()

  const form = useForm<Product>({
    initialValues: {
      name: '',
      image: '',
      description: '',
      location: '',
      price: 0,
    },
    validate: {
      image: (value) => {
        if (!value.match(/^(http|https):\/\//)) {
          return 'Invalid URL'
        }
      },
      price: (value) => {
        // check if value is a number
        if (isNaN(Number(value))) {
          return 'Invalid price'
        }
      },
    },
  })

  const mutation = useMutation(
    async (newProduct: Product) => {
      const product = Object.assign(newProduct, {
        id: uuid4(),
        price: parseNearAmount(newProduct.price.toString()),
      })

      return contract?.setProduct({ product })
    },
    {
      async onSuccess() {
        await refetch()

        form.reset()

        hideNotification('creating-product')

        showNotification({
          title: 'Success!',
          message: 'Product created!',
          color: 'green',
        })
      },
      onMutate(newProduct) {
        showNotification({
          autoClose: false,
          loading: true,
          disallowClose: true,
          title: 'Creating product...',
          message: `Product ${newProduct.name} is being created...`,
          id: 'creating-product',
        })
      },
      async onError() {
        showNotification({
          color: 'red',
          title: 'Default notification',
          message: 'Hey there, your code is awesome! 🤥',
        })
      },
    }
  )

  return (
    <Center p="xl">
      <form
        onSubmit={form.onSubmit((values) => {
          mutation.mutate(values)
        })}
        className={classes.form}
      >
        <Title>New Product</Title>

        <Stack>
          <TextInput
            required
            label="Food Name"
            placeholder="Pizza"
            {...form.getInputProps('name')}
            disabled={mutation.isLoading}
          />

          <TextInput
            required
            label="Image URL"
            {...form.getInputProps('image')}
            disabled={mutation.isLoading}
          />

          <Textarea
            required
            label="Description"
            {...form.getInputProps('description')}
            disabled={mutation.isLoading}
            autosize
          />

          <TextInput
            required
            label="Location"
            {...form.getInputProps('location')}
            disabled={mutation.isLoading}
          />

          <NumberInput
            min={0}
            precision={2}
            placeholder="1"
            label="NEAR Price"
            required
            {...form.getInputProps('price')}
            disabled={mutation.isLoading}
          />

          <Group position="right" mt="md">
            <Button type="submit" disabled={mutation.isLoading}>
              Submit
            </Button>
          </Group>
        </Stack>
      </form>
    </Center>
  )
}

export default CreateProduct
