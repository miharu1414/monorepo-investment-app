'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { CacheProvider } from '@chakra-ui/next-js'
import { ApolloProvider } from '@apollo/client'
import { client } from '../lib/apollo-client'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider>
        <ApolloProvider client={client}>
          {children}
        </ApolloProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}
