
import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
    email: {
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
    },
    recommendationsReceived :[
        {
            from:{
                type:Schema.Types.ObjectId,
                ref:'User'
            },
            property:{
                type:Schema.Types.ObjectId,
                ref:'Properti'
            }
        }
    ]
})

export const User = mongoose.model('User', UserSchema);