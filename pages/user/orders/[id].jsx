import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import api from 'instance'
import {
    Button,
    Container,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Icon,
    Image,
    Input,
    Select,
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

const RnRModal = ({ order }) => {
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const disclosure = useDisclosure()
    const [image, setImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const { register, watch, setValue, handleSubmit } = useForm()

    const handleImage = (e) => {
        const file = e.target.files[0]

        if (!file) {
            toast({
                position: 'top',
                render: () => (
                    <Toast
                        title="Invalid Image"
                        description="file does not exists."
                        status="error"
                    />
                )
            })

            return
        }

        if (file.size > 5120 * 5120) {
            toast({
                position: 'top',
                render: () => (
                    <Toast
                        title="Invalid Image"
                        description="Largest image size is 5mb."
                        status="error"
                    />
                )
            })

            return
        }

        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
            toast({
                position: 'top',
                render: () => (
                    <Toast
                        title="Invalid Image"
                        description="Image format is incorrect."
                        status="error"
                    />
                )
            })

            return
        }

        setImage(file)
    }

    const rnr = useMutation((data) => api.create('/rnr', data), {
        onSuccess: () => {
            queryClient.invalidateQueries('rnr')
            setIsLoading(false)
            disclosure.onClose()

            toast({
                position: 'top',
                render: () => (
                    <Toast
                        title="Success"
                        description="Thanks for your ratings and reviews."
                    />
                )
            })
        }
    })

    const onSubmit = async (data) => {
        setIsLoading(true)

        let res = null

        for (const item of [image]) {
            const formData = new FormData()

            formData.append('file', item)
            formData.append('upload_preset', 'products')

            res = await axios.post(
                'https://api.cloudinary.com/v1_1/romadan/image/upload',
                formData
            )
        }

        rnr.mutate({
            name: session.user.name,
            email: session.user.email,
            avatar: session.user.image,
            address: session.user.address,
            order: {
                id: order._id
            },
            ratings: Number(data.ratings),
            reviews: data.reviews,
            image: res.data.secure_url
        })
    }

    useEffect(() => {
        setValue('ratings', '5')
    }, [])

    return (
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
                    _hover={{ shadow: 'md', _dark: { shadow: 'dark-xl' } }}
                    onClick={() => (order.to_rate.status ? null : onOpen())}
                >
                    <Flex
                        bg={
                            order.to_rate.status ? 'brand.alpha' : 'transparent'
                        }
                        justify="center"
                        align="center"
                        border="2px solid"
                        borderColor={
                            order.to_rate.status ? 'brand.default' : 'accent-5'
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
                        <Text fontWeight="semibold" color="accent-1">
                            To Rate
                        </Text>

                        <Text fontSize="xs">
                            {order.to_rate.date.split(',')[0]}
                            <br />
                            {order.to_rate.date.split(',')[1]}
                        </Text>
                    </Flex>
                </Flex>
            )}
            disclosure={disclosure}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex align="center" direction="column" gap={6}>
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
                                    Number(watch('ratings')) >= 1
                                        ? 'brand.default'
                                        : 'accent-5'
                                }
                            />
                            <Icon
                                as={FiStar}
                                boxSize={8}
                                fill="currentcolor"
                                color={
                                    Number(watch('ratings')) >= 2
                                        ? 'brand.default'
                                        : 'accent-5'
                                }
                            />
                            <Icon
                                as={FiStar}
                                boxSize={8}
                                fill="currentcolor"
                                color={
                                    Number(watch('ratings')) >= 3
                                        ? 'brand.default'
                                        : 'accent-5'
                                }
                            />
                            <Icon
                                as={FiStar}
                                boxSize={8}
                                fill="currentcolor"
                                color={
                                    Number(watch('ratings')) >= 4
                                        ? 'brand.default'
                                        : 'accent-5'
                                }
                            />
                            <Icon
                                as={FiStar}
                                boxSize={8}
                                fill="currentcolor"
                                color={
                                    Number(watch('ratings')) >= 5
                                        ? 'brand.default'
                                        : 'accent-5'
                                }
                            />
                        </Flex>

                        <Text fontWeight="medium" color="accent-1">
                            {Number(watch('ratings')) === 5
                                ? 'Amazing'
                                : Number(watch('ratings')) === 4
                                ? 'Good'
                                : Number(watch('ratings')) === 3
                                ? 'Fair'
                                : Number(watch('ratings')) === 2
                                ? 'Poor'
                                : Number(watch('ratings')) === 1 && 'Terrible'}
                        </Text>
                    </Flex>

                    <FormControl>
                        <FormLabel>Ratings</FormLabel>

                        <Select size="lg" {...register('ratings')}>
                            <option value={5}>5 Star</option>
                            <option value={4}>4 Star</option>
                            <option value={3}>3 Star</option>
                            <option value={2}>2 Star</option>
                            <option value={1}>1 Star</option>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Review</FormLabel>
                        <Textarea
                            placeholder="Share more thoughts on the product to help other buyers."
                            h={220}
                            {...register('reviews')}
                        ></Textarea>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Upload Image</FormLabel>
                        <Input type="file" onChange={handleImage} />
                    </FormControl>

                    <Flex justify="end" align="center" gap={3} w="full">
                        <Button size="lg" onClick={disclosure.onClose}>
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            size="lg"
                            colorScheme="brand"
                            isLoading={isLoading}
                        >
                            Submit
                        </Button>
                    </Flex>
                </Flex>
            </form>
        </Modal>
    )
}

