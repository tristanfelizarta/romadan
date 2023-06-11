import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import {
    Avatar,
    Button,
    Container,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Grid,
    GridItem,
    Input,
    Select,
    Spinner,
    Text,
    useToast
} from '@chakra-ui/react'
import Card from 'components/card'
import Toast from 'components/toast'

const Profile = () => {
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    const { data: user, isFetched: isUserFetched } = useQuery(['user'], () =>
        api.get('/users', session.user.id)
    )
    const [isLoading, setIsLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const toast = useToast()

    const {
        register,
        setValue,
        formState: { errors },
        clearErrors,
        handleSubmit
    } = useForm()

    const profile = useMutation(
        (data) => api.update('/users', session.user.id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('user')
                clearErrors()
                setIsLoading(false)

                toast({
                    position: 'top',
                    render: () => <Toast title="Success" description="" />
                })
            }
        }
    )

    const onSubmit = (data) => {
        setIsLoading(true)
        profile.mutate(data)
    }

    useEffect(() => {
        if (isUserFetched) {
            setValue('name', user.name)
            setValue('contact', user.contact)
            setValue('gender', user.gender)
            setValue('date_of_birth', user.date_of_birth)
            setMounted(true)
        }
    }, [isUserFetched])

    if (!mounted || !isUserFetched) {
        return (
            <Flex p={6}>
                <Spinner color="brand.default" />
            </Flex>
        )
    }

    return (
        <Container>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid templateColumns="1fr" gap={6}>
                    <GridItem>
                        <Text
                            fontSize="2xl"
                            fontWeight="semibold"
                            color="accent-1"
                        >
                            My Profile
                        </Text>
                    </GridItem>

                    <GridItem>
                        <Card>
                            <Flex direction="column" gap={6}>
                                <Flex p={6} w="full">
                                    <Avatar
                                        name={session.user.name}
                                        src={session.user.image}
                                        size="xl"
                                    />
                                </Flex>

                                <FormControl isInvalid={errors.name}>
                                    <FormLabel>Full Name</FormLabel>
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

                                <FormControl>
                                    <FormLabel>Email Address</FormLabel>
                                    <Input
                                        size="lg"
                                        defaultValue={session.user.email}
                                        cursor="not-allowed"
                                        readOnly
                                    />
                                </FormControl>

                                <FormControl isInvalid={errors.contact}>
                                    <FormLabel>Mobile Number</FormLabel>
                                    <Input
                                        size="lg"
                                        {...register('contact', {
                                            required: true
                                        })}
                                    />
                                    <FormErrorMessage>
                                        This field is required.
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.gender}>
                                    <FormLabel>Gender</FormLabel>

                                    <Select
                                        size="lg"
                                        {...register('gender', {
                                            required: true
                                        })}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </Select>

                                    <FormErrorMessage>
                                        This field is required.
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.date_of_birth}>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <Input
                                        type="date"
                                        size="lg"
                                        {...register('date_of_birth', {
                                            required: true
                                        })}
                                    />
                                    <FormErrorMessage>
                                        This field is required.
                                    </FormErrorMessage>
                                </FormControl>
                            </Flex>
                        </Card>
                    </GridItem>

                    <GridItem>
                        <Flex justify="end" align="center" gap={3}>
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

export default Profile
