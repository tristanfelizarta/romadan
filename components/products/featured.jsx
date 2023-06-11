import NextLink from 'next/link'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Flex, Image, Text } from '@chakra-ui/react'
import Card from 'components/card'

const Featured = () => {
    const { data: products, isFetched: isProductsFetched } = useQuery(
        ['products'],
        () => api.all('/products')
    )

    return (
        <Flex direction="column" gap={6}>
            {isProductsFetched &&
                products.slice(0, 3).map((product) => (
                    <NextLink
                        href={`/products/${product._id}`}
                        passHref
                        key={product._id}
                    >
                        <Flex direction="column" gap={6}>
                            <Card>
                                <Image
                                    borderRadius={12}
                                    alt={product.name}
                                    src={product.image}
                                />
                            </Card>

                            <Flex
                                justify="space-between"
                                align="center"
                                gap={3}
                            >
                                <Text
                                    fontWeight="medium"
                                    color="accent-1"
                                    noOfLines={2}
                                >
                                    {product.name}
                                </Text>

                                <Text fontWeight="medium" color="brand.default">
                                    ₱
                                    {product.price.toLocaleString(undefined, {
                                        maximumFractionDigits: 2
                                    })}
                                </Text>
                            </Flex>
                        </Flex>
                    </NextLink>
                ))}
        </Flex>
    )
}

export default Featured
