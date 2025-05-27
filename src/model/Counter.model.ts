import mongoose,{ Schema } from "mongoose";


const counterModel = new Schema({
    id:{
        type:String,
        unqiue:true,
        required:true
    },
    seq:{
        type:Number,
        default:1000
    }
})

export const Counter = mongoose.model('Counter',counterModel);