import { Schema, model, models } from 'mongoose'

const OrdersSchema = Schema(
    {
        user: {
            id: String
        },
        image: String,
        name: String,
        email: String,
        contact: String,
        address: Object,
        products: Array,
        subtotal: Number,
        discount: Number,
        shipping: Number,
        total: Number,
        payment_method: {
            type: String,
            default: ''
        },
        to_pay: {
            status: {
                type: Boolean,
                default: true
            },
            date: {
                type: String,
                default: ''
            }
        },
        to_ship: {
            status: {
                type: Boolean,
                default: false
            },
            date: {
                type: String,
                default: ''
            }
        },
        to_receive: {
            status: {
                type: Boolean,
                default: false
            },
            date: {
                type: String,
                default: ''
            }
        },
        completed: {
            status: {
                type: Boolean,
                default: false
            },
            date: {
                type: String,
                default: ''
            }
        },
        cancelled: {
            status: {
                type: Boolean,
                default: false
            },
            date: {
                type: String,
                default: ''
            }
        },
        to_rate: {
            status: {
                type: Boolean,
                default: false
            },
            date: {
                type: String,
                default: ''
            }
        },
        status: {
            type: String,
            default: 'pay'
        },
        is_paid: {
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

const Orders = models.Orders || model('Orders', OrdersSchema)

export default Orders
