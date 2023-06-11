const Link = {
    baseStyle: (props) => ({
        fontWeight: 'medium',
        textTransform: 'capitalize',
        color: props.active ? 'brand.default' : 'accent-1',
        transition: '.4s',
        _hover: {
            textDecoration: 'none',
            color: 'brand.default'
        }
    }),
    sizes: {
        sm: {
            fontSize: 'xs'
        },
        md: {
            fontSize: 'sm'
        },
        lg: {
            fontSize: 'md'
        }
    },
    defaultProps: {
        size: 'md'
    }
}

export default Link
