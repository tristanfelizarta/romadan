import { useRouter } from 'next/router'
import NextHead from 'next/head'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Box, Container, Flex, Image, Text } from '@chakra-ui/react'

const Blog = () => {
    const router = useRouter()
    const { id } = router.query
    const { data: blog } = useQuery(['blog', id], () => api.get('/blogs', id))

    return (
        <>
            <NextHead>
                <title>{blog ? blog.title : 'loading...'}</title>
                <meta
                    name="description"
                    content={blog ? blog.content : 'loading...'}
                />
            </NextHead>

            <Container>
                <Flex direction="column" gap={12} mx="auto" maxW={992}>
                    <Flex align="center" direction="column" gap={2}>
                        <Text
                            fontSize="4xl"
                            fontWeight="semibold"
                            color="accent-1"
                        >
                            {blog?.title}
                        </Text>

                        <Text fontSize="sm">{blog?.created}</Text>
                    </Flex>

                    <Box
                        bg="canvas-1"
                        overflow="hidden"
                        borderRadius={12}
                        h={500}
                        w="full"
                    >
                        <Image
                            alt={blog?.title}
                            src={blog?.image}
                            boxSize="full"
                            objectFit="cover"
                            objectPosition="center"
                        />
                    </Box>

                    <Text>{blog?.content}</Text>
                </Flex>
            </Container>
        </>
    )
}

export default Blog
