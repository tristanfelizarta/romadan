import { mode } from '@chakra-ui/theme-tools'

const Popover = {
    baseStyle: (props) => ({
        content: {
            bg: mode('white', 'surface')(props),
            overflow: 'hidden',
            border: 'none',
            borderRadius: 12,
            boxShadow: mode('sm', 'dark-xl')(props)
        },
        header: {
            borderBottomWidth: 0,
            px: 6,
            pt: 6,
            pb: 0,
            fontWeight: 'semibold',
            color: 'accent-1'
        },
        closeButton: {
            top: 3,
            right: 3,
            _hover: {
                bg: 'canvas-1'
            },
            _active: {
                bg: 'canvas-1'
            }
        },
        body: {
            p: 6
        },
        footer: {
            borderTopWidth: 0,
            px: 6,
            pt: 0,
            pb: 6
        }
    })
}

export default Popover
