import {catchError} from '../../../middleware/catchError.js'
import { AppError } from '../../../utils/AppError.js'
import { userModel } from '../../../../db/models/user.model.js'
import { deleteOne } from '../../handelers/handelers.js'
import { ApiFeature } from '../../../utils/ApiFeature.js'
import { cloudinaryConfig } from "../../../utils/cloudinaryConfig.js"

const addUser = catchError(async(req,res,next)=>{
    if (req.file){
        const imageResult = await cloudinaryConfig().uploader.upload(req.file.path, {
            folder: 'Traveller/users/images',
        });
        req.body.image = imageResult.url
    }else{
        console.log('kk');
        const imageResult = await cloudinaryConfig().uploader.upload('https://th.bing.com/th/id/R.a6e328f484dfaee5cff22431f5c61cab?rik=QtxCe0VZ6bQvjQ&pid=ImgRaw&r=0', {
            folder: 'Traveller/users/images',
        });
        req.body.image = imageResult.url
    } 
    req.body.isVerify = true
    const user = new userModel(req.body)
    await user.save()
    !user && next (new AppError('user not founded',404))
    user && res.send({msg:'success',user})
})
const getUsers = catchError(async(req,res,next)=>{
    let apiFeaturee = new ApiFeature(userModel.find(),req.query).pagenation().sort().filter().search('firstname','lastName','email')
    const users = await apiFeaturee.mongoseQuery
    !users && next (new AppError('can not find users',404))
    users && res.send({msg:'success',page:apiFeaturee.pageNumber,users})
})
const getSingleUser = catchError(async(req,res,next)=>{
    const user = await userModel.findById(req.params.id)
    !user && next (new AppError('user not find',404))
    user && res.send({msg:'success',user})
})
const updateUser = catchError(async(req,res,next)=>{
    if (req.file){
        let publicId = userModel.image.split('/').pop().split('.')[0]
        await cloudinaryConfig().uploader.destroy(publicId, (err, result) => {
            if (err) {
                console.error(err);
            } else {
                console.log(result);
            }
        });
        const imageResult = await cloudinaryConfig().uploader.upload(req.file.path, {
            folder: 'Traveller/users/images',
        });
        req.body.image = imageResult.url
    } 
    const user = await userModel.findByIdAndUpdate(req.params.id,req.body,{new: true})
    !user && next (new AppError('type not find',404))
    user && res.send({msg:'success',user})
})
const deleteUser =  deleteOne(userModel)

export{
    addUser,
    getUsers,
    getSingleUser,
    updateUser,
    deleteUser
}



