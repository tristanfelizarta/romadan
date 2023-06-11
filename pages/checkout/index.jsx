import { useState, useEffect } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import {
    Button,
    Container,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    Grid,
    GridItem,
    Icon,
    Image,
    Select,
    Spinner,
    Text,
    useToast
} from '@chakra-ui/react'
import { FiMapPin } from 'react-icons/fi'
import Card from 'components/card'
import Toast from 'components/toast'

const Checkout = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const { data: carts, isFetched: isCartsFetched } = useQuery(['carts'], () =>
        api.get('/carts', session.user.id)
    )
    const [mounted, setMounted] = useState(false)
    const toast = useToast()

    if (!session) {
        router.push('/')
    }

    const {
        register,
        watch,
        formState: { errors },
        handleSubmit
    } = useForm()

    const subtotal = (data) => {
        let sum = 0

        data.forEach((data) => {
            sum += data.price * data.quantity
        })

        return sum
    }

    const discount = (data) => {
        let sum = 0

        data.forEach((data) => {
            sum += data.price * data.quantity * (data.discount.percentage / 100)
        })

        return sum
    }

    const shipping = 40

    const total = (data) => {
        return subtotal(data) - discount(data) + shipping
    }

    const orderMutation = useMutation((data) => api.create('/orders', data), {
        onSuccess: () => {
            queryClient.invalidateQueries('orders')

            toast({
                position: 'top',
                render: () => (
                    <Toast
                        title="Success"
                        description="Order successfully added."
                    />
                )
            })

            router.push('/user/orders')
        }
    })

    const placeOrder = () => {
        orderMutation.mutate({
            user: {
                id: session.user.id
            },
            image: session.user.image,
            name: session.user.name,
            email: session.user.email,
            contact: session.user.contact,
            address: session.user.address,
            products: carts,
            subtotal: subtotal(carts),
            discount: discount(carts),
            shipping: shipping,
            total: total(carts),
            payment_method: watch('payment_method')
        })
    }

    useEffect(() => {
        if (isCartsFetched) {
            setMounted(true)
        }
    }, [isCartsFetched])

    if (!mounted || !isCartsFetched) {
        return (
            <Flex p={6}>
                <Spinner color="brand.default" />
            </Flex>
        )
    }

    return (
        <Container>
            <Grid alignItems="start" templateColumns="2fr 1fr" gap={6}>
                <GridItem colSpan={2}>
                    <Text fontSize="2xl" fontWeight="semibold" color="accent-1">
                        Checkout
                    </Text>
                </GridItem>

                <GridItem display="grid" gap={6} colSpan={{ base: 2, lg: 1 }}>
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

                                <NextLink href="/user/address" passHref>
                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="brand.default"
                                        cursor="pointer"
                                    >
                                        Change
                                    </Text>
                                </NextLink>
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
                                            {session.user.name}
                                        </Text>

                                        <Text
                                            fontSize="sm"
                                            fontWeight="semibold"
                                            color="accent-1"
                                        >
                                            {session.user.contact}
                                        </Text>
                                    </Flex>

                                    <Flex flex={1}>
                                        <Text
                                            fontSize="sm"
                                            textTransform="uppercase"
                                            color="accent-1"
                                        >
                                            {session.user.address.address},{' '}
                                            {session.user.address.barangay},{' '}
                                            {session.user.address.city},{' '}
                                            {session.user.address.region}{' '}
                                            {session.user.address.postal}
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Card>

                    {carts.map((product) => (
                        <Card key={product.cart.id}>
                            <Flex gap={6}>
                                <NextLink
                                    href={`/products/${product.product.id}`}
                                    passHref
                                >
                                    <Flex>
                                        <Image
                                            boxSize={24}
                                            alt={product.name}
                                            src={product.image}
                                        />
                                    </Flex>
                                </NextLink>

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
                                        {product.price.toLocaleString(
                                            undefined,
                                            { maximumFractionDigits: 2 }
                                        )}
                                    </Text>

                                    <Text
                                        fontWeight="medium"
                                        color="brand.default"
                                    >
                                        ₱
                                        {(
                                            product.price -
                                            product.price *
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

                <GridItem display="grid" gap={6} colSpan={{ base: 2, lg: 1 }}>
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
                                    {subtotal(carts).toLocaleString(undefined, {
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
                                    {discount(carts).toLocaleString(undefined, {
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
                                    {shipping.toLocaleString(undefined, {
                                        maximumFractionDigits: 2
                                    })}
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
                                    {total(carts).toLocaleString(undefined, {
                                        maximumFractionDigits: 2
                                    })}
                                </Text>
                            </Flex>
                        </Flex>
                    </Card>

                    <Card>
                        <form onSubmit={handleSubmit(placeOrder)}>
                            <Flex direction="column" gap={6}>
                                <FormControl isInvalid={errors.payment_method}>
                                    <Select
                                        placeholder="Payment Methods"
                                        size="lg"
                                        {...register('payment_method', {
                                            required: true
                                        })}
                                    >
                                        <option value="cod">
                                            Cash On Delivery
                                        </option>
                                    </Select>

                                    <FormErrorMessage>
                                        This field is required.
                                    </FormErrorMessage>
                                </FormControl>

                                <Button
                                    type="submit"
                                    size="lg"
                                    colorScheme="brand"
                                >
                                    Place Order
                                </Button>
                            </Flex>
                        </form>
                    </Card>
                </GridItem>
            </Grid>
        </Container>
    )
}

export default Checkout
