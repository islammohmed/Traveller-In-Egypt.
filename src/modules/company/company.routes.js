import express from "express";
const companyRouter = express.Router()
import { validation } from '../../middleware/validation.js'

import { uploadsingleFile } from "../../../service/fileUpload/fileUpload.js"
import { addCompany, deleteCompany, getCompanies, getSingleCompany, updateCompany } from "./controller/company.js";
import { addCompanyVal, paramValidation, updateCompanyVal } from "./company.validation.js";
import { allowedTo } from "../../middleware/allowedTo.js";
import { protectedRouter } from "../auth/controller/auth.js";

companyRouter
    .route('/')
    .post(protectedRouter, uploadsingleFile('image'), validation(addCompanyVal), allowedTo('owner'), addCompany)
    .get(getCompanies)

companyRouter
    .route('/:id')
    .get(validation(paramValidation), getSingleCompany)
    .put(protectedRouter, uploadsingleFile('image'), allowedTo('owner'), validation(updateCompanyVal), updateCompany)
    .delete(protectedRouter, allowedTo('admin','owner'), validation(paramValidation), deleteCompany)


export default companyRouter