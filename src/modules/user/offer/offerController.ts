import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import message from "./offerConstant";
import mongoose from "mongoose";
import Offer from "../../../models/offer";



const listoffer = async (req: any, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const skip = page * limit;

        if (Number(req.query.limit) !== 0) {
            Offer.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        brandId: new mongoose.Types.ObjectId(req.body.brand_id),
                        outletId:null
                    },
                },
                {
                    $lookup: {
                        from: "brands",
                        let: {
                            brandId: "$brandId",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$brandId"] },
                                            { $eq: ["$isDeleted", false] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "brand_detail",
                    },
                },
                {
                    $unwind: {
                        path: "$brand_detail",
                        preserveNullAndEmptyArrays: true
                    },
                },

                
                {
                    $project: {
                        _id: 1,
                        brandName: "$brand_detail.name",
                        image: 1,
                        createdAt: { $toLong: "$createdAt" },
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $facet: {
                        metadata: [
                            { $count: "total" },
                            { $addFields: { page: Number(page) } },
                            {
                                $addFields: {
                                    totalPages: {
                                        $ceil: { $divide: ["$total", limit] },
                                    },
                                },
                            },
                            {
                                $addFields: {
                                    hasPrevPage: {
                                        $cond: {
                                            if: {
                                                $lt: [{ $subtract: [page, Number(1)] }, Number(0)],
                                            },
                                            then: false,
                                            else: true,
                                        },
                                    },
                                },
                            },
                            {
                                $addFields: {
                                    prevPage: {
                                        $cond: {
                                            if: {
                                                $lt: [{ $subtract: [page, Number(1)] }, Number(0)],
                                            },
                                            then: null,
                                            else: { $subtract: [page, Number(1)] },
                                        },
                                    },
                                },
                            },
                            {
                                $addFields: {
                                    hasNextPage: {
                                        $cond: {
                                            if: {
                                                $gt: [
                                                    {
                                                        $subtract: [
                                                            {
                                                                $ceil: { $divide: ["$total", limit] },
                                                            },
                                                            Number(1),
                                                        ],
                                                    },
                                                    "$page",
                                                ],
                                            },
                                            then: true,
                                            else: false,
                                        },
                                    },
                                },
                            },
                            { $addFields: { nextPage: { $sum: [page, Number(1)] } } },
                        ],
                        data: [{ $skip: skip }, { $limit: limit }],
                    },
                },
            ])
                .then((data: any) => {
                    if (!data) {
                        throw {
                            statusCode: constants.code.dataNotFound,
                            msg: constants.message.dataNotFound,
                        };
                    } else {
                        res.status(constants.code.success).json({
                            status: constants.status.statusTrue,
                            userStatus: req.status,
                            message: message.offerList,
                            metadata: data[0].metadata,
                            data: data[0].data,
                        });
                    }
                })
                .catch((err) => {
                    res.status(err.statusCode).json({
                        status: constants.status.statusFalse,
                        userStatus: req.status,
                        message: err.msg,
                    });
                });
        } else {
            Offer.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        brandId: new mongoose.Types.ObjectId(req.body.brand_id),
                        outletId:null
                    },
                },
                {
                    $lookup: {
                        from: "brands",
                        let: {
                            brandId: "$brandId",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$brandId"] },
                                            { $eq: ["$isDeleted", false] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "brand_detail",
                    },
                },
                {
                    $unwind: {
                        path: "$brand_detail",
                        preserveNullAndEmptyArrays: true
                    },
                },

               
                {
                    $project: {
                        _id: 1,
                        brandName: "$brand_detail.name",
                        image: 1,
                        createdAt: { $toLong: "$createdAt" },
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $facet: {
                        metadata: [
                            { $count: "total" },
                            { $addFields: { page: Number(page) } },
                            {
                                $addFields: { totalPages: { $sum: [Number(page), Number(1)] } },
                            },
                            { $addFields: { hasPrevPage: false } },
                            { $addFields: { prevPage: null } },
                            { $addFields: { hasNextPage: false } },
                            { $addFields: { nextPage: null } },
                        ],
                        data: [],
                    },
                },
            ])
                .then((data) => {
                    if (!data) {
                        throw {
                            statusCode: constants.code.dataNotFound,
                            msg: constants.message.dataNotFound,
                        };
                    } else {
                        res.status(constants.code.success).json({
                            status: constants.status.statusTrue,
                            userStatus: req.status,
                            message: message.offerList,
                            metadata: data[0].metadata,
                            data: data[0].data,
                        });
                    }
                })
                .catch((err) => {
                    res.status(err.statusCode).json({
                        status: constants.status.statusFalse,
                        userStatus: req.status,
                        message: err.msg,
                    });
                });
        }
    } catch (err) {
        res.status(constants.code.internalServerError).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: err,
        });
    }
}

