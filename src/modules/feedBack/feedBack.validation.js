import Joi from 'joi'

const addFeedbackVal = Joi.object({
    company: Joi.string().hex().length(24).required(),
    text: Joi.string().min(2).max(200).required(),
    rate:Joi.number().min(0).max(5).required(),
})
const paramValidation = Joi.object({
    id: Joi.string().hex().length(24).required()
})
const upadteFeedbackVal = Joi.object({
    id: Joi.string().hex().length(24).optional(),
    text: Joi.string().min(2).max(200).optional(),
    rate:Joi.number().min(0).max(5).optional()
})



export{
    addFeedbackVal,
    paramValidation,
    upadteFeedbackVal
}