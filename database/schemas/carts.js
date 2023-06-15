import { Schema, model, models } from 'mongoose'

const CartsSchema = new Schema(
    {
        user: {
            id: {
                type: String,
                default: ''
            }
        },
        products: [
            {
                id: String,
                price: Number,
                discount: {
                    percentage: Number
                },
                color: String,
                size: String,
                quantity: Number
            }
        ],
        created: {
            type: String,
            default: ''
        },
        updated: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
)

const Carts = models.Carts || model('Carts', CartsSchema)

export default Carts
