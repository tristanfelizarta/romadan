import connect from 'database/connect'
import Carts from 'database/schemas/carts'
import Orders from 'database/schemas/orders'
import Products from 'database/schemas/products'
import Sales from 'database/schemas/sales'
import sgMail from '@sendgrid/mail'

export default async (req, res) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const { method } = req
    await connect()

    const sum_of_quantity = (orders) => {
        let sum = 0

        orders.products.forEach((order) => {
            sum += order.quantity
        })

        return sum
    }

    switch (method) {
        case 'GET':
            try {
                const data = await Orders.find({}).sort({ createdAt: -1 })
                res.status(200).send(data)
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'POST':
            try {
                const { data } = req.body

                await Orders.create({
                    ...data,
                    to_pay: {
                        status: true,
                        date: new Date().toLocaleString('en-US', {
                            timeZone: 'Asia/Manila'
                        })
                    },
                    created: new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Manila'
                    }),
                    updated: new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Manila'
                    })
                })

                await Carts.findOneAndUpdate(
                    { user: { id: data.user.id } },
                    {
                        products: [],
                        updated: new Date().toLocaleString('en-US', {
                            timeZone: 'Asia/Manila'
                        })
                    }
                )

                res.status(200).send('request success.')
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'PATCH':
            try {
                const { id, data } = req.body

                switch (data.type) {
                    case 'to_ship':
                        console.log(req.body)
                        if (data.status) {
                            await Orders.findByIdAndUpdate(
                                { _id: id },
                                {
                                    to_ship: {
                                        status: true,
                                        date: new Date().toLocaleString(
                                            'en-US',
                                            { timeZone: 'Asia/Manila' }
                                        )
                                    },
                                    status: 'ship'
                                }
                            )

                            sgMail.send({
                                to: data.email,
                                from: process.env.EMAIL_FROM,
                                subject: 'Your Order Is Ready To Ship!',
                                html: `<a>Visit Romadan to see order details and status.</a>`
                            })
                        } else {
                            await Orders.findByIdAndUpdate(
                                { _id: id },
                                {
                                    to_ship: {
                                        status: false,
                                        date: ''
                                    },
                                    status: 'pay'
                                }
                            )
                        }

                        break

                    case 'to_receive':
                        if (data.status) {
                            await Orders.findByIdAndUpdate(
                                { _id: id },
                                {
                                    to_receive: {
                                        status: true,
                                        date: new Date().toLocaleString(
                                            'en-US',
                                            { timeZone: 'Asia/Manila' }
                                        )
                                    },
                                    status: 'receive'
                                }
                            )

                            sgMail.send({
                                to: data.email,
                                from: process.env.EMAIL_FROM,
                                subject: 'Your Order Is Ready To Receive!',
                                html: `<a>Visit Romadan to see order details and status.</a>`
                            })
                        } else {
                            await Orders.findByIdAndUpdate(
                                { _id: id },
                                {
                                    to_receive: {
                                        status: false,
                                        date: ''
                                    },
                                    status: 'ship'
                                }
                            )
                        }

                        break

                    case 'completed':
                        const orders = await Orders.findById({ _id: id })

                        orders.products.map(async (order) => {
                            const product = await Products.findById({
                                _id: order.product.id
                            })

                            await Products.findByIdAndUpdate(
                                { _id: order.product.id },
                                {
                                    sold: product.sold + order.quantity,
                                    total_sales:
                                        product.total_sales +
                                        order.price * order.quantity,
                                    inventory: {
                                        shelf:
                                            product.inventory.shelf -
                                            order.quantity,
                                        warehouse: product.inventory.warehouse
                                    }
                                }
                            )

                            const sales = await Sales.findById({
                                _id: '637bba7201c9e559d6d2e174'
                            })

                            await Sales.findByIdAndUpdate(
                                { _id: '637bba7201c9e559d6d2e174' },
                                {
                                    total_sales:
                                        sales.total_sales +
                                        order.price * order.quantity
                                }
                            )
                        })

                        if (data.status) {
                            await Orders.findByIdAndUpdate(
                                { _id: id },
                                {
                                    completed: {
                                        status: true,
                                        date: new Date().toLocaleString(
                                            'en-US',
                                            { timeZone: 'Asia/Manila' }
                                        )
                                    },
                                    status: 'completed'
                                }
                            )
                        } else {
                            console.log('completed')
                        }

                        sgMail.send({
                            to: data.email,
                            from: process.env.EMAIL_FROM,
                            subject: 'Your Order Is Completed!',
                            html: `<a>Visit Romadan to see order details and status.</a>`
                        })

                        break

                    case 'cancelled':
                        if (data.status) {
                            await Orders.findByIdAndUpdate(
                                { _id: id },
                                {
                                    cancelled: {
                                        status: true,
                                        date: new Date().toLocaleString(
                                            'en-US',
                                            { timeZone: 'Asia/Manila' }
                                        )
                                    },
                                    status: 'cancelled'
                                }
                            )
                        } else {
                            await Orders.findByIdAndUpdate(
                                { _id: id },
                                {
                                    cancelled: {
                                        status: false,
                                        date: ''
                                    },
                                    status: 'pay'
                                }
                            )
                        }

                        break

                    case 'to_rate':
                        await Orders.findByIdAndUpdate(
                            { _id: id },
                            {
                                to_rate: {
                                    status: true,
                                    date: new Date().toLocaleString('en-US', {
                                        timeZone: 'Asia/Manila'
                                    })
                                },
                                status: 'rate'
                            }
                        )

                        break

                    default:
                        return res.status(400).send('request failed.')
                        break
                }

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
