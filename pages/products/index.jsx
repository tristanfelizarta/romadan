import NextLink from 'next/link'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import {
    AspectRatio,
    Container,
    Flex,
    Image,
    SimpleGrid,
    Skeleton,
    Text
} from '@chakra-ui/react'
import Card from 'components/card'

const Products = () => {
    const { data: products, isFetched: isProductsFetched } = useQuery(
        ['products'],
        () => api.all('/products')
    )

    return (
        <Container>
            <Flex direction="column" gap={6}>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
                    {isProductsFetched
                        ? products.map((product) => (
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
                                              noOfLines={1}
                                          >
                                              {product.name}
                                          </Text>

                                          <Text
                                              fontWeight="medium"
                                              color="brand.default"
                                          >
                                              ₱
                                              {product.price.toLocaleString(
                                                  undefined,
                                                  { maximumFractionDigits: 2 }
                                              )}
                                          </Text>
                                      </Flex>
                                  </Flex>
                              </NextLink>
                          ))
                        : [...Array(12)].map((data, index) => (
                              <AspectRatio key={index}>
                                  <Skeleton borderRadius={12} />
                              </AspectRatio>
                          ))}
                </SimpleGrid>
            </Flex>
        </Container>
    )
}

export default Products
