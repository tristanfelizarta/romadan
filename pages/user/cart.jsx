import { useState, useEffect } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import {
    Button,
    Container,
    Divider,
    Flex,
    Image,
    Spinner,
    Text,
    useToast
} from '@chakra-ui/react'
import Card from 'components/card'
import Toast from 'components/toast'

const Cart = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: session } = useSession()
    const { data: carts, isFetched: isCartsFetched } = useQuery(['carts'], () =>
        api.get('/carts', session.user.id)
    )
    const [mounted, setMounted] = useState(false)
    const [removeCartItemId, setRemoveCartItemId] = useState(null)
    const [isRemoveCartItemLoading, setIsRemoveCartItemLoading] =
        useState(false)
    const toast = useToast()

    const removeCartItemMutation = useMutation(
        (data) => api.remove('/carts', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('variants')
                setRemoveCartItemId(null)
                setIsRemoveCartItemLoading(false)

                toast({
                    position: 'top',
                    render: () => (
                        <Toast
                            title="Success"
                            description="Cart item successfully removed."
                        />
                    )
                })
            }
        }
    )

    const removeCartItem = (id) => {
        setRemoveCartItemId(id)
        setIsRemoveCartItemLoading(true)

        removeCartItemMutation.mutate({
            user: session.user.id,
            cart: id
        })
    }

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

    const total = (data) => {
        return subtotal(data) - discount(data)
    }

    const proceed = () => {
        if (carts.length === 0) {
            toast({
                position: 'top',
                render: () => (
                    <Toast
                        title="Empty Cart"
                        description="Please add products."
                        status="error"
                    />
                )
            })
        } else {
            router.push('/checkout')
        }
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
            <Flex direction="column" gap={6}>
                <Flex justify="space-between" align="center" gap={6}>
                    <Text fontSize="2xl" fontWeight="semibold" color="accent-1">
                        Shopping Cart
                    </Text>
                </Flex>

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
                                    <Text fontWeight="medium" color="accent-1">
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
                                <Flex align="center" gap={2}>
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

                                <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="brand.default"
                                    cursor="pointer"
                                    onClick={() =>
                                        removeCartItem(product.cart.id)
                                    }
                                >
                                    Remove
                                </Text>
                            </Flex>
                        </Flex>
                    </Card>
                ))}

                <Card>
                    <Flex direction="column" gap={3}>
                        <Flex justify="space-between" align="center" gap={6}>
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

                        <Flex justify="space-between" align="center" gap={6}>
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

                        <Divider />

                        <Flex justify="space-between" align="center" gap={6}>
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

                <Flex justify="end" align="center">
                    <Button size="lg" colorScheme="brand" onClick={proceed}>
                        Proceed To Checkout
                    </Button>
                </Flex>
            </Flex>
        </Container>
    )
}

export default Cart
