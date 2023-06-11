import connect from 'database/connect'
import Blogs from 'database/schemas/blogs'

export default async (req, res) => {
    const { id } = req.query
    await connect()

    try {
        const data = await Blogs.findById({ _id: id })
        res.status(200).send(data)
    } catch (error) {
        return res.status(400).send('request failed.')
    }
}
