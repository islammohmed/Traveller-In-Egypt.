import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    trip :{type: mongoose.Types.ObjectId, ref: 'trip'},
    number:Number,
    totalprice: Number,
    isPiad:{
        type:Boolean,
        default:false
    },
    paidAt:Date,
}, { timestamps: true })

export const reservedModel = mongoose.model('reserved', schema)
