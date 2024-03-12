import express from "express";
const authRouter = express.Router()

import { validation } from '../../middleware/validation.js'
import { changedPasswordVal, checkCodeVal, forgetPasswordVal, isverifyVal, resetPasswordVal, signInValidation, signUpValidation } from "./auth.validation.js";
import { uploadsingleFile } from "../../../service/fileUpload/fileUpload.js"
import { changePassword, checkCode, forgetPassword, isVerify, resetPassword, signIn, signUp } from "./controller/auth.js";
import { checkEmail } from "../../middleware/checkEmail.js";
import { protectedRouter } from "./controller/auth.js";

authRouter.post('/signUp', uploadsingleFile('image'), validation(signUpValidation), checkEmail, signUp)
authRouter.post('/signIn', validation(signInValidation), signIn)
authRouter.post('/verify-email', protectedRouter, validation(isverifyVal), isVerify)
authRouter.post('/forgetPassword', validation(forgetPasswordVal), forgetPassword)
authRouter.post('/checkCode', validation(checkCodeVal), checkCode)
authRouter.post('/resetPassword', validation(resetPasswordVal), resetPassword)




authRouter.patch('/changePassword', protectedRouter, validation(changedPasswordVal), changePassword)


export default authRouter