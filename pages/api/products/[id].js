import connect from 'database/connect'
import Products from 'database/schemas/products'

export default async (req, res) => {
    await connect()

    try {
        const { id } = req.query
        const data = await Products.findById({ _id: id })
        res.status(200).send(data)
    } catch (error) {
        return res.status(400).send('request failed.')
    }
}
