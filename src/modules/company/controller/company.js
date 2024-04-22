import { catchError } from '../../../middleware/catchError.js'
import { companyModel } from '../../../../db/models/company.model.js'
import { AppError } from '../../../utils/AppError.js'
import { deleteOne } from '../../handelers/handelers.js'
import { ApiFeature } from '../../../utils/ApiFeature.js'
import { cloudinaryConfig } from '../../../utils/cloudinaryConfig.js'


const addCompany = catchError(async (req, res, next) => {
    req.body.owner = req.user._id
    const image = await cloudinaryConfig().uploader.upload(req.file.path, {
        folder: 'Traveller/company/coverimage',
    });
    req.body.image = image.url;
    const companies = new companyModel(req.body)
    await companies.save()
    !companies && next(new AppError('invalid data', 404))
    companies && res.send({ msg: 'success', companies })
})
const getCompanies = catchError(async (req, res, next) => {
    let companies = await companyModel.find()
    res.send({ msg: 'success', companies })
})
const getSingleCompany = catchError(async (req, res, next) => {
    const Companys = await companyModel.findById(req.params.id)
    !Companys && next(new AppError('company not find', 404))
    Companys && res.send({ msg: 'success', Companys })
})

const updateCompany = catchError(async (req, res, next) => {
    let company = await companyModel.findById(req.params.id)
    !company && next(new AppError('company not founded!', 404))
    if (req.file) {
        let publicId = company.image.split('/').pop().split('.')[0]
        await cloudinaryConfig().uploader.destroy(publicId, (err, result) => {
            if (err) {
                console.error(err);
            } else {
                console.log(result);
            }
        });
        const imageResult = await cloudinaryConfig().uploader.upload(req.file.path, {
            folder: 'Traveller/company/image',
        });
        req.body.image = imageResult.url
    }
    if (req.body.name) {
        let conflictCompany = await companyModel.findOne({ name: req.body.name })
        if (conflictCompany) return next(new AppError('name already token', 404))
    }
    const Companys = await companyModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    !Companys && next(new AppError('company not find', 404))
    Companys && res.send({ msg: 'success', Companys })
})

const deleteCompany = deleteOne(companyModel)


export {
    addCompany,
    getCompanies,
    getSingleCompany,
    updateCompany,
    deleteCompany
}