const listOutletoffer = async (req: any, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const skip = page * limit;


        if (Number(req.query.limit) !== 0) {
            Offer.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        outletId: new mongoose.Types.ObjectId(req.body.outlet_id)
                    },
                },
                {
                    $lookup: {
                        from: "brands",
                        let: {
                            brandId: "$brandId",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$brandId"] },
                                            { $eq: ["$isDeleted", false] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "brand_detail",
                    },
                },
                {
                    $unwind: {
                        path: "$brand_detail",
                        preserveNullAndEmptyArrays: true
                    },
                },

                {
                    $lookup: {
                        from: "outlets",
                        let: {
                            outletId: "$outletId",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$outletId"] },
                                            { $eq: ["$isDeleted", false] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "outlet_detail",
                    },
                },
                {
                    $unwind: {
                        path: "$outlet_detail",
                        preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $project: {
                        _id: 1,
                        brandName: "$brand_detail.name",
                        outletName: "$outlet_detail.name",
                        image: 1,
                        createdAt: { $toLong: "$createdAt" },
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $facet: {
                        metadata: [
                            { $count: "total" },
                            { $addFields: { page: Number(page) } },
                            {
                                $addFields: {
                                    totalPages: {
                                        $ceil: { $divide: ["$total", limit] },
                                    },
                                },
                            },
                            {
                                $addFields: {
                                    hasPrevPage: {
                                        $cond: {
                                            if: {
                                                $lt: [{ $subtract: [page, Number(1)] }, Number(0)],
                                            },
                                            then: false,
                                            else: true,
                                        },
                                    },
                                },
                            },
                            {
                                $addFields: {
                                    prevPage: {
                                        $cond: {
                                            if: {
                                                $lt: [{ $subtract: [page, Number(1)] }, Number(0)],
                                            },
                                            then: null,
                                            else: { $subtract: [page, Number(1)] },
                                        },
                                    },
                                },
                            },
                            {
                                $addFields: {
                                    hasNextPage: {
                                        $cond: {
                                            if: {
                                                $gt: [
                                                    {
                                                        $subtract: [
                                                            {
                                                                $ceil: { $divide: ["$total", limit] },
                                                            },
                                                            Number(1),
                                                        ],
                                                    },
                                                    "$page",
                                                ],
                                            },
                                            then: true,
                                            else: false,
                                        },
                                    },
                                },
                            },
                            { $addFields: { nextPage: { $sum: [page, Number(1)] } } },
                        ],
                        data: [{ $skip: skip }, { $limit: limit }],
                    },
                },
            ])
                .then((data: any) => {
                    if (!data) {
                        throw {
                            statusCode: constants.code.dataNotFound,
                            msg: constants.message.dataNotFound,
                        };
                    } else {
                        res.status(constants.code.success).json({
                            status: constants.status.statusTrue,
                            userStatus: req.status,
                            message: message.outletOfferList,
                            metadata: data[0].metadata,
                            data: data[0].data,
                        });
                    }
                })
                .catch((err) => {
                    res.status(err.statusCode).json({
                        status: constants.status.statusFalse,
                        userStatus: req.status,
                        message: err.msg,
                    });
                });
        } else {
            Offer.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        outletId: new mongoose.Types.ObjectId(req.body.outlet_id)
                    },
                },
                {
                    $lookup: {
                        from: "brands",
                        let: {
                            brandId: "$brandId",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$brandId"] },
                                            { $eq: ["$isDeleted", false] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "brand_detail",
                    },
                },
                {
                    $unwind: {
                        path: "$brand_detail",
                        preserveNullAndEmptyArrays: true
                    },
                },

                {
                    $lookup: {
                        from: "outlets",
                        let: {
                            outletId: "$outletId",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$outletId"] },
                                            { $eq: ["$isDeleted", false] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "outlet_detail",
                    },
                },
                {
                    $unwind: {
                        path: "$outlet_detail",
                        preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $project: {
                        _id: 1,
                        brandName: "$brand_detail.name",
                        outletName: "$outlet_detail.name",
                        image: 1,
                        createdAt: { $toLong: "$createdAt" },
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $facet: {
                        metadata: [
                            { $count: "total" },
                            { $addFields: { page: Number(page) } },
                            {
                                $addFields: { totalPages: { $sum: [Number(page), Number(1)] } },
                            },
                            { $addFields: { hasPrevPage: false } },
                            { $addFields: { prevPage: null } },
                            { $addFields: { hasNextPage: false } },
                            { $addFields: { nextPage: null } },
                        ],
                        data: [],
                    },
                },
            ])
                .then((data) => {
                    if (!data) {
                        throw {
                            statusCode: constants.code.dataNotFound,
                            msg: constants.message.dataNotFound,
                        };
                    } else {
                        res.status(constants.code.success).json({
                            status: constants.status.statusTrue,
                            userStatus: req.status,
                            message: message.outletOfferList,
                            metadata: data[0].metadata,
                            data: data[0].data,
                        });
                    }
                })
                .catch((err) => {
                    res.status(err.statusCode).json({
                        status: constants.status.statusFalse,
                        userStatus: req.status,
                        message: err.msg,
                    });
                });
        }
    } catch (err) {
        res.status(constants.code.internalServerError).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: err,
        });
    }
}


export default {
    listoffer,
    listOutletoffer
}