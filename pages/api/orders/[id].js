import connect from 'database/connect'
import Orders from 'database/schemas/orders'

export default async (req, res) => {
    const { id } = req.query
    await connect()

    try {
        const data = await Orders.findById({ _id: id })
        res.status(200).send(data)
    } catch (error) {
        return res.status(400).send('request failed.')
    }
}
