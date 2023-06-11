import connect from 'database/connect'
import RatingsAndReviews from 'database/schemas/rnr'

export default async (req, res) => {
    const { id } = req.query
    await connect()

    try {
        console.log(id)
        const data = await RatingsAndReviews.findOne({ order: { id } })
        res.status(200).send(data)
    } catch (error) {
        return res.status(400).send('request failed.')
    }
}
