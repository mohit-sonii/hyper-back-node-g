
import mongoose, { Schema } from 'mongoose'

const propertySchema = new Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },
    areaSqFt: {
        type: Number,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    amenities: {
        type: [String],
        required: true
    },
    furnished: {
        type: String,
        required: true
    },
    // availableFrom: {
    //     type: Date,
    //     required: true,
    //     default:new Date()
    // },
    listedBy: {
        type: String,
        required: true
    },
    tags: {
        type: [String]
    },
    colorTheme: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true
    },
    listingType: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

export const Properti = mongoose.model('Properti',propertySchema);