import { mode } from '@chakra-ui/theme-tools'

const Menu = {
    baseStyle: (props) => ({
        list: {
            bg: mode('white', 'surface')(props),
            overflow: 'hidden',
            border: 'none',
            borderRadius: 12,
            boxShadow: mode('sm', 'dark-xl')(props),
            p: 2,
            minW: 200
        },
        item: {
            borderRadius: 8,
            p: 2,
            fontSize: 'sm',
            fontWeight: 'medium',
            color: 'accent-2',
            _hover: {
                bg: 'canvas-1'
            },
            _focus: {
                bg: 'transparent'
            }
        },
        divider: {
            opacity: 1,
            borderColor: 'border',
            mx: -2,
            my: 2
        }
    })
}

export default Menu
