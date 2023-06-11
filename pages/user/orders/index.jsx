import { useState, useEffect } from 'react'
import NextLink from 'next/link'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import {
    Container,
    Divider,
    Flex,
    Icon,
    Image,
    Spinner,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text
} from '@chakra-ui/react'
import {
    FiCheckCircle,
    FiCreditCard,
    FiPackage,
    FiTruck,
    FiXCircle
} from 'react-icons/fi'
import Card from 'components/card'

const Orders = () => {
    const { data: session } = useSession()
    const { data: orders, isFetched: isOrdersFetched } = useQuery(
        ['orders'],
        () => api.get('/orders/user', session.user.id)
    )
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        if (isOrdersFetched) {
            setMounted(true)
        }
    }, [isOrdersFetched])

    if (!mounted || !isOrdersFetched) {
        return (
            <Flex p={6}>
                <Spinner color="brand.default" />
            </Flex>
        )
    }

    return (
        <Container>
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize="2xl" fontWeight="semibold" color="accent-1">
                        My Orders
                    </Text>
                </Flex>

                <Tabs isFitted>
                    <TabList overflow="hidden">
                        <Flex
                            direction={{ base: 'column', lg: 'row' }}
                            w="full"
                        >
                            <Tab>
                                <Flex align="center" gap={3}>
                                    <Icon as={FiCreditCard} boxSize={4} />

                                    <Flex align="center" gap={3}>
                                        <Text>To Pay</Text>
                                        <Text color="brand.default">
                                            {
                                                orders.filter(
                                                    (order) =>
                                                        order.status === 'pay'
                                                ).length
                                            }
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Tab>

                            <Tab>
                                <Flex align="center" gap={3}>
                                    <Icon as={FiPackage} boxSize={4} />

                                    <Flex align="center" gap={3}>
                                        <Text>To Ship</Text>
                                        <Text color="brand.default">
                                            {
                                                orders.filter(
                                                    (order) =>
                                                        order.status === 'ship'
                                                ).length
                                            }
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Tab>

                            <Tab>
                                <Flex align="center" gap={3}>
                                    <Icon as={FiTruck} boxSize={4} />

                                    <Flex align="center" gap={3}>
                                        <Text>To Receive</Text>
                                        <Text color="brand.default">
                                            {
                                                orders.filter(
                                                    (order) =>
                                                        order.status ===
                                                        'receive'
                                                ).length
                                            }
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Tab>

                            <Tab>
                                <Flex align="center" gap={3}>
                                    <Icon as={FiCheckCircle} boxSize={4} />

                                    <Flex align="center" gap={3}>
                                        <Text>Completed</Text>
                                        <Text color="brand.default">
                                            {
                                                orders.filter(
                                                    (order) =>
                                                        order.status ===
                                                        'completed'
                                                ).length
                                            }
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Tab>

                            <Tab>
                                <Flex align="center" gap={3}>
                                    <Icon as={FiXCircle} boxSize={4} />

                                    <Flex align="center" gap={3}>
                                        <Text>Cancelled</Text>
                                        <Text color="brand.default">
                                            {
                                                orders.filter(
                                                    (order) =>
                                                        order.status ===
                                                        'cancelled'
                                                ).length
                                            }
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Tab>
                        </Flex>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <Flex direction="column" gap={6}>
                                {orders
                                    .filter((order) => order.status === 'pay')
                                    .map((order) => (
                                        <Card key={order._id}>
                                            <Flex direction="column" gap={6}>
                                                <NextLink
                                                    href={`/user/orders/${order._id}`}
                                                    passHref
                                                >
                                                    <Flex
                                                        direction="column"
                                                        gap={6}
                                                    >
                                                        {order.products.map(
                                                            (product) => (
                                                                <Flex
                                                                    gap={6}
                                                                    key={
                                                                        product
                                                                            .cart
                                                                            .id
                                                                    }
                                                                >
                                                                    <Flex>
                                                                        <Image
                                                                            boxSize={
                                                                                24
                                                                            }
                                                                            alt={
                                                                                product.name
                                                                            }
                                                                            src={
                                                                                product.image
                                                                            }
                                                                        />
                                                                    </Flex>

                                                                    <Flex
                                                                        flex={1}
                                                                        justify="space-between"
                                                                        align="start"
                                                                        direction="column"
                                                                    >
                                                                        <div>
                                                                            <Text
                                                                                fontWeight="medium"
                                                                                color="accent-1"
                                                                            >
                                                                                {
                                                                                    product.name
                                                                                }
                                                                            </Text>

                                                                            <Text fontSize="sm">
                                                                                {
                                                                                    product.color
                                                                                }{' '}
                                                                                -{' '}
                                                                                {
                                                                                    product.size
                                                                                }
                                                                            </Text>
                                                                        </div>

                                                                        <Text
                                                                            fontWeight="medium"
                                                                            color="accent-1"
                                                                        >
                                                                            x
                                                                            {
                                                                                product.quantity
                                                                            }
                                                                        </Text>
                                                                    </Flex>

                                                                    <Flex
                                                                        justify="space-between"
                                                                        align="end"
                                                                        direction="column"
                                                                        gap={6}
                                                                    >
                                                                        <Text
                                                                            fontSize="sm"
                                                                            fontWeight="medium"
                                                                            textDecoration="line-through"
                                                                        >
                                                                            ₱
                                                                            {(
                                                                                product.price *
                                                                                product.quantity
                                                                            ).toLocaleString(
                                                                                undefined,
                                                                                {
                                                                                    maximumFractionDigits: 2
                                                                                }
                                                                            )}
                                                                        </Text>

                                                                        <Text
                                                                            fontWeight="medium"
                                                                            color="brand.default"
                                                                        >
                                                                            ₱
                                                                            {(
                                                                                product.price *
                                                                                    product.quantity -
                                                                                product.price *
                                                                                    product.quantity *
                                                                                    (product
                                                                                        .discount
                                                                                        .percentage /
                                                                                        100)
                                                                            ).toLocaleString(
                                                                                undefined,
                                                                                {
                                                                                    maximumFractionDigits: 2
                                                                                }
                                                                            )}
                                                                        </Text>
                                                                    </Flex>
                                                                </Flex>
                                                            )
                                                        )}
                                                    </Flex>
                                                </NextLink>

                                                <Divider />

                                                <Flex
                                                    justify="space-between"
                                                    align="center"
                                                    gap={6}
                                                >
                                                    <Text
                                                        fontWeight="medium"
                                                        color="accent-1"
                                                    >
                                                        Order Total
                                                    </Text>

                                                    <Text
                                                        fontSize="xl"
                                                        fontWeight="medium"
                                                        color="brand.default"
                                                    >
                                                        ₱
                                                        {order.total.toLocaleString(
                                                            undefined,
                                                            {
                                                                maximumFractionDigits: 2
                                                            }
                                                        )}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </Card>
                                    ))}
                            </Flex>
                        </TabPanel>

                        <TabPanel>
                            <Flex direction="column" gap={6}>
                                {orders
                                    .filter((order) => order.status === 'ship')
                                    .map((order) => (
                                        <Card key={order._id}>
                                            <Flex direction="column" gap={6}>
                                                <NextLink
                                                    href={`/user/orders/${order._id}`}
                                                    passHref
                                                >
                                                    <Flex
                                                        direction="column"
                                                        gap={6}
                                                    >
                                                        {order.products.map(
                                                            (product) => (
                                                                <Flex
                                                                    gap={6}
                                                                    key={
                                                                        product
                                                                            .cart
                                                                            .id
                                                                    }
                                                                >
                                                                    <Flex>
                                                                        <Image
                                                                            boxSize={
                                                                                24
                                                                            }
                                                                            alt={
                                                                                product.name
                                                                            }
                                                                            src={
                                                                                product.image
                                                                            }
                                                                        />
                                                                    </Flex>

                                                                    <Flex
                                                                        flex={1}
                                                                        justify="space-between"
                                                                        align="start"
                                                                        direction="column"
                                                                    >
                                                                        <div>
                                                                            <Text
                                                                                fontWeight="medium"
                                                                                color="accent-1"
                                                                            >
                                                                                {
                                                                                    product.name
                                                                                }
                                                                            </Text>

                                                                            <Text fontSize="sm">
                                                                                {
                                                                                    product.color
                                                                                }{' '}
                                                                                -{' '}
                                                                                {
                                                                                    product.size
                                                                                }
                                                                            </Text>
                                                                        </div>

                                                                        <Text
                                                                            fontWeight="medium"
                                                                            color="accent-1"
                                                                        >
                                                                            x
                                                                            {
                                                                                product.quantity
                                                                            }
                                                                        </Text>
                                                                    </Flex>

                                                                    <Flex
                                                                        justify="space-between"
                                                                        align="end"
                                                                        direction="column"
                                                                        gap={6}
                                                                    >
                                                                        <Text
                                                                            fontSize="sm"
                                                                            fontWeight="medium"
                                                                            textDecoration="line-through"
                                                                        >
                                                                            ₱
                                                                            {(
                                                                                product.price *
                                                                                product.quantity
                                                                            ).toLocaleString(
                                                                                undefined,
                                                                                {
                                                                                    maximumFractionDigits: 2
                                                                                }
                                                                            )}
                                                                        </Text>

                                                                        <Text
                                                                            fontWeight="medium"
                                                                            color="brand.default"
                                                                        >
                                                                            ₱
                                                                            {(
                                                                                product.price *
                                                                                    product.quantity -
                                                                                product.price *
                                                                                    product.quantity *
                                                                                    (product
                                                                                        .discount
                                                                                        .percentage /
                                                                                        100)
                                                                            ).toLocaleString(
                                                                                undefined,
                                                                                {
                                                                                    maximumFractionDigits: 2
                                                                                }
                                                                            )}
                                                                        </Text>
                                                                    </Flex>
                                                                </Flex>
                                                            )
                                                        )}
                                                    </Flex>
                                                </NextLink>

                                                <Divider />

                                                <Flex
                                                    justify="space-between"
                                                    align="center"
                                                    gap={6}
                                                >
                                                    <Text
                                                        fontWeight="medium"
                                                        color="accent-1"
                                                    >
                                                        Order Total
                                                    </Text>

                                                    <Text
                                                        fontSize="xl"
                                                        fontWeight="medium"
                                                        color="brand.default"
                                                    >
                                                        ₱
                                                        {order.total.toLocaleString(
                                                            undefined,
                                                            {
                                                                maximumFractionDigits: 2
                                                            }
                                                        )}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </Card>
                                    ))}
                            </Flex>
                        </TabPanel>

                        <TabPanel>
                            <Flex direction="column" gap={6}>
                                {orders
                                    .filter(
                                        (order) => order.status === 'receive'
                                    )
                                    .map((order) => (
                                        <Card key={order._id}>
                                            <Flex direction="column" gap={6}>
                                                <NextLink
                                                    href={`/user/orders/${order._id}`}
                                                    passHref
                                                >
                                                    <Flex
                                                        direction="column"
                                                        gap={6}
                                                    >
                                                        {order.products.map(
                                                            (product) => (
                                                                <Flex
                                                                    gap={6}
                                                                    key={
                                                                        product
                                                                            .cart
                                                                            .id
                                                                    }
                                                                >
                                                                    <Flex>
                                                                        <Image
                                                                            boxSize={
                                                                                24
                                                                            }
                                                                            alt={
                                                                                product.name
                                                                            }
                                                                            src={
                                                                                product.image
                                                                            }
                                                                        />
                                                                    </Flex>

                                                                    <Flex
                                                                        flex={1}
                                                                        justify="space-between"
                                                                        align="start"
                                                                        direction="column"
                                                                    >
                                                                        <div>
                                                                            <Text
                                                                                fontWeight="medium"
                                                                                color="accent-1"
                                                                            >
                                                                                {
                                                                                    product.name
                                                                                }
                                                                            </Text>

                                                                            <Text fontSize="sm">
                                                                                {
                                                                                    product.color
                                                                                }{' '}
                                                                                -{' '}
                                                                                {
                                                                                    product.size
                                                                                }
                                                                            </Text>
                                                                        </div>

                                                                        <Text
                                                                            fontWeight="medium"
                                                                            color="accent-1"
                                                                        >
                                                                            x
                                                                            {
                                                                                product.quantity
                                                                            }
                                                                        </Text>
                                                                    </Flex>

                                                                    <Flex
                                                                        justify="space-between"
                                                                        align="end"
                                                                        direction="column"
                                                                        gap={6}
                                                                    >
                                                                        <Text
                                                                            fontSize="sm"
                                                                            fontWeight="medium"
                                                                            textDecoration="line-through"
                                                                        >
                                                                            ₱
                                                                            {(
                                                                                product.price *
                                                                                product.quantity
                                                                            ).toLocaleString(
                                                                                undefined,
                                                                                {
                                                                                    maximumFractionDigits: 2
                                                                                }
                                                                            )}
                                                                        </Text>

                                                                        <Text
                                                                            fontWeight="medium"
                                                                            color="brand.default"
                                                                        >
                                                                            ₱
                                                                            {(
                                                                                product.price *
                                                                                    product.quantity -
                                                                                product.price *
                                                                                    product.quantity *
                                                                                    (product
                                                                                        .discount
                                                                                        .percentage /
                                                                                        100)
                                                                            ).toLocaleString(
                                                                                undefined,
                                                                                {
                                                                                    maximumFractionDigits: 2
                                                                                }
                                                                            )}
                                                                        </Text>
                                                                    </Flex>
                                                                </Flex>
                                                            )
                                                        )}
                                                    </Flex>
                                                </NextLink>

                                                <Divider />

                                                <Flex
                                                    justify="space-between"
                                                    align="center"
                                                    gap={6}
                                                >
                                                    <Text
                                                        fontWeight="medium"
                                                        color="accent-1"
                                                    >
                                                        Order Total
                                                    </Text>

                                                    <Text
                                                        fontSize="xl"
                                                        fontWeight="medium"
                                                        color="brand.default"
                                                    >
                                                        ₱
                                                        {order.total.toLocaleString(
                                                            undefined,
                                                            {
                                                                maximumFractionDigits: 2
                                                            }
                                                        )}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </Card>
                                    ))}
                            </Flex>
                        </TabPanel>

                        <TabPanel>
                            <Flex direction="column" gap={6}>
                                {orders
                                    .filter(
                                        (order) => order.status === 'completed'
                                    )
                                    .map((order) => (
                                        <Card key={order._id}>
                                            <Flex direction="column" gap={6}>
                                                <NextLink
                                                    href={`/user/orders/${order._id}`}
                                                    passHref
                                                >
                                                    <Flex
                                                        direction="column"
                                                        gap={6}
                                                    >
                                                        {order.products.map(
                                                            (product) => (
                                                                <Flex
                                                                    gap={6}
                                                                    key={
                                                                        product
                                                                            .cart
                                                                            .id
                                                                    }
                                                                >
                                                                    <Flex>
                                                                        <Image
                                                                            boxSize={
                                                                                24
                                                                            }
                                                                            alt={
                                                                                product.name
                                                                            }
                                                                            src={
                                                                                product.image
                                                                            }
                                                                        />
                                                                    </Flex>

                                                                    <Flex
                                                                        flex={1}
                                                                        justify="space-between"
                                                                        align="start"
                                                                        direction="column"
                                                                    >
                                                                        <div>
                                                                            <Text
                                                                                fontWeight="medium"
                                                                                color="accent-1"
                                                                            >
                                                                                {
                                                                                    product.name
                                                                                }
                                                                            </Text>

                                                                            <Text fontSize="sm">
                                                                                {
                                                                                    product.color
                                                                                }{' '}
                                                                                -{' '}
                                                                                {
                                                                                    product.size
                                                                                }
                                                                            </Text>
                                                                        </div>

                                                                        <Text
                                                                            fontWeight="medium"
                                                                            color="accent-1"
                                                                        >
                                                                            x
                                                                            {
                                                                                product.quantity
                                                                            }
                                                                        </Text>
                                                                    </Flex>

                                                                    <Flex
                                                                        justify="space-between"
                                                                        align="end"
                                                                        direction="column"
                                                                        gap={6}
                                                                    >
                                                                        <Text
                                                                            fontSize="sm"
                                                                            fontWeight="medium"
                                                                            textDecoration="line-through"
                                                                        >
                                                                            ₱
                                                                            {(
                                                                                product.price *
                                                                                product.quantity
                                                                            ).toLocaleString(
                                                                                undefined,
                                                                                {
                                                                                    maximumFractionDigits: 2
                                                                                }
                                                                            )}
                                                                        </Text>

                                                                        <Text
                                                                            fontWeight="medium"
                                                                            color="brand.default"
                                                                        >
                                                                            ₱
                                                                            {(
                                                                                product.price *
                                                                                    product.quantity -
                                                                                product.price *
                                                                                    product.quantity *
                                                                                    (product
                                                                                        .discount
                                                                                        .percentage /
                                                                                        100)
                                                                            ).toLocaleString(
                                                                                undefined,
                                                                                {
                                                                                    maximumFractionDigits: 2
                                                                                }
                                                                            )}
                                                                        </Text>
                                                                    </Flex>
                                                                </Flex>
                                                            )
                                                        )}
                                                    </Flex>
                                                </NextLink>

                                                <Divider />

                                                <Flex
                                                    justify="space-between"
                                                    align="center"
                                                    gap={6}
                                                >
                                                    <Text
                                                        fontWeight="medium"
                                                        color="accent-1"
                                                    >
                                                        Order Total
                                                    </Text>

                                                    <Text
                                                        fontSize="xl"
                                                        fontWeight="medium"
                                                        color="brand.default"
                                                    >
                                                        ₱
                                                        {order.total.toLocaleString(
                                                            undefined,
                                                            {
                                                                maximumFractionDigits: 2
                                                            }
                                                        )}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </Card>
                                    ))}
                            </Flex>
                        </TabPanel>

                        <TabPanel>
                            <Flex direction="column" gap={6}>
                                {orders
                                    .filter(
                                        (order) => order.status === 'cancelled'
                                    )
                                    .map((order) => (
                                        <Card key={order._id}>
                                            <Flex direction="column" gap={6}>
                                                <NextLink
                                                    href={`/user/orders/${order._id}`}
                                                    passHref
                                                >
                                                    <Flex
                                                        direction="column"
                                                        gap={6}
                                                    >
                                                        {order.products.map(
                                                            (product) => (
                                                                <Flex
                                                                    gap={6}
                                                                    key={
                                                                        product
                                                                            .cart
                                                                            .id
                                                                    }
                                                                >
                                                                    <Flex>
                                                                        <Image
                                                                            boxSize={
                                                                                24
                                                                            }
                                                                            alt={
                                                                                product.name
                                                                            }
                                                                            src={
                                                                                product.image
                                                                            }
                                                                        />
                                                                    </Flex>

                                                                    <Flex
                                                                        flex={1}
                                                                        justify="space-between"
                                                                        align="start"
                                                                        direction="column"
                                                                    >
                                                                        <div>
                                                                            <Text
                                                                                fontWeight="medium"
                                                                                color="accent-1"
                                                                            >
                                                                                {
                                                                                    product.name
                                                                                }
                                                                            </Text>

                                                                            <Text fontSize="sm">
                                                                                {
                                                                                    product.color
                                                                                }{' '}
                                                                                -{' '}
                                                                                {
                                                                                    product.size
                                                                                }
                                                                            </Text>
                                                                        </div>

                                                                        <Text
                                                                            fontWeight="medium"
                                                                            color="accent-1"
                                                                        >
                                                                            x
                                                                            {
                                                                                product.quantity
                                                                            }
                                                                        </Text>
                                                                    </Flex>

                                                                    <Flex
                                                                        justify="space-between"
                                                                        align="end"
                                                                        direction="column"
                                                                        gap={6}
                                                                    >
                                                                        <Text
                                                                            fontSize="sm"
                                                                            fontWeight="medium"
                                                                            textDecoration="line-through"
                                                                        >
                                                                            ₱
                                                                            {(
                                                                                product.price *
                                                                                product.quantity
                                                                            ).toLocaleString(
                                                                                undefined,
                                                                                {
                                                                                    maximumFractionDigits: 2
                                                                                }
                                                                            )}
                                                                        </Text>

                                                                        <Text
                                                                            fontWeight="medium"
                                                                            color="brand.default"
                                                                        >
                                                                            ₱
                                                                            {(
                                                                                product.price *
                                                                                    product.quantity -
                                                                                product.price *
                                                                                    product.quantity *
                                                                                    (product
                                                                                        .discount
                                                                                        .percentage /
                                                                                        100)
                                                                            ).toLocaleString(
                                                                                undefined,
                                                                                {
                                                                                    maximumFractionDigits: 2
                                                                                }
                                                                            )}
                                                                        </Text>
                                                                    </Flex>
                                                                </Flex>
                                                            )
                                                        )}
                                                    </Flex>
                                                </NextLink>

                                                <Divider />

                                                <Flex
                                                    justify="space-between"
                                                    align="center"
                                                    gap={6}
                                                >
                                                    <Text
                                                        fontWeight="medium"
                                                        color="accent-1"
                                                    >
                                                        Order Total
                                                    </Text>

                                                    <Text
                                                        fontSize="xl"
                                                        fontWeight="medium"
                                                        color="brand.default"
                                                    >
                                                        ₱
                                                        {order.total.toLocaleString(
                                                            undefined,
                                                            {
                                                                maximumFractionDigits: 2
                                                            }
                                                        )}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </Card>
                                    ))}
                            </Flex>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
        </Container>
    )
}

export default Orders
