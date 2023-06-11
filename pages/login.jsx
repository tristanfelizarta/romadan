import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import {
    Button,
    chakra,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    Input,
    Text,
    useToast
} from '@chakra-ui/react'
import { Facebook, Google, Romadan } from 'components/logos'
import { FiArrowLeft } from 'react-icons/fi'
import Toast from 'components/toast'

const Login = () => {
    const router = useRouter()
    const toast = useToast()

    const {
        register,
        formState: { errors },
        setError,
        clearErrors,
        reset,
        handleSubmit
    } = useForm()

    const onSubmit = (data) => {
        const { email } = data

        if (data.email.includes('@gmail.com')) {
            setError('email', {
                type: 'custom',
                message: 'Continue with Google instead.'
            })
            return
        }

        if (!data.email.includes('@') || !data.email.includes('.')) {
            setError('email', {
                type: 'custom',
                message: 'Invalid email address.'
            })
            return
        }

        signIn('email', { email, redirect: false })

        toast({
            position: 'top',
            render: () => (
                <Toast
                    title="Confirm your email address"
                    description={`Confirmation email has been sent to ${email}`}
                />
            )
        })

        clearErrors()
        reset()
    }

    return (
        <Flex
            justify="center"
            align="center"
            p={6}
            h="auto"
            minH="100vh"
            w="full"
        >
            <Flex align="center" direction="column" gap={6} w="full" maxW={348}>
                <Romadan h={64} w={48} />

                <Flex align="center" direction="column" textAlign="center">
                    <Text fontSize={24} fontWeight="semibold" color="accent-1">
                        Log in to your account
                    </Text>

                    <Text fontSize="sm">
                        You don&apos;t need a password, It is safer that way.
                    </Text>
                </Flex>

                <chakra.form w="full" onSubmit={handleSubmit(onSubmit)}>
                    <Flex direction="column" gap={3}>
                        <FormControl isInvalid={errors.email}>
                            <Input
                                placeholder="Email address"
                                size="lg"
                                {...register('email', {
                                    required: 'This field is required.'
                                })}
                            />
                            <FormErrorMessage>
                                {errors.email?.message}
                            </FormErrorMessage>
                        </FormControl>

                        <Button type="submit" size="lg" colorScheme="brand">
                            Continue with Email
                        </Button>
                    </Flex>
                </chakra.form>

                <Flex align="center" gap={6} w="full">
                    <Divider />
                    <Text fontSize="xs">OR</Text>
                    <Divider />
                </Flex>

                <Flex direction="column" gap={3} w="full">
                    <Button
                        size="lg"
                        color="accent-1"
                        leftIcon={<Google />}
                        onClick={() => signIn('google')}
                    >
                        Continue with Google
                    </Button>

                    <Button
                        size="lg"
                        color="accent-1"
                        leftIcon={<Facebook />}
                        onClick={() => signIn('facebook')}
                    >
                        Continue with Facebook
                    </Button>

                    <Button
                        size="lg"
                        w="full"
                        color="accent-1"
                        leftIcon={<FiArrowLeft size={16} />}
                        onClick={() => router.back()}
                    >
                        Go Back
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Login
