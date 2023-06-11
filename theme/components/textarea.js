const Textarea = {
    baseStyle: {
        fontWeight: 'medium',
        color: 'accent-1',
        _placeholder: {
            color: 'accent-3'
        }
    },
    variants: {
        filled: {
            bg: 'canvas-2',
            _hover: {
                bg: 'canvas-2'
            },
            _focus: {
                bg: 'canvas-2',
                borderColor: 'transparent'
            },
            _invalid: {
                borderColor: 'red.default',
                boxShadow: 'none'
            }
        },
        outline: {
            borderColor: 'border',
            _hover: {
                borderColor: 'border'
            },
            _focus: {
                borderColor: 'border',
                boxShadow: 'none'
            }
        }
    },
    sizes: {
        xs: {
            borderRadius: 12,
            p: 3,
            h: '32px'
        },
        sm: {
            borderRadius: 12,
            p: 3,
            h: '36px',
            fontSize: 'xs'
        },
        md: {
            borderRadius: 12,
            p: 3,
            fontSize: 'sm'
        },
        lg: {
            borderRadius: 12,
            p: 3,
            h: '44px',
            fontSize: 'sm'
        },
        xl: {
            borderRadius: 12,
            p: 3,
            h: 12,
            fontSize: 'md'
        }
    },
    defaultProps: {
        variant: 'filled'
    }
}

export default Textarea
