import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import Reward from "../../../models/reward";
import RewardPOint from "../../../models/rewardPoint";
import message from "./rewardConstant";
import mongoose from "mongoose";
import User from "../../../models/user";
import EarnPoint from "../../../models/earnRewardPOint";

const pointValue = async(req:any, res:Response, next:NextFunction) =>{
    try{

        Reward.findOneAndUpdate(
            {
              isDeleted: false,
            },
            {
                point: req.body.point,
                value: req.body.value,
                maximumAmount: req.body.maximumAmount,
                minimumAmount: req.body.minimumAmount,
                maximumPoints: req.body.maximumPoints
            },
            { upsert: true, new:true }
          ).then((data)=>{
            if(!data){
                throw{
                    statusCode: constants.code.dataNotFound,
                    msg: constants.message.dataNotFound
                }
            }
            else{
                res.status(constants.code.success).json({
                    status: constants.status.statusTrue,
                    userStatus: req.status,
                    message: message.pointValue
                })
            }
        }).catch((err)=>{
            res.status(err.statusCode).json({
                status: constants.status.statusFalse,
                userStatus: req.status,
                message: err.msg,
            })
        })

    } catch(err) {
        res.status(constants.code.internalServerError).json({
            status: constants.status.statusFalse,
            userStatus: constants.status.statusFalse,
            message: err
        })
    }
}


const pointValueDeatil = async(req:any, res:Response, next:NextFunction)=>{
    try {
        Reward.find(
          { isDeleted: false },
          { _id: 1, point: 1, value:1,maximumAmount:1, minimumAmount:1, maximumPoints:1}
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
                message: message.pointValueDetail,
                data: data,
              });
            }
          })
          .catch((err: any) => {
            res.status(err.statusCode).json({
              status: constants.status.statusFalse,
              userStatus: constants.status.statusFalse,
              message: err.msg,
            });
          });
      } catch (err) {
        res.status(constants.code.preconditionFailed).json({
          status: constants.status.statusFalse,
          userStatus: constants.status.statusFalse,
          message: err,
        });
      }
}

const distributepoints = async(req:any, res:Response, next:NextFunction) =>{
    try{

        EarnPoint.findOneAndUpdate(
            {
              isDeleted: false,
            },
            {
                maximumAmount: req.body.maximumAmount,
                minimumAmount: req.body.minimumAmount,
                maximumPoints: req.body.maximumPoints
            },
            { upsert: true, new:true }
          ).then((data)=>{
            if(!data){
                throw{
                    statusCode: constants.code.dataNotFound,
                    msg: constants.message.dataNotFound
                }
            }
            else{
                res.status(constants.code.success).json({
                    status: constants.status.statusTrue,
                    userStatus: req.status,
                    message: message.earnPoint
                })
            }
        }).catch((err)=>{
            res.status(err.statusCode).json({
                status: constants.status.statusFalse,
                userStatus: req.status,
                message: err.msg,
            })
        })

    } catch(err) {
        res.status(constants.code.internalServerError).json({
            status: constants.status.statusFalse,
            userStatus: constants.status.statusFalse,
            message: err
        })
    }
}

const distributePointValue = async(req:any, res:Response, next:NextFunction) =>{
    try {
        EarnPoint.find(
          { isDeleted: false },
          { _id: 1, maximumAmount:1, minimumAmount:1, maximumPoints:1}
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
                message: message.earnPOintValue,
                data: data,
              });
            }
          })
          .catch((err: any) => {
            res.status(err.statusCode).json({
              status: constants.status.statusFalse,
              userStatus: constants.status.statusFalse,
              message: err.msg,
            });
          });
      } catch (err) {
        res.status(constants.code.preconditionFailed).json({
          status: constants.status.statusFalse,
          userStatus: constants.status.statusFalse,
          message: err,
        });
      }
}

const listPOintsDetail = async (req: any, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const skip = page * limit;


        if (Number(req.query.limit) !== 0) {
            RewardPOint.aggregate([
                {
                    $match: {
                        isDeleted: false,

                    },
                },

                {
                    $lookup: {
                        from: "users",
                        let: { userId: "$userId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$userId"] },
                                    isDeleted: false,
                                },
                            },
                        ],
                        as: "userDetail",
                    },
                },
                {
                    $unwind: {
                        path: "$userDetail",
                        preserveNullAndEmptyArrays: true,
                    },
                },

                {
                    $project: {
                        _id: 1,
                        points: 1,
                        pointStatus: 1,
                        createdAt: 1,
                        activity: 1,
                        userName: "$userDetail.fullName"
                    },
                },
                {
                    $match: {
                        $or: [
                            {
                                pointStatus: {
                                    $regex: "^" + req.query.filter + ".*",
                                    $options: "i",
                                },
                            },
                        ],
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
                    if (!data[0].data.length) {
                        throw {
                            statusCode: constants.code.dataNotFound,
                            msg: constants.message.dataNotFound,
                        };
                    } else {
                        res.status(constants.code.success).json({
                            status: constants.status.statusTrue,
                            userStatus: req.status,
                            message: message.pointList,
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
            RewardPOint.aggregate([
                {
                    $match: {
                        isDeleted: false,

                    },
                },

                {
                    $lookup: {
                        from: "users",
                        let: { userId: "$userId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$userId"] },
                                    isDeleted: false,
                                },
                            },
                        ],
                        as: "userDetail",
                    },
                },
                {
                    $unwind: {
                        path: "$userDetail",
                        preserveNullAndEmptyArrays: true,
                    },
                },

                {
                    $project: {
                        _id: 1,
                        points: 1,
                        pointStatus: 1,
                        createdAt: 1,
                        activity: 1,
                        userName: "$userDetail.fullName"
                    },
                },
                {
                    $match: {
                        $or: [
                            {
                                pointStatus: {
                                    $regex: "^" + req.query.filter + ".*",
                                    $options: "i",
                                },
                            },
                        ],
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
                    if (!data[0].data.length) {
                        throw {
                            statusCode: constants.code.dataNotFound,
                            msg: constants.message.dataNotFound,
                        };
                    } else {
                        res.status(constants.code.success).json({
                            status: constants.status.statusTrue,
                            userStatus: req.status,
                            message: message.pointList,
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


const PointDetail = async (req: any, res: Response, next: NextFunction) => {
    try {

        RewardPOint.findOne({ _id: new mongoose.Types.ObjectId(req.params.reward_id), isDeleted: false })
            .then((rewardData) => {
                if (!rewardData) {
                    throw {
                        statusCode: constants.code.dataNotFound,
                        message: constants.message.dataNotFound,
                    };
                } else {

                    RewardPOint.aggregate([
                        {
                            $match: {
                                _id: new mongoose.Types.ObjectId(req.params.reward_id),
                                isDeleted: false,
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$userId" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ["$_id", "$$userId"] },
                                            isDeleted: false,
                                        },
                                    },
                                ],
                                as: "userDetail",
                            },
                        },
                        {
                            $unwind: {
                                path: "$userDetail",
                                preserveNullAndEmptyArrays: true,
                            },
                        },

                        {
                            $project: {
                                _id: 1,
                                points: 1,
                                pointStatus: 1,
                                createdAt: 1,
                                activity: 1,
                                userName: "$userDetail.fullName"
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
                                    message: message.pointDetail,
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


export default {
    pointValue,
    listPOintsDetail,
    PointDetail,
    pointValueDeatil,
    distributepoints,
    distributePointValue
}