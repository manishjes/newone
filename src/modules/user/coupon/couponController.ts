import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import mongoose from "mongoose";
import Coupon from "../../../models/coupon";
import User from "../../../models/user";
import MyCoupon from "../../../models/myCoupons";
import RewardPOint from "../../../models/rewardPoint";
import message from './couponConstant'



const couponList = async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;
    const currentDate = new Date();


    let matchStage: any = {};

    if (req.body.brandId) {
      matchStage = {
        $match: {
          $or: [
            {
              "base.brandId": new mongoose.Types.ObjectId(req.body.brandId), isDeleted: false, status: true, startDate: { $lte: currentDate },
              endDate: { $gt: currentDate }, "base.outletId": { $size: 0 }, couponUsed: { $gt: 0 }
            },
            {
              "base.brandId": null, isDeleted: false, status:true, startDate: { $lte: currentDate },
              endDate: { $gt: currentDate }, "base.outletId": { $size: 0 }, couponUsed: { $gt: 0 }
            }
          ]
        }
      };
    } else if (req.body.outletId) {
      matchStage = {
        $match: {
          "base.outletId": {
            $in: [new mongoose.Types.ObjectId(req.body.outletId)],
          },
          isDeleted: false,
          status:true,
          startDate: { $lte: currentDate },
          endDate: { $gt: currentDate },
          couponUsed: { $gt: 0 }
        }
      };
    }



    

    if (Number(req.query.limit) !== 0) {
      Coupon.aggregate([
        matchStage,

        {
          $lookup: {
            from: "users",
            let: { included: "$included" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$included"] },
                  isDeleted: false,
                },
              },
            ],
            as: "includedDetail",
          },
        },
        {
          $lookup: {
            from: "users",
            let: { excluded: "$excluded" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$excluded"] },
                  isDeleted: false,
                },
              },
            ],
            as: "excludedDetail",
          },
        },
        {
          $addFields: {
            isAccessible: {
              $and: [
                {
                  $or: [
                    { $eq: ["$included", []] },
                    { $in: [req.id, "$included"] },
                  ],
                },
                {
                  $not: {
                    $in: [req.id, "$excluded"],
                  },
                },
              ],
            },
          },
        },
        {
          $match: {
            isAccessible: true,
          },
        },

        {
          $lookup: {
            from: "mycoupons",
            let: { couponId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$couponId", "$$couponId"] },
                  userId: new mongoose.Types.ObjectId(req.id),
                  isDeleted: false,
                },
              },
              {
                $count: "usageCount",
              },
            ],
            as: "usage",
          },
        },
        {
          $addFields: {
            usageCount: { $ifNull: [{ $arrayElemAt: ["$usage.usageCount", 0] }, 0] },
          },
        },
        {
          $match: {
            $expr: {
              $or: [
                { $eq: ["$usageCount", 0] },
                { $lt: ["$usageCount", "$usesPerUser"] },
              ],
            },
          },
        },

        
        // {
        //   $lookup: {
        //     from: "mycoupons",
        //     let: { couponId: "$_id" },
        //     pipeline: [
        //       {
        //         $match: {
        //           $expr: { $eq: ["$couponId", "$$couponId"] },
        //           isDeleted: false,
        //         },
        //       },
        //       {
        //         $count: "couponUsage",
        //       },
        //     ],
        //     as: "usageCoupon",
        //   },
        // },
        // {
        //   $addFields: {
        //     usageCouponCount: { $ifNull: [{ $arrayElemAt: ["$usageCoupon.couponUsage", 0] }, 0] },
        //   },
        // },
        // {
        //   $match: {
        //     $expr: {
        //       $or: [
        //         { $eq: ["$usageCouponCount", 0] },
        //         { $lt: ["$usageCouponCount", "$usesPerCoupon"] },
        //       ],
        //     },
        //   },
        // },
      
      
      
      
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            description: { $first: "$description" },
            code: { $first: "$code" },
            minimumAmount: {$first: "$base.minimumAmount"},
            discountType: { $first: "$discountType" },
            unit: { $first: "$unit" },
            value: { $first: "$value" },
            startDate: { $first: "$startDate" },
            endDate: { $first: "$endDate" },
            pointtoredem: { $first: "$pointtoredem" },
            usesPerCoupon: { $first: "$usesPerCoupon" },
            createdAt: { $first: "$createdAt" }
          }
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
              message: message.couponList,
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
      Coupon.aggregate([
        matchStage,
        {
          $lookup: {
            from: "users",
            let: { included: "$included" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$included"] },
                  isDeleted: false,
                },
              },
            ],
            as: "includedDetail",
          },
        },
        {
          $lookup: {
            from: "users",
            let: { excluded: "$excluded" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$excluded"] },
                  isDeleted: false,
                },
              },
            ],
            as: "excludedDetail",
          },
        },
        {
          $addFields: {
            isAccessible: {
              $and: [
                {
                  $or: [
                    { $eq: ["$included", []] },
                    { $in: [req.id, "$included"] },
                  ],
                },
                {
                  $not: {
                    $in: [req.id, "$excluded"],
                  },
                },
              ],
            },
          },
        },
        {
          $match: {
            isAccessible: true,
          },
        },

        {
          $lookup: {
            from: "mycoupons",
            let: { couponId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$couponId", "$$couponId"] },
                  userId: new mongoose.Types.ObjectId(req.id),
                  isDeleted: false,
                },
              },
              {
                $count: "usageCount",
              },
            ],
            as: "usage",
          },
        },
        {
          $addFields: {
            usageCount: { $ifNull: [{ $arrayElemAt: ["$usage.usageCount", 0] }, 0] },
          },
        },
        {
          $match: {
            $expr: {
              $or: [
                { $eq: ["$usageCount", 0] },
                { $lt: ["$usageCount", "$usesPerUser"] },
              ],
            },
          },
        },
      
      


        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            description: { $first: "$description" },
            code: { $first: "$code" },
            minimumAmount: {$first: "$base.minimumAmount"},
            discountType: { $first: "$discountType" },
            unit: { $first: "$unit" },
            value: { $first: "$value" },
            startDate: { $first: "$startDate" },
            endDate: { $first: "$endDate" },
            pointtoredem: { $first: "$pointtoredem" },
            usesPerCoupon: { $first: "$usesPerCoupon" },
            createdAt: { $first: "$createdAt" }
          }
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
              message: message.couponList,
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

