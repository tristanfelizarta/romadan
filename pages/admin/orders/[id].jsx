import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import {
    Button,
    Container,
    Divider,
    Flex,
    Grid,
    GridItem,
    Icon,
    Image,
    SimpleGrid,
    Spinner,
    Text,
    Textarea,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import {
    FiCheckCircle,
    FiChevronLeft,
    FiCreditCard,
    FiMapPin,
    FiPackage,
    FiStar,
    FiTruck,
    FiXCircle
} from 'react-icons/fi'
import Card from 'components/card'
import Toast from 'components/toast'
import Modal from 'components/modal'

const Order = () => {
    const router = useRouter()
    const { id } = router.query
    const queryClient = useQueryClient()
    const { data: order, isFetched: isOrderFetched } = useQuery(['order'], () =>
        api.get('/orders', id)
    )
    const { data: rnr, isFetched: isRnRFetched } = useQuery(
        ['rnr'],
        () => api.get('/rnr', id),
        { enabled: isOrderFetched }
    )
    const [mounted, setMounted] = useState(false)
    const disclosure = useDisclosure()
    const toast = useToast()

    const orderStatusMutation = useMutation(
        (data) => api.update('/orders', id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('orders')
                queryClient.invalidateQueries('products')

                toast({
                    position: 'top',
                    render: () => (
                        <Toast
                            title="Success"
                            description="Order status updated successfully."
                        />
                    )
                })
            }
        }
    )

    const handleOrderStatus = (type) => {
        switch (type) {
            case 'to_ship':
                if (order.to_ship.status) {
                    orderStatusMutation.mutate({
                        type: type,
                        status: false,
                        email: order.email
                    })
                } else {
                    orderStatusMutation.mutate({
                        type: type,
                        status: true,
                        email: order.email
                    })
                }

                break

            case 'to_receive':
                if (order.to_receive.status) {
                    orderStatusMutation.mutate({
                        type: type,
                        status: false,
                        email: order.email
                    })
                } else {
                    orderStatusMutation.mutate({
                        type: type,
                        status: true,
                        email: order.email
                    })
                }

                break

            case 'completed':
                if (order.completed.status) {
                    orderStatusMutation.mutate({
                        type: type,
                        status: false,
                        email: order.email
                    })
                } else {
                    orderStatusMutation.mutate({
                        type: type,
                        status: true,
                        email: order.email
                    })
                }

                break

            case 'cancelled':
                if (order.cancelled.status) {
                    orderStatusMutation.mutate({
                        type: type,
                        status: false
                    })
                } else {
                    orderStatusMutation.mutate({
                        type: type,
                        status: true
                    })
                }

                break

            default:
                console.log('invalid required')
                break
        }
    }

    useEffect(() => {
        if (isOrderFetched) {
            setMounted(true)
        }
    }, [isOrderFetched])

    if (!mounted || !isOrderFetched || !isRnRFetched) {
        return (
            <Flex p={6}>
                <Spinner color="brand.default" />
            </Flex>
        )
    }

    return (
        <Container>
            <Grid templateColumns="2fr 1fr" gap={6}>
                <GridItem colSpan={2}>
                    <Flex justify="space-between" align="center" gap={6}>
                        <Button
                            variant="plain"
                            leftIcon={<FiChevronLeft size={16} />}
                            onClick={() => router.back()}
                        >
                            Back
                        </Button>

                        <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            textTransform="uppercase"
                            color="accent-1"
                        >
                            ORDER ID. {id}
                        </Text>
                    </Flex>
                </GridItem>

                <GridItem colSpan={2}>
                    <Card>
                        <SimpleGrid
                            columns={{
                                base: 1,
                                md: 2,
                                lg: 3,
                                xl: order.to_ship.status
                                    ? 5
                                    : order.cancelled.status
                                    ? 5
                                    : order.completed.status
                                    ? 5
                                    : 6
                            }}
                            gap={6}
                        >
                            <Flex
                                as="button"
                                align="center"
                                direction="column"
                                gap={3}
                                borderRadius={12}
                                p={6}
                                cursor="pointer"
                                transition=".4s"
                                _hover={{
                                    shadow: 'md',
                                    _dark: { shadow: 'dark-xl' }
                                }}
                            >
                                <Flex
                                    bg="brand.alpha"
                                    justify="center"
                                    align="center"
                                    border="2px solid"
                                    borderColor="brand.default"
                                    borderRadius="full"
                                    h={16}
                                    w={16}
                                >
                                    <Icon
                                        as={FiCreditCard}
                                        boxSize={6}
                                        color="brand.default"
                                    />
                                </Flex>

                                <Flex
                                    align="center"
                                    direction="column"
                                    gap={1}
                                    textAlign="center"
                                >
                                    <Text
                                        fontWeight="semibold"
                                        color="accent-1"
                                    >
                                        To Pay
                                    </Text>

                                    <Text fontSize="xs">
                                        {order.to_pay.date.split(',')[0]}
                                        <br />
                                        {order.to_pay.date.split(',')[1]}
                                    </Text>
                                </Flex>
                            </Flex>

                            <Flex
                                as="button"
                                align="center"
                                direction="column"
                                gap={3}
                                borderRadius={12}
                                p={6}
                                transition=".4s"
                                cursor={
                                    order.to_receive.status
                                        ? 'not-allowed'
                                        : 'pointer'
                                }
                                _hover={{
                                    shadow: 'md',
                                    _dark: { shadow: 'dark-xl' }
                                }}
                                disabled={order.to_receive.status}
                                onDoubleClick={() =>
                                    handleOrderStatus('to_ship')
                                }
                            >
                                <Flex
                                    bg={
                                        order.cancelled.status
                                            ? 'yellow.alpha'
                                            : order.to_ship.status
                                            ? 'brand.alpha'
                                            : 'transparent'
                                    }
                                    justify="center"
                                    align="center"
                                    border="2px solid"
                                    borderColor={
                                        order.cancelled.status
                                            ? 'yellow.default'
                                            : order.to_ship.status
                                            ? 'brand.default'
                                            : 'accent-5'
                                    }
                                    borderRadius="full"
                                    h={16}
                                    w={16}
                                >
                                    <Icon
                                        as={FiPackage}
                                        boxSize={6}
                                        color={
                                            order.cancelled.status
                                                ? 'yellow.default'
                                                : order.to_ship.status
                                                ? 'brand.default'
                                                : 'accent-5'
                                        }
                                    />
                                </Flex>

                                <Flex
                                    align="center"
                                    direction="column"
                                    gap={1}
                                    textAlign="center"
                                >
                                    <Text
                                        fontWeight="semibold"
                                        color="accent-1"
                                    >
                                        To Ship
                                    </Text>

                                    <Text fontSize="xs">
                                        {order.to_ship.date.split(',')[0]}
                                        <br />
                                        {order.to_ship.date.split(',')[1]}
                                    </Text>
                                </Flex>
                            </Flex>

                            <Flex
                                as="button"
                                align="center"
                                direction="column"
                                gap={3}
                                borderRadius={12}
                                p={6}
                                transition=".4s"
                                cursor={
                                    !order.to_ship.status
                                        ? 'not-allowed'
                                        : 'pointer'
                                }
                                _hover={{
                                    shadow: 'md',
                                    _dark: { shadow: 'dark-xl' }
                                }}
                                disabled={!order.to_ship.status}
                                onDoubleClick={() =>
                                    handleOrderStatus('to_receive')
                                }
                            >
                                <Flex
                                    bg={
                                        order.cancelled.status
                                            ? 'yellow.alpha'
                                            : order.to_receive.status
                                            ? 'brand.alpha'
                                            : 'transparent'
                                    }
                                    justify="center"
                                    align="center"
                                    border="2px solid"
                                    borderColor={
                                        order.cancelled.status
                                            ? 'yellow.default'
                                            : order.to_receive.status
                                            ? 'brand.default'
                                            : 'accent-5'
                                    }
                                    borderRadius="full"
                                    h={16}
                                    w={16}
                                >
                                    <Icon
                                        as={FiTruck}
                                        boxSize={6}
                                        color={
                                            order.cancelled.status
                                                ? 'yellow.default'
                                                : order.to_receive.status
                                                ? 'brand.default'
                                                : 'accent-5'
                                        }
                                    />
                                </Flex>

                                <Flex
                                    align="center"
                                    direction="column"
                                    gap={1}
                                    textAlign="center"
                                >
                                    <Text
                                        fontWeight="semibold"
                                        color="accent-1"
                                    >
                                        To Receive
                                    </Text>

                                    <Text fontSize="xs">
                                        {order.to_receive.date.split(',')[0]}
                                        <br />
                                        {order.to_receive.date.split(',')[1]}
                                    </Text>
                                </Flex>
                            </Flex>

                            <Flex
                                as="button"
                                align="center"
                                direction="column"
                                gap={3}
                                borderRadius={12}
                                p={6}
                                transition=".4s"
                                cursor={
                                    !order.to_receive.status
                                        ? 'not-allowed'
                                        : 'pointer'
                                }
                                _hover={{
                                    shadow: 'md',
                                    _dark: { shadow: 'dark-xl' }
                                }}
                                disabled={!order.to_receive.status}
                                onDoubleClick={() =>
                                    handleOrderStatus('completed')
                                }
                            >
                                <Flex
                                    bg={
                                        order.cancelled.status
                                            ? 'yellow.alpha'
                                            : order.completed.status
                                            ? 'brand.alpha'
                                            : 'transparent'
                                    }
                                    justify="center"
                                    align="center"
                                    border="2px solid"
                                    borderColor={
                                        order.cancelled.status
                                            ? 'yellow.default'
                                            : order.completed.status
                                            ? 'brand.default'
                                            : 'accent-5'
                                    }
                                    borderRadius="full"
                                    h={16}
                                    w={16}
                                >
                                    <Icon
                                        as={FiCheckCircle}
                                        boxSize={6}
                                        color={
                                            order.cancelled.status
                                                ? 'yellow.default'
                                                : order.completed.status
                                                ? 'brand.default'
                                                : 'accent-5'
                                        }
                                    />
                                </Flex>

                                <Flex
                                    align="center"
                                    direction="column"
                                    gap={1}
                                    textAlign="center"
                                >
                                    <Text
                                        fontWeight="semibold"
                                        color="accent-1"
                                    >
                                        Completed
                                    </Text>

                                    <Text fontSize="xs">
                                        {order.completed.date.split(',')[0]}
                                        <br />
                                        {order.completed.date.split(',')[1]}
                                    </Text>
                                </Flex>
                            </Flex>

                            {!order.to_ship.status &&
                                !order.completed.status && (
                                    <Flex
                                        as="button"
                                        align="center"
                                        direction="column"
                                        gap={3}
                                        borderRadius={12}
                                        p={6}
                                        cursor="pointer"
                                        transition=".4s"
                                        _hover={{
                                            shadow: 'md',
                                            _dark: { shadow: 'dark-xl' }
                                        }}
                                        onDoubleClick={() =>
                                            handleOrderStatus('cancelled')
                                        }
                                    >
                                        <Flex
                                            bg={
                                                order.cancelled.status
                                                    ? 'red.alpha'
                                                    : 'transparent'
                                            }
                                            justify="center"
                                            align="center"
                                            border="2px solid"
                                            borderColor={
                                                order.cancelled.status
                                                    ? 'red.default'
                                                    : 'accent-5'
                                            }
                                            borderRadius="full"
                                            h={16}
                                            w={16}
                                        >
                                            <Icon
                                                as={FiXCircle}
                                                boxSize={6}
                                                color={
                                                    order.cancelled.status
                                                        ? 'red.default'
                                                        : 'accent-5'
                                                }
                                            />
                                        </Flex>

                                        <Flex
                                            align="center"
                                            direction="column"
                                            gap={1}
                                            textAlign="center"
                                        >
                                            <Text
                                                fontWeight="semibold"
                                                color="accent-1"
                                            >
                                                cancelled
                                            </Text>

                                            <Text fontSize="xs">
                                                {
                                                    order.cancelled.date.split(
                                                        ','
                                                    )[0]
                                                }
                                                <br />
                                                {
                                                    order.cancelled.date.split(
                                                        ','
                                                    )[1]
                                                }
                                            </Text>
                                        </Flex>
                                    </Flex>
                                )}

                            {!order.cancelled.status && (
                                <Modal
                                    title="Ratings & Reviews"
                                    size="2xl"
                                    toggle={(onOpen) => (
                                        <Flex
                                            as="button"
                                            align="center"
                                            direction="column"
                                            gap={3}
                                            borderRadius={12}
                                            p={6}
                                            cursor="pointer"
                                            transition=".4s"
                                            _hover={{
                                                shadow: 'md',
                                                _dark: { shadow: 'dark-xl' }
                                            }}
                                            onClick={onOpen}
                                        >
                                            <Flex
                                                bg={
                                                    order.to_rate.status
                                                        ? 'brand.alpha'
                                                        : 'transparent'
                                                }
                                                justify="center"
                                                align="center"
                                                border="2px solid"
                                                borderColor={
                                                    order.to_rate.status
                                                        ? 'brand.default'
                                                        : 'accent-5'
                                                }
                                                borderRadius="full"
                                                h={16}
                                                w={16}
                                            >
                                                <Icon
                                                    as={FiStar}
                                                    boxSize={6}
                                                    color={
                                                        order.to_rate.status
                                                            ? 'brand.default'
                                                            : 'accent-5'
                                                    }
                                                />
                                            </Flex>

                                            <Flex
                                                align="center"
                                                direction="column"
                                                gap={1}
                                                textAlign="center"
                                            >
                                                <Text
                                                    fontWeight="semibold"
                                                    color="accent-1"
                                                >
                                                    To Rate
                                                </Text>

                                                <Text fontSize="xs">
                                                    {
                                                        order.to_rate.date.split(
                                                            ','
                                                        )[0]
                                                    }
                                                    <br />
                                                    {
                                                        order.to_rate.date.split(
                                                            ','
                                                        )[1]
                                                    }
                                                </Text>
                                            </Flex>
                                        </Flex>
                                    )}
                                    disclosure={disclosure}
                                >
                                    <Flex
                                        align="center"
                                        direction="column"
                                        gap={6}
                                    >
                                        <Flex
                                            align="center"
                                            direction="column"
                                            textAlign="center"
                                            gap={1}
                                            borderRadius={12}
                                            py={6}
                                            w="full"
                                        >
                                            <Flex align="center">
                                                <Icon
                                                    as={FiStar}
                                                    boxSize={8}
                                                    fill="currentcolor"
                                                    color={
                                                        rnr.ratings >= 1
                                                            ? 'brand.default'
                                                            : 'accent-5'
                                                    }
                                                />
                                                <Icon
                                                    as={FiStar}
                                                    boxSize={8}
                                                    fill="currentcolor"
                                                    color={
                                                        rnr.ratings >= 2
                                                            ? 'brand.default'
                                                            : 'accent-5'
                                                    }
                                                />
                                                <Icon
                                                    as={FiStar}
                                                    boxSize={8}
                                                    fill="currentcolor"
                                                    color={
                                                        rnr.ratings >= 3
                                                            ? 'brand.default'
                                                            : 'accent-5'
                                                    }
                                                />
                                                <Icon
                                                    as={FiStar}
                                                    boxSize={8}
                                                    fill="currentcolor"
                                                    color={
                                                        rnr.ratings >= 4
                                                            ? 'brand.default'
                                                            : 'accent-5'
                                                    }
                                                />
                                                <Icon
                                                    as={FiStar}
                                                    boxSize={8}
                                                    fill="currentcolor"
                                                    color={
                                                        rnr.ratings >= 5
                                                            ? 'brand.default'
                                                            : 'accent-5'
                                                    }
                                                />
                                            </Flex>

                                            <Text
                                                fontWeight="medium"
                                                color="accent-1"
                                            >
                                                {rnr.ratings === 5
                                                    ? 'Amazing'
                                                    : rnr.ratings === 4
                                                    ? 'Good'
                                                    : rnr.ratings === 3
                                                    ? 'Fair'
                                                    : rnr.ratings === 2
                                                    ? 'Poor'
                                                    : rnr.ratings === 1 &&
                                                      'Terrible'}
                                            </Text>
                                        </Flex>

                                        <Textarea
                                            value={rnr.reviews}
                                            size="lg"
                                            h={220}
                                            readOnly
                                        />

                                        <Image
                                            alt={rnr.reviews}
                                            src={rnr.image}
                                        />
                                    </Flex>
                                </Modal>
                            )}
                        </SimpleGrid>
                    </Card>
                </GridItem>

                <GridItem colSpan={2}>
                    <Card>
                        <Flex direction="column" gap={6}>
                            <Flex
                                justify="space-between"
                                align="center"
                                gap={6}
                            >
                                <Flex
                                    align="center"
                                    gap={3}
                                    color="brand.default"
                                >
                                    <Icon as={FiMapPin} boxSize={4} />
                                    <Text fontWeight="medium">
                                        Delivery Address
                                    </Text>
                                </Flex>
                            </Flex>

                            <Flex
                                bg="brand.alpha"
                                border="1px dashed"
                                borderColor="brand.default"
                                borderRadius={12}
                                p={6}
                            >
                                <Flex direction="column" gap={3}>
                                    <Flex direction="column">
                                        <Text
                                            fontSize="sm"
                                            fontWeight="semibold"
                                            color="accent-1"
                                        >
                                            {order.name}
                                        </Text>

                                        <Text
                                            fontSize="sm"
                                            fontWeight="semibold"
                                            color="accent-1"
                                        >
                                            {order.contact}
                                        </Text>
                                    </Flex>

                                    <Flex flex={1}>
                                        <Text
                                            fontSize="sm"
                                            textTransform="uppercase"
                                            color="accent-1"
                                        >
                                            {order.address.address},{' '}
                                            {order.address.barangay},{' '}
                                            {order.address.city},{' '}
                                            {order.address.region}{' '}
                                            {order.address.postal}
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Card>
                </GridItem>

                <GridItem display="grid" gap={6} colSpan={{ base: 2, lg: 1 }}>
                    {order.products.map((product) => (
                        <Card key={product.cart.id}>
                            <Flex gap={6}>
                                <Flex>
                                    <Image
                                        boxSize={24}
                                        alt={product.name}
                                        src={product.image}
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
                                            {product.name}
                                        </Text>

                                        <Text fontSize="sm">
                                            {product.color} - {product.size}
                                        </Text>
                                    </div>

                                    <Text fontWeight="medium" color="accent-1">
                                        x{product.quantity}
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
                                            product.price * product.quantity
                                        ).toLocaleString(undefined, {
                                            maximumFractionDigits: 2
                                        })}
                                    </Text>

                                    <Text
                                        fontWeight="medium"
                                        color="brand.default"
                                    >
                                        ₱
                                        {(
                                            product.price * product.quantity -
                                            product.price *
                                                product.quantity *
                                                (product.discount.percentage /
                                                    100)
                                        ).toLocaleString(undefined, {
                                            maximumFractionDigits: 2
                                        })}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Card>
                    ))}
                </GridItem>

                <GridItem colSpan={{ base: 2, lg: 1 }}>
                    <Card>
                        <Flex direction="column" gap={3}>
                            <Flex
                                justify="space-between"
                                align="center"
                                gap={6}
                            >
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="accent-1"
                                >
                                    Subtotal
                                </Text>

                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="accent-1"
                                >
                                    ₱
                                    {order.subtotal.toLocaleString(undefined, {
                                        maximumFractionDigits: 2
                                    })}
                                </Text>
                            </Flex>

                            <Flex
                                justify="space-between"
                                align="center"
                                gap={6}
                            >
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="accent-1"
                                >
                                    Discount
                                </Text>

                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="accent-1"
                                >
                                    - ₱
                                    {order.discount.toLocaleString(undefined, {
                                        maximumFractionDigits: 2
                                    })}
                                </Text>
                            </Flex>

                            <Flex
                                justify="space-between"
                                align="center"
                                gap={6}
                            >
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="accent-1"
                                >
                                    Shipping
                                </Text>

                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="accent-1"
                                >
                                    ₱
                                    {order.shipping.toLocaleString(undefined, {
                                        maximumFractionDigits: 2
                                    })}
                                </Text>
                            </Flex>

                            <Flex
                                justify="space-between"
                                align="center"
                                gap={6}
                            >
                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="accent-1"
                                >
                                    Payment Method
                                </Text>

                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="accent-1"
                                >
                                    {order.payment_method}
                                </Text>
                            </Flex>

                            <Divider />

                            <Flex
                                justify="space-between"
                                align="center"
                                gap={6}
                            >
                                <Text
                                    fontSize="xl"
                                    fontWeight="medium"
                                    color="accent-1"
                                >
                                    Total
                                </Text>

                                <Text
                                    fontSize="xl"
                                    fontWeight="medium"
                                    color="accent-1"
                                >
                                    ₱
                                    {order.total.toLocaleString(undefined, {
                                        maximumFractionDigits: 2
                                    })}
                                </Text>
                            </Flex>
                        </Flex>
                    </Card>
                </GridItem>
            </Grid>
        </Container>
    )
}

export default Order
