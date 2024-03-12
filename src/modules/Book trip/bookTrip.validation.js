import Joi from 'joi'

const bookValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
    numberReserves:Joi.number()
})

const paramValidation = Joi.object({
    id: Joi.string().hex().length(24).required()
})


export {
    bookValidation,
    paramValidation
}