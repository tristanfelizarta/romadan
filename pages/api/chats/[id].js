import connect from 'database/connect'
import Chats from 'database/schemas/chats'

export default async (req, res) => {
    const { id } = req.query
    const user = { id }
    await connect()

    try {
        const data = await Chats.findOne({ user: user })

        if (data) {
            return res.status(200).send(data)
        } else {
            res.status(200).send({ messages: [] })
        }
    } catch (error) {
        return res.status(400).send('request failed.')
    }
}
