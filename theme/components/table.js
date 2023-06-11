const Table = {
    baseStyle: {
        table: {
            whiteSpace: 'nowrap'
        },
        th: {
            whiteSpace: 'nowrap'
        }
    },
    variants: {
        default: {
            thead: {
                tr: {
                    th: {
                        px: 6,
                        h: 12,
                        color: 'accent-3',
                        '&:first-of-type': {
                            pl: 0
                        },
                        '&:last-of-type': {
                            pr: 0
                        }
                    }
                }
            },
            tbody: {
                tr: {
                    td: {
                        px: 6,
                        color: 'accent-1',
                        '&:first-of-type': {
                            pl: 0
                        },
                        '&:last-of-type': {
                            pr: 0
                        }
                    },
                    '&:last-of-type': {
                        borderBottom: 'none'
                    }
                }
            }
        }
    },
    sizes: {
        md: {
            th: {
                fontSize: 'xs',
                fontWeight: 'semibold',
                lineHeight: 'inherit'
            },
            td: {
                fontSize: 'sm',
                fontWeight: 'medium',
                lineHeight: 'inherit'
            }
        }
    },
    defaultProps: {
        variant: 'default'
    }
}

export default Table
