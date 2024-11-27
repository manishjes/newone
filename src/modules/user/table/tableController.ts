import {  Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import mongoose from "mongoose";
import Table from "../../../models/table";
import User from "../../../models/user";
import { createRequest, generateTableBookingNumber } from "../../../helpers/helper"
import message from "./tableConstant";
import Request from "../../../models/request";



const bookTable = async (req: any, res: Response, next: NextFunction) => {
    try {

        User.exists({
            _id: new mongoose.Types.ObjectId(req.id),
            role: constants.accountLevel.user,
            status: true,
            isDeleted: false,
        })
            .then(async(user_detail: any) => {
                if (!user_detail) {
                    throw {
                        statusCode: constants.code.unAuthorized,
                        msg: constants.message.unAuthAccess,
                    };
                } else {
                    Table.create({
                        userId: new mongoose.Types.ObjectId(user_detail._id),
                        outletId: new mongoose.Types.ObjectId(req.body.outlet_id),
                        bookingTime: req.body.bookingTime,
                        guestNum: req.body.guestNum,
                        tableBookingNum: await generateTableBookingNumber()
                    }).then(async (data) => {
                        if (!data) {
                            throw {
                                statusCode: constants.code.dataNotFound,
                                msg: constants.message.dataNotFound,
                            }
                        }
                        else{
                            await createRequest(data)
                            res.status(constants.code.success).json({
                                status: constants.status.statusTrue,
                                userStatus: req.status,
                                message: message.tableBooking
                            })
                        }

                    }).catch((err) => {
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
                    message: err.msg,
                });
            });

    }
    catch (err) {
        res.status(constants.code.internalServerError).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: err,
        });
    }
}

const bookingListStatus = async (req: any, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const skip = page * limit;

    
        if (Number(req.query.limit) !== 0) {
          Table.aggregate([
            {
              $match: {
                userId: new mongoose.Types.ObjectId(req.id),
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
              $lookup: {
                from: "outlets",
                let: { outletId: "$outletId" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$outletId"] },
                      isDeleted: false,
                    },
                  },
                ],
                as: "outletDetail",
              },
            },
            {
              $unwind: {
                path: "$outletDetail",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
                $lookup: {
                  from: "addresses",
                  let: { outletId: "$outletDetail._id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$OutletId", "$$outletId"] },
                        isDeleted: false,
                      },
                    },
                  ],
                  as: "addressDetail",
                },
              },
              {
                $unwind: {
                  path: "$addressDetail",
                  preserveNullAndEmptyArrays: true,
                },
              },

              {
                $lookup: {
                  from: "cities",
                  let: { cityId: "$addressDetail.address.city" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$cityId"] },
                        isDeleted: false
                      },
                    },
                  ],
                  as: "cityDetail",
                },
              },
              {
                $unwind: {
                  path: "$cityDetail",
                  preserveNullAndEmptyArrays: true
                },
              },


    
            {
              $lookup: {
                from: "requests",
                let: { tableId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$tableId", "$$tableId"] },
                      isDeleted: false,
                    },
                  },
                ],
                as: "requestDetail",
              },
            },
            {
              $unwind: {
                path: "$requestDetail",
                preserveNullAndEmptyArrays: true,
              },
            },
    
          {
            $project:{
                userName: "$userDetail.fullName",
                outletName: "$outletDetail.name",
                outletDescription: "$outletDetail.description",
                outletAddress: "$addressDetail.address.line_one",
                city: "$cityDetail.name",
                outletImages: "$outletDetail.images",
                outletTiming: "$outletDetail.timings",
                guestNum: 1,
                bookingTime: 1,
                rejectedReason: "$requestDetail.reason",
                bookingStatus: "$requestDetail.status",
                createdAt: 1
            }
          },
          {
            $sort:{createdAt: -1}
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
                  message: message.bookingList,
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
            Table.aggregate([
                {
                  $match: {
                    userId: new mongoose.Types.ObjectId(req.id),
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
                  $lookup: {
                    from: "outlets",
                    let: { outletId: "$outletId" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$_id", "$$outletId"] },
                          isDeleted: false,
                        },
                      },
                    ],
                    as: "outletDetail",
                  },
                },
                {
                  $unwind: {
                    path: "$outletDetail",
                    preserveNullAndEmptyArrays: true,
                  },
                },

                {
                    $lookup: {
                      from: "addresses",
                      let: { outletId: "$outletDetail._id" },
                      pipeline: [
                        {
                          $match: {
                            $expr: { $eq: ["$OutletId", "$$outletId"] },
                            isDeleted: false,
                          },
                        },
                      ],
                      as: "addressDetail",
                    },
                  },
                  {
                    $unwind: {
                      path: "$addressDetail",
                      preserveNullAndEmptyArrays: true,
                    },
                  },

                  {
                    $lookup: {
                      from: "cities",
                      let: { cityId: "$addressDetail.address.city" },
                      pipeline: [
                        {
                          $match: {
                            $expr: { $eq: ["$_id", "$$cityId"] },
                            isDeleted: false
                          },
                        },
                      ],
                      as: "cityDetail",
                    },
                  },
                  {
                    $unwind: {
                      path: "$cityDetail",
                      preserveNullAndEmptyArrays: true
                    },
                  },
        
                {
                  $lookup: {
                    from: "requests",
                    let: { tableId: "$_id" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$tableId", "$$tableId"] },
                          isDeleted: false,
                        },
                      },
                    ],
                    as: "requestDetail",
                  },
                },
                {
                  $unwind: {
                    path: "$requestDetail",
                    preserveNullAndEmptyArrays: true,
                  },
                },
        
                {
                    $project:{
                        userName: "$userDetail.fullName",
                        outletName: "$outletDetail.name",
                        outletDescription: "$outletDetail.description",
                        outletAddress: "$addressDetail.address.line_one",
                        city: "$cityDetail.name",
                        outletTiming: "$outletDetail.timings",
                        outletImages: "$outletDetail.images",
                        guestNum: 1,
                        bookingTime: 1,
                        rejectedReason: "$requestDetail.reason",
                        bookingStatus: "$requestDetail.status",
                        createdAt: 1
                    }
                  },
              {
                $sort:{createdAt: -1}
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
                  message: message.bookingList,
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

const modifyBooking = async (req:any, res:Response, next:NextFunction)=>{

  try{
    Table.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.params.table_id),
        isDeleted: false
    },
    {
      is_approved: false,
      bookingTime: req.body.bookingTime,
      guestNum: req.body.guestNum,
    },
    {
      new:true
    }
  ).then(async(tableData)=>{
    if(!tableData){
      throw{
        statusCode: constants.code.dataNotFound,
        msg: constants.message.dataNotFound
      }
    } else{
      Request.findOneAndUpdate(
        {
          tableId: new mongoose.Types.ObjectId(req.params.table_id),
          isDeleted: false
        },
        {
        status: constants.requestStatus.pending
        },
        {
          new:true
        }
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
            message: message.bookingModify,
          });
        }

      }).catch((err) => {
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

const cancelBooking = async (req:any, res:Response, next:NextFunction)=>{
  try{
    Request.findOneAndUpdate(
      {
        tableId: new mongoose.Types.ObjectId(req.params.table_id),
        isDeleted: false
      },
      {
        userReason: req.body.userReason,
        status: constants.requestStatus.cancelled
      },
      {
        new:true
      }
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
          message: message.bookingCancelled,
        });
      }

    }).catch((err) => {
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


export default {
    bookTable,
    bookingListStatus,
    modifyBooking,
    cancelBooking
}