import Joi from 'joi'

const signUpValidation = Joi.object({
    firstName: Joi.string().min(2).max(100).trim().required(),
    lastName: Joi.string().min(2).max(100).trim().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/).required(),
    rePassword: Joi.valid(Joi.ref('password')).required(),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5242880)
    }).optional(),
})

const paramValidation = Joi.object({
    id: Joi.string().hex().length(24).required()
})

const signInValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

const changedPasswordVal = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/).required(),
    reNewPassword: Joi.valid(Joi.ref('newPassword')).required()
})

const isverifyVal = Joi.object({
    code:Joi.string().required()
})

const forgetPasswordVal = Joi.object({
    email:Joi.string().email().required()
})
const checkCodeVal = Joi.object({
    code:Joi.string().required(),
    email:Joi.string().email().required()
})

const resetPasswordVal = Joi.object({
    email:Joi.string().email().required(),
    newPassword: Joi.string().pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/).required(),
    reNewPassword: Joi.valid(Joi.ref('newPassword')).required()
})

export {
    signUpValidation,
    paramValidation,
    signInValidation,
    changedPasswordVal,
    isverifyVal,
    forgetPasswordVal,
    resetPasswordVal,
    checkCodeVal
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