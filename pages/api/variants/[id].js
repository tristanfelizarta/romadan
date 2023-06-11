import connect from 'database/connect'
import Variants from 'database/schemas/variants'

export default async (req, res) => {
    const { id } = req.query
    await connect()

    try {
        const data = await Variants.findOne({ product: { id } })

        if (data) {
            res.status(200).send(data.variants)
        } else {
            res.status(200).send([])
        }
    } catch (error) {
        return res.status(400).send('request failed.')
    }
}
