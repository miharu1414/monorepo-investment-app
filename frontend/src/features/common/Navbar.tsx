import { Box, Flex, Button, useColorModeValue, Stack, useColorMode, Container, Link } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

export const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const router = useRouter()
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <Box 
      bg={bg} 
      px={4} 
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={borderColor}
      position="fixed"
      width="100%"
      top={0}
      zIndex={1000}
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box fontWeight="bold">
            <NextLink href="/" passHref>
              Investment App
            </NextLink>
          </Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              {isLoggedIn ? (
                <>
                  <NextLink href="/todos" passHref>
                    <Button variant="ghost">
                      TODO一覧
                    </Button>
                  </NextLink>
                  <NextLink href="/dashboard" passHref>
                    <Button variant="ghost">
                      ダッシュボード
                    </Button>
                  </NextLink>
                  <Button variant="ghost" onClick={handleLogout}>
                    ログアウト
                  </Button>
                </>
              ) : (
                <>
                  <NextLink href="/login" passHref>
                    <Button variant="ghost">
                      ログイン
                    </Button>
                  </NextLink>
                  <NextLink href="/register" passHref>
                    <Button variant="ghost">
                      新規登録
                    </Button>
                  </NextLink>
                </>
              )}
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
