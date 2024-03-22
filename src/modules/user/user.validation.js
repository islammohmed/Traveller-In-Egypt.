import Joi from 'joi'

const addUserValidation = Joi.object({
    firstName: Joi.string().min(2).max(100).trim().required(),
    lastName: Joi.string().min(2).max(100).trim().required(),
    email: Joi.string().email(),
    password: Joi.string().pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/).required(),
    rePassword: Joi.valid(Joi.ref('password')).required(),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jepg', 'image/png', 'image/jpg').required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5242880)
    }).optional(),
    role:Joi.string().valid('user','admin','owner').optional()
})
const paramValidation = Joi.object({
    id: Joi.string().hex().length(24).required()
})


const updateUserValidation = Joi.object({ 
    id: Joi.string().hex().length(24).required(),
    firstName: Joi.string().min(2).max(100).trim().optional(),
    lastName: Joi.string().min(2).max(100).trim().optional(),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jepg', 'image/png', 'image/jpg').required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5242880)
    }).optional(),
    phone: Joi.string().pattern(/^\+(20)\d{1,2}\d{7,8}$/).optional(),
    nationality:Joi.string().min(2).max(100).trim().optional(),
    role: Joi.string().valid('user','admin','owner').optional()
})

export {
    addUserValidation,
    paramValidation,
    updateUserValidation
}

/*
(           # Start of group
(?=.*\d)      #   must contains one digit from 0-9
(?=.*[a-z])       #   must contains one lowercase characters
(?=.*[\W])        #   must contains at least one special character
    .     #     match anything with previous condition checking
        {8,20}  #        length at least 8 characters and maximum of 20 
)           # End of group
*/ 