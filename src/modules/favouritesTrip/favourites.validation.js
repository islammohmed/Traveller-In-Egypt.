import Joi from 'joi'

const addFavouritesVal = Joi.object({
    trip: Joi.string().hex().length(24).required()
})
const paramValidation = Joi.object({
    id: Joi.string().hex().length(24).required()
})
const upadteFavouritesVal = Joi.object({
    trip: Joi.string().hex().length(24).required()
})



export{
    addFavouritesVal,
    paramValidation,
    upadteFavouritesVal
}