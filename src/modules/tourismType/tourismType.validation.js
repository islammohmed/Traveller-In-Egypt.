import Joi from 'joi'

const addtourismTypeValidation = Joi.object({
    name: Joi.string().min(10).max(100).trim().required(),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg', 'image/jfif').required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5242880).required()
    }).required()
})
const paramValidation = Joi.object({
    id: Joi.string().hex().length(24).required()
})


const updatetourismTypeValidation = Joi.object({
    name: Joi.string().min(10).max(100).trim().optional(),
    id: Joi.string().hex().length(24).optional(),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5242880).required()
    }).optional()
})

export {
    addtourismTypeValidation,
    paramValidation,
    updatetourismTypeValidation
}