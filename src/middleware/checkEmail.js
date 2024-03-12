import { userModel } from "../../db/models/user.model.js"
import { AppError } from "../utils/AppError.js"
import { catchError } from "./catchError.js"


export const checkEmail = catchError(async(req,res,next)=>{
    let email = await userModel.findOne({email:req.body.email})
    if(email)  next(new AppError('email already exist',401))
    next()
})