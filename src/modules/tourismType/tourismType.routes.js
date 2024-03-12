import express from "express";
const tourismTypeRouter = express.Router()

import { addTourismType, deleteTourismType, getSingleTourismType, getTourismTypes, updateTourismType } from "./controller/tourismType.controller.js";
import { validation } from './../../middleware/validation.js'
import { addtourismTypeValidation, paramValidation, updatetourismTypeValidation } from "./tourismType.validation.js";
import { uploadsingleFile } from "./../../../service/fileUpload/fileUpload.js"
import { protectedRouter } from './../auth/controller/auth.js'
import { allowedTo } from './../../middleware/allowedTo.js'

tourismTypeRouter
    .route('/')
    .post(protectedRouter, allowedTo('admin'), uploadsingleFile('image'), validation(addtourismTypeValidation), addTourismType)
    .get(getTourismTypes)

tourismTypeRouter
    .route('/:id')
    .get(validation(paramValidation), getSingleTourismType)
    .put(protectedRouter, uploadsingleFile('image'), validation(updatetourismTypeValidation), updateTourismType)
    .delete(protectedRouter, validation(paramValidation), allowedTo('admin'), deleteTourismType)

export default tourismTypeRouter