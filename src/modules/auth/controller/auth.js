import { catchError } from '../../../middleware/catchError.js'
import { AppError } from '../../../utils/AppError.js'
import { userModel } from '../../../../db/models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendEmail } from './../../../../service/email/sendEmail.js'
import { nanoid } from 'nanoid'
import { cloudinaryConfig } from "../../../utils/cloudinaryConfig.js"

const signUp = catchError(async (req, res, next) => {
    if (req.file) {
        const imageResult = await cloudinaryConfig().uploader.upload(req.file.path, {
            folder: 'Traveller/users/images',
        });
        req.body.image = imageResult.url
    } else {
        const imageResult = await cloudinaryConfig().uploader.upload('https://th.bing.com/th/id/R.a6e328f484dfaee5cff22431f5c61cab?rik=QtxCe0VZ6bQvjQ&pid=ImgRaw&r=0', {
            folder: 'Traveller/users/images',
        });
        req.body.image = imageResult.url
    }
    let Code = nanoid(6);
    req.body.verifyCode = Code
    const user = new userModel(req.body)
    await user.save()
    let token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY)
   sendEmail(Code, req.body.email)
    !user && next(new AppError('invalid data', 404))
    user && res.send({ msg: 'success', token })
})

const signIn = catchError(async (req, res, next) => {
    let { email, password } = req.body
    let checkEmail = await userModel.findOne({ email })
    if (!checkEmail) return next(new AppError('email incorrect', 401))
    let checkPassword = bcrypt.compareSync(password, checkEmail.password)
    if (!checkPassword) return next(new AppError('passwor incorrect', 401))
    let token = jwt.sign({ userId: checkEmail._id, role: checkEmail.role }, process.env.SECRET_KEY)
    res.send({ msg: 'success', token })
})

const changePassword = catchError(async (req, res, next) => {
    let user = await userModel.findById(req.user._id)
    let { oldPassword, newPassword } = req.body
    if (user && bcrypt.compareSync(oldPassword, user.password)) {
        await userModel.findByIdAndUpdate(req.user._id, { password: newPassword, passwordChangedAT: Date.now() })
        let token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY)
        res.send({ msg: 'success', token })
    }
    next(new AppError('incorrect password', 401))

})

const protectedRouter = catchError(async (req, res, next) => {
    const { token } = req.headers
    if (!token) return next(new AppError('invalid token', 401))
    let decoded = jwt.verify(token, process.env.SECRET_KEY)
    if (!decoded) return next(new AppError('invalid data', 401))
    let user = await userModel.findById(decoded.userId)
    if (!user) return next(new AppError('user not founded please signUp', 401))
    if (user.passwordChangedAT) {
        let time = parseInt(user?.passwordChangedAT.getTime() / 1000)
        if (decoded.iat < time) return next(new AppError('token invalid please login again', 401))
    }
    req.user = user
    next()
})

const isVerify = catchError(async (req, res, next) => {
    let verify = await userModel.findOne({ _id: req.user._id, verifyCode: req.body.code })
    if (!verify) return next(new AppError('code invalid', 401))
    let verified = await userModel.findOneAndUpdate({ _id: req.user._id }, { isverify: true },)
    if (!verified) return next(new AppError('verify faild', 401))
    res.send({ msg: 'success' })
})

const forgetPassword = catchError(async (req, res, next) => {
    let { email } = req.body
    let user = await userModel.findOne({ email })
    if (!user) return next(new AppError('no account for this email', 401))
    let resetCode = nanoid(6)
    await userModel.findOneAndUpdate({ email }, { resetCode })
    sendEmail(resetCode, email)
    res.send({ msg: 'success' })
})

const checkCode = catchError(async (req, res, next) => {
    let { email, code } = req.body
    let verify = await userModel.findOne({ email: email, resetCode: code })
    if (!verify) return next(new AppError('code invalid', 401))
    res.send({ msg: 'success' })
})

const resetPassword = catchError(async (req, res, next) => {
    let user = await userModel.findOneAndUpdate({ email: req.body.email }, { password: req.body.newPassword, passwordChangedAt: Date.now() })
    let token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY)
    res.send({ msg: 'success', token })
})


export {
    signUp,
    protectedRouter,
    signIn,
    changePassword,
    isVerify,
    forgetPassword,
    resetPassword,
    checkCode
}


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYxYjY1MDBhZmQ3OThlNmYzYzRiNGYiLCJyb2xlIjoidXNlciIsImlhdCI6MTcxMDM0MDA4M30.pz46A9t5-Kb0K7nq3MVcFbyBgYs7yxuqZmjejZ-FV2Q admin
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWZjZDEzZmEwOWFiNjEwZjFkYTYxZTYiLCJyb2xlIjoib3duZXIiLCJpYXQiOjE3MTEwNjc1MDR9.uWy1cYqdmrwsxa_nr--ajvU9cw50sBK0HFC79SbcvBc owner
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYxYzY3ZmNhNTM5N2ExZTExMmZkMmQiLCJyb2xlIjoidXNlciIsImlhdCI6MTcxMDM0MzgwN30.5P2M4QSBmmzyslS_dr33d9jqipRJsPTebp8mOgKnh8U user