import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Flex, IconButton, Td, Text, Tr } from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/card'
import Table from 'components/table'

const Customers = () => {
    const router = useRouter()
    const { data: users, isFetched: isUsersFetched } = useQuery(
        ['customers_dashboard'],
        () => api.all('/users')
    )

    return (
        <Card>
            <Flex justify="space-between" align="center" gap={6} mb={6}>
                <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                    New Customers
                </Text>

                <IconButton
                    size="xs"
                    icon={<FiMoreHorizontal size={12} />}
                    onClick={() => router.push('/admin/customers')}
                />
            </Flex>

            <Table
                data={users}
                fetched={isUsersFetched}
                th={['Customer', , '']}
                td={(user) => (
                    <Tr key={user._id}>
                        <Td maxW={200}>
                            <Flex align="center" gap={3}>
                                <Avatar name={user.name} src={user.image} />

                                <Text overflow="hidden" textOverflow="ellipsis">
                                    {user.name}
                                </Text>
                            </Flex>
                        </Td>

                        <Td textAlign="right">
                            <IconButton
                                size="xs"
                                icon={<FiMoreHorizontal size={12} />}
                                onClick={() =>
                                    router.push(`/admin/customers/${user._id}`)
                                }
                            />
                        </Td>
                    </Tr>
                )}
                settings={{
                    search: 'off',
                    controls: 'off',
                    show: [5]
                }}
            />
        </Card>
    )
}

export default Customers
