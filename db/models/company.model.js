
import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
        unique: [true, 'name already token'],
        maxLength: [100, 'name is too long'],
    },
    image: {
        type: String,
        required: true,
    },
    phone: [{
        type: String,
        required: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    rateAvg: {
        type: Number,
    },
    rateCount: {
        type: Number,
        default:0
    },
    email: {
        type: String,
        required: true
    }

},
    { timestamps: true })

export const companyModel = mongoose.model('company', schema)