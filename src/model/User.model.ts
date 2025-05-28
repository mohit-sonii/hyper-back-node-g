
import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    properties: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Properti'
        }], 
        default: []
    },

    favorites: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Properti'
        }],
        default: []
    }
})

export const User = mongoose.model('User', UserSchema);