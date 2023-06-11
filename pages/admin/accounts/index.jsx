import { useState } from 'react'
import NextHead from 'next/head'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import { useForm } from 'react-hook-form'
import {
    Avatar,
    Badge,
    Button,
    Container,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Icon,
    IconButton,
    Input,
    Select,
    Td,
    Text,
    Tr,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { FiAlertTriangle, FiEdit2, FiTrash } from 'react-icons/fi'
import Table from 'components/table'
import Card from 'components/card'
import Modal from 'components/modal'
import Toast from 'components/toast'

const AddModal = () => {
    const disclosure = useDisclosure()

    return (
        <Modal
            title="Add Modal"
            header="off"
            toggle={(onOpen) => (
                <Button colorScheme="brand" onClick={onOpen}>
                    Add New
                </Button>
            )}
            disclosure={disclosure}
        >
            <Text textAlign="center" color="accent-1">
                New User will be automatically added.
            </Text>
        </Modal>
    )
}

const UpdateModal = ({ user }) => {
    const queryClient = useQueryClient()
    const disclosure = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const {
        register,
        formState: { errors },
        clearErrors,
        reset,
        handleSubmit
    } = useForm()

    const mutation = useMutation(
        (data) => api.update('/users', user._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('users')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    render: () => (
                        <Toast title="Success" description="Request success." />
                    )
                })
            }
        }
    )

    const onSubmit = (data) => {
        setIsLoading(true)
        mutation.mutate(data)
    }

    return (
        <Modal
            title="Edit User"
            toggle={(onOpen) => (
                <IconButton
                    variant="tinted"
                    size="xs"
                    colorScheme="brand"
                    icon={<FiEdit2 size={12} />}
                    onClick={() => clearErrors() || reset() || onOpen()}
                />
            )}
            disclosure={disclosure}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap={6}>
                    <FormControl isInvalid={errors.name}>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                            defaultValue={user.name}
                            size="lg"
                            {...register('name', { required: true })}
                        />
                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Email Address</FormLabel>
                        <Input defaultValue={user.email} size="lg" disabled />
                    </FormControl>

                    <FormControl isInvalid={errors.role}>
                        <FormLabel>Role</FormLabel>

                        <Select
                            defaultValue={user.role}
                            size="lg"
                            {...register('role', { required: true })}
                        >
                            <option value="Admin">Admin</option>
                            <option value="Customer">Customer</option>
                        </Select>

                        <FormErrorMessage>
                            This field is required.
                        </FormErrorMessage>
                    </FormControl>

                    <Flex gap={3} mt={6}>
                        <Button size="lg" w="full" onClick={disclosure.onClose}>
                            Close
                        </Button>

                        <Button
                            type="submit"
                            size="lg"
                            colorScheme="brand"
                            w="full"
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

const DeleteModal = ({ user }) => {
    const queryClient = useQueryClient()
    const disclosure = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const mutation = useMutation(
        (data) => api.remove('/users', user._id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('users')
                setIsLoading(false)
                disclosure.onClose()

                toast({
                    position: 'top',
                    render: () => (
                        <Toast title="Success" description="Request success." />
                    )
                })
            }
        }
    )

    const onSubmit = () => {
        setIsLoading(true)
        mutation.mutate({})
    }

    return (
        <Modal
            size="sm"
            header="off"
            toggle={(onOpen) => (
                <IconButton
                    variant="tinted"
                    size="xs"
                    colorScheme="red"
                    icon={<FiTrash size={12} />}
                    onClick={onOpen}
                />
            )}
            disclosure={disclosure}
        >
            <Flex align="center" direction="column" gap={6} p={6}>
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
                    textAlign="center"
                    gap={3}
                >
                    <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                        Remove User
                    </Text>

                    <Text fontSize="sm">
                        Are you sure you want to remove
                        <br /> this user permanently?
                    </Text>
                </Flex>

                <Flex gap={3}>
                    <Button size="lg" onClick={disclosure.onClose}>
                        No, cancel
                    </Button>

                    <Button
                        size="lg"
                        colorScheme="red"
                        isLoading={isLoading}
                        onClick={onSubmit}
                    >
                        Yes, sure!
                    </Button>
                </Flex>
            </Flex>
        </Modal>
    )
}

const Accounts = () => {
    const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () =>
        api.all('/users')
    )

    return (
        <>
            <NextHead>
                <title>Accounts</title>
            </NextHead>

            <Container>
                <Flex justify="space-between" align="center" gap={6} mb={6}>
                    <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                        Accounts
                    </Text>

                    <AddModal />
                </Flex>

                <Card>
                    <Table
                        data={users}
                        fetched={isUsersFetched}
                        th={[
                            'Avatar',
                            'Full Name',
                            'Email Address',
                            'Role',
                            'Joined',
                            ''
                        ]}
                        td={(user) => (
                            <Tr key={user._id}>
                                <Td>
                                    <Avatar name={user.name} src={user.image} />
                                </Td>

                                <Td>
                                    <Text
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                        color="accent-1"
                                    >
                                        {user.name}
                                    </Text>
                                </Td>

                                <Td>
                                    <Text>{user.email}</Text>
                                </Td>

                                <Td>
                                    <Badge
                                        variant="tinted"
                                        colorScheme={
                                            user.role === 'Admin'
                                                ? 'yellow'
                                                : user.role === 'Customer'
                                                ? 'blue'
                                                : user.role === 'User' && 'red'
                                        }
                                    >
                                        {user.role}
                                    </Badge>
                                </Td>

                                <Td>
                                    <Text>
                                        {user.created.split(',')[0]} -{' '}
                                        {user.created.split(',')[1]}
                                    </Text>
                                </Td>

                                <Td>
                                    <Flex justify="end" align="center" gap={3}>
                                        {user.email !==
                                            'romadandevelopers@gmail.com' && (
                                            <>
                                                <DeleteModal user={user} />
                                                <UpdateModal user={user} />
                                            </>
                                        )}
                                    </Flex>
                                </Td>
                            </Tr>
                        )}
                        select={(register) => (
                            <Flex flex={1} justify="end" align="center" gap={3}>
                                <Select
                                    placeholder="Role"
                                    size="lg"
                                    w="auto"
                                    {...register('role')}
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Customer">Customer</option>
                                </Select>
                            </Flex>
                        )}
                        filters={(data, watch) => {
                            return data
                                .filter((data) =>
                                    ['name'].some((key) =>
                                        data[key]
                                            .toString()
                                            .toLowerCase()
                                            .includes(
                                                watch('search') &&
                                                    watch(
                                                        'search'
                                                    ).toLowerCase()
                                            )
                                    )
                                )
                                .filter((data) =>
                                    watch('role')
                                        ? watch('role') === data.role
                                        : data
                                )
                        }}
                        effects={(watch) => [watch('role')]}
                    />
                </Card>
            </Container>
        </>
    )
}

export default Accounts
