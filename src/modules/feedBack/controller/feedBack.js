import { feedBackModel } from '../../../../db/models/FeedBack.model.js'
import { catchError } from '../../../middleware/catchError.js'
import { AppError } from '../../../utils/AppError.js'
import { companyModel } from './../../../../db/models/company.model.js'

const addFeedback = catchError(async (req, res, next) => {
    let company = await companyModel.findById(req.body.company)
    if (!company) return next(new AppError('company not Founded', 404))
    let isfeedbackExist = await feedBackModel.findOne({ user: req.user._id, company: req.body.company })
    if (isfeedbackExist) return next(new AppError('you are created feedback Before', 404))
    company.rateCount += 1;
    if (company.rateCount !== 0) {
        if (company.rateCount === 1) {
            // If it's the first rating, set rateAvg to the new rating directly
            company.rateAvg = req.body.rate;
        } else {
            // Update rateAvg based on the existing average and the new rating
            company.rateAvg = (company.rateAvg * (company.rateCount - 1) + req.body.rate) / company.rateCount;
        }
        await company.save();
    } else {
        console.error("rateCount should not be zero");
    }

    req.body.user = req.user._id
    const feedback = new feedBackModel(req.body)
    await feedback.save()
    !feedback && next(new AppError('invalid data', 404))
    feedback && res.send({ msg: 'success', feedback })
})
const getFeedbacks = catchError(async (req, res, next) => {
    const feedback = await feedBackModel.findOne({ company: req.body.company })
    !feedback && next(new AppError('No feedback', 404))
    feedback && res.send({ msg: 'success', feedback })
})
const getSingleFeedback = catchError(async (req, res, next) => {
    const feedback = await feedBackModel.findById(req.params.id)
    !feedback && next(new AppError('feedback not find', 404))
    feedback && res.send({ msg: 'success', feedback })
})
const updateFeedback = catchError(async (req, res, next) => {
    let feedback = await feedBackModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    !feedback && next(new AppError('invalid data', 404))
    feedback && res.send({ msg: 'success', feedback })
})
const deleteFeedback = catchError(async (req, res, next) => {
    let user = await feedBackModel.findOne({ user: req.user._id, _id: req.params.id })
    !user && next(new AppError('user do not have any feedback ', 404))
    const feedback = await feedBackModel.findByIdAndDelete(req.params.id)
    !feedback && next(new AppError('can not find ', 404))
    feedback && res.send({ msg: 'success' })
})

export {
    addFeedback,
    getFeedbacks,
    getSingleFeedback,
    updateFeedback,
    deleteFeedback
}



