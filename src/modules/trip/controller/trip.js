import { catchError } from '../../../middleware/catchError.js'
import slugify from 'slugify'
import { AppError } from '../../../utils/AppError.js'
import { tripModel } from '../../../../db/models/trip.model.js'
import { ApiFeature } from '../../../utils/ApiFeature.js'
import { companyModel } from '../../../../db/models/company.model.js'
import { cloudinaryConfig } from '../../../utils/cloudinaryConfig.js'
const addTrip = catchError(async (req, res, next) => {
    let company = await companyModel.findOne({ owner: req.user._id })
    if (!company) return next(new AppError('no company for u add company please', 404))
    req.body.company = company._id
    req.body.owner = req.user._id
    let { startDate, endDate } = req.body
    req.body.slug = slugify(req.body.title)
    const imageResult = await cloudinaryConfig().uploader.upload(req.files.image[0].path, {
        folder: 'Traveller/trip/image',
    });
    const uploadPromises = req.files.images.map(async (file) => {
        const result = await cloudinaryConfig().uploader.upload(file.path, {
            folder: 'Traveller/trip/images',
        });
        return result.url;
    });
    const images = await Promise.all(uploadPromises);
    req.body.image = imageResult.url;
    req.body.images = images;
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    req.body.Days = diffDays
    const trips = new tripModel(req.body)
    await trips.save()
    !trips && next(new AppError('invalid data', 404))
    trips && res.send({ msg: 'success', trips })
})

const getTrips = catchError(async (req, res, next) => {
    let apiFeaturee = new ApiFeature
    (tripModel.find({}).populate('tourismType', 'name ')
    .populate('company', 'name _id'), req.query).pagenation().sort().filter().search('title', 'description')
    const trips = await apiFeaturee.mongoseQuery
    !trips && next(new AppError('can not find trips', 404))
    trips && res.send({ msg: 'success', page: apiFeaturee.pageNumber, trips })
})

const getSingleTrip = catchError(async (req, res, next) => {
    const Trips = await tripModel.findById(req.params.id).populate('tourismType', 'name').populate('company', 'name _id')
    !Trips && next(new AppError('type not find', 404))
    Trips && res.send({ msg: 'success', Trips })
})

const getTripsForCompany = catchError(async (req, res, next) => {
    let apiFeaturee = new ApiFeature(tripModel.find({ company: req.params.id }), req.query).pagenation().sort().filter().search()
    const trips = await apiFeaturee.mongoseQuery
    !trips && next(new AppError('can not find type', 404))
    trips && res.send({ msg: 'success', page: apiFeaturee.pageNumber, trips })
})

const updateTrip = catchError(async (req, res, next) => {
    let trip = await tripModel.findOne({ _id: req.params.id, owner: req.user._id });
    if (!trip) {
        next(new AppError('You are not the owner of this trip', 401));
        return;
    }

    if (req.body.name) {
        req.body.slug = slugify(req.body.name);
    }

    if (req.file) {
        if (trip.image) {
            let publicId = trip.image.split('/').pop().split('.')[0];
            await cloudinaryConfig().uploader.destroy(publicId, (err, result) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(result);
                }
            });
        }

        let image = await cloudinaryConfig().uploader.upload(req.file.path, {
            folder: 'Traveller/trip/image'
        });
        req.body.image = image.url;
    }

    const updatedTrip = await tripModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTrip) {
        next(new AppError('Trip not found', 404));
    } else {
        res.send({ msg: 'Success', updatedTrip });
    }
});



const deleteTrip = catchError(async (req, res, next) => {
    let owner = await tripModel.findOne({ _id: req.params.id, owner: req.user._id })
    if (!owner && req.user.role != 'admin') next(new AppError('you are not owner for this trip', 401))
    let trip = await tripModel.findByIdAndDelete(req.params.id)
    trip && res.send({ msg: 'success' })
})


export {
    addTrip,
    getTrips,
    getSingleTrip,
    updateTrip,
    deleteTrip,
    getTripsForCompany
}



