import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import {
    Avatar,
    Flex,
    Grid,
    GridItem,
    IconButton,
    Input,
    Text
} from '@chakra-ui/react'
import { Romadan } from './logos'
import { FiSend } from 'react-icons/fi'

const Chats = () => {
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const { data: chats, isFetched: isChatsFetched } = useQuery(
        ['chats', session.user.id],
        () => api.get('/chats', session.user.id)
    )
    const [showMessage, setShowMessage] = useState(false)
    const [selectedUser, setSelectedUser] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
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

    const onSubmit = (data) => {
        setIsLoading(true)

        messageMutation.mutate({
            user: {
                id: session.user.id
            },
            role: 'Customer',
            message: data.message
        })
    }

    return (
        <Flex
            position="fixed"
            bottom={6}
            right={6}
            align="end"
            direction={{ base: 'column', md: 'row' }}
            gap={3}
        >
            {showMessage && (
                <Flex
                    bg="system"
                    border="1px solid"
                    borderColor="border"
                    borderRadius={12}
                    shadow="xl"
                    h="auto"
                    w={{ base: 'full', md: 360 }}
                    _dark={{ shadow: 'dark-xl' }}
                >
                    <Grid templateRows="auto 1fr auto" h="full" w="full">
                        <GridItem p={3}>
                            <Flex justify="space-between" align="center">
                                <Flex align="center" gap={3}>
                                    <Avatar
                                        name={selectedUser.name}
                                        src="/favicon.png"
                                    />

                                    <Text fontWeight="medium" color="accent-1">
                                        Romadan Support
                                    </Text>
                                </Flex>
                            </Flex>
                        </GridItem>

                        <GridItem
                            p={6}
                            overflowY="auto"
                            borderTop="1px solid"
                            borderBottom="1px solid"
                            borderColor="border"
                            maxH={360}
                        >
                            <Flex direction="column" gap={6}>
                                {isChatsFetched &&
                                    chats.messages.map((chat) => (
                                        <Flex
                                            justify={
                                                chat.role === 'Customer'
                                                    ? 'end'
                                                    : 'start'
                                            }
                                            key={chat._id}
                                        >
                                            <Flex
                                                bg={
                                                    chat.role === 'Customer'
                                                        ? 'brand.default'
                                                        : 'canvas-1'
                                                }
                                                align={
                                                    chat.role === 'Customer'
                                                        ? 'end'
                                                        : 'start'
                                                }
                                                direction="column"
                                                gap={1}
                                                borderRadius={12}
                                                p={3}
                                            >
                                                <Text
                                                    color={
                                                        chat.role === 'Customer'
                                                            ? 'white'
                                                            : 'accent-1'
                                                    }
                                                >
                                                    {chat.message}
                                                </Text>

                                                <Text
                                                    fontSize="xs"
                                                    color={
                                                        chat.role === 'Customer'
                                                            ? 'white'
                                                            : 'accent-3'
                                                    }
                                                >
                                                    {chat.created.split(',')[0]}{' '}
                                                    {chat.created.split(',')[1]}
                                                </Text>
                                            </Flex>
                                        </Flex>
                                    ))}
                            </Flex>
                        </GridItem>

                        <GridItem p={3}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Flex gap={3}>
                                    <Input {...register('message')} />
                                    <IconButton
                                        type="submit"
                                        colorScheme="brand"
                                        icon={<FiSend size={16} />}
                                        isLoading={isLoading}
                                    />
                                </Flex>
                            </form>
                        </GridItem>
                    </Grid>
                </Flex>
            )}

            <Flex
                bg="hsl(230, 20%, 10%)"
                justify="center"
                align="center"
                borderRadius="full"
                h={12}
                w={12}
                cursor="pointer"
                _dark={{ bg: 'white' }}
                onClick={() =>
                    showMessage ? setShowMessage(false) : setShowMessage(true)
                }
            >
                <Romadan />
            </Flex>
        </Flex>
    )
}

export default Chats
