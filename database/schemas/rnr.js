import { Schema, model, models } from 'mongoose'

const RatingsAndReviewsSchema = new Schema(
    {
        name: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: ''
        },
        address: {
            type: Object,
            default: {}
        },
        order: {
            id: {
                type: String,
                default: ''
            }
        },
        ratings: {
            type: 'Number',
            default: 5
        },
        reviews: {
            type: String,
            default: ''
        },
        image: {
            type: String,
            default: ''
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

const RatingsAndReviews =
    models.RatingsAndReviews ||
    model('RatingsAndReviews', RatingsAndReviewsSchema)

export default RatingsAndReviews
