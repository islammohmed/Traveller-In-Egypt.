import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const schema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        trim: true,
        maxLength: [20, 'first name is too long'],
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: [20, 'last name is too short'],
    },
    image: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        require: true
    },
    phone: [String],
    BookTotalPrice:Number,
    nationality: String,
    isActive: {
        type: Boolean,
        default: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isverify: {
        type: Boolean,
        default: false
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    favTrips: {
        type: mongoose.Types.ObjectId,
        ref: 'trip'
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'owner'],
        default: 'user'
    },
    verifyCode: {
        type: String,
    },
    resetCode: String,
    passwordChangedAT: Date,
    bookeDetails:[{
        totalPrice:Number,
        numberReserves:Number
    }]
},
    { timestamps: true })
schema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, 8)
})
schema.pre('findOneAndUpdate', function () {
    if (this._update.password) this._update.password = bcrypt.hashSync(this._update.password, 8)
})

export const userModel = mongoose.model('user', schema)