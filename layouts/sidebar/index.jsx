import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import {
    Avatar,
    Button,
    chakra,
    Flex,
    Grid,
    GridItem,
    Icon,
    Link,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text
} from '@chakra-ui/react'
import {
    FiEdit2,
    FiGrid,
    FiLogOut,
    FiMapPin,
    FiMessageSquare,
    FiPackage,
    FiPieChart,
    FiSettings,
    FiShoppingCart,
    FiStar,
    FiThumbsUp,
    FiUser,
    FiUsers
} from 'react-icons/fi'
import { Romadan } from 'components/logos'

const Sidebar = ({
    session,
    isAdmin,
    isUserPage,
    isSidebarOpen,
    onSidebarClose
}) => {
    const router = useRouter()

    return (
        <>
            <chakra.div
                bg="hsla(0, 0%, 0%, 0.4)"
                position="fixed"
                top={0}
                left={0}
                h="100vh"
                w="full"
                visibility={isSidebarOpen ? 'visible' : 'hidden'}
                opacity={isSidebarOpen ? 1 : 0}
                transition="0.4s ease-in-out"
                zIndex={99}
                onClick={onSidebarClose}
            />

            <chakra.aside
                bg="system"
                position="fixed"
                top={{
                    base: 0,
                    lg: isAdmin ? 'auto' : isUserPage ? 'auto' : 0
                }}
                left={{
                    base: isSidebarOpen ? 0 : -256,
                    lg: isAdmin
                        ? 'auto'
                        : isSidebarOpen
                        ? 0
                        : isUserPage
                        ? 'auto'
                        : -256
                }}
                h={{
                    base: 'full',
                    lg: isAdmin
                        ? 'calc(100% - 64px)'
                        : isUserPage
                        ? 'calc(100% - 64px)'
                        : 'full'
                }}
                w={256}
                transition="0.4s ease-in-out"
                zIndex={100}
            >
                <Grid
                    templateRows={{
                        base: '64px 1fr auto',
                        lg: isAdmin
                            ? '1fr auto'
                            : isUserPage
                            ? '1fr'
                            : '64px 1fr auto'
                    }}
                    h="full"
                >
                    <GridItem
                        display={{
                            base: 'block',
                            lg: isAdmin ? 'none' : isUserPage ? 'none' : 'block'
                        }}
                        my="auto"
                        px="6"
                    >
                        <Flex align="center" gap={3}>
                            <Romadan h={32} w={24} />

                            <Text
                                fontSize="2xl"
                                fontWeight="semibold"
                                lineHeight={8}
                                color="accent-1"
                            >
                                Romadan
                            </Text>
                        </Flex>
                    </GridItem>

                    <GridItem p={6}>
                        {isAdmin ? (
                            <Flex direction="column" gap={1}>
                                <NextLink href="/admin/dashboard" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes(
                                                'dashboard'
                                            )
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiPieChart} boxSize={4} />

                                            <Text>Dashboard</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/admin/chats" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('chats')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon
                                                as={FiMessageSquare}
                                                boxSize={4}
                                            />

                                            <Text>Chats</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/admin/blogs" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('blogs')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiEdit2} boxSize={4} />

                                            <Text>Blogs</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/admin/products" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('products')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiGrid} boxSize={4} />

                                            <Text>Products</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/admin/orders" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('orders')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiPackage} boxSize={4} />

                                            <Text>Orders</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/admin/customers" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes(
                                                'customers'
                                            )
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiUsers} boxSize={4} />

                                            <Text>Customers</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/admin/accounts" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('accounts')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiStar} boxSize={4} />

                                            <Text>Accounts</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>
                            </Flex>
                        ) : isUserPage ? (
                            <Flex direction="column" gap={1}>
                                <NextLink href="/user/profile" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('profile')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiUser} boxSize={4} />

                                            <Text>Profile</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/user/address" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('address')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiMapPin} boxSize={4} />

                                            <Text>Address</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/user/cart" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('cart')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon
                                                as={FiShoppingCart}
                                                boxSize={4}
                                            />

                                            <Text>Cart</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>

                                <NextLink href="/user/orders" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('orders')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        <Flex align="center" gap={3}>
                                            <Icon as={FiPackage} boxSize={4} />

                                            <Text>Orders</Text>
                                        </Flex>
                                    </Link>
                                </NextLink>
                            </Flex>
                        ) : (
                            <Flex direction="column" gap={1}>
                                <NextLink href="/products" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('products')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        Products
                                    </Link>
                                </NextLink>

                                <NextLink href="/services" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('services')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        Services
                                    </Link>
                                </NextLink>

                                <NextLink href="/blogs" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('blogs')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        Blogs
                                    </Link>
                                </NextLink>

                                <NextLink href="/company" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('company')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        Company
                                    </Link>
                                </NextLink>

                                <NextLink href="/contact" passHref>
                                    <Link
                                        as="span"
                                        display="block"
                                        py={2}
                                        lineHeight={6}
                                        active={
                                            router.pathname.includes('contact')
                                                ? 1
                                                : 0
                                        }
                                        onClick={onSidebarClose}
                                    >
                                        Contact Us
                                    </Link>
                                </NextLink>
                            </Flex>
                        )}
                    </GridItem>

                    <GridItem
                        display={{
                            base: 'block',
                            lg: isUserPage ? 'none' : 'block'
                        }}
                        p={6}
                    >
                        {session ? (
                            <Menu>
                                <MenuButton>
                                    <Flex align="center" gap={3}>
                                        <Avatar
                                            name={session.user.name}
                                            src={session.user.image}
                                        />

                                        <Text
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color="accent-1"
                                            noOfLines={1}
                                        >
                                            {session.user.name}
                                        </Text>
                                    </Flex>
                                </MenuButton>

                                <MenuList w={256}>
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

                                    <MenuItem icon={<FiSettings size={16} />}>
                                        Settings
                                    </MenuItem>
                                    <MenuItem icon={<FiThumbsUp size={16} />}>
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
                        ) : (
                            <Button
                                size="lg"
                                colorScheme="brand"
                                w="full"
                                onClick={() =>
                                    onSidebarClose() || router.push('/login')
                                }
                            >
                                Sign in
                            </Button>
                        )}
                    </GridItem>
                </Grid>
            </chakra.aside>
        </>
    )
}

export default Sidebar
