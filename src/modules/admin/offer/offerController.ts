import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import Offer from "../../../models/offer";
import User from "../../../models/user";
import {
    createSlug,
    imageUrl,
    removeImage,
    getFileName,
} from "../../../helpers/helper";
import message from "./offerConstant";
import mongoose from "mongoose";



const addOffer = async (req: any, res: Response, next: NextFunction) => {
    try {
        Offer.create({
            image: !req.file
                ? null
                : await imageUrl(req.headers.host, req.file.filename),
            brandId: new mongoose.Types.ObjectId(req.body.brand_id),
            outletId: !req.body.outlet_id ? null : new mongoose.Types.ObjectId(req.body.outlet_id),
            createdBy: req.id,

        })
            .then((data) => {
                if (!data) {
                    throw {
                        statusCode: constants.code.internalServerError,
                        msg: constants.message.internalServerError,
                    };
                } else {
                    res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.offerSuccess,
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
    } catch (err) {
        res.status(constants.code.internalServerError).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: err,
        });
    }
}


const updateOffer = async (req: any, res: Response, next: NextFunction) => {
    try {
        Offer.findOne({
            _id: new mongoose.Types.ObjectId(req.params.offer_id),
            isDeleted: false,
        })
            .then(async (data) => {
                if (!data) {
                    throw {
                        statusCode: constants.code.dataNotFound,
                        msg: constants.message.dataNotFound,
                    };
                } else {
                    if (!req.file) {
                        Offer.findOneAndUpdate(
                            {
                                _id: new mongoose.Types.ObjectId(req.params.offer_id),
                                isDeleted: false,
                            },
                            {
                                brandId: new mongoose.Types.ObjectId(req.body.brand_id),
                                outletId: !req.body.outlet_id ? null : new mongoose.Types.ObjectId(req.body.outlet_id),
                                updatedBy: req.id,
                            },
                            { new: true }
                        )
                            .then((data) => {
                                if (!data) {
                                    throw {
                                        statusCode: constants.code.internalServerError,
                                        msg: constants.message.internalServerError,
                                    };
                                } else {
                                    res.status(constants.code.success).json({
                                        status: constants.status.statusTrue,
                                        userStatus: req.status,
                                        message: message.offerUpdated,
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
                    } else if (!data.image) {
                        Offer.findOneAndUpdate(
                            {
                                _id: new mongoose.Types.ObjectId(req.params.offer_id),
                                isDeleted: false,
                            },
                            {
                                image: await imageUrl(req.headers.host, req.file.filename),
                                brandId: new mongoose.Types.ObjectId(req.body.brand_id),
                                outletId: !req.body.outlet_id ? null : new mongoose.Types.ObjectId(req.body.outlet_id),
                                updatedBy: req.id,
                            },
                            { new: true }
                        )
                            .then((data) => {
                                if (!data) {
                                    throw {
                                        statusCode: constants.code.internalServerError,
                                        msg: constants.message.internalServerError,
                                    };
                                } else {
                                    res.status(constants.code.success).json({
                                        status: constants.status.statusTrue,
                                        userStatus: req.status,
                                        message: message.offerUpdated,
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
                        await removeImage(await getFileName(data.image));
                        Offer.findOneAndUpdate(
                            {
                                _id: new mongoose.Types.ObjectId(req.params.offer_id),
                                isDeleted: false,
                            },
                            {
                                image: await imageUrl(req.headers.host, req.file.filename),
                                brandId: new mongoose.Types.ObjectId(req.body.brand_id),
                                outletId: !req.body.outlet_id ? null : new mongoose.Types.ObjectId(req.body.outlet_id),
                                updatedBy: req.id,
                            },
                            { new: true }
                        )
                            .then((data) => {
                                if (!data) {
                                    throw {
                                        statusCode: constants.code.internalServerError,
                                        msg: constants.message.internalServerError,
                                    };
                                } else {
                                    res.status(constants.code.success).json({
                                        status: constants.status.statusTrue,
                                        userStatus: req.status,
                                        message: message.offerUpdated,
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

                }
            })
            .catch((err) => {
                res.status(err.statusCode).json({
                    status: constants.status.statusFalse,
                    userStatus: req.status,
                    message: err.msg,
                });
            });
    } catch (err) {
        res.status(constants.code.internalServerError).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: err,
        });
    }
}

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


const offerDetail = async (req: any, res: Response, next: NextFunction) => {
    try {

        Offer.findOne({ _id: new mongoose.Types.ObjectId(req.params.offer_id), isDeleted: false })
            .then((offerData) => {
                if (!offerData) {
                    throw {
                        statusCode: constants.code.dataNotFound,
                        message: constants.message.dataNotFound,
                    };
                } else {

                    Offer.aggregate([
                        {
                            $match: {
                                _id: new mongoose.Types.ObjectId(req.params.offer_id),
                                isDeleted: false,
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
                                    message: message.offerDetail,
                                    data: data

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
            }).catch((err) => {
                res.status(err.statusCode).json({
                    status: constants.status.statusFalse,
                    userStatus: req.status,
                    message: err.message,
                });
            });

    } catch (err) {
        res.status(constants.code.internalServerError).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: err,
        });
    }
}


const deleteOffer = async (req: any, res: Response, next: NextFunction) => {
    try {
        if (!req.body.is_delete) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.invalidType,
          };
        } else {
          Offer.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(req.params.offer_id),
              isDeleted: false,
            },
            {
              isDeleted: req.body.is_delete,
            }
          )
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
                  message: message.offerDeleted,
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
      } catch (err: any) {
        res.status(err.statusCode).json({
          status: constants.status.statusFalse,
          userStatus: req.status,
          message: err.msg,
        });
      }
}


export default {
    addOffer,
    updateOffer,
    listoffer,
    offerDetail,
    deleteOffer
}