import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Flex, Icon, IconButton, Td, Text, Tr } from '@chakra-ui/react'
import { FiMoreHorizontal, FiStar } from 'react-icons/fi'
import Card from 'components/card'
import Table from 'components/table'

const Ratings = () => {
    const router = useRouter()
    const { data: rnr, isFetched: isRnRFetched } = useQuery(
        ['rnr_dashboard'],
        () => api.all('/rnr')
    )

    return (
        <Card>
            <Flex justify="space-between" align="center" gap={6} mb={6}>
                <Text fontSize="xl" fontWeight="semibold" color="accent-1">
                    Service Ratings
                </Text>

                <IconButton size="xs" icon={<FiMoreHorizontal size={12} />} />
            </Flex>

            <Table
                data={rnr}
                fetched={isRnRFetched}
                th={['Customer', 'Order Id', 'Stars', 'Date', '']}
                td={(rnr) => (
                    <Tr key={rnr._id}>
                        <Td maxW={200}>
                            <Flex align="center" gap={3}>
                                <Avatar name={rnr.name} src={rnr.avatar} />

                                <Text overflow="hidden" textOverflow="ellipsis">
                                    {rnr.name}
                                </Text>
                            </Flex>
                        </Td>

                        <Td>
                            <Text>{rnr.order.id.slice(0, 10)}</Text>
                        </Td>

                        <Td>
                            <Flex align="center" gap={1}>
                                <Text>{rnr.ratings}</Text>
                                <Icon
                                    as={FiStar}
                                    boxSize={4}
                                    fill="currentcolor"
                                    color="brand.default"
                                />
                            </Flex>
                        </Td>

                        <Td>
                            <Text>{rnr.created.split(',')[0]}</Text>
                        </Td>

                        <Td textAlign="right">
                            <IconButton
                                size="xs"
                                icon={<FiMoreHorizontal size={12} />}
                                onClick={() =>
                                    router.push(`/admin/orders/${rnr.order.id}`)
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

export default Ratings