const Order = () => {
    const router = useRouter()
    const { id } = router.query
    const queryClient = useQueryClient()
    const { data: order, isFetched: isOrderFetched } = useQuery(
        ['order', id],
        () => api.get('/orders', id)
    )
    const [mounted, setMounted] = useState(false)
    const toast = useToast()

    const orderStatusMutation = useMutation(
        (data) => api.update('/orders', id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('orders')

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
            case 'completed':
                if (order.completed.status) {
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

    if (!mounted || !isOrderFetched) {
        return (
            <Flex p={6}>
                <Spinner color="brand.default" />
            </Flex>
        )
    }

    return (
        <Container>
            <Grid templateColumns="2fr 1fr" alignItems="start" gap={6}>
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
                        <Flex
                            justify="space-evenly"
                            align={{ base: 'center', lg: 'start' }}
                            direction={{ base: 'column', lg: 'row' }}
                        >
                            <Flex
                                as="button"
                                align="center"
                                direction="column"
                                gap={3}
                                borderRadius={12}
                                p={6}
                                cursor="default"
                                transition=".4s"
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
                                cursor="default"
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
                                cursor="default"
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
                                    !order.to_receive.status ||
                                    order.completed.status
                                        ? 'default'
                                        : 'pointer'
                                }
                                disabled={
                                    !order.to_receive.status ||
                                    order.completed.status
                                }
                                _hover={{
                                    shadow: !order.completed.status && 'md',
                                    _dark: {
                                        shadow:
                                            !order.completed.status && 'dark-xl'
                                    }
                                }}
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

                            {((order.payment_method !== 'paypal' &&
                                !order.to_ship.status) ||
                                order.cancelled.status) && (
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
                                        shadow: !order.cancelled.status && 'md',
                                        _dark: {
                                            shadow:
                                                !order.cancelled.status &&
                                                'dark-xl'
                                        }
                                    }}
                                    disabled={order.cancelled.status}
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
                                            {order.cancelled.date.split(',')[0]}
                                            <br />
                                            {order.cancelled.date.split(',')[1]}
                                        </Text>
                                    </Flex>
                                </Flex>
                            )}

                            {!order.cancelled.status &&
                                order.completed.status && (
                                    <RnRModal order={order} />
                                )}
                        </Flex>
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
