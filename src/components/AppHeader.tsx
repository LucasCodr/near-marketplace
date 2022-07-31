import React from 'react'
import {
  ActionIcon,
  Avatar,
  Button,
  createStyles,
  Group,
  Header,
  Menu,
  Text,
  useMantineColorScheme,
} from '@mantine/core'
import { IconDoorExit, IconMoonStars, IconSun, IconWallet } from '@tabler/icons'
import { useWallet } from '../hooks/useWallet'

const useStyles = createStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    ':hover': {
      cursor: 'pointer',
    },
  },
})

const AppHeader: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'

  const { classes } = useStyles()

  const { login, signOut, account, balance } = useWallet()

  return (
    <Header height={70} p="md" className={classes.header}>
      <Text size={26} weight="bold" variant="gradient">
        NEAR Marketplace
      </Text>

      <Group>
        <ActionIcon
          variant="transparent"
          color={dark ? 'yellow' : 'dark'}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
          size="md"
        >
          {dark ? <IconSun /> : <IconMoonStars />}
        </ActionIcon>

        {account?.accountId ? (
          <Group spacing="xs">
            <Text>{account.accountId}</Text>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Avatar alt={account.accountId} radius="xl" className={classes.avatar} />
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Balance</Menu.Label>
                <Menu.Item closeMenuOnClick={false}>{balance} NEAR</Menu.Item>

                <Menu.Label>Application</Menu.Label>
                <Menu.Item color="red" icon={<IconDoorExit size={14} />} onClick={signOut}>
                  Sign out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        ) : (
          <Button variant="outline" leftIcon={<IconWallet />} onClick={login}>
            Connect Wallet
          </Button>
        )}
      </Group>
    </Header>
  )
}

export default AppHeader
