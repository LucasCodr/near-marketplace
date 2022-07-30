import React from 'react'
import { ActionIcon, createStyles, Header, Title, useMantineColorScheme } from '@mantine/core'
import { IconMoonStars, IconSun } from '@tabler/icons'

const useStyles = createStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

const AppHeader: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'

  const { classes } = useStyles()

  return (
    <Header height={70} p="xs" className={classes.header}>
      <Title order={2}>NEAR Marketplace</Title>
      <ActionIcon
        variant="outline"
        color={dark ? 'yellow' : 'blue'}
        onClick={() => toggleColorScheme()}
        title="Toggle color scheme"
      >
        {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
      </ActionIcon>
    </Header>
  )
}

export default AppHeader
