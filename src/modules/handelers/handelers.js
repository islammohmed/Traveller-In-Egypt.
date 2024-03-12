import { catchError } from "../../middleware/catchError.js"
export function deleteOne (model){
    return catchError(async(req,res,next)=>{
    const document = await model.findByIdAndDelete(req.params.id)
    !document && next(new AppError('can not find ',404))
    document && res.send({msg:'success'})
})} 