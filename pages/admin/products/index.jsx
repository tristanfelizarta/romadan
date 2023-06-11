import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import {
    Badge,
    Button,
    Container,
    Flex,
    IconButton,
    Image,
    Td,
    Text,
    Tr
} from '@chakra-ui/react'
import { FiMoreHorizontal, FiPlus, FiStar } from 'react-icons/fi'
import Card from 'components/card'
import Table from 'components/table'

const Products = () => {
    const router = useRouter()
    const { data: products, isFetched: isProductsFetched } = useQuery(
        ['products'],
        () => api.all('/products')
    )

    return (
        <Container>
            <Card>
                <Table
                    data={products}
                    fetched={isProductsFetched}
                    th={[
                        'Product',
                        'Quantity',
                        'Price',
                        'Stock',
                        'Sold',
                        'total Sales',
                        'Status',
                        ''
                    ]}
                    td={(product, index) => (
                        <Tr key={index}>
                            <Td maxW={200}>
                                <Flex align="center" gap={3}>
                                    <Image
                                        boxSize={8}
                                        alt={product.name}
                                        src={product.image}
                                    />

                                    <Text
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                    >
                                        {product.name}
                                    </Text>
                                </Flex>
                            </Td>

                            <Td>
                                <Text>
                                    {product.inventory.shelf +
                                        product.inventory.warehouse}
                                </Text>
                            </Td>

                            <Td>
                                <Text>
                                    ₱
                                    {product.price.toLocaleString(undefined, {
                                        maximumFractionDigits: 2
                                    })}
                                </Text>
                            </Td>

                            <Td>
                                <Text>{product.inventory.shelf}</Text>
                            </Td>

                            <Td>
                                <Text>
                                    {product.sold.toLocaleString(undefined, {
                                        maximumFractionDigits: 2
                                    })}
                                </Text>
                            </Td>

                            <Td>
                                <Text>
                                    ₱
                                    {product.total_sales.toLocaleString(
                                        undefined,
                                        { maximumFractionDigits: 2 }
                                    )}
                                </Text>
                            </Td>

                            <Td>
                                <Badge
                                    variant="tinted"
                                    colorScheme={
                                        product.status === 'published'
                                            ? 'blue'
                                            : product.status === 'draft'
                                            ? 'yellow'
                                            : product.status === 'inactive' &&
                                              'red'
                                    }
                                    textTransform="capitalize"
                                >
                                    {product.status}
                                </Badge>
                            </Td>

                            <Td textAlign="right">
                                <IconButton
                                    size="xs"
                                    icon={<FiMoreHorizontal size={12} />}
                                    onClick={() =>
                                        router.push(
                                            `/admin/products/view/${product._id}`
                                        )
                                    }
                                />
                            </Td>
                        </Tr>
                    )}
                    select={() => (
                        <Flex flex={1} justify="end" align="center" gap={3}>
                            <Button
                                size="lg"
                                colorScheme="brand"
                                leftIcon={<FiPlus size={16} />}
                                onClick={() =>
                                    router.push('/admin/products/add')
                                }
                            >
                                Add Product
                            </Button>
                        </Flex>
                    )}
                    filters={(data, watch) => {
                        return data.filter((data) =>
                            ['name'].some((key) =>
                                data[key]
                                    .toString()
                                    .toLowerCase()
                                    .includes(
                                        watch('search') &&
                                            watch('search').toLowerCase()
                                    )
                            )
                        )
                    }}
                    settings={{
                        placeholder: 'Search Products'
                    }}
                />
            </Card>
        </Container>
    )
}

export default Products
