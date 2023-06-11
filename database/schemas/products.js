import { Schema, model, models } from 'mongoose'

const ProductSchema = Schema(
    {
        image: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        inventory: {
            shelf: {
                type: Number,
                default: 0
            },
            warehouse: {
                type: Number,
                default: 0
            }
        },
        shipping: {
            weight: {
                type: Number,
                default: 0
            },
            width: {
                type: Number,
                default: 0
            },
            height: {
                type: Number,
                default: 0
            },
            length: {
                type: Number,
                default: 0
            }
        },
        price: {
            type: Number,
            default: 0
        },
        discount: {
            percentage: {
                type: Number,
                default: 0
            }
        },
        sold: {
            type: Number,
            default: 0
        },
        total_sales: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            default: ''
        },
        views: {
            type: Number,
            default: 0
        },
        archive: {
            type: Boolean,
            default: false
        },
        deleted: {
            type: Boolean,
            default: false
        },
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

const Products = models.Products || model('Products', ProductSchema)

export default Products
