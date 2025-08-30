import type { NextPage } from 'next'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Layout } from '../src/layouts/MainLayout'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { LOGIN_MUTATION, LoginResponse, LoginVariables } from '../src/graphql/auth'

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const boxBg = useColorModeValue('white', 'gray.800')
  const boxShadow = useColorModeValue('lg', 'dark-lg')

  const [login, { loading }] = useMutation<LoginResponse, LoginVariables>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data?.login.success) {
        localStorage.setItem('token', data.login.token)
        toast({
          title: "ログイン成功",
          description: data.login.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        router.push('/')
      } else {
        toast({
          title: "ログイン失敗",
          description: data?.login.message || "ログインに失敗しました",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    },
    onError: (error) => {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({
        variables: {
          username: email,
          password: password
        }
      })
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <Layout>
      <Box bg={bgColor} minH="calc(100vh - 64px)" py={20}>
        <Container maxW="lg">
          <VStack spacing={8}>
            <VStack spacing={2} textAlign="center">
              <Heading fontSize={{ base: '2xl', md: '3xl' }}>
                アカウントにログイン
              </Heading>
              <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.500">
                投資アプリへようこそ！ログインしてサービスをご利用ください。
              </Text>
            </VStack>

            <Box
              as="form"
              onSubmit={handleSubmit}
              w="full"
              bg={boxBg}
              boxShadow={boxShadow}
              rounded="lg"
              p={{ base: 6, md: 8 }}
            >
              <VStack spacing={4}>
                <FormControl id="email" isRequired>
                  <FormLabel>メールアドレス</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </FormControl>

                <FormControl id="password" isRequired>
                  <FormLabel>パスワード</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  fontSize="md"
                  isLoading={loading}
                  w="full"
                >
                  ログイン
                </Button>

                <Text fontSize="sm" color="gray.500" textAlign="center">
                  テストアカウント：<br />
                  Email: test@example.com<br />
                  Password: password
                </Text>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>
    </Layout>
  )
}

export default LoginPage
