'use client'

import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'

export default function Home() {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={6} align="start">
        <Box>
          <Heading mb={2}>Investment App</Heading>
          <Text color="gray.600">Welcome to your investment dashboard</Text>
        </Box>
      </VStack>
    </Container>
  )
}
