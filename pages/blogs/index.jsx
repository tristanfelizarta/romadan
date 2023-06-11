import NextLink from 'next/link'
import NextHead from 'next/head'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import {
    Badge,
    Box,
    Container,
    Flex,
    IconButton,
    SimpleGrid,
    Skeleton,
    Text,
    Textarea
} from '@chakra-ui/react'
import { FiArchive, FiEdit2 } from 'react-icons/fi'
import Card from 'components/card'

const Blogs = () => {
    const { data: session } = useSession()
    const { data: blogs, isFetched: isBlogFetched } = useQuery(['blogs'], () =>
        api.all('/blogs')
    )

    return (
        <>
            <NextHead>
                <title>Blogs</title>
            </NextHead>

            <Container>
                <SimpleGrid
                    alignItems="start"
                    columns={{ base: 1, md: 2, xl: 3 }}
                    gap={6}
                >
                    {isBlogFetched ? (
                        blogs.map((blog) => (
                            <Card p={0} key={blog._id}>
                                <NextLink href={`/blogs/${blog._id}`} passHref>
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

                                                <Flex align="center" gap={3}>
                                                    <IconButton
                                                        icon={
                                                            <FiEdit2
                                                                size={16}
                                                            />
                                                        }
                                                        onClick={() =>
                                                            reset() ||
                                                            clearErrors() ||
                                                            setBlogSelected({
                                                                id: blog._id,
                                                                title: blog.title,
                                                                content:
                                                                    blog.content,
                                                                status: blog.status
                                                            }) ||
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
                                                            setBlogSelected({
                                                                id: blog._id
                                                            }) ||
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
                            {[...Array(12)].map((data, index) => (
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
        </>
    )
}

export default Blogs
