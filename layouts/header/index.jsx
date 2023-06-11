import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import {
    Avatar,
    Button,
    chakra,
    Flex,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    useColorMode,
    useColorModeValue
} from '@chakra-ui/react'
import {
    FiLogOut,
    FiMenu,
    FiMoon,
    FiSettings,
    FiShoppingCart,
    FiSun,
    FiThumbsUp
} from 'react-icons/fi'
import { Romadan } from 'components/logos'

const Header = ({ session, isAdmin, isCustomer, onSidebarOpen }) => {
    const router = useRouter()
    const { toggleColorMode } = useColorMode()
    const colorModeIcon = useColorModeValue(
        <FiMoon size={16} fill="currentColor" />,
        <FiSun size={16} fill="currentColor" />
    )

    return (
        <chakra.header
            bg="#FFFFFFBF"
            backdropFilter="blur(12px)"
            position="sticky"
            top={0}
            zIndex={99}
            _dark={{ bg: '#14161FBF' }}
        >
            <Flex
                align="center"
                gap={6}
                mx="auto"
                px={6}
                h={16}
                w="full"
                maxW={isAdmin ? 1536 : 1280}
            >
                <Flex flex={1} justify="start" align="center">
                    <NextLink href="/" passHref>
                        <Flex align="center" gap={3}>
                            <Romadan h={32} w={24} />

                            <Text
                                display={{ base: 'none', md: 'flex' }}
                                fontSize="2xl"
                                fontWeight="semibold"
                                lineHeight={8}
                                color="accent-1"
                            >
                                Romadan
                            </Text>
                        </Flex>
                    </NextLink>
                </Flex>

                {isCustomer && (
                    <Flex
                        display={{ base: 'none', lg: 'flex' }}
                        flex={3}
                        justify="center"
                        align="center"
                    >
                        <Flex align="center" gap={8}>
                            <NextLink href="/products" passHref>
                                <Link
                                    as="span"
                                    active={
                                        router.pathname.includes('products')
                                            ? 1
                                            : 0
                                    }
                                >
                                    Products
                                </Link>
                            </NextLink>

                            <NextLink href="/services" passHref>
                                <Link
                                    as="span"
                                    active={
                                        router.pathname.includes('services')
                                            ? 1
                                            : 0
                                    }
                                >
                                    Services
                                </Link>
                            </NextLink>

                            <NextLink href="/blogs" passHref>
                                <Link
                                    as="span"
                                    active={
                                        router.pathname.includes('blogs')
                                            ? 1
                                            : 0
                                    }
                                >
                                    Blogs
                                </Link>
                            </NextLink>

                            <NextLink href="/company" passHref>
                                <Link
                                    as="span"
                                    active={
                                        router.pathname.includes('company')
                                            ? 1
                                            : 0
                                    }
                                >
                                    Company
                                </Link>
                            </NextLink>

                            <NextLink href="/contact" passHref>
                                <Link
                                    as="span"
                                    active={
                                        router.pathname.includes('contact')
                                            ? 1
                                            : 0
                                    }
                                >
                                    Contact Us
                                </Link>
                            </NextLink>
                        </Flex>
                    </Flex>
                )}

                <Flex flex={1} justify="end" align="center">
                    <Flex align="center" gap={3}>
                        <Flex align="center">
                            {isCustomer && (
                                <IconButton
                                    variant="ghost"
                                    colorScheme="brand"
                                    icon={
                                        <FiShoppingCart
                                            size={16}
                                            fill="currentColor"
                                        />
                                    }
                                    onClick={() => router.push('/user/cart')}
                                />
                            )}
                            <IconButton
                                variant="ghost"
                                colorScheme="brand"
                                icon={colorModeIcon}
                                onClick={toggleColorMode}
                            />
                        </Flex>

                        {session ? (
                            <>
                                <Menu>
                                    <MenuButton
                                        display={{ base: 'none', lg: 'block' }}
                                    >
                                        <Avatar
                                            name={session.user.name}
                                            src={session.user.image}
                                        />
                                    </MenuButton>

                                    <MenuList
                                        display={{ base: 'none', lg: 'block' }}
                                        w={256}
                                    >
                                        <MenuItem
                                            onClick={() =>
                                                router.push('/user/profile')
                                            }
                                        >
                                            <Flex align="center" gap={3}>
                                                <Avatar
                                                    name={session.user.name}
                                                    src={session.user.image}
                                                />

                                                <Text
                                                    color="accent-1"
                                                    noOfLines={1}
                                                >
                                                    {session.user.name}
                                                </Text>
                                            </Flex>
                                        </MenuItem>

                                        <MenuDivider />

                                        <MenuItem
                                            icon={<FiSettings size={16} />}
                                        >
                                            Settings
                                        </MenuItem>
                                        <MenuItem
                                            icon={<FiThumbsUp size={16} />}
                                        >
                                            Feedback
                                        </MenuItem>

                                        <MenuDivider />

                                        <MenuItem
                                            icon={<FiLogOut size={16} />}
                                            onClick={() => signOut()}
                                        >
                                            Sign out
                                        </MenuItem>
                                    </MenuList>
                                </Menu>

                                <chakra.button
                                    display={{ base: 'block', lg: 'none' }}
                                    onClick={onSidebarOpen}
                                >
                                    <Avatar
                                        name={session.user.name}
                                        src={session.user.image}
                                    />
                                </chakra.button>
                            </>
                        ) : (
                            <>
                                <IconButton
                                    display={{ base: 'flex', lg: 'none' }}
                                    variant="plain"
                                    size="xs"
                                    icon={<FiMenu size={24} />}
                                    onClick={onSidebarOpen}
                                />

                                <Button
                                    display={{ base: 'none', lg: 'flex' }}
                                    colorScheme="brand"
                                    onClick={() => router.push('/login')}
                                >
                                    Sign in
                                </Button>
                            </>
                        )}
                    </Flex>
                </Flex>
            </Flex>
        </chakra.header>
    )
}

export default Header
