import { AppError } from "../utils/AppError.js"


export function allowedTo(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return next(new AppError('You Are Not allowed', 401))
        next()
    }

}