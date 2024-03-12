import express  from "express";
const userRouter = express.Router()

import { addUser, deleteUser, getSingleUser, getUsers, updateUser } from "./controller/user.js";
import {validation} from '../../middleware/validation.js'
import { addUserValidation, paramValidation, updateUserValidation } from "./user.validation.js";
import {uploadsingleFile} from "../../../service/fileUpload/fileUpload.js"
import { allowedTo } from "../../middleware/allowedTo.js";
import {protectedRouter} from './../auth/controller/auth.js'
import {checkEmail} from './../../middleware/checkEmail.js'
userRouter
.route('/') 
.post(uploadsingleFile('photo'),protectedRouter,validation(addUserValidation),allowedTo('admin'),checkEmail, addUser)
.get(protectedRouter,allowedTo('admin'),getUsers)




userRouter
.route('/:id')
.get(protectedRouter,validation(paramValidation),allowedTo('admin'),getSingleUser)
.delete(protectedRouter,validation(paramValidation),allowedTo('admin'),deleteUser)
.put(uploadsingleFile('photo'),protectedRouter,validation(updateUserValidation),allowedTo('admin','user','owner'),checkEmail, updateUser)
export default userRouter