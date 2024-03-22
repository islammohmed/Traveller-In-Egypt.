
import mongoose from "mongoose";

const schema = mongoose.Schema({
    text: {
        type: String,
        required: true,
        minLength: [2, 'FeedBack is too short'],
        maxLength: [200, 'FeedBack is too long'],
    },
    rate: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    company: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'company'
    },
},
    { timestamps: true })

schema.pre(/^find/, function () {
    this.populate('user', 'firstName lastName -_id')
})

export const feedBackModel = mongoose.model('feedBack', schema)