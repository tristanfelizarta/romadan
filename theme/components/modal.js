import { mode } from '@chakra-ui/theme-tools'

const Modal = {
    baseStyle: (props) => ({
        dialog: {
            bg: mode('white', 'surface')(props),
            mx: 6,
            my: 24,
            borderRadius: 12,
            boxShadow: 'none'
        },
        overlay: {
            bg: 'hsla(0, 0%, 0%, 0.4)'
        },
        header: {
            borderBottom: '1px solid',
            borderColor: 'border',
            p: 6,
            color: 'accent-1'
        },
        closeButton: {
            top: 6,
            right: 6,
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
            px: 6,
            pt: 0,
            pb: 6
        }
    })
}

export default Modal
