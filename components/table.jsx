import { useState, useEffect } from 'react'
import {
    Flex,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Spinner,
    Table as ChakraTable,
    TableContainer,
    Tbody,
    Text,
    Th,
    Thead,
    Tr
} from '@chakra-ui/react'
import {
    FiChevronLeft,
    FiChevronRight,
    FiFolderMinus,
    FiSearch
} from 'react-icons/fi'
import { useForm } from 'react-hook-form'

const Table = (props) => {
    const { data, fetched, th, td, select, filters, effects, settings } = props
    const { register, watch } = useForm()
    const [state, dispatch] = useState({
        loading: true,
        min: 0,
        max: 0,
        show: 0
    })
    const { loading, min, max, show } = state
    const results = filters ? fetched && filters(data, watch) : data
    const xeffects = effects ? effects(watch) : []

    const xsettings = {
        search: settings && settings.search ? settings.search : 'on',
        placeholder:
            settings && settings.placeholder
                ? settings.placeholder
                : 'Search...',
        searchWidth:
            settings && settings.searchWidth ? settings.searchWidth : 300,
        controls: settings && settings.controls ? settings.controls : 'on',
        show: settings && settings.show ? settings.show : [10, 25, 50]
    }

    const prev = () => {
        dispatch({ ...state, min: min - show, max: max - show })
    }

    const next = () => {
        dispatch({ ...state, min: min + show, max: max + show })
    }

    useEffect(() => {
        dispatch({
            ...state,
            min: 0,
            max: Number(watch('show')),
            show: Number(watch('show'))
        })
    }, [watch('show'), ...xeffects])

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch({
                ...state,
                loading: false,
                min: 0,
                max: Number(watch('show')),
                show: Number(watch('show'))
            })
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    return (
        <Flex direction="column" gap={6}>
            <Flex
                display={
                    xsettings.search === 'off' && !select ? 'none' : 'flex'
                }
                direction={{ base: 'column', md: 'row' }}
                gap={6}
            >
                <InputGroup
                    display={xsettings.search === 'off' ? 'none' : 'flex'}
                    w={{ base: 'full', md: xsettings.searchWidth }}
                >
                    <InputLeftElement pt={1}>
                        <FiSearch size={20} />
                    </InputLeftElement>

                    <Input
                        placeholder={xsettings.placeholder}
                        variant="filled"
                        size="lg"
                        {...register('search', {
                            onChange: () =>
                                dispatch({ ...state, isLoading: true })
                        })}
                    />
                </InputGroup>

                {select && select(register)}
            </Flex>

            <TableContainer>
                <ChakraTable>
                    <Thead>
                        <Tr>
                            {th &&
                                th.map((data, index) => (
                                    <Th key={index}>{data}</Th>
                                ))}
                        </Tr>
                    </Thead>

                    <Tbody>
                        {!loading &&
                            fetched &&
                            results
                                .slice(min, max)
                                .map((data, index) => td && td(data, index))}
                    </Tbody>
                </ChakraTable>
            </TableContainer>

            {(loading || !fetched) && (
                <Flex justify="center" align="center" p={6}>
                    <Spinner emptyColor="canvas-1" color="brand.default" />
                </Flex>
            )}

            {!loading && fetched && results.length === 0 && (
                <Flex
                    justify="center"
                    align="center"
                    direction="column"
                    gap={3}
                    px={6}
                    py={16}
                    color="accent-5"
                >
                    <Icon as={FiFolderMinus} boxSize={12} />

                    <Text fontSize="sm" fontWeight="medium">
                        No records found
                    </Text>
                </Flex>
            )}

            <Flex
                display={xsettings.controls === 'off' ? 'none' : 'flex'}
                justify="space-between"
                align="center"
                gap={6}
            >
                <Select
                    variant="filled"
                    size="lg"
                    w="auto"
                    {...register('show')}
                >
                    {xsettings.show.map((data, index) => (
                        <option key={index}>{data}</option>
                    ))}
                </Select>

                <Flex align="center" gap={3}>
                    <IconButton
                        variant="filled"
                        size="lg"
                        color="accent-1"
                        icon={<FiChevronLeft size={20} />}
                        disabled={min === 0}
                        onClick={prev}
                    />
                    <IconButton
                        variant="filled"
                        size="lg"
                        color="accent-1"
                        icon={<FiChevronRight size={20} />}
                        disabled={
                            loading ||
                            !fetched ||
                            (results && results.length <= max)
                        }
                        onClick={next}
                    />
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Table
