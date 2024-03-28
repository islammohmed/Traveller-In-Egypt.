import express from "express";
const feedbackRouter = express.Router()
import { protectedRouter } from './../auth/controller/auth.js'

import { validation } from '../../middleware/validation.js'
import { addFeedbackVal, paramValidation, upadteFeedbackVal } from "./feedBack.validation.js";
import { allowedTo } from './../../middleware/allowedTo.js'
import { addFeedback, deleteFeedback, getFeedbacks, getSingleFeedback, updateFeedback } from "./controller/feedBack.js";
import { isVerify } from "../../middleware/isVerify.js";

feedbackRouter
    .route('/')

    .post(protectedRouter,isVerify, allowedTo('user'), validation(addFeedbackVal), addFeedback)
    .get(getFeedbacks)

feedbackRouter
    .route('/:id')
    .delete(protectedRouter, isVerify,allowedTo('admin', 'user'), validation(paramValidation), deleteFeedback)
    .put(protectedRouter, isVerify,allowedTo('user'), validation(upadteFeedbackVal), updateFeedback)
    .post(protectedRouter,isVerify, allowedTo('user'), validation(addFeedbackVal), addFeedback)


feedbackRouter.get('/singleFeedback/:id', validation(paramValidation), getSingleFeedback)


export default feedbackRouter