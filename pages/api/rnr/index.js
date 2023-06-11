import connect from 'database/connect'
import Orders from 'database/schemas/orders'
import RatingsAndReviews from 'database/schemas/rnr'

export default async (req, res) => {
    const { method } = req
    await connect()

    switch (method) {
        case 'GET':
            try {
                const data = await RatingsAndReviews.find({}).sort({
                    createdAt: -1
                })
                res.status(200).send(data)
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'POST':
            try {
                const { data } = req.body

                await Orders.findByIdAndUpdate(
                    { _id: data.order.id },
                    {
                        to_rate: {
                            status: true,
                            date: new Date().toLocaleString('en-US', {
                                timeZone: 'Asia/Manila'
                            })
                        },
                        updated: new Date().toLocaleString('en-US', {
                            timeZone: 'Asia/Manila'
                        })
                    }
                )

                await RatingsAndReviews.create({
                    ...data,
                    created: new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Manila'
                    }),
                    updated: new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Manila'
                    })
                })

                res.status(200).send('request success.')
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
