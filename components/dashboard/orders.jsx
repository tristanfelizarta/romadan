import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Badge, Flex, IconButton, Td, Text, Tr } from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/card'
import Table from 'components/table'

const Orders = () => {
    const router = useRouter()
    const { data: orders, isFetched: isOrdersFetched } = useQuery(
        ['orders_dashboard'],
        () => api.all('/orders')
    )
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec'
    ]

    return (
        <Card>
            <Flex justify="space-between" align="center" gap={6} mb={6}>
                <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                    Recent Orders
                </Text>

                <IconButton
                    size="xs"
                    icon={<FiMoreHorizontal size={12} />}
                    onClick={() => router.push('/admin/orders')}
                />
            </Flex>

            <Table
                data={orders}
                fetched={isOrdersFetched}
                th={[
                    'Customer',
                    'Products',
                    'Total Price',
                    'Payment Method',
                    'Status',
                    'Date',
                    ''
                ]}
                td={(order) => (
                    <Tr key={order._id}>
                        <Td maxW={200}>
                            <Flex align="center" gap={3}>
                                <Avatar name={order.name} src={order.image} />

                                <Text overflow="hidden" textOverflow="ellipsis">
                                    {order.name}
                                </Text>
                            </Flex>
                        </Td>

                        <Td>{order.products.length}</Td>

                        <Td>
                            <Text>
                                ₱
                                {order.total.toLocaleString(undefined, {
                                    maximumFractionDigits: 2
                                })}
                            </Text>
                        </Td>

                        <Td>
                            <Badge variant="tinted" colorScheme="brand">
                                {order.payment_method === 'cod'
                                    ? 'Cash On Delivery'
                                    : 'PayPal'}
                            </Badge>
                        </Td>

                        <Td>
                            <Badge variant="tinted" colorScheme="brand">
                                {order.status === 'pay'
                                    ? 'To Pay'
                                    : order.status === 'ship'
                                    ? 'To Ship'
                                    : order.status === 'receive'
                                    ? 'To Received'
                                    : order.status === 'completed'
                                    ? 'Completed'
                                    : order.status === 'cancelled' &&
                                      'Cancelled'}
                            </Badge>
                        </Td>

                        <Td>
                            <Text>
                                {months[
                                    order.created.split(',')[0].split('/')[0] -
                                        1
                                ] +
                                    ' ' +
                                    order.created.split(',')[0].split('/')[1] +
                                    ', ' +
                                    order.created.split(',')[0].split('/')[2]}
                            </Text>
                        </Td>

                        <Td textAlign="right">
                            <IconButton
                                size="xs"
                                icon={<FiMoreHorizontal size={12} />}
                                onClick={() =>
                                    router.push(`/admin/orders/${order._id}`)
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

export default Orders
