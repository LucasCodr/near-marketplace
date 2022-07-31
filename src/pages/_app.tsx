import { AppProps } from 'next/app'
import Head from 'next/head'
import { AppShell, ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import AppHeader from '../components/AppHeader'
import { useHotkeys, useLocalStorage } from '@mantine/hooks'
import AppSidebar from '../components/AppSidebar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { UseWalletProvider } from '../hooks/useWallet'
import { NotificationsProvider } from '@mantine/notifications'

const queryClient = new QueryClient()

export default function App(props: AppProps) {
  const { Component, pageProps } = props
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  })

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  useHotkeys([['mod+J', () => toggleColorScheme()]])

  return (
    <>
      <Head>
        <title>NEAR Marketplace</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <UseWalletProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />
          <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
              <NotificationsProvider>
                <AppShell
                  padding="md"
                  header={<AppHeader />}
                  aside={<AppSidebar />}
                  styles={(theme) => ({
                    main: {
                      backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                    },
                  })}
                >
                  <Component {...pageProps} />
                </AppShell>
              </NotificationsProvider>
            </MantineProvider>
          </ColorSchemeProvider>
        </QueryClientProvider>
      </UseWalletProvider>
    </>
  )
}
