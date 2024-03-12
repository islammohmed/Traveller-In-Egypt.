import { catchError } from './../../../middleware/catchError.js'
import slugify from 'slugify'
import { tourismTypeModel } from './../../../../db/models/tourismTypes.model.js'
import { AppError } from '../../../utils/AppError.js'
import { deleteOne } from '../../handelers/handelers.js'
import { cloudinaryConfig } from "../../../utils/cloudinaryConfig.js"

const addTourismType = catchError(async (req, res, next) => {
    const imageResult = await cloudinaryConfig().uploader.upload(req.file.path, {
        folder: 'Traveller/tourismType/images',
    });
    req.body.image = imageResult.url
    req.body.slug = slugify(req.body.name)
    const tourismTypes = new tourismTypeModel(req.body)
    await tourismTypes.save()
    !tourismTypes && next(new AppError('invalid data', 404))
    tourismTypes && res.send({ msg: 'success', tourismTypes })
})
const getTourismTypes = catchError(async (req, res, next) => {
    const tourismTypes = await tourismTypeModel.find().populate('trips')
    !tourismTypes && next(new AppError('can not find type', 404))
    tourismTypes && res.send({ msg: 'success', tourismTypes })
})
const getSingleTourismType = catchError(async (req, res, next) => {
    const tourismTypes = await tourismTypeModel.findById(req.params.id).populate('trips')
    !tourismTypes && next(new AppError('type not find', 404))
    tourismTypes && res.send({ msg: 'success', tourismTypes })
})

const updateTourismType = catchError(async (req, res, next) => {
    let tourismType = await tourismTypeModel.findById(req.params.id)
    !tourismType && next(new AppError('type not find', 404))
    if (req.file) {
        let publicId = tourismType.image.split('/').pop().split('.')[0]
        await cloudinaryConfig().uploader.destroy(publicId, (err, result) => {
            if (err) {
                console.error(err);
            } else {
                console.log(result);
            }
        });
        const imageResult = await cloudinaryConfig().uploader.upload(req.file.path, {
            folder: 'Traveller/tourismType/images',
        });
        req.body.image = imageResult.url
    }
    if (req.body.name) req.body.slug = slugify(req.body.name)

    const tourismTypes = await tourismTypeModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    !tourismTypes && next(new AppError('type not find', 404))
    tourismTypes && res.send({ msg: 'success', tourismTypes })
})

const deleteTourismType = deleteOne(tourismTypeModel)

export {
    addTourismType,
    getTourismTypes,
    getSingleTourismType,
    updateTourismType,
    deleteTourismType
}



