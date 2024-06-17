
import { catchError } from "../../../middleware/catchError.js";
import { tripModel } from "../../../../db/models/trip.model.js";
import { Message } from "../../../../db/models/messageModel.js";
import { userModel } from "../../../../db/models/user.model.js";
import { companyModel } from "../../../../db/models/company.model.js";
import mongoose from "mongoose";
const getAdminTripsAnalytics = catchError(async (req, res, next) => {
    const { startYear, endYear } = req.query;

    const tripsStatusAnalytics = await tripModel.aggregate([
        {
            $match: {
                $expr:
                {
                    $and:
                        [
                            { $eq: [{ $year: "$startDate" }, Number(startYear)] },
                            { $eq: [{ $year: "$endDate" }, Number(endYear)] }
                        ]
                }
            }
        },
        { $group: { _id: "$tripStatus", totalCount: { $sum: 1 } } },
        { $project: { tripStatus: "$_id", totalCount: 1, _id: 0 } }
    ])

    res.json({ success: true, data: tripsStatusAnalytics, Message: null });
})


const getCompanyTripsAnalytics = catchError(async (req, res, next) => {
    const { startYear, endYear, companyId } = req.query;

    const agencyTripsAnalytics = await tripModel.aggregate([
        {
            $match:
            {
                owner: { $in: [new mongoose.Types.ObjectId(companyId)] },
                $expr:
                {
                    $and:
                        [
                            { $eq: [{ $year: "$startDate" }, Number(startYear)] },
                            { $eq: [{ $year: "$endDate" }, Number(endYear)] }
                        ]
                }
            },

        },
        { $group: { _id: "$tripStatus", totalCount: { $sum: 1 } } },
        { $project: { tripStatus: "$_id", totalCount: 1, _id: 0 } }
    ])

    res.json({ success: true, data: agencyTripsAnalytics, Message: null });
})


const getUserAndAgencyAnalytics = catchError(async (req, res, next) => {
    const currentYear = new Date().getFullYear();

    const newUsers = await userModel.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                }
            }
        },
        { $group: { _id: null, totalCount: { $sum: 1 } } },
        {
            $project: {
                totalCount: 1,
                _id: 0
            }
        }
    ]);


    const oldUsers = await userModel.aggregate([
        {
            $match: {
                createdAt: {
                    $lte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                }
            }
        },
        { $group: { _id: null, totalCount: { $sum: 1 } } },
        {
            $project: {
                totalCount: 1,
                _id: 0
            }
        }
    ]);

    const newCompanies = await companyModel.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                }
            }
        },
        { $group: { _id: null, totalCount: { $sum: 1 } } },
        {
            $project: {
                totalCount: 1,
                _id: 0
            }
        }
    ]);

    const oldCompanies = await companyModel.aggregate([
        {
            $match: {
                createdAt: {
                    $lte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                }
            }
        },
        { $group: { _id: null, totalCount: { $sum: 1 } } },
        {
            $project: {
                totalCount: 1,
                _id: 0
            }
        }
    ]);

    res.json({
        success: true,
        data: {
            newUsers,
            oldUsers,
            newCompanies,
            oldCompanies
        },
        message: null
    });
});

export { getAdminTripsAnalytics, getCompanyTripsAnalytics, getUserAndAgencyAnalytics }