import { ChakraProvider } from '@chakra-ui/react'
import AppLayout from 'layouts'
import Fonts from './fonts'
import theme from 'theme'

const AppProvider = ({ children, authentication }) => {
    return (
        <>
            <Fonts />

            <ChakraProvider theme={theme}>
                <AppLayout authentication={authentication}>
                    {children}
                </AppLayout>
            </ChakraProvider>
        </>
    )
}

export default AppProvider
