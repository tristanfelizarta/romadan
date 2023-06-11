import connect from 'database/connect'
import Products from 'database/schemas/products'
import Carts from 'database/schemas/carts'

export default async (req, res) => {
    const { id } = req.query
    await connect()

    try {
        const products = await Products.find({})
        const carts = await Carts.findOne({ user: { id } })

        let data = []

        carts.products.map((cart_product) => {
            products
                .filter(
                    (product) =>
                        product._id.toString() === cart_product.id.toString()
                )
                .map((product) => {
                    data.push({
                        product: {
                            id: product._id
                        },
                        cart: {
                            id: cart_product._id
                        },
                        image: product.image,
                        name: product.name,
                        price: product.price,
                        discount: product.discount,
                        color: cart_product.color,
                        size: cart_product.size,
                        quantity: cart_product.quantity
                    })
                })
        })

        if (carts) {
            res.status(200).send(data)
        } else {
            res.status(200).send([])
        }
    } catch (error) {
        return res.status(400).send('request failed.')
    }
}
