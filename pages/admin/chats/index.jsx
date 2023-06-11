import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import {
    Avatar,
    chakra,
    Container,
    Flex,
    Grid,
    GridItem,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Td,
    Text,
    Tr
} from '@chakra-ui/react'
import { FiMoreHorizontal, FiSearch, FiSend } from 'react-icons/fi'
import Card from 'components/card'

const Chats = () => {
    const queryClient = useQueryClient()
    const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () =>
        api.all('/users')
    )
    const [selectedUser, setSelectedUser] = useState({
        _id: '6371a1f5d1409e0b39ea4806',
        name: 'Romadan Developers',
        image: 'https://lh3.googleusercontent.com/a/ALm5wu1XfIOiY0c78TJv_pO-0YQUnMWNfam_aD7Xykrb=s96-c'
    })
    const { data: chats, isFetched: isChatsFetched } = useQuery(
        ['chats', selectedUser._id],
        () => api.get('/chats', selectedUser._id),
        { enabled: selectedUser !== null }
    )
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        watch,
        formState: { errors },
        reset,
        handleSubmit
    } = useForm()

    const messageMutation = useMutation((data) => api.create('/chats', data), {
        onSuccess: () => {
            queryClient.invalidateQueries('chats')
            reset()
            setIsLoading(false)
        }
    })

    const seen = (user) => {
        setSelectedUser(user)
    }

    const onSubmit = (data) => {
        setIsLoading(true)

        messageMutation.mutate({
            user: {
                id: selectedUser._id
            },
            role: 'Admin',
            message: data.message
        })
    }

    return (
        <Container>
            <Grid gridTemplateColumns="1fr 360px" gap={6}>
                <GridItem h="calc(100vh - 112px)">
                    <Card p={0} h="full">
                        {selectedUser && (
                            <Grid templateRows="auto 1fr auto" h="full">
                                <GridItem p={6}>
                                    <Flex
                                        justify="space-between"
                                        align="center"
                                    >
                                        <Flex align="center" gap={3}>
                                            <Avatar
                                                name={selectedUser.name}
                                                src={selectedUser.image}
                                            />

                                            <Text
                                                fontWeight="medium"
                                                color="accent-1"
                                            >
                                                {selectedUser.name}
                                            </Text>
                                        </Flex>

                                        <IconButton
                                            size="xs"
                                            icon={
                                                <FiMoreHorizontal size={12} />
                                            }
                                        />
                                    </Flex>
                                </GridItem>

                                <GridItem
                                    overflowY="auto"
                                    p={6}
                                    borderTop="1px solid"
                                    borderBottom="1px solid"
                                    borderColor="border"
                                    maxH="calc(100vh - 286px)"
                                >
                                    <Flex direction="column" gap={6}>
                                        {isChatsFetched &&
                                            chats.messages.map((chat) => (
                                                <Flex
                                                    justify={
                                                        chat.role === 'Customer'
                                                            ? 'start'
                                                            : 'end'
                                                    }
                                                    key={chat._id}
                                                >
                                                    <Flex
                                                        bg={
                                                            chat.role ===
                                                            'Customer'
                                                                ? 'canvas-1'
                                                                : 'brand.default'
                                                        }
                                                        align={
                                                            chat.role ===
                                                            'Customer'
                                                                ? 'start'
                                                                : 'end'
                                                        }
                                                        direction="column"
                                                        gap={1}
                                                        borderRadius={12}
                                                        p={3}
                                                    >
                                                        <Text
                                                            color={
                                                                chat.role ===
                                                                'Customer'
                                                                    ? 'accent-1'
                                                                    : 'white'
                                                            }
                                                        >
                                                            {chat.message}
                                                        </Text>

                                                        <Text
                                                            fontSize="xs"
                                                            color={
                                                                chat.role ===
                                                                'Customer'
                                                                    ? 'accent-3'
                                                                    : 'white'
                                                            }
                                                        >
                                                            {
                                                                chat.created.split(
                                                                    ','
                                                                )[0]
                                                            }{' '}
                                                            {
                                                                chat.created.split(
                                                                    ','
                                                                )[1]
                                                            }
                                                        </Text>
                                                    </Flex>
                                                </Flex>
                                            ))}
                                    </Flex>
                                </GridItem>

                                <GridItem p={6}>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Flex gap={3}>
                                            <Input
                                                size="lg"
                                                {...register('message')}
                                            />
                                            <IconButton
                                                type="submit"
                                                size="lg"
                                                colorScheme="brand"
                                                icon={<FiSend size={16} />}
                                                isLoading={isLoading}
                                            />
                                        </Flex>
                                    </form>
                                </GridItem>
                            </Grid>
                        )}
                    </Card>
                </GridItem>

                <GridItem>
                    <Card p={3} h="full">
                        <Flex direction="column" gap={3}>
                            <chakra.div p={3}>
                                <InputGroup>
                                    <InputLeftElement pt={1} pl={1}>
                                        <FiSearch size={16} />
                                    </InputLeftElement>

                                    <Input
                                        placeholder="Search Customer"
                                        size="lg"
                                        {...register('search')}
                                    />
                                </InputGroup>
                            </chakra.div>

                            <Flex
                                direction="column"
                                overflowY="auto"
                                gap={3}
                                h="calc(100vh - 223px)"
                            >
                                {isUsersFetched &&
                                    users
                                        .filter((user) =>
                                            ['name'].some((key) =>
                                                user[key]
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
                                        .map((user) => (
                                            <Flex
                                                align="center"
                                                gap={3}
                                                borderRadius={12}
                                                p={3}
                                                _hover={{ bg: 'canvas-1' }}
                                                cursor="pointer"
                                                onClick={() => seen(user)}
                                                key={user._id}
                                            >
                                                <Avatar
                                                    name={user.name}
                                                    src={user.image}
                                                    boxSize={10}
                                                />

                                                <Text
                                                    color="accent-1"
                                                    noOfLines={1}
                                                >
                                                    {user.name}
                                                </Text>

                                                <Flex flex={1} justify="end">
                                                    <chakra.span
                                                        bg="brand.default"
                                                        borderRadius="full"
                                                        h={3}
                                                        w={3}
                                                    />
                                                </Flex>
                                            </Flex>
                                        ))}
                            </Flex>
                        </Flex>
                    </Card>
                </GridItem>
            </Grid>
        </Container>
    )
}

export default Chats
