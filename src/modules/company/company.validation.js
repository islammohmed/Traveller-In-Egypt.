import Joi from 'joi'

const addCompanyVal = Joi.object({
    name: Joi.string().min(5).max(100).trim().required(),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5242880).required()
    }).required(),
    phone: Joi.string().required(),
    email: Joi.string().required(),

})
const paramValidation = Joi.object({
    id: Joi.string().hex().length(24).required()
})
const updateCompanyVal = Joi.object({
    id: Joi.string().hex().length(24).required(),
    name: Joi.string().min(5).max(100).trim().optional(),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5242880).required()
    }).optional(),
    phone: Joi.string().optional()
})

export {
    addCompanyVal,
    paramValidation,
    updateCompanyVal
}