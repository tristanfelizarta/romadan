const Badge = {
    baseStyle: {
        borderRadius: 'full',
        fontWeight: 'medium',
        textTransform: 'normal',
        cursor: 'default'
    },
    variants: {
        filled: (props) => ({
            bg:
                props.colorScheme === 'default'
                    ? 'canvas-1'
                    : `${props.colorScheme}.default`,
            color: props.colorScheme === 'default' ? 'accent-3' : 'white'
        }),
        tinted: (props) => ({
            bg:
                props.colorScheme === 'default'
                    ? 'canvas-1'
                    : `${props.colorScheme}.alpha`,
            color:
                props.colorScheme === 'default'
                    ? 'accent-3'
                    : `${props.colorScheme}.default`
        })
    },
    sizes: {
        xs: {
            px: 2,
            py: 1,
            lineHeight: '16px'
        },
        sm: {
            px: 3,
            py: 1.5,
            lineHeight: '16px'
        },
        md: {
            px: 3,
            py: 1.5,
            fontSize: 'sm',
            lineHeight: '20px'
        },
        lg: {
            px: 3.5,
            py: 2,
            fontSize: 'sm',
            lineHeight: '20px'
        },
        xl: {
            px: 4,
            py: 2,
            fontSize: 'md'
        }
    },
    defaultProps: {
        variant: 'filled',
        size: 'sm',
        colorScheme: 'default'
    }
}

export default Badge
