import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { chakra, Flex, Spinner, useDisclosure } from '@chakra-ui/react'
import { Romadan } from 'components/logos'
import Header from './header'
import Sidebar from './sidebar'
import Chats from 'components/chats'

const AppLayout = (props) => {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const { data: session, status } = useSession()
    const isAdmin = session
        ? session.user.role === 'Admin'
            ? true
            : false
        : false
    const isCustomer = session
        ? session.user.role === 'Customer'
            ? true
            : false
        : true
    const isUserPage = router.pathname.includes('user') ? true : false
    const {
        isOpen: isSidebarOpen,
        onOpen: onSidebarOpen,
        onClose: onSidebarClose
    } = useDisclosure()

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true)
        }, 1000)

        return () => {
            clearTimeout(timer)
        }
    }, [])

    if (!mounted || status === 'loading') {
        return (
            <Flex
                position="relative"
                justify="center"
                align="center"
                h="100vh"
                w="full"
            >
                <Romadan h={32} w={24} />
                <Spinner
                    position="absolute"
                    boxSize={16}
                    thickness={2}
                    speed="0.8s"
                    emptyColor="canvas-1"
                    color="brand.default"
                />
            </Flex>
        )
    } else {
        if (!session && router.pathname === '/login') {
            return props.children
        }

        if (session && router.pathname === '/login') {
            router.push('/')
            return
        }

        if (!session && router.pathname.includes('admin')) {
            router.push('/')
            return
        }

        if (!session && router.pathname.includes('user')) {
            router.push('/')
            return
        }

        if (!isAdmin && router.pathname.includes('admin')) {
            router.push('/')
            return
        }

        if (isAdmin && !router.pathname.includes('admin')) {
            router.push('/admin/dashboard')
            return
        }

        return (
            <>
                <Header
                    session={session}
                    isAdmin={isAdmin}
                    isCustomer={isCustomer}
                    onSidebarOpen={onSidebarOpen}
                />

                <chakra.div position="relative" h="auto" w="auto">
                    <chakra.div
                        mx="auto"
                        h="auto"
                        minH="calc(100vh - 64px)"
                        w="full"
                        maxW={isAdmin ? 1536 : 1280}
                    >
                        <Sidebar
                            session={session}
                            isAdmin={isAdmin}
                            isUserPage={isUserPage}
                            isSidebarOpen={isSidebarOpen}
                            onSidebarClose={onSidebarClose}
                        />

                        <chakra.main
                            ml={{
                                base: 0,
                                lg: isAdmin ? 256 : isUserPage ? 256 : 0
                            }}
                            w={{
                                base: 'full',
                                lg: isAdmin
                                    ? 'calc(100% - 256px)'
                                    : isUserPage
                                    ? 'calc(100% - 256px)'
                                    : 'full'
                            }}
                        >
                            {props.children}
                        </chakra.main>
                    </chakra.div>
                </chakra.div>

                {session && session.user.role === 'Customer' && <Chats />}
            </>
        )
    }
}

export default AppLayout
