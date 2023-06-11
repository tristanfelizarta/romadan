import { Flex, Icon, Text } from '@chakra-ui/react'
import { FiCheck, FiX } from 'react-icons/fi'
import Card from './card'

const Toast = ({ title, description, status }) => {
    return (
        <Card
            p={3}
            mt={1}
            shadow="xs"
            _dark={{ bg: 'hsl(230, 20%, 15%)', shadow: 'dark-xl' }}
        >
            <Flex align="center" gap={3}>
                <Flex
                    bg={
                        status
                            ? status === 'error' && 'red.default'
                            : 'blue.default'
                    }
                    justify="center"
                    align="center"
                    borderRadius="full"
                    h={8}
                    w={8}
                >
                    <Icon
                        as={status ? status === 'error' && FiX : FiCheck}
                        boxSize={4}
                        color="white"
                    />
                </Flex>

                <Flex direction="column">
                    <Text fontSize="sm" fontWeight="semibold" color="accent-1">
                        {title ? title : null}
                    </Text>

                    <Text fontSize="xs" mt={-0.5}>
                        {description ? description : null}
                    </Text>
                </Flex>
            </Flex>
        </Card>
    )
}

export default Toast
