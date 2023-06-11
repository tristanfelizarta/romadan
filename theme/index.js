import { extendTheme } from '@chakra-ui/react'
import foundations from './foundations'
import components from './components'

const theme = extendTheme({
    ...foundations,
    components,
    config: {
        initialColorMode: 'light',
        cssVarPrefix: 'css'
    }
})

export default theme
