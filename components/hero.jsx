import { useRouter } from 'next/router'
import { Box, Button, chakra, Flex, Text } from '@chakra-ui/react'

const Hero = () => {
    const router = useRouter()

    return (
        <Flex gap={12} h={632}>
            <Flex flex={1} justify="start" align="center">
                <Flex align="start" direction="column" gap={8}>
                    <Text
                        fontSize={{ base: 48, sm: 64, xl: 80 }}
                        fontWeight="bold"
                        lineHeight={1}
                        letterSpacing={0}
                        color="accent-1"
                    >
                        Romadan
                        <br />{' '}
                        <chakra.span color="brand.default">
                            Online Shop
                        </chakra.span>
                        <br /> is finally here.
                    </Text>

                    <Text fontSize="lg">
                        One of the best distributors of high-quality water
                        filtration, containers, bottles and printing services.
                    </Text>

                    <Button
                        size="xl"
                        colorScheme="brand"
                        w={{ base: 'full', sm: 'auto' }}
                        onClick={() => router.push('/products')}
                    >
                        Shop Now
                    </Button>
                </Flex>
            </Flex>

            <Flex
                display={{ base: 'none', lg: 'flex' }}
                flex={1}
                justify="start"
                align="center"
            >
                <Box
                    bgImage="url('/assets/canvas.png')"
                    bgRepeat="no-repeat"
                    bgSize="contain"
                    bgPos="right"
                    h="full"
                    w="full"
                />
            </Flex>
        </Flex>
    )
}

export default Hero
