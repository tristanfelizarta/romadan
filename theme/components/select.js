const Select = {
    baseStyle: {
        field: {
            fontWeight: 'medium',
            color: 'accent-1',
            _placeholder: {
                color: 'accent-2'
            }
        }
    },
    variants: {
        filled: {
            field: {
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
            }
        },
        outline: {
            field: {
                borderColor: 'border',
                _hover: {
                    borderColor: 'border'
                },
                _focus: {
                    borderColor: 'border',
                    boxShadow: 'none'
                }
            }
        }
    },
    sizes: {
        xs: {
            field: {
                borderRadius: 12,
                pl: 3,
                h: '32px'
            }
        },
        sm: {
            field: {
                borderRadius: 12,
                pl: 3,
                h: '36px',
                fontSize: 'xs'
            }
        },
        md: {
            field: {
                borderRadius: 12,
                pl: 3,
                h: 10,
                fontSize: 'sm'
            }
        },
        lg: {
            field: {
                borderRadius: 12,
                pl: 3,
                h: '44px',
                fontSize: 'sm'
            }
        },
        xl: {
            field: {
                borderRadius: 12,
                pl: 3,
                h: 12,
                fontSize: 'md'
            }
        }
    },
    defaultProps: {
        variant: 'filled'
    }
}

export default Select
