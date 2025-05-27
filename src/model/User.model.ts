
import mongoose,{Schema} from 'mongoose'

const UserSchema = new Schema ({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    properties:[{
        type:Schema.Types.ObjectId,
        ref:'Properti'
    }],
    favorites:[{
        type:Schema.Types.ObjectId,
        ref:'Properti'
    }]
})

export const User = mongoose.model('User',UserSchema);