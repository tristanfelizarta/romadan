import connect from 'database/connect'
import Carts from 'database/schemas/carts'

export default async (req, res) => {
    const { method } = req
    await connect()

    switch (method) {
        case 'GET':
            try {
                const data = await Carts.find({}).sort({ createdAt: -1 })
                res.status(200).send(data)
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'POST':
            try {
                const { data } = req.body
                const carts = await Carts.findOne({ user: data.user })

                if (carts) {
                    carts.products.push({
                        id: data.product.id,
                        price: data.product.price,
                        discount: data.product.discount,
                        color: data.product.color,
                        size: data.product.size,
                        quantity: data.product.quantity
                    })

                    await carts.save()
                    return res.status(200).send('request success.')
                } else {
                    await Carts.create({
                        user: data.user,
                        products: [
                            {
                                id: data.product.id,
                                price: data.product.price,
                                discount: data.product.discount,
                                color: data.product.color,
                                size: data.product.size,
                                quantity: data.product.quantity
                            }
                        ],
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
                const { id } = req.body
                const carts = await Carts.findOne({ user: { id: id.user } })

                const index = carts.products
                    .map((product) => {
                        return product._id.toString()
                    })
                    .indexOf(id.cart)

                carts.products.splice(index, 1)
                await carts.save()
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
