import express from "express";
import { getAdminTripsAnalytics, getCompanyTripsAnalytics, getUserAndAgencyAnalytics } from './controller/dashboard.js';
import { protectedRouter } from "../auth/controller/auth.js";
import { allowedTo } from "../../middleware/allowedTo.js";
import { isVerify } from "../../middleware/isVerify.js";
import { CompanyTripAnalyticsValidation, tripYearValidation } from "./dashboard.validation.js"
import { validation } from "../../middleware/validation.js";
const dashboardRouter = express.Router();

dashboardRouter.route('/adminTripsAnalytics')
    .get(protectedRouter, isVerify, allowedTo('admin'),
        validation(tripYearValidation), getAdminTripsAnalytics);

dashboardRouter.route('/companyTripAnalytics')
    .get(protectedRouter, isVerify, allowedTo('owner', 'admin'),
        validation(CompanyTripAnalyticsValidation), getCompanyTripsAnalytics);


dashboardRouter.route('/usersAnalytics')
    .get( protectedRouter, isVerify, allowedTo('admin'),getUserAndAgencyAnalytics);


export default dashboardRouter;