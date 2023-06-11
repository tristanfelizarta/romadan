import connect from 'database/connect'
import Variants from 'database/schemas/variants'

export default async (req, res) => {
    const { method } = req
    await connect()

    switch (method) {
        case 'GET':
            try {
                const data = await Variants.find({}).sort({ createdAt: -1 })
                res.status(200).send(data)
            } catch (error) {
                return res.status(400).send('request failed.')
            }

            break

        case 'POST':
            try {
                const { data } = req.body
                const variants = await Variants.findOne({
                    product: data.product
                })

                if (variants) {
                    variants.variants.push({
                        color: data.variant.color,
                        size: data.variant.size,
                        quantity: data.variant.quantity
                    })

                    await variants.save()
                    return res.status(200).send('request success.')
                } else {
                    await Variants.create({
                        product: data.product,
                        variants: [
                            {
                                color: data.variant.color,
                                size: data.variant.size,
                                quantity: data.variant.quantity
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
                const variant = await Variants.findOne({
                    product: { id: id.product }
                })

                const index = variant.variants
                    .map((variant) => {
                        return variant._id.toString()
                    })
                    .indexOf(id.variant)

                variant.variants.splice(index, 1)
                await variant.save()
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
