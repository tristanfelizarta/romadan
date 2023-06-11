import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import api from 'instance'
import {
    Button,
    chakra,
    Container,
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Grid,
    GridItem,
    Icon,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Spinner,
    Text,
    Textarea,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { FiMinus, FiPlus, FiX } from 'react-icons/fi'
import Card from 'components/card'
import Toast from 'components/toast'

const View = () => {
    const router = useRouter()
    const { id } = router.query
    const queryClient = useQueryClient()
    const { data: product, isFetched: isProductFetched } = useQuery(
        ['products', id],
        () => api.get('/products', id)
    )
    const { data: variants, isFetched: isVariantsFetched } = useQuery(
        ['variants'],
        () => api.get('/variants', id)
    )
    const [mounted, setMounted] = useState(false)
    const [image, setImage] = useState(null)
    const disclosure = useDisclosure()
    const [isAddVariantLoading, setIsAddVariantLoading] = useState(false)
    const [removeVariantId, setRemoveVariantId] = useState(null)
    const [isRemoveVariantLoading, setIsRemoveVariantLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec'
    ]

    const {
        register,
        setValue,
        watch,
        formState: { errors },
        resetField,
        handleSubmit
    } = useForm()

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

    const productMutation = useMutation(
        (data) => api.update('/products', id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('products')

                setTimeout(() => {
                    setIsLoading(false)
                    router.push('/admin/products')
                }, 1000)
            }
        }
    )

    const addVariantMutation = useMutation(
        (data) => api.create('/variants', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('variants')
                setIsAddVariantLoading(false)
                resetField('color')
                resetField('size')
                resetField('quantity')
            }
        }
    )

    const removeVariantMutation = useMutation(
        (data) => api.remove('/variants', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('variants')
                setRemoveVariantId(null)
                setIsRemoveVariantLoading(false)
            }
        }
    )

    const addVariant = () => {
        setIsAddVariantLoading(true)

        addVariantMutation.mutate({
            product: {
                id: id
            },
            variant: {
                color: watch('color'),
                size: watch('size'),
                quantity: watch('quantity')
            }
        })
    }

    const removeVariant = (product, variant) => {
        setRemoveVariantId(variant)
        setIsRemoveVariantLoading(true)

        removeVariantMutation.mutate({
            product: product,
            variant: variant
        })
    }

    const onSubmit = async (data) => {
        setIsLoading(true)

        let res = null

        if (typeof image === 'object') {
            for (const item of [image]) {
                const formData = new FormData()

                formData.append('file', item)
                formData.append('upload_preset', 'products')

                res = await axios.post(
                    'https://api.cloudinary.com/v1_1/romadan/image/upload',
                    formData
                )
            }
        }

        productMutation.mutate({
            image:
                typeof image === 'object' ? res.data.secure_url : product.image,
            name: data.name,
            description: data.description,
            inventory: {
                shelf: data.shelf,
                warehouse: data.warehouse
            },
            shipping: {
                weight: data.weight,
                width: data.width,
                height: data.height,
                length: data.length
            },
            price: data.price,
            discount: {
                percentage: data.percentage
            },
            status: data.status
        })
    }

    useEffect(() => {
        if (isProductFetched) {
            setImage(product.image)
            setValue('name', product.name)
            setValue('description', product.description)
            setValue('shelf', product.inventory.shelf)
            setValue('warehouse', product.inventory.warehouse)
            setValue('weight', product.shipping.weight)
            setValue('width', product.shipping.width)
            setValue('height', product.shipping.height)
            setValue('length', product.shipping.length)
            setValue('price', product.price)
            setValue('percentage', product.discount.percentage)
            setMounted(true)
        }
    }, [isProductFetched])

    if (!mounted || !isProductFetched || !isVariantsFetched) {
        return (
            <Flex p={6}>
                <Spinner color="brand.default" />
            </Flex>
        )
    }

    return (
        <Container>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                    alignItems="start"
                    templateColumns={{ base: '1fr', lg: '300px 1fr' }}
                    gap={6}
                >
                    <GridItem display="grid" gap={6}>
                        <Card>
                            <Flex direction="column" gap={6}>
                                <Flex
                                    position="relative"
                                    justify="space-between"
                                    align="center"
                                    gap={6}
                                >
                                    <Text
                                        fontSize="xl"
                                        fontWeight="semibold"
                                        color="accent-1"
                                    >
                                        Image
                                    </Text>

                                    {image && (
                                        <IconButton
                                            position="absolute"
                                            right={0}
                                            borderRadius="full"
                                            variant="tinted"
                                            size="xs"
                                            colorScheme="brand"
                                            icon={<FiX size={12} />}
                                            onClick={() => setImage(null)}
                                        />
                                    )}
                                </Flex>

                                {image ? (
                                    <Image
                                        alt="product"
                                        src={
                                            typeof image === 'object'
                                                ? URL.createObjectURL(image)
                                                : image
                                        }
                                    />
                                ) : (
                                    <Flex
                                        bg="brand.alpha"
                                        position="relative"
                                        align="center"
                                        direction="column"
                                        gap={2}
                                        border="1px dashed"
                                        borderColor="brand.default"
                                        borderRadius={12}
                                        px={6}
                                        py={12}
                                    >
                                        <chakra.input
                                            type="file"
                                            position="absolute"
                                            top={0}
                                            left={0}
                                            h="full"
                                            w="full"
                                            opacity={0}
                                            cursor="pointer"
                                            onChange={handleImage}
                                        />
                                        <Icon
                                            as={FiPlus}
                                            boxSize={6}
                                            color="brand.default"
                                        />

                                        <Text
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color="brand.default"
                                        >
                                            Add Image
                                        </Text>
                                    </Flex>
                                )}

                                {!image && (
                                    <Text fontSize="xs" textAlign="center">
                                        Set the product image. Only *.png, *.jpg
                                        and *.jpeg image files are accepted
                                    </Text>
                                )}
                            </Flex>
                        </Card>

                        <Card>
                            <Flex direction="column" gap={6}>
                                <Flex
                                    justify="space-between"
                                    align="center"
                                    gap={6}
                                >
                                    <Text
                                        fontSize="xl"
                                        fontWeight="semibold"
                                        color="accent-1"
                                    >
                                        Status
                                    </Text>

                                    <chakra.span
                                        bg="brand.default"
                                        borderRadius="full"
                                        h={4}
                                        w={4}
                                    />
                                </Flex>

                                <Select
                                    defaultValue={product.status}
                                    size="lg"
                                    {...register('status', { required: true })}
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                    <option value="inactive">Inactive</option>
                                </Select>
                            </Flex>
                        </Card>

                        <Card>
                            <Flex direction="column" gap={6}>
                                <Text
                                    fontSize="xl"
                                    fontWeight="semibold"
                                    color="accent-1"
                                >
                                    Sales
                                </Text>

                                <FormControl>
                                    <FormLabel>Sold</FormLabel>
                                    <Input
                                        value={product.sold}
                                        size="lg"
                                        readOnly
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Total Sales</FormLabel>

                                    <InputGroup>
                                        <InputLeftElement pt={1} pl={1}>
                                            ₱
                                        </InputLeftElement>

                                        <Input
                                            value={product.total_sales.toLocaleString(
                                                undefined,
                                                { maximumFractionDigits: 2 }
                                            )}
                                            size="lg"
                                            readOnly
                                        />
                                    </InputGroup>
                                </FormControl>
                            </Flex>
                        </Card>

                        <Card>
                            <Flex direction="column" gap={6}>
                                <Text
                                    fontSize="xl"
                                    fontWeight="semibold"
                                    color="accent-1"
                                >
                                    Updated
                                </Text>

                                <FormControl>
                                    <FormLabel>Time</FormLabel>
                                    <Input
                                        value={product.updated.split(',')[1]}
                                        size="lg"
                                        readOnly
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Date</FormLabel>
                                    <Input
                                        value={
                                            months[
                                                product.updated
                                                    .split(',')[0]
                                                    .split('/')[0] - 1
                                            ] +
                                            ' ' +
                                            product.updated
                                                .split(',')[0]
                                                .split('/')[1] +
                                            ', ' +
                                            product.updated
                                                .split(',')[0]
                                                .split('/')[2]
                                        }
                                        size="lg"
                                        readOnly
                                    />
                                </FormControl>
                            </Flex>
                        </Card>

                        <Card>
                            <Flex direction="column" gap={6}>
                                <Text
                                    fontSize="xl"
                                    fontWeight="semibold"
                                    color="accent-1"
                                >
                                    Created
                                </Text>

                                <FormControl>
                                    <FormLabel>Time</FormLabel>
                                    <Input
                                        value={product.created.split(',')[1]}
                                        size="lg"
                                        readOnly
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Date</FormLabel>
                                    <Input
                                        value={
                                            months[
                                                product.created
                                                    .split(',')[0]
                                                    .split('/')[0] - 1
                                            ] +
                                            ' ' +
                                            product.created
                                                .split(',')[0]
                                                .split('/')[1] +
                                            ', ' +
                                            product.created
                                                .split(',')[0]
                                                .split('/')[2]
                                        }
                                        size="lg"
                                        readOnly
                                    />
                                </FormControl>
                            </Flex>
                        </Card>
                    </GridItem>

                    <GridItem display="grid" gap={6}>
                        <Card>
                            <Flex direction="column" gap={6}>
                                <Text
                                    fontSize="xl"
                                    fontWeight="semibold"
                                    color="accent-1"
                                >
                                    General
                                </Text>

                                <FormControl isInvalid={errors.name}>
                                    <FormLabel>
                                        Product Name{' '}
                                        <chakra.span color="red.default">
                                            *
                                        </chakra.span>
                                    </FormLabel>

                                    <Input
                                        size="lg"
                                        {...register('name', {
                                            required: true
                                        })}
                                    />
                                    <FormErrorMessage>
                                        This field is required.
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.description}>
                                    <FormLabel>
                                        Description{' '}
                                        <chakra.span color="red.default">
                                            *
                                        </chakra.span>
                                    </FormLabel>

                                    <Textarea
                                        size="lg"
                                        minH={132}
                                        {...register('description', {
                                            required: true
                                        })}
                                    ></Textarea>
                                    <FormErrorMessage>
                                        This field is required.
                                    </FormErrorMessage>
                                </FormControl>
                            </Flex>
                        </Card>

                        <Card>
                            <Flex direction="column" gap={6}>
                                <Text
                                    fontSize="xl"
                                    fontWeight="semibold"
                                    color="accent-1"
                                >
                                    Inventory
                                </Text>

                                <FormControl>
                                    <FormLabel>Identification</FormLabel>
                                    <Input
                                        defaultValue={product._id}
                                        size="lg"
                                        textTransform="uppercase"
                                        cursor="not-allowed"
                                        readOnly
                                    />
                                    <FormHelperText>
                                        Product identification will
                                        automatically be generated once the
                                        product has been published.
                                    </FormHelperText>
                                    <FormErrorMessage>
                                        This field is required.
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl
                                    isInvalid={errors.shelf || errors.warehouse}
                                >
                                    <FormLabel>
                                        Quantity{' '}
                                        <chakra.span color="red.default">
                                            *
                                        </chakra.span>
                                    </FormLabel>

                                    <Flex align="center" gap={6}>
                                        <Input
                                            type="number"
                                            placeholder="On shelf"
                                            size="lg"
                                            {...register('shelf', {
                                                required: true
                                            })}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="In warehouse"
                                            size="lg"
                                            {...register('warehouse', {
                                                required: true
                                            })}
                                        />
                                    </Flex>

                                    <FormErrorMessage>
                                        This field is required.
                                    </FormErrorMessage>
                                </FormControl>
                            </Flex>
                        </Card>

                        <Card>
                            <Flex direction="column" gap={6}>
                                <Text
                                    fontSize="xl"
                                    fontWeight="semibold"
                                    color="accent-1"
                                >
                                    Variants
                                </Text>

                                <FormControl>
                                    <FormLabel>
                                        Add Product Variantions
                                    </FormLabel>

                                    <Flex direction="column" gap={6}>
                                        <Flex align="center" gap={6}>
                                            <Input
                                                placeholder="Color"
                                                size="lg"
                                                {...register('color')}
                                            />
                                            <Input
                                                placeholder="Size"
                                                size="lg"
                                                {...register('size')}
                                            />
                                            {/* <Input type="number" placeholder="Quantity" size="lg" {...register('quantity')} /> */}
                                            <IconButton
                                                variant="tinted"
                                                size="lg"
                                                colorScheme="brand"
                                                icon={<FiPlus size={16} />}
                                                isLoading={isAddVariantLoading}
                                                onClick={addVariant}
                                            />
                                        </Flex>

                                        {variants.map((variant) => (
                                            <Flex
                                                align="center"
                                                gap={6}
                                                key={variant._id}
                                            >
                                                <Input
                                                    value={variant.color}
                                                    size="lg"
                                                    textTransform="capitalize"
                                                    readOnly
                                                />
                                                <Input
                                                    value={variant.size}
                                                    size="lg"
                                                    textTransform="capitalize"
                                                    readOnly
                                                />
                                                {/* <Input value={variant.quantity} type="number" size="lg" readOnly /> */}
                                                <IconButton
                                                    variant="tinted"
                                                    size="lg"
                                                    colorScheme="red"
                                                    icon={<FiMinus size={16} />}
                                                    isLoading={
                                                        isRemoveVariantLoading &&
                                                        removeVariantId ===
                                                            variant._id
                                                    }
                                                    onClick={() =>
                                                        removeVariant(
                                                            product._id,
                                                            variant._id
                                                        )
                                                    }
                                                />
                                            </Flex>
                                        ))}
                                    </Flex>
                                </FormControl>
                            </Flex>
                        </Card>

                        <Card>
                            <Flex direction="column" gap={6}>
                                <Text
                                    fontSize="xl"
                                    fontWeight="semibold"
                                    color="accent-1"
                                >
                                    Shipping
                                </Text>

                                <FormControl>
                                    <FormLabel>Weight</FormLabel>
                                    <Input
                                        type="number"
                                        size="lg"
                                        {...register('weight')}
                                    />
                                    <FormHelperText>
                                        Set a product weight in kilograms (kg).
                                    </FormHelperText>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Dimension</FormLabel>

                                    <Flex align="center" gap={6}>
                                        <Input
                                            type="number"
                                            placeholder="Width"
                                            size="lg"
                                            {...register('width')}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Height"
                                            size="lg"
                                            {...register('height')}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Length"
                                            size="lg"
                                            {...register('length')}
                                        />
                                    </Flex>

                                    <FormHelperText>
                                        Enter the product dimensions in
                                        centimeters (cm).
                                    </FormHelperText>
                                </FormControl>
                            </Flex>
                        </Card>

                        <Card>
                            <Flex direction="column" gap={6}>
                                <Text
                                    fontSize="xl"
                                    fontWeight="semibold"
                                    color="accent-1"
                                >
                                    Pricing
                                </Text>

                                <FormControl isInvalid={errors.price}>
                                    <FormLabel>
                                        Base Price{' '}
                                        <chakra.span color="red.default">
                                            *
                                        </chakra.span>
                                    </FormLabel>

                                    <InputGroup>
                                        <InputLeftElement pt={1} pl={1}>
                                            ₱
                                        </InputLeftElement>

                                        <Input
                                            type="number"
                                            size="lg"
                                            {...register('price', {
                                                required: true
                                            })}
                                        />
                                    </InputGroup>

                                    <FormErrorMessage>
                                        This field is required.
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Discount Percentage</FormLabel>

                                    <InputGroup>
                                        <InputLeftElement pt={1} pl={1}>
                                            %
                                        </InputLeftElement>

                                        <Input
                                            type="number"
                                            size="lg"
                                            {...register('percentage')}
                                        />
                                    </InputGroup>
                                </FormControl>
                            </Flex>
                        </Card>

                        <Flex justify="end" align="center" gap={3}>
                            <Button size="lg">Cancel</Button>

                            <Button
                                type="submit"
                                size="lg"
                                colorScheme="brand"
                                isLoading={isLoading}
                            >
                                Save Changes
                            </Button>
                        </Flex>
                    </GridItem>
                </Grid>
            </form>
        </Container>
    )
}

export default View
