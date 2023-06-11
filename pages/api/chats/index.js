import connect from 'database/connect'
import Chats from 'database/schemas/chats'

export default async (req, res) => {
    const { method } = req
    await connect()

    switch (method) {
        case 'GET':
            try {
                res.status(200).send('request success.')
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'POST':
            try {
                const { data } = req.body
                const user = await Chats.findOne({ user: data.user })

                if (user) {
                    user.messages.push({
                        role: data.role,
                        message: data.message,
                        created: new Date().toLocaleString('en-US', {
                            timeZone: 'Asia/Manila'
                        })
                    })

                    await user.save()

                    await Chats.findOne(
                        { user: data.user },
                        {
                            status: true,
                            updated: new Date().toLocaleString('en-US', {
                                timeZone: 'Asia/Manila'
                            })
                        }
                    )

                    return res.status(200).send('request success.')
                } else {
                    await Chats.create({
                        user: data.user,
                        messages: [
                            {
                                role: data.role,
                                message: data.message,
                                created: new Date().toLocaleString('en-US', {
                                    timeZone: 'Asia/Manila'
                                })
                            }
                        ],
                        status: true,
                        created: new Date().toLocaleString('en-US', {
                            timeZone: 'Asia/Manila'
                        }),
                        updated: new Date().toLocaleString('en-US', {
                            timeZone: 'Asia/Manila'
                        })
                    })

                    res.status(200).send('request success.')
                }
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'PATCH':
            try {
                res.status(200).send('request success.')
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'DELETE':
            try {
                res.status(200).send('request success.')
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        default:
            res.status(400).send('request failed.')
            break
    }
}
