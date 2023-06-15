import { Schema, model, models } from 'mongoose'

const BlogSchema = new Schema(
    {
        image: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        },
        status: {
            type: Boolean,
            default: true
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

const Blogs = models.Blogs || model('Blogs', BlogSchema)

export default Blogs
