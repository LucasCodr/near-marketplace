import React from 'react'
import { Navbar, NavLink, Stack } from '@mantine/core'
import { IconEdit, IconHome } from '@tabler/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useWallet } from '../hooks/useWallet'

const AppSidebar: React.FC = () => {
  const router = useRouter()
  const { account } = useWallet()

  return (
    <Navbar width={{ base: 300 }} p="xs">
      <Stack spacing="xs">
        <Link href="/" passHref>
          <NavLink
            component="a"
            label="Home"
            icon={<IconHome size={22} />}
            active={router.pathname === '/'}
          />
        </Link>

        {account?.accountId && (
          <Link href="/create-product" passHref>
            <NavLink
              component="a"
              label="Create Product"
              icon={<IconEdit size={22} />}
              active={router.pathname === '/create-product'}
            />
          </Link>
        )}
      </Stack>
    </Navbar>
  )
}

export default AppSidebar
