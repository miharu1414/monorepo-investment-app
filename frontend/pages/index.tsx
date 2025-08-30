'use client'

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiBarChart2, FiDatabase, FiLock } from 'react-icons/fi'
import { Layout } from '../src/layouts/MainLayout'
import NextLink from 'next/link'

const Feature = ({ title, text, icon }) => {
  return (
    <Stack align="center" textAlign="center">
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        color="white"
        rounded="full"
        bg="blue.500"
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color="gray.600">{text}</Text>
    </Stack>
  )
}

export default function Home() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const boxBg = useColorModeValue('white', 'gray.800')

  return (
    <Layout>
      <Box bg={bgColor}>
        {/* Hero Section */}
        <Container maxW="container.xl" py={20}>
          <Stack
            align="center"
            spacing={{ base: 8, md: 10 }}
            textAlign="center"
            mb={16}
          >
            <Heading
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
              lineHeight="110%"
            >
              あなたの投資を{' '}
              <Text as="span" color="blue.400">
                スマートに管理
              </Text>
            </Heading>
            <Text color="gray.500" maxW="3xl" fontSize={{ base: 'lg', md: 'xl' }}>
              最新のテクノロジーを活用して、投資ポートフォリオを簡単に管理。
              リアルタイムの市場データと高度な分析ツールで、より良い投資判断をサポートします。
            </Text>
            <Stack spacing={6} direction={{ base: 'column', sm: 'row' }}>
              <NextLink href="/login" passHref>
                <Button
                  rounded="full"
                  px={6}
                  size="lg"
                  colorScheme="blue"
                  bg="blue.400"
                  _hover={{ bg: 'blue.500' }}
                >
                  はじめる
                </Button>
              </NextLink>
              <Button rounded="full" px={6} size="lg">
                詳しく見る
              </Button>
            </Stack>
          </Stack>

          {/* Feature Section */}
          <Box py={20}>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={{ base: 10, md: 4 }}
              justify="center"
            >
              <Feature
                icon={<Icon as={FiBarChart2} w={10} h={10} />}
                title="ポートフォリオ分析"
                text="資産配分の最適化と運用パフォーマンスの可視化"
              />
              <Feature
                icon={<Icon as={FiDatabase} w={10} h={10} />}
                title="リアルタイムデータ"
                text="最新の市場データと詳細な銘柄情報にアクセス"
              />
              <Feature
                icon={<Icon as={FiLock} w={10} h={10} />}
                title="セキュアな管理"
                text="高度な暗号化技術で大切な資産情報を保護"
              />
            </Stack>
          </Box>
        </Container>
      </Box>
    </Layout>
  )
}
