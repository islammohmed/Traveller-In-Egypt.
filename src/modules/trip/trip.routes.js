import express from "express";
const tripRouter = express.Router()
import { validation } from '../../middleware/validation.js'
import { uploadFields } from "../../../service/fileUpload/fileUpload.js"
import { addTrip, deleteTrip, getSingleTrip, getTrips, getTripsForCompany, updateTrip } from "./controller/trip.js";
import { addTripVal, paramVal, updateTripVal } from "./trip.validation.js";
import { protectedRouter } from "../auth/controller/auth.js";
import { allowedTo } from "../../middleware/allowedTo.js";


tripRouter
    .route('/')
    .post(protectedRouter, uploadFields([
        { name: 'image', maxCount: 1 },
        { name: 'images', maxCount: 10 }
    ]), validation(addTripVal), allowedTo('owner'), addTrip)
    .get(getTrips)

tripRouter
    .route('/:id')
    .get(validation(paramVal), getSingleTrip)
    .put(protectedRouter, uploadFields([
        { name: 'image', maxCount: 1 },
        { name: 'images', maxCount: 10 }
    ]), validation(updateTripVal), updateTrip)
    .delete(protectedRouter, validation(paramVal), allowedTo('owner',''),deleteTrip)

tripRouter
    .get('/trips/:id', validation(paramVal), getTripsForCompany)

export default tripRouter