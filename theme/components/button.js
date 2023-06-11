const Button = {
    baseStyle: {
        overflow: 'hidden',
        fontWeight: 'medium',
        lineHeight: 'inherit',
        transition: '.2s',
        _active: {
            transform: 'scale(.95)'
        }
    },
    variants: {
        filled: (props) => ({
            bg:
                props.colorScheme === 'default'
                    ? 'canvas-1'
                    : `${props.colorScheme}.default`,
            color: props.colorScheme === 'default' ? 'accent-1' : 'white',
            _hover: {
                bg:
                    props.colorScheme === 'default'
                        ? 'canvas-1'
                        : `${props.colorScheme}.default`,
                _disabled: {
                    bg:
                        props.colorScheme === 'default'
                            ? 'canvas-1'
                            : `${props.colorScheme}.default`
                }
            },
            _active: {
                bg:
                    props.colorScheme === 'default'
                        ? 'canvas-1'
                        : `${props.colorScheme}.default`
            }
        }),
        tinted: (props) => ({
            bg:
                props.colorScheme === 'default'
                    ? 'canvas-1'
                    : `${props.colorScheme}.alpha`,
            color:
                props.colorScheme === 'default'
                    ? 'accent-1'
                    : `${props.colorScheme}.default`
        }),
        outline: (props) => ({
            bg: 'transparent',
            borderColor:
                props.colorScheme === 'default'
                    ? 'border'
                    : `${props.colorScheme}.default`,
            color:
                props.colorScheme === 'default'
                    ? 'accent-1'
                    : `${props.colorScheme}.default`,
            _hover: {
                bg: 'transparent'
            },
            _active: {
                bg: 'transparent'
            }
        }),
        plain: (props) => ({
            bg: 'transparent',
            color:
                props.colorScheme === 'default'
                    ? 'accent-1'
                    : `${props.colorScheme}.default`
        }),
        ghost: (props) => ({
            bg: 'transparent',
            color: 'accent-1',
            _hover: {
                bg:
                    props.colorScheme === 'default'
                        ? 'canvas-1'
                        : `${props.colorScheme}.alpha`,
                color:
                    props.colorScheme === 'default'
                        ? 'accent-1'
                        : `${props.colorScheme}.default`
            },
            _active: {
                bg:
                    props.colorScheme === 'default'
                        ? 'canvas-1'
                        : `${props.colorScheme}.alpha`
            }
        })
    },
    sizes: {
        xs: {
            borderRadius: 12,
            px: 3,
            h: 8,
            minW: 8,
            fontSize: 'xs'
        },
        sm: {
            borderRadius: 12,
            px: 4,
            h: 9,
            minW: 9,
            fontSize: 'xs'
        },
        md: {
            borderRadius: 12,
            px: 4,
            h: 10,
            minW: 10,
            fontSize: 'sm'
        },
        lg: {
            borderRadius: 12,
            px: 5,
            h: '44px',
            minW: '44px',
            fontSize: 'sm'
        },
        xl: {
            borderRadius: 12,
            px: 5,
            h: 12,
            minW: 12,
            fontSize: 'md'
        }
    },
    defaultProps: {
        variant: 'filled',
        colorScheme: 'default'
    }
}

export default Button
