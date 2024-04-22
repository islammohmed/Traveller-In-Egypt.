import { userModel } from "../../db/models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { catchError } from "./catchError.js";

export const isVerify = catchError(async(req,res,next)=>{
    console.log(req.user);
    let user = await userModel.findById(req.user._id)
    if(user.isverify){
        next()
    }else{
        next(new AppError('Email is not verified'))
    }
})