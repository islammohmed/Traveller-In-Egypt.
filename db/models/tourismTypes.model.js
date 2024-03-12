
import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength: [10,'tourism Type is too short'],
        maxLength: [100,'tourism Type is too long'],
    },
    slug:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true
    }
},
{ timestamps:true ,toJSON: {virtuals:true}})

schema.virtual('trips',{
    ref:'trip',
    localField: '_id',
    foreignField:'tourismType'
})
schema.post('init',function(doc){
    doc.photo = process.env.BASE_URL + 'uploads/' + doc.photo
})

export const tourismTypeModel = mongoose.model('tourismType',schema)