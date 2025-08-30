import { Box } from '@chakra-ui/react'
import { Navbar } from '../features/common/Navbar'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <Box pt="64px">  {/* NavbarのHeight + padding */}
        {children}
      </Box>
    </>
  )
}
