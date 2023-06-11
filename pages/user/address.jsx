import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import {
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

const Address = () => {
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
        formState: { errors },
        setValue,
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

        profile.mutate({
            address: {
                ...data
            }
        })
    }

    useEffect(() => {
        if (isUserFetched) {
            setValue('region', user.address.region)
            setValue('city', user.address.city)
            setValue('barangay', user.address.barangay)
            setValue('address', user.address.address)
            setValue('postal', user.address.postal)
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
                            My Address
                        </Text>
                    </GridItem>

                    <GridItem>
                        <Card>
                            <Flex direction="column" gap={6}>
                                <Flex
                                    align="start"
                                    direction={{ base: 'column', lg: 'row' }}
                                    gap={6}
                                >
                                    <FormControl isInvalid={errors.region}>
                                        <FormLabel>Region</FormLabel>

                                        <Select
                                            placeholder="⠀"
                                            size="lg"
                                            {...register('region', {
                                                required: true
                                            })}
                                        >
                                            <option>Metro Manila</option>
                                        </Select>

                                        <FormErrorMessage>
                                            This field is required.
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={errors.city}>
                                        <FormLabel>City</FormLabel>

                                        <Select
                                            placeholder="⠀"
                                            size="lg"
                                            {...register('city', {
                                                required: true
                                            })}
                                        >
                                            <option>Las Pinas</option>
                                            <option>Pasay</option>
                                            <option>Makati</option>
                                            <option>Muntinlupa</option>
                                            <option>Cavite</option>
                                        </Select>

                                        <FormErrorMessage>
                                            This field is required.
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={errors.barangay}>
                                        <FormLabel>Barangay</FormLabel>

                                        <Select
                                            placeholder="⠀"
                                            size="lg"
                                            {...register('barangay', {
                                                required: true
                                            })}
                                        >
                                            <option>Pulang Lupa Uno</option>
                                            <option>Pulang Lupa Dos</option>
                                        </Select>

                                        <FormErrorMessage>
                                            This field is required.
                                        </FormErrorMessage>
                                    </FormControl>
                                </Flex>

                                <FormControl isInvalid={errors.address}>
                                    <FormLabel>
                                        Street Name, Building, House No.
                                    </FormLabel>
                                    <Input
                                        size="lg"
                                        {...register('address', {
                                            required: true
                                        })}
                                    />
                                    <FormErrorMessage>
                                        This field is required.
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.postal}>
                                    <FormLabel>Postal Code</FormLabel>
                                    <Input
                                        type="number"
                                        size="lg"
                                        {...register('postal', {
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

export default Address
