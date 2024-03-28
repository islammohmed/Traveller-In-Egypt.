import express  from "express";
const favouritesRouter = express.Router()
import {protectedRouter} from '../auth/controller/auth.js'
import {validation} from '../../middleware/validation.js'
import {allowedTo} from '../../middleware/allowedTo.js' 
import {addFavouritesVal, paramValidation} from './favourites.validation.js'
import { addTofavourites, getfavourites, removeFromFavourites } from "./controller/favourits.js";
import { isVerify } from "../../middleware/isVerify.js";
favouritesRouter
.route('/')
.post(protectedRouter,isVerify,allowedTo('user'),validation(addFavouritesVal),addTofavourites)
.get(protectedRouter,isVerify,allowedTo('user'),getfavourites)
favouritesRouter
.route('/:id')
.delete(protectedRouter,isVerify,allowedTo('user'),validation(paramValidation),removeFromFavourites)


export default favouritesRouter