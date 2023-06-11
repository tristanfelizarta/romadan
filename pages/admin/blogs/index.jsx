import { useState, useEffect } from 'react'
import NextLink from 'next/link'
import NextHead from 'next/head'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import axios from 'axios'
import {
    Badge,
    Box,
    Button,
    chakra,
    Container,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Icon,
    IconButton,
    Input,
    Modal as ChakraModal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Select,
    SimpleGrid,
    Skeleton,
    Spinner,
    Text,
    Textarea,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import {
    FiAlertTriangle,
    FiArchive,
    FiEdit2,
    FiImage,
    FiX
} from 'react-icons/fi'
import Card from 'components/card'
import Toast from 'components/toast'
import { useForm } from 'react-hook-form'

const Modal = (props) => {
    const { children, isOpen, onClose, header, title } = props

    return (
        <ChakraModal
            preserveScrollBarGap
            isOpen={isOpen}
            onClose={onClose}
            {...props}
        >
            <ModalOverlay />

            <ModalContent>
                {!header || header !== 'off' ? (
                    <ModalHeader
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Text>{title ? title : null}</Text>

                        <IconButton
                            size="sm"
                            borderRadius="full"
                            icon={<FiX size={16} />}
                            onClick={onClose}
                        />
                    </ModalHeader>
                ) : null}

                <ModalBody>{children}</ModalBody>
            </ModalContent>
        </ChakraModal>
    )
}

const Blogs = () => {
    const { data: session } = useSession()

    const queryClient = useQueryClient()
    const { data: blogs, isFetched: isBlogFetched } = useQuery(['blogs'], () =>
        api.all('/blogs')
    )

    const {
        isOpen: isAddOpen,
        onOpen: onAddOpen,
        onClose: onAddClose
    } = useDisclosure()
    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onClose: onEditClose
    } = useDisclosure()
    const {
        isOpen: isInfoMessageOpen,
        onOpen: onInfoMessageOpen,
        onClose: onInfoMessageClose
    } = useDisclosure()

    const [image, setImage] = useState(null)
    const [imageURL, setImageURL] = useState('')
    const [imageError, setImageError] = useState('')
    const [isImageLoading, setIsImageLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [blogSelected, setBlogSelected] = useState(null)

    const toast = useToast()

    const {
        register,
        formState: { errors },
        reset,
        clearErrors,
        handleSubmit
    } = useForm()

    const handleImage = (e) => {
        const file = e.target.files[0]

        if (!file) return setImageError('file does not exists.')
        if (file.size > 5120 * 5120)
            return setImageError('Largest image size is 5mb.')
        if (file.type !== 'image/jpeg' && file.type !== 'image/png')
            return setImageError('Image format is incorrect.')

        setImage(file)
    }

    useEffect(() => {
        const controller = new AbortController()

        const uploadImage = async () => {
            if (image) {
                setIsImageLoading(true)

                for (const item of [image]) {
                    const formData = new FormData()

                    formData.append('file', item)
                    formData.append('upload_preset', 'uploads')

                    const res = await axios.post(
                        'https://api.cloudinary.com/v1_1/commence/image/upload',
                        formData,
                        { signal: controller.signal }
                    )
                    setImage(null)
                    setImageURL(res.data.secure_url)
                    setIsImageLoading(false)
                }
            }
        }

        uploadImage()

        return () => {
            controller.abort()
        }
    }, [image])

    const addBlogMutation = useMutation((data) => api.create('/blogs', data), {
        onSuccess: () => {
            queryClient.invalidateQueries('blogs')
            reset()
            setImageURL('')
            setIsLoading(false)
            onAddClose()

            toast({
                position: 'top',
                render: () => (
                    <Toast title="Success" message="Blog successfully added." />
                )
            })
        }
    })

    const editBlogMutation = useMutation(
        (data) => api.update('/blogs', blogSelected.id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('blogs')
                reset()
                setImageURL('')
                setIsLoading(false)
                onEditClose()

                toast({
                    position: 'bottom-left',
                    render: () => (
                        <Toast
                            title="Blog Updated."
                            message="Blog update successfully."
                            status={true}
                        />
                    )
                })
            }
        }
    )

    const archiveBlogMutation = useMutation(
        (data) => api.update('/blogs', blogSelected.id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('blogs')
                setIsLoading(false)
                onInfoMessageClose()

                toast({
                    position: 'top',
                    render: () => (
                        <Toast
                            title="Success"
                            message="Blog moved to archive."
                        />
                    )
                })
            }
        }
    )

    const onSubmit = (data) => {
        setIsLoading(true)

        addBlogMutation.mutate({
            data: {
                image: imageURL,
                title: data.title,
                content: data.content,
                status: data.status === 'true'
            }
        })
    }

    const onUpdate = (data) => {
        setIsLoading(true)

        editBlogMutation.mutate({
            data: {
                image: imageURL,
                title: data.title,
                content: data.content,
                status: data.status === 'true'
            }
        })
    }

    const onArchive = () => {
        setIsLoading(true)

        archiveBlogMutation.mutate({
            data: {
                archive: true
            }
        })
    }

    return (
        <>
            <NextHead>
                <title>Blogs</title>
            </NextHead>

            <Container>
                {!session && (
                    <Text
                        mb={12}
                        fontSize="4xl"
                        fontWeight="semibold"
                        textAlign="center"
                        color="accent-1"
                    >
                        TSVJ Blogs
                    </Text>
                )}

                {session && session.user.role === 'Admin' && (
                    <Flex justify="space-between" align="center" gap={6} mb={6}>
                        <Text
                            fontSize="xl"
                            fontWeight="semibold"
                            color="accent-1"
                        >
                            Blogs
                        </Text>

                        <Button
                            colorScheme="brand"
                            onClick={() =>
                                reset() ||
                                clearErrors() ||
                                setImageURL('') ||
                                onAddOpen()
                            }
                        >
                            Add New
                        </Button>
                    </Flex>
                )}

                <SimpleGrid
                    alignItems="start"
                    columns={{ base: 1, md: 2, xl: 3 }}
                    gap={6}
                >
                    {isBlogFetched ? (
                        blogs
                            .filter((data) =>
                                session && session.user.role === 'Admin'
                                    ? data
                                    : data.status
                            )
                            .map((blog) => (
                                <Card p={0} key={blog._id}>
                                    <NextLink
                                        href={`/admin/blogs/${blog._id}`}
                                        passHref
                                    >
                                        <Box
                                            bg="canvas-1"
                                            bgImage={blog.image}
                                            bgSize="cover"
                                            bgPos="top"
                                            position="relative"
                                            h={{ base: 200, xl: 164 }}
                                            w="full"
                                        />
                                    </NextLink>

                                    <Flex direction="column" gap={6} p={6}>
                                        <Flex direction="column" gap={3}>
                                            <Text
                                                fontSize="lg"
                                                fontWeight="semibold"
                                                color="accent-1"
                                                noOfLines={1}
                                            >
                                                {blog.title}
                                            </Text>

                                            <Text noOfLines={5}>
                                                {blog.content}
                                            </Text>

                                            <Text fontSize="sm">
                                                {blog.created}
                                            </Text>
                                        </Flex>

                                        {session &&
                                            session.user.role === 'Admin' && (
                                                <Flex
                                                    justify="space-between"
                                                    align="center"
                                                    gap={6}
                                                >
                                                    <Badge
                                                        variant="tinted"
                                                        size="md"
                                                        colorScheme={
                                                            blog.status
                                                                ? 'blue'
                                                                : 'yellow'
                                                        }
                                                    >
                                                        {blog.status
                                                            ? 'Published'
                                                            : 'Draft'}
                                                    </Badge>

                                                    <Flex
                                                        align="center"
                                                        gap={3}
                                                    >
                                                        <IconButton
                                                            icon={
                                                                <FiEdit2
                                                                    size={16}
                                                                />
                                                            }
                                                            onClick={() =>
                                                                reset() ||
                                                                clearErrors() ||
                                                                setBlogSelected(
                                                                    {
                                                                        id: blog._id,
                                                                        title: blog.title,
                                                                        content:
                                                                            blog.content,
                                                                        status: blog.status
                                                                    }
                                                                ) ||
                                                                setImageURL(
                                                                    blog.image
                                                                ) ||
                                                                onEditOpen()
                                                            }
                                                        />
                                                        <IconButton
                                                            icon={
                                                                <FiArchive
                                                                    size={16}
                                                                />
                                                            }
                                                            onClick={() =>
                                                                setBlogSelected(
                                                                    {
                                                                        id: blog._id
                                                                    }
                                                                ) ||
                                                                onInfoMessageOpen()
                                                            }
                                                        />
                                                    </Flex>
                                                </Flex>
                                            )}
                                    </Flex>
                                </Card>
                            ))
                    ) : (
                        <>
                            {[...Array(3)].map((data, index) => (
                                <Skeleton
                                    borderRadius={12}
                                    h={360}
                                    w="full"
                                    key={index}
                                />
                            ))}
                        </>
                    )}
                </SimpleGrid>
            </Container>

            <Modal
                title="Add Post"
                size="xl"
                isOpen={isAddOpen}
                onClose={onAddClose}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Flex direction="column" gap={6}>
                        <Flex
                            bgImage={imageURL}
                            bgRepeat="no-repeat"
                            bgSize="cover"
                            bgPos="center"
                            justify="center"
                            align="center"
                            direction="column"
                            gap={3}
                            position="relative"
                            border={!imageURL && '2px dashed'}
                            borderColor="border"
                            borderRadius={12}
                            h={256}
                            w="full"
                            color="accent-5"
                        >
                            {imageURL ? (
                                <IconButton
                                    position="absolute"
                                    top={3}
                                    right={3}
                                    color="accent-1"
                                    icon={<FiX size={16} />}
                                    onClick={() => setImageURL('')}
                                />
                            ) : (
                                <>
                                    {isImageLoading ? (
                                        <Spinner color="brand.default" />
                                    ) : (
                                        <>
                                            <chakra.input
                                                type="file"
                                                position="absolute"
                                                h="full"
                                                w="full"
                                                opacity={0}
                                                cursor="pointer"
                                                onChange={handleImage}
                                            />
                                            <Icon as={FiImage} boxSize={16} />
                                            <Text>Upload Image</Text>

                                            {imageError && (
                                                <Text
                                                    fontSize="sm"
                                                    color="red.default"
                                                >
                                                    {imageError}
                                                </Text>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </Flex>

                        <FormControl isInvalid={errors.title}>
                            <FormLabel>Title</FormLabel>
                            <Input
                                size="lg"
                                {...register('title', { required: true })}
                            />
                            <FormErrorMessage>
                                This field is required.
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.content}>
                            <FormLabel>Content</FormLabel>
                            <Textarea
                                minH={256}
                                {...register('content', { required: true })}
                            />
                            <FormErrorMessage>
                                This field is required.
                            </FormErrorMessage>
                        </FormControl>

                        <Flex justify="end" align="center" gap={3}>
                            <Select size="lg" w="auto" {...register('status')}>
                                <option value={false}>Draft</option>
                                <option value={true}>Publish</option>
                            </Select>

                            <Button
                                type="submit"
                                size="lg"
                                colorScheme="brand"
                                isLoading={isLoading}
                            >
                                Post
                            </Button>
                        </Flex>
                    </Flex>
                </form>
            </Modal>

            <Modal
                title="Add Post"
                size="xl"
                isOpen={isEditOpen}
                onClose={onEditClose}
            >
                <form onSubmit={handleSubmit(onUpdate)}>
                    <Flex direction="column" gap={6}>
                        <Flex
                            bgImage={imageURL}
                            bgRepeat="no-repeat"
                            bgSize="cover"
                            bgPos="center"
                            justify="center"
                            align="center"
                            direction="column"
                            gap={3}
                            position="relative"
                            border={!imageURL && '2px dashed'}
                            borderColor="border"
                            borderRadius={12}
                            h={256}
                            w="full"
                            color="accent-5"
                        >
                            {imageURL ? (
                                <IconButton
                                    position="absolute"
                                    top={3}
                                    right={3}
                                    color="accent-1"
                                    icon={<FiX size={16} />}
                                    onClick={() => setImageURL('')}
                                />
                            ) : (
                                <>
                                    {isImageLoading ? (
                                        <Spinner color="brand.default" />
                                    ) : (
                                        <>
                                            <chakra.input
                                                type="file"
                                                position="absolute"
                                                h="full"
                                                w="full"
                                                opacity={0}
                                                cursor="pointer"
                                                onChange={handleImage}
                                            />
                                            <Icon as={FiImage} boxSize={16} />
                                            <Text>Upload Image</Text>

                                            {imageError && (
                                                <Text
                                                    fontSize="sm"
                                                    color="red.default"
                                                >
                                                    {imageError}
                                                </Text>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </Flex>

                        <FormControl isInvalid={errors.title}>
                            <FormLabel>Title</FormLabel>
                            <Input
                                defaultValue={blogSelected?.title}
                                size="lg"
                                {...register('title', { required: true })}
                            />
                            <FormErrorMessage>
                                This field is required.
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.content}>
                            <FormLabel>Content</FormLabel>
                            <Textarea
                                defaultValue={blogSelected?.content}
                                minH={256}
                                {...register('content', { required: true })}
                            />
                            <FormErrorMessage>
                                This field is required.
                            </FormErrorMessage>
                        </FormControl>

                        <Flex justify="end" align="center" gap={3}>
                            <Select
                                defaultValue={blogSelected?.status}
                                size="lg"
                                w="auto"
                                {...register('status')}
                            >
                                <option value={false}>Draft</option>
                                <option value={true}>Publish</option>
                            </Select>

                            <Button
                                type="submit"
                                size="lg"
                                colorScheme="brand"
                                isLoading={isLoading}
                            >
                                Post
                            </Button>
                        </Flex>
                    </Flex>
                </form>
            </Modal>

            <Modal
                header="off"
                isOpen={isInfoMessageOpen}
                onClose={onInfoMessageClose}
            >
                <Flex
                    justify="center"
                    align="center"
                    direction="column"
                    gap={6}
                    p={6}
                >
                    <Flex
                        bg="red.alpha"
                        justify="center"
                        align="center"
                        borderRadius="full"
                        h={24}
                        w={24}
                    >
                        <Icon
                            as={FiAlertTriangle}
                            boxSize={8}
                            color="red.default"
                        />
                    </Flex>

                    <Flex
                        align="center"
                        direction="column"
                        gap={3}
                        textAlign="center"
                    >
                        <Text
                            fontSize="xl"
                            fontWeight="semibold"
                            color="red.default"
                        >
                            Remove this Post?
                        </Text>

                        <Text fontSize="sm">
                            Are you sure you want to moved post to archive? You
                            can restore it back anytime to make changes.
                        </Text>
                    </Flex>

                    <Flex align="center" gap={3}>
                        <Button
                            size="lg"
                            colorScheme="red"
                            isLoading={isLoading}
                            onClick={onArchive}
                        >
                            Yes, sure
                        </Button>

                        <Button size="lg" onClick={onInfoMessageClose}>
                            No, cancel
                        </Button>
                    </Flex>
                </Flex>
            </Modal>
        </>
    )
}

export default Blogs