const purchaseCoupon = async (req: any, res: Response, next: NextFunction) => {
  try {
    const requiredPoint: any = await Coupon.findOne({
      _id: new mongoose.Types.ObjectId(req.body.coupon_id),
      isDeleted: false
    },
      { pointtoredem: 1 })

    const userPoints: any = await User.findOne({
      _id: new mongoose.Types.ObjectId(req.id)
    }, { points: 1 })

    if (userPoints.points < requiredPoint?.pointtoredem) {
      return res.status(constants.code.preconditionFailed).json({
        status: constants.status.statusFalse,
        userStatus: req.status,
        message: message.requiredPOint,
      });
    }
    else {
      MyCoupon.create({
        userId: new mongoose.Types.ObjectId(req.id),
        couponId: new mongoose.Types.ObjectId(req.body.coupon_id)
      }).then((myCouponData) => {
        if (!myCouponData) {
          throw {
            statusCode: constants.code.dataNotFound,
            message: constants.message.dataNotFound
          }
        }
        else {
          RewardPOint.create({
            userId: new mongoose.Types.ObjectId(
              req.id),
            points: requiredPoint?.pointtoredem,
            activity: "earn coupon",
            pointStatus: "deduction"
          }).then((rewardPointData) => {
            if (!rewardPointData) {
              throw {
                statusCode: constants.code.dataNotFound,
                message: constants.message.dataNotFound
              }
            }
            else {
              User.findOneAndUpdate(
                {
                  _id: new mongoose.Types.ObjectId(req.id),
                  isDeleted: false,
                },
                { $inc: { points: -requiredPoint?.pointtoredem } },
                {
                  upsert: true,
                  new: true
                }
              ).then((userData) => {
                if (!userData) {
                  throw {
                    statusCode: constants.code.dataNotFound,
                    message: constants.message.dataNotFound
                  }
                }
                else {
                  Coupon.findOneAndUpdate({
                    _id: new mongoose.Types.ObjectId(req.body.coupon_id),
                    isDeleted: false
                  },
                    {
                      $inc: { couponUsed: -1 }
                    }, {
                    upsert: true,
                    new: true
                  }
                  ).then((data) => {
                    if (!data) {
                      throw {
                        statusCode: constants.code.dataNotFound,
                        message: constants.message.dataNotFound
                      }
                    }
                    else {
                      res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.couponAdded,
                      });
                    }
                  }).catch((err) => {
                    res.status(err.statusCode).json({
                      status: constants.status.statusFalse,
                      userStatus: req.status,
                      message: err.message,
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
            }
          }).catch((err) => {
            res.status(err.statusCode).json({
              status: constants.status.statusFalse,
              userStatus: req.status,
              message: err.message,
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
    }

  } catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
}



const listPurchaseCoupon = async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;


    if (Number(req.query.limit) !== 0) {
      MyCoupon.aggregate([
        {
          $match: {
            isDeleted: false,
            userId: new mongoose.Types.ObjectId(req.id)
          },
        },

        {
          $lookup: {
            from: "coupons",
            let: { couponId: "$couponId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$couponId"] },
                  isDeleted: false,
                },
              },
            ],
            as: "couponDetail",
          },
        },
        {
          $unwind: {
            path: "$couponDetail",
            preserveNullAndEmptyArrays: true,
          },
        },

        // {
        //   $match: {
        //     $or: [
        //       { "couponDetail.endDate": { $gt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } },
        //       { "couponDetail.endDate": null }
        //     ]
        //   },
        // },

        // {
        //   $match: {
        //     "couponDetail.endDate": { $gt: new Date() } 
        //   },
        // },


        {
          $project: {
            _id: 1,
            name: "$couponDetail.name",
            description: "$couponDetail.description",
            code: "$couponDetail.code",
            isUsed: 1,
            discountType: "$couponDetail.discountType",
            startDate: "$couponDetail.startDate",
            endDate: "$couponDetail.endDate",
            termsCondition: "$couponDetail.termsCondition",
            createdAt: 1
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
              message: message.myCouponListed,
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
      MyCoupon.aggregate([
        {
          $match: {
            isDeleted: false,
            userId: new mongoose.Types.ObjectId(req.id)
          },
        },

        {
          $lookup: {
            from: "coupons",
            let: { couponId: "$couponId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$couponId"] },
                  isDeleted: false,
                },
              },
            ],
            as: "couponDetail",
          },
        },
        {
          $unwind: {
            path: "$couponDetail",
            preserveNullAndEmptyArrays: true,
          },
        },



        {
          $project: {
            _id: 1,
            name: "$couponDetail.name",
            description: "$couponDetail.description",
            code: "$couponDetail.code",
            isUsed: 1,
            discountType: "$couponDetail.discountType",
            startDate: "$couponDetail.startDate",
            endDate: "$couponDetail.endDate",
            termsCondition: "$couponDetail.termsCondition",
            createdAt: 1
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
              message: message.myCouponListed,
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


const listavailableCoupon = async(req:any, res:Response, next:NextFunction)=>{
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;


    if (Number(req.query.limit) !== 0) {
      MyCoupon.aggregate([
        {
          $match: {
            isDeleted: false,
            isUsed: false,
            userId: new mongoose.Types.ObjectId(req.id)
          },
        },

        {
          $lookup: {
            from: "coupons",
            let: { couponId: "$couponId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$couponId"] },
                  isDeleted: false,
                },
              },
            ],
            as: "couponDetail",
          },
        },
        {
          $unwind: {
            path: "$couponDetail",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $match: {
            $or: [
              {
                "couponDetail.base.brandId": null
              },
              {
                "couponDetail.base.brandId": new mongoose.Types.ObjectId(req.body.brandId),"couponDetail.base.outletId": { $size: 0 }
              },
             
             
              {
                "couponDetail.base.outletId": new mongoose.Types.ObjectId(req.body.outletId)
              }
            ]
          }
        },
        {
          $match: {
            "couponDetail.endDate": { $gt: new Date() }
          }
        },

        

       

        
        {
          $project: {
            _id: 1,
            couponId: "$couponDetail._id",
            name: "$couponDetail.name",
            description: "$couponDetail.description",
            code: "$couponDetail.code",
            isUsed: 1,
            discountType: "$couponDetail.discountType",
            minimumAmount: "$couponDetail.base.minimumAmount",
            unitType: "$couponDetail.unit",
            value: "$couponDetail.value",
            startDate: "$couponDetail.startDate",
            endDate: "$couponDetail.endDate",
            termsCondition: "$couponDetail.termsCondition",
            createdAt: 1
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
              message: message.myCouponListed,
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
      MyCoupon.aggregate([
        {
          $match: {
            isDeleted: false,
            isUsed: false,
            userId: new mongoose.Types.ObjectId(req.id)
          },
        },

        {
          $lookup: {
            from: "coupons",
            let: { couponId: "$couponId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$couponId"] },
                  isDeleted: false,
                },
              },
            ],
            as: "couponDetail",
          },
        },
        {
          $unwind: {
            path: "$couponDetail",
            preserveNullAndEmptyArrays: true,
          },
        },



        {
          $match: {
            $or: [
              {
                "couponDetail.base.brandId": null
              },
              {
                "couponDetail.base.brandId": new mongoose.Types.ObjectId(req.body.brandId),"couponDetail.base.outletId": { $size: 0 }
              },
             
             
              {
                "couponDetail.base.outletId": new mongoose.Types.ObjectId(req.body.outletId)
              }
            ]
          }
        },
        {
          $match: {
            "couponDetail.endDate": { $gt: new Date() }
          }
        },



        {
          $project: {
            _id: 1,
            couponId: "$couponDetail._id",
            name: "$couponDetail.name",
            description: "$couponDetail.description",
            code: "$couponDetail.code",
            isUsed: 1,
            discountType: "$couponDetail.discountType",
            minimumAmount: "$couponDetail.base.minimumAmount",
            unitType: "$couponDetail.unit",
            value: "$couponDetail.value",
            startDate: "$couponDetail.startDate",
            endDate: "$couponDetail.endDate",
            termsCondition: "$couponDetail.termsCondition",
            createdAt: 1
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
              message: message.myCouponListed,
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

const couponDiscount = async(req:any, res:Response, next:NextFunction)=>{
  try{
    const couponData:any = await Coupon.findOne(
      {_id: new mongoose.Types.ObjectId(req.body.coupon_id), isDeleted:false},
    { discountType:1, unit:1, base:1, value:1, code:1 }
    )

    let discountAmount:any = 0

    if(req.body.amount<couponData.base.minimumAmount){
      discountAmount =0
    }

    else{

    if(couponData?.discountType=='upto'){
      discountAmount = couponData.value
    }
    else if(couponData?.discountType=='flat'){
      if(couponData?.unit=='value'){
        discountAmount = couponData.value
      }
      else if(couponData?.unit=='percentage'){
        discountAmount = (req.body.amount*couponData.value)/100
      }
    }
  }

    let payAmount = req.body.amount-discountAmount

    res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      userStatus: req.status,
      message: constants.message.success,
      data: {
        totalBill: req.body.amount,
        discountAmount: discountAmount,
        payAmount: payAmount,
        couponCode: couponData.code
      }
    });

  } catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
}

const listCouponForPurchase = async(req:any, res:Response, next:NextFunction)=>{
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;
    const currentDate = new Date();



    if (Number(req.query.limit) !== 0) {
      Coupon.aggregate([
        {
        $match: {
          $or: [
            {
              "base.brandId": new mongoose.Types.ObjectId(req.body.brandId), isDeleted: false, status:true, startDate: { $lte: currentDate },
              endDate: { $gt: currentDate }, "base.outletId": { $size: 0 }, couponUsed: { $gt: 0 }
            },
            {
              "base.brandId": null, isDeleted: false, status:true, startDate: { $lte: currentDate },
              endDate: { $gt: currentDate }, "base.outletId": { $size: 0 }, couponUsed: { $gt: 0 }
            },
            {
              "base.outletId": {
                $in: [new mongoose.Types.ObjectId(req.body.outletId)],
              },
              isDeleted: false,
              status:true,
              startDate: { $lte: currentDate },
              endDate: { $gt: currentDate },
              couponUsed: { $gt: 0 }
            }
          ]
        }
      },
        {
          $lookup: {
            from: "users",
            let: { included: "$included" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$included"] },
                  isDeleted: false,
                },
              },
            ],
            as: "includedDetail",
          },
        },
        {
          $lookup: {
            from: "users",
            let: { excluded: "$excluded" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$excluded"] },
                  isDeleted: false,
                },
              },
            ],
            as: "excludedDetail",
          },
        },
        {
          $addFields: {
            isAccessible: {
              $and: [
                {
                  $or: [
                    { $eq: ["$included", []] },
                    { $in: [req.id, "$included"] },
                  ],
                },
                {
                  $not: {
                    $in: [req.id, "$excluded"],
                  },
                },
              ],
            },
          },
        },
        {
          $match: {
            isAccessible: true,
          },
        },

        {
          $lookup: {
            from: "mycoupons",
            let: { couponId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$couponId", "$$couponId"] },
                  userId: new mongoose.Types.ObjectId(req.id),
                  isDeleted: false,
                },
              },
              {
                $count: "usageCount",
              },
            ],
            as: "usage",
          },
        },
        {
          $addFields: {
            usageCount: { $ifNull: [{ $arrayElemAt: ["$usage.usageCount", 0] }, 0] },
          },
        },
        {
          $match: {
            $expr: {
              $or: [
                { $eq: ["$usageCount", 0] },
                { $lt: ["$usageCount", "$usesPerUser"] },
              ],
            },
          },
        },


        {
          $addFields: {
            isOutletSpecific: {
              $cond: {
                if: { $in: [new mongoose.Types.ObjectId(req.body.outletId), "$base.outletId"] },
                then: 1,
                else: 0
              }
            }
          }
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            description: { $first: "$description" },
            code: { $first: "$code" },
            minimumAmount: {$first: "$base.minimumAmount"},
            discountType: { $first: "$discountType" },
            unit: { $first: "$unit" },
            value: { $first: "$value" },
            startDate: { $first: "$startDate" },
            endDate: { $first: "$endDate" },
            pointtoredem: { $first: "$pointtoredem" },
            usesPerCoupon: { $first: "$usesPerCoupon" },
            createdAt: { $first: "$createdAt" },
            isOutletSpecific: {$first: "$isOutletSpecific"}
          }
        },
        {
          $sort: {
            isOutletSpecific: -1,
            createdAt: -1
          }
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
              message: message.couponList,
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
      Coupon.aggregate([
        {
        $match: {
          $or: [
            {
              "base.brandId": new mongoose.Types.ObjectId(req.body.brandId), isDeleted: false, status:true, startDate: { $lte: currentDate },
              endDate: { $gt: currentDate }, "base.outletId": { $size: 0 }, couponUsed: { $gt: 0 }
            },
            {
              "base.brandId": null, isDeleted: false, status:true, startDate: { $lte: currentDate },
              endDate: { $gt: currentDate }, "base.outletId": { $size: 0 }, couponUsed: { $gt: 0 }
            },
            {
              "base.outletId": {
                $in: [new mongoose.Types.ObjectId(req.body.outletId)],
              },
              isDeleted: false,
              status:true,
              startDate: { $lte: currentDate },
              endDate: { $gt: currentDate },
              couponUsed: { $gt: 0 }
            }
          ]
        }
      },
        {
          $lookup: {
            from: "users",
            let: { included: "$included" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$included"] },
                  isDeleted: false,
                },
              },
            ],
            as: "includedDetail",
          },
        },
        {
          $lookup: {
            from: "users",
            let: { excluded: "$excluded" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$excluded"] },
                  isDeleted: false,
                },
              },
            ],
            as: "excludedDetail",
          },
        },
        {
          $addFields: {
            isAccessible: {
              $and: [
                {
                  $or: [
                    { $eq: ["$included", []] },
                    { $in: [req.id, "$included"] },
                  ],
                },
                {
                  $not: {
                    $in: [req.id, "$excluded"],
                  },
                },
              ],
            },
          },
        },
        {
          $match: {
            isAccessible: true,
          },
        },

        {
          $lookup: {
            from: "mycoupons",
            let: { couponId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$couponId", "$$couponId"] },
                  userId: new mongoose.Types.ObjectId(req.id),
                  isDeleted: false,
                },
              },
              {
                $count: "usageCount",
              },
            ],
            as: "usage",
          },
        },
        {
          $addFields: {
            usageCount: { $ifNull: [{ $arrayElemAt: ["$usage.usageCount", 0] }, 0] },
          },
        },
        {
          $match: {
            $expr: {
              $or: [
                { $eq: ["$usageCount", 0] },
                { $lt: ["$usageCount", "$usesPerUser"] },
              ],
            },
          },
        },

        
        {
          $addFields: {
            isOutletSpecific: {
              $cond: {
                if: { $in: [new mongoose.Types.ObjectId(req.body.outletId), "$base.outletId"] },
                then: 1,
                else: 0
              }
            }
          }
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            description: { $first: "$description" },
            code: { $first: "$code" },
            minimumAmount: {$first: "$base.minimumAmount"},
            discountType: { $first: "$discountType" },
            unit: { $first: "$unit" },
            value: { $first: "$value" },
            startDate: { $first: "$startDate" },
            endDate: { $first: "$endDate" },
            pointtoredem: { $first: "$pointtoredem" },
            usesPerCoupon: { $first: "$usesPerCoupon" },
            createdAt: { $first: "$createdAt" },
            isOutletSpecific: {$first: "$isOutletSpecific"}
          }
        },
        {
          $sort: {
            isOutletSpecific: -1,
            createdAt: -1
          }
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
              message: message.couponList,
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


// const outletCouponList = async(req:any, res:Response, next:NextFunction) =>{
//   try{
//     const page = Number(req.query.page);
//     const limit = Number(req.query.limit);
//     const skip = page * limit;



//     if (Number(req.query.limit) !== 0) {
//       Coupon.aggregate([
//         {
//           $match: {
//             "base.outletId": {
//               $in: [new mongoose.Types.ObjectId(req.body.outletId)],
//             },
//           }
//         },

//         {
//           $lookup: {
//             from: "users",
//             let: { included: "$included" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $in: ["$_id", "$$included"] },
//                   isDeleted: false,
//                 },
//               },
//             ],
//             as: "includedDetail",
//           },
//         },
//         {
//           $lookup: {
//             from: "users",
//             let: { excluded: "$excluded" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $in: ["$_id", "$$excluded"] },
//                   isDeleted: false,
//                 },
//               },
//             ],
//             as: "excludedDetail",
//           },
//         },
//         {
//           $addFields: {
//             isAccessible: {
//               $and: [
//                 {
//                   $or: [
//                     { $eq: ["$included", []] },
//                     { $in: [req.id, "$included"] },
//                   ],
//                 },
//                 {
//                   $not: {
//                     $in: [req.id, "$excluded"],
//                   },
//                 },
//               ],
//             },
//           },
//         },
//         {
//           $match: {
//             isAccessible: true,
//           },
//         },


//         {
//             $group: {
//                 _id: "$_id",
//                 name: { $first: "$name" },
//                 description: { $first: "$description" },
//                 code: { $first: "$code" },
//                 discountType: { $first: "$discountType" },
//                 unit: { $first: "$unit" },
//                 value: { $first: "$value" },
//                 startDate: { $first: "$startDate" },
//                 endDate: { $first: "$endDate" },
//                 pointtoredem: { $first: "$pointtoredem" },
//                 usesPerCoupon: { $first: "$usesPerCoupon" },
//                 createdAt: {$first: "$createdAt"}
//             }
//         },

//         {
//           $sort: { createdAt: -1 },
//         },
//         {
//           $facet: {
//             metadata: [
//               { $count: "total" },
//               { $addFields: { page: Number(page) } },
//               {
//                 $addFields: {
//                   totalPages: {
//                     $ceil: { $divide: ["$total", limit] },
//                   },
//                 },
//               },
//               {
//                 $addFields: {
//                   hasPrevPage: {
//                     $cond: {
//                       if: {
//                         $lt: [{ $subtract: [page, Number(1)] }, Number(0)],
//                       },
//                       then: false,
//                       else: true,
//                     },
//                   },
//                 },
//               },
//               {
//                 $addFields: {
//                   prevPage: {
//                     $cond: {
//                       if: {
//                         $lt: [{ $subtract: [page, Number(1)] }, Number(0)],
//                       },
//                       then: null,
//                       else: { $subtract: [page, Number(1)] },
//                     },
//                   },
//                 },
//               },
//               {
//                 $addFields: {
//                   hasNextPage: {
//                     $cond: {
//                       if: {
//                         $gt: [
//                           {
//                             $subtract: [
//                               {
//                                 $ceil: { $divide: ["$total", limit] },
//                               },
//                               Number(1),
//                             ],
//                           },
//                           "$page",
//                         ],
//                       },
//                       then: true,
//                       else: false,
//                     },
//                   },
//                 },
//               },
//               { $addFields: { nextPage: { $sum: [page, Number(1)] } } },
//             ],
//             data: [{ $skip: skip }, { $limit: limit }],
//           },
//         },
//       ])
//         .then((data: any) => {
//           if (!data[0].data.length) {
//             throw {
//               statusCode: constants.code.dataNotFound,
//               msg: constants.message.dataNotFound,
//             };
//           } else {
//             res.status(constants.code.success).json({
//               status: constants.status.statusTrue,
//               userStatus: req.status,
//               message: message.outletCoupon,
//               metadata: data[0].metadata,
//               data: data[0].data,
//             });
//           }
//         })
//         .catch((err) => {
//           res.status(err.statusCode).json({
//             status: constants.status.statusFalse,
//             userStatus: req.status,
//             message: err.msg,
//           });
//         });
//     } else {
//       Coupon.aggregate([
//         {
//           $match: {
//             "base.outletId": {
//               $in: [new mongoose.Types.ObjectId(req.body.OutletId)],
//             },
//           }
//         },
//         {
//             $lookup:{
//                 from: "brands",
//                 let: {brandId: "$base.brandId"},
//                 pipeline:[
//                     {
//                         $match:{
//                             $expr:{$eq:["$_id", "$$brandId"]},
//                             isDeleted: false
//                         }
//                     }
//                 ],
//                 as: "brandDetail"
//             }
//         },
//         {
//             $unwind:{
//                 path: "$brandDetail",
//                 preserveNullAndEmptyArrays:true
//             },
//         },
//         {
//           $lookup: {
//             from: "users",
//             let: { included: "$included" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $in: ["$_id", "$$included"] },
//                   isDeleted: false,
//                 },
//               },
//             ],
//             as: "includedDetail",
//           },
//         },
//         {
//           $lookup: {
//             from: "users",
//             let: { excluded: "$excluded" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $in: ["$_id", "$$excluded"] },
//                   isDeleted: false,
//                 },
//               },
//             ],
//             as: "excludedDetail",
//           },
//         },
//         {
//           $addFields: {
//             isAccessible: {
//               $and: [
//                 {
//                   $or: [
//                     { $eq: ["$included", []] },
//                     { $in: [req.id, "$included"] },
//                   ],
//                 },
//                 {
//                   $not: {
//                     $in: [req.id, "$excluded"],
//                   },
//                 },
//               ],
//             },
//           },
//         },
//         {
//           $match: {
//             isAccessible: true,
//           },
//         },


//         {
//             $group: {
//                 _id: "$_id",
//                 name: { $first: "$name" },
//                 description: { $first: "$description" },
//                 code: { $first: "$code" },
//                 discountType: { $first: "$discountType" },
//                 unit: { $first: "$unit" },
//                 value: { $first: "$value" },
//                 startDate: { $first: "$startDate" },
//                 endDate: { $first: "$endDate" },
//                 pointtoredem: { $first: "$pointtoredem" },
//                 usesPerCoupon: { $first: "$usesPerCoupon" },
//                 createdAt: {$first: "$createdAt"}
//             }
//         },

//         {
//           $sort: { createdAt: -1 },
//         },
//         {
//           $facet: {
//             metadata: [
//               { $count: "total" },
//               { $addFields: { page: Number(page) } },
//               {
//                 $addFields: { totalPages: { $sum: [Number(page), Number(1)] } },
//               },
//               { $addFields: { hasPrevPage: false } },
//               { $addFields: { prevPage: null } },
//               { $addFields: { hasNextPage: false } },
//               { $addFields: { nextPage: null } },
//             ],
//             data: [],
//           },
//         },
//       ])
//         .then((data) => {
//           if (!data[0].data.length) {
//             throw {
//               statusCode: constants.code.dataNotFound,
//               msg: constants.message.dataNotFound,
//             };
//           } else {
//             res.status(constants.code.success).json({
//               status: constants.status.statusTrue,
//               userStatus: req.status,
//               message: message.outletCoupon,
//               metadata: data[0].metadata,
//               data: data[0].data,
//             });
//           }
//         })
//         .catch((err) => {
//           res.status(err.statusCode).json({
//             status: constants.status.statusFalse,
//             userStatus: req.status,
//             message: err.msg,
//           });
//         });
//     }
//   } catch (err) {
//     res.status(constants.code.internalServerError).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: err,
//     });
//   }
// }

export default {
  couponList,
  //outletCouponList
  purchaseCoupon,
  listPurchaseCoupon,
  listavailableCoupon,
  couponDiscount,
  listCouponForPurchase
}