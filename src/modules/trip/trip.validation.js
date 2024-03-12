import Joi from 'joi'

const addTripVal = Joi.object({
    title: Joi.string().min(5).max(100).trim().required(),
    image: Joi.array().items(Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5242880).required()
    })).required(),
    images: Joi.array().items(Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5242880).required()
    })).required(),
    discription: Joi.string().min(20).max(200).trim().required(),
    startDate: Joi.date().required().greater('now'),
    endDate: Joi.date().required().greater('now'),
    inclusion: Joi.array().required(),
    tripStatus: Joi.string().valid('Avaliable', 'Canceled', 'Fineshed').optional(),
    quantity: Joi.number().min(0).required(),
    price: Joi.number().min(0).required(),
})
const paramVal = Joi.object({
    id: Joi.string().hex().length(24).required()
})


const updateTripVal = Joi.object({
    id: Joi.string().hex().length(24).required(),
    title: Joi.string().min(5).max(100).trim().optional(),
    image: Joi.array().items(Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5242880).required()
    })).optional(),
    discription: Joi.string().min(20).max(200).trim().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    inclusion: Joi.array().optional(),
    tripStatus: Joi.string().valid('Avaliable', 'Canceled', 'Fineshed').optional(),
    quantity: Joi.number().min(0).optional(),
    price: Joi.number().min(0).optional(),
})

export {
    addTripVal,
    paramVal,
    updateTripVal
}