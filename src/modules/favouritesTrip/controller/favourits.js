import { catchError } from '../../../middleware/catchError.js'
import { AppError } from '../../../utils/AppError.js'
import { userModel } from '../../../../db/models/user.model.js'

const addTofavourites = catchError(async (req, res, next) => {
    const favourite = await userModel.findByIdAndUpdate(req.user._id, { $addToSet: { favTrips: req.body.trip } }, { new: true }).populate('favTrips')
    !favourite && next(new AppError('No favourite', 404))
    favourite && res.send({ msg: 'success', favourite: favourite.favTrips })
})
const getfavourites = catchError(async (req, res, next) => {
    const favourite = await userModel.findById(req.user._id).populate('favTrips')
    !favourite && next(new AppError('No favourite', 404))
    favourite && res.send({ msg: 'success', favourite: favourite.favTrips })
})

const removeFromFavourites = catchError(async (req, res, next) => {
    let favourite = await userModel.findByIdAndUpdate(req.user._id, { $pull: { favTrips: req.params.id } }, { new: true })
    !favourite && next(new AppError('invalid data', 404))
    favourite && res.send({ msg: 'success' })
})


export {
    addTofavourites,
    getfavourites,
    removeFromFavourites
}



