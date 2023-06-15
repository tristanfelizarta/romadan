import { Schema, model, models } from 'mongoose'

const VariantsSchema = new Schema(
    {
        product: {
            id: {
                type: String,
                default: ''
            }
        },
        variants: [
            {
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

const Variants = models.Variants || model('Variants', VariantsSchema)

export default Variants
