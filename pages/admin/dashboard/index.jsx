import { Container, Grid, GridItem } from '@chakra-ui/react'
import Statistics from 'components/dashboard/statistics'
import Orders from 'components/dashboard/orders'
import Ratings from 'components/dashboard/ratings'
import Customers from 'components/dashboard/customers'

const Dashboard = () => {
    return (
        <Container>
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                <Statistics />

                <GridItem colSpan={12}>
                    <Orders />
                </GridItem>

                <GridItem colSpan={{ base: 12, lg: 8 }}>
                    <Ratings />
                </GridItem>

                <GridItem colSpan={{ base: 12, lg: 4 }}>
                    <Customers />
                </GridItem>
            </Grid>
        </Container>
    )
}

export default Dashboard
