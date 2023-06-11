import { useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
    Text,
    Textarea,
    useToast
} from '@chakra-ui/react'
import { FiPlus, FiX } from 'react-icons/fi'
import Card from 'components/card'
import Toast from 'components/toast'

const Add = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [image, setImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const {
        register,
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
        console.log(file)
    }

    const productMutation = useMutation(
        (data) => api.create('/products', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('products')
                setIsLoading(false)
                router.push('/admin/products')
            }
        }
    )

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

        productMutation.mutate({
            image: res.data.secure_url,
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
                                        src={URL.createObjectURL(image)}
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
                                        Set the product image. Only *.png,
                                        *.jpg, and *.jpeg image files are
                                        accepted.
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

                                <Text fontSize="xs">
                                    No data is available. Once the product is
                                    released, sales data will begin to be
                                    collected.
                                </Text>
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
                                        size="lg"
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

export default Add
