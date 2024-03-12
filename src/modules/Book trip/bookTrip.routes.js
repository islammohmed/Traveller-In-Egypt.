import express  from "express";
const bookTripRouter = express.Router()

import {validation} from '../../middleware/validation.js'
import {protectedRouter} from '../auth/controller/auth.js'
import {allowedTo} from '../../middleware/allowedTo.js'
import { bookValidation, paramValidation } from "./bookTrip.validation.js";
import { createCheckOutSession, getReservedForUser, getSpcificReserved, getallReserves, tripDetails } from "./controller/BookTrip.controller.js";

bookTripRouter
.route('/')
// .post(protectedRouter,allowedTo('user'),uploadsingleFile('photo'),validation(addtourismTypeValidation),addTourismType)
.get(protectedRouter,allowedTo('user'),getReservedForUser)
.get(protectedRouter,allowedTo('owner'),getallReserves)


bookTripRouter
.route('/:id')
.post(protectedRouter,allowedTo('user'),validation(bookValidation),tripDetails)
.get(protectedRouter,allowedTo('user','owner','admin'),validation(paramValidation),getSpcificReserved)
bookTripRouter.post('/checkout/:id',protectedRouter,allowedTo('user'),validation(paramValidation),createCheckOutSession)
// .put(protectedRouter,uploadsingleFile('photo'),validation(updatetourismTypeValidation),updateTourismType)
// .delete(protectedRouter,validation(paramValidation),allowedTo('admin'),deleteTourismType)

export default bookTripRouter