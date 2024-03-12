import mongoose from "mongoose";

const schema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        maxLength: [40,'title name is too long'],
    },
    slug:{
        type:String,
        required:true,
    },
    discription:{
        type:String,
        required:true,
        minLength: [30,'description  is too short'],
        maxLength: [200,'description  is too long']
    },
    image:{
        type:String,
        requiredd:true,
    },
    images:[{
        type:String,
        required:true,
    }],
    startDate:{
        type:Date,
        requiredd:true,
    },
    endDate:{
        type:Date,
        required:true,
    },
    Days:{
        type:Number
    },
    inclusion:[{
        type:String,
        required:true
    }],
    company:{
        type:mongoose.Types.ObjectId,
        ref:'company'
    },
    owner:[{
        type:mongoose.Types.ObjectId,
        ref:'company'
    }],
    tourismType:{
        type:mongoose.Types.ObjectId,
        ref:'tourismType'
    },
    discount:{
        type:Number,
        min:0,
    },
    tripStatus:{
        type:String,
        required:true,
        enum:['Avaliable','Canceled','completed'],
        default:'Avaliable'
    },
    quantity:{
        type:Number,
        required:true,
        min:0
    },
    price:{
        type:Number,
        min:0,
        required:true
    }, 
    priceAfterDiscount:{
        type:Number,
        min:0
    }, 
    booked:{
        type:Number,
        default:0
    }
},
{ timestamps:true })

export const tripModel = mongoose.model('trip',schema)