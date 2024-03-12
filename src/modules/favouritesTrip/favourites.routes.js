import express  from "express";
const favouritesRouter = express.Router()
import {protectedRouter} from '../auth/controller/auth.js'
import {validation} from '../../middleware/validation.js'
import {allowedTo} from '../../middleware/allowedTo.js' 
import {addFavouritesVal, paramValidation} from './favourites.validation.js'
import { addTofavourites, getfavourites, removeFromFavourites } from "./controller/favourits.js";
favouritesRouter
.route('/')
.post(protectedRouter,allowedTo('user'),validation(addFavouritesVal),addTofavourites)
.get(protectedRouter,allowedTo('user'),getfavourites)
favouritesRouter
.route('/:id')
.delete(protectedRouter,allowedTo('user'),validation(paramValidation),removeFromFavourites)


export default favouritesRouter