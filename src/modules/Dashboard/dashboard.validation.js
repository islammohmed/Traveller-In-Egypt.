import Joi from "joi";


const CompanyTripAnalyticsValidation = Joi.object({
    companyId: Joi.string().hex().length(24).required(),
    startYear: Joi.number().required(),
    endYear: Joi.number().required()
})


const tripYearValidation = Joi.object({
    startYear: Joi.number().required(),
    endYear: Joi.number().required()
})


export { CompanyTripAnalyticsValidation , tripYearValidation  }