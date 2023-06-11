import connect from 'database/connect'
import Orders from 'database/schemas/orders'

export default async (req, res) => {
    const { id } = req.query
    await connect()

    try {
        console.log(id)
        const orders = await Orders.find({}).sort({ createdAt: -1 })
        const data = orders.filter((order) => order.user.id === id)

        if (data) {
            res.status(200).send(data)
        } else {
            res.status(200).send([])
        }
    } catch (error) {
        return res.status(400).send('request failed.')
    }
}
