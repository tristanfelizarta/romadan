const Checkbox = {
    baseStyle: {
        control: {
            transition: '.4s',
            _checked: {
                bg: 'brand.default',
                borderColor: 'brand.default',
                color: 'white',
                _hover: {
                    bg: 'brand.default',
                    borderColor: 'brand.default'
                }
            },
            _focus: {
                shadow: 'none'
            }
        }
    },
    variants: {
        filled: {
            control: {
                bg: 'canvas-3',
                borderColor: 'transparent',
                _checked: {
                    borderColor: 'transparent'
                }
            }
        },
        outline: {
            control: {
                bg: 'transparent',
                border: '1px solid',
                borderColor: 'border'
            }
        }
    },
    sizes: {
        sm: {
            control: {
                borderRadius: 4,
                h: 3,
                w: 3
            },
            label: {
                fontSize: 'xs'
            }
        },
        md: {
            control: {
                borderRadius: 4,
                h: 4,
                w: 4
            },
            label: {
                fontSize: 'sm'
            }
        },
        lg: {
            control: {
                borderRadius: 4,
                h: 5,
                w: 5
            },
            label: {
                fontSize: 'md'
            }
        }
    },
    defaultProps: {
        variant: 'filled'
    }
}

export default Checkbox
