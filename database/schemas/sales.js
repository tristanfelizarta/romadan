import { Schema, model, models } from 'mongoose'

const SaleSchema = new Schema(
    {
        total_sales: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
)

const Sales = models.Sales || model('Sales', SaleSchema)

export default Sales
