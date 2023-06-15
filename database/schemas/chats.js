import { Schema, model, models } from 'mongoose'

const ChatSchema = new Schema(
    {
        user: {
            id: {
                type: String,
                default: ''
            }
        },
        messages: [
            {
                role: String,
                message: String,
                created: String
            }
        ],
        status: {
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

const Chats = models.Chats || model('Chats', ChatSchema)

export default Chats
