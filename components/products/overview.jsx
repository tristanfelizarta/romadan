import {
    Avatar,
    Button,
    Divider,
    Flex,
    Icon,
    IconButton,
    Image,
    Select,
    Text
} from '@chakra-ui/react'
import {
    FiChevronLeft,
    FiChevronRight,
    FiStar,
    FiThumbsUp
} from 'react-icons/fi'
import Card from 'components/card'

const Overview = ({ product }) => {
    return (
        <Card>
            <Flex direction="column" gap={12}>
                <Flex direction="column" gap={6}>
                    <Text fontSize="lg" fontWeight="semibold" color="accent-1">
                        Product Description
                    </Text>

                    <Text color="accent-1">{product.description}</Text>
                </Flex>

                <Flex direction="column" gap={6}>
                    <Flex align="center" direction="column" gap={3}>
                        <Flex align="center" direction="column">
                            <Text
                                fontSize={48}
                                fontWeight="semibold"
                                color="accent-1"
                            >
                                5.0
                            </Text>

                            <Flex align="center">
                                <Icon
                                    as={FiStar}
                                    boxSize={6}
                                    fill="currentcolor"
                                    color="brand.default"
                                />
                                <Icon
                                    as={FiStar}
                                    boxSize={6}
                                    fill="currentcolor"
                                    color="brand.default"
                                />
                                <Icon
                                    as={FiStar}
                                    boxSize={6}
                                    fill="currentcolor"
                                    color="brand.default"
                                />
                                <Icon
                                    as={FiStar}
                                    boxSize={6}
                                    fill="currentcolor"
                                    color="brand.default"
                                />
                                <Icon
                                    as={FiStar}
                                    boxSize={6}
                                    fill="currentcolor"
                                    color="brand.default"
                                />
                            </Flex>
                        </Flex>

                        <Flex align="center" gap={6}>
                            <Text fontWeight="medium" color="accent-1">
                                99 Ratings
                            </Text>

                            <Text fontWeight="medium" color="accent-1">
                                99 Reviews
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex direction="column" gap={6}>
                    <Flex justify="space-between" align="center" gap={6}>
                        <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            color="accent-1"
                        >
                            Ratings & Reviews
                        </Text>

                        <Select size="lg" w="auto">
                            <option>All Stars</option>
                            <option>5 Star</option>
                            <option>4 Star</option>
                            <option>3 Star</option>
                            <option>2 Star</option>
                            <option>1 Star</option>
                        </Select>
                    </Flex>

                    {[...Array(3)].map((data, index) => (
                        <Flex direction="column" gap={6} key={index}>
                            <Flex
                                justify="space-between"
                                align="center"
                                gap={6}
                            >
                                <Flex gap={3}>
                                    <Avatar />

                                    <Flex direction="column">
                                        <Text
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color="accent-1"
                                        >
                                            Customer Name
                                        </Text>

                                        <Flex align="center">
                                            <Icon
                                                as={FiStar}
                                                boxSize={3}
                                                fill="currentcolor"
                                                color="brand.default"
                                            />
                                            <Icon
                                                as={FiStar}
                                                boxSize={3}
                                                fill="currentcolor"
                                                color="brand.default"
                                            />
                                            <Icon
                                                as={FiStar}
                                                boxSize={3}
                                                fill="currentcolor"
                                                color="brand.default"
                                            />
                                            <Icon
                                                as={FiStar}
                                                boxSize={3}
                                                fill="currentcolor"
                                                color="brand.default"
                                            />
                                            <Icon
                                                as={FiStar}
                                                boxSize={3}
                                                fill="currentcolor"
                                                color="brand.default"
                                            />
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </Flex>

                            <Flex direction="column" gap={3}>
                                <Image
                                    boxSize={24}
                                    alt="product-image-review"
                                    src="/assets/product.png"
                                />

                                <Text fontSize="sm" color="accent-1">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Labore dolor, quod eaque
                                    asperiores, minima perferendis molestiae est
                                    odio libero, explicabo ratione aperiam optio
                                    aut tempore? Laudantium totam ipsa est
                                    molestias.
                                </Text>
                            </Flex>

                            <Flex
                                justify="space-between"
                                align="center"
                                gap={6}
                            >
                                <Flex align="center" gap={2} cursor="pointer">
                                    <Icon as={FiThumbsUp} boxSize={4} />

                                    <Text fontSize="sm" fontWeight="medium">
                                        1
                                    </Text>
                                </Flex>

                                <Text fontSize="sm" fontWeight="medium">
                                    Dec 25, 2022
                                </Text>
                            </Flex>

                            <Divider />
                        </Flex>
                    ))}

                    <Flex justify="center" align="center" gap={3}>
                        <IconButton icon={<FiChevronLeft size={16} />} />
                        <Button colorScheme="brand">1</Button>
                        <Button>2</Button>
                        <Button>3</Button>
                        <IconButton icon={<FiChevronRight size={16} />} />
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    )
}

export default Overview
