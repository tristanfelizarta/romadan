import { Schema, model, models } from 'mongoose'

const AccountSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
})

const Accounts = models.Accounts || model('Accounts', AccountSchema)

export default Accounts
