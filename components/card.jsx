import { chakra } from '@chakra-ui/react'

const Card = (props) => {
    return (
        <chakra.div
            bg="surface"
            overflow="hidden"
            border="1px solid"
            borderRadius={12}
            borderColor="border"
            p={6}
            h="auto"
            w="full"
            {...props}
        />
    )
}

export default Card
