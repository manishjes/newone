import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import Coupon from "../../../models/coupon";
import mongoose from "mongoose";
import message from "./couponConstant";
import {createSlug} from "../../../helpers/helper"
import Quiz from "../../../models/quiz";
import Outlet from "../../../models/outlet";


const addCoupon = async(req:any, res:Response, next:NextFunction)=>{
    try{

        let inclueds = [];
        for (let i = 0; i < req.body.included.length; i++) {
            inclueds.push(new mongoose.Types.ObjectId(req.body?.included[i]));
        }

        let excluded:any = [];
        for (let i = 0; i < req.body.excludeds.length; i++) {
          excluded.push(new mongoose.Types.ObjectId(req.body?.excludeds[i]));
        }
        let outlets:any = [];
        for (let i = 0; i < req.body.outlet.length; i++) {
          outlets.push(new mongoose.Types.ObjectId(req.body?.outlet[i]));
        }
        Coupon.create({
            name: req.body.name,
            slug: await createSlug(req.body.name),
            description: req.body.description,
            code: req.body.code,
            discountType: req.body.discountType,
            unit: req.body.unit,
            value: req.body.value,                              
            base:{
                brandId:  !req.body.brandId ? null : new mongoose.Types.ObjectId(req.body.brandId),
                outletId:  !req.body.outlet ? null : outlets,
                minimumAmount: req.body.minimumAmount
            },
            included: inclueds,
            excluded: excluded,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            pointtoredem: req.body.pointtoredem,
            usesPerCoupon: req.body.usesPerCoupon,
            couponUsed: req.body.usesPerCoupon,
            usesPerUser:req.body.usesPerUser,
            termsCondition: req.body.termsCondition,
            status: req.body.status
        }).then((data)=>{
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
                    message: message.addCoupon
                })
            }
        }).catch((err)=>{
            res.status(constants.code.preconditionFailed).json({
                status: constants.status.statusFalse,
                userStatus: req.status,
                message: err.message
            })
        })

    } catch(err){
        res.status(constants.code.internalServerError).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message:err
        })
    }
}


// const couponDetail = async(req:any, res:Response, next:NextFunction)=>{
//    try{
//     Coupon.findOne({
//         _id: new mongoose.Types.ObjectId(req.params.coupon_id),
//         isDeleted:false
//     }) .then((data) => {
//         if (!data) {
//           throw {
//             statusCode: constants.code.dataNotFound,
//             msg: constants.message.dataNotFound,
//           };
//         } else {
//             Coupon.aggregate([
//                 {
//                     $match:{
//                         _id: new mongoose.Types.ObjectId(req.params.coupon_id),
//                         isDeleted: false
//                     }
//                 },
//                 {
//                     $lookup:{
//                         from: "brands",
//                         let: {brandId: "$base.brandId"},
//                         pipeline:[
//                             {
//                                 $match:{
//                                     $expr:{$eq:["$_id", "$$brandId"]},
//                                     isDeleted: false
//                                 }
//                             }
//                         ],
//                         as: "brandDetail"
//                     }
//                 },
//                 {
//                     $unwind:{
//                         path: "$brandDetail",
//                         preserveNullAndEmptyArrays:true
//                     },
//                 },
//                 {
//                     $lookup: {
//                       from: "users",
//                       let: { included: "$included" },
//                       pipeline: [
//                         {
//                           $match: {
//                             $expr: { $in: ["$_id", "$$included"] },
//                             isDeleted: false,
//                           },
//                         },
//                       ],
//                       as: "userDetail",
//                     },
//                   },
//                   {
//                     $unwind:{
//                         path: "$userDetail",
//                         preserveNullAndEmptyArrays:true
//                     },
//                 },
//                 {
//                     $project:{
//                         name:1,
//                         description:1,
//                         code:1,
//                         discountType:1,
//                         value:1,
//                         unit:1,
//                         brandName: "$brandDetail.name",
//                         userDetail: "$userDetail",
//                         startDate:1,
//                         endDate:1,
//                         pointtoredem:1,
//                         usesPerCoupon:1
//                     }
//                 }

//             ]).then((coupon_Detail) => {
//                 if (!coupon_Detail) {
//                   throw {
//                     statusCode: constants.code.dataNotFound,
//                     msg: constants.message.dataNotFound,
//                   };
//                 } else {
//                   res.status(constants.code.success).json({
//                     status: constants.status.statusTrue,
//                     userStatus: req.status,
//                     message: message.couponDetail,
//                     data: coupon_Detail,
//                   });
//                 }
//               })
//               .catch((err) => {
//                 res.status(constants.code.preconditionFailed).json({
//                   status: constants.status.statusFalse,
//                   userStatus: req.status,
//                   message: err.msg,
//                 });
//               });
//         }
//     }).catch((err: any) => {
//         res.status(err.statusCode).json({
//           status: constants.status.statusFalse,
//           userStatus: req.status,
//           message: err.msg,
//         });
//       });
//    } catch (err) {
//     res.status(constants.code.internalServerError).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: err,
//     });
//   }
// }

const couponDetail = async(req:any, res:Response, next:NextFunction)=>{
    try{
     Coupon.findOne({
         _id: new mongoose.Types.ObjectId(req.params.coupon_id),
         isDeleted:false
     }) .then((data) => {
         if (!data) {
           throw {
             statusCode: constants.code.dataNotFound,
             msg: constants.message.dataNotFound,
           };
         } else {
             Coupon.aggregate([
                 {
                     $match:{
                         _id: new mongoose.Types.ObjectId(req.params.coupon_id),
                         isDeleted: false
                     }
                 },
                 {
                     $lookup:{
                         from: "brands",
                         let: {brandId: "$base.brandId"},
                         pipeline:[
                             {
                                 $match:{
                                     $expr:{$eq:["$_id", "$$brandId"]},
                                     isDeleted: false
                                 }
                             }
                         ],
                         as: "brandDetail"
                     }
                 },
                 {
                     $unwind:{
                         path: "$brandDetail",
                         preserveNullAndEmptyArrays:true
                     },
                 },
                 {
                  $lookup:{
                      from: "outlets",
                      let: {outletId: "$base.outletId"},
                      pipeline:[
                          {
                              $match:{
                                  $expr:{$in:["$_id", "$$outletId"]},
                                  isDeleted: false
                              }
                          }
                      ],
                      as: "outletDetail"
                  }
              },
              // {
              //     $unwind:{
              //         path: "$outletDetail",
              //         preserveNullAndEmptyArrays:true
              //     },
              // },
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
                //    {
                //      $unwind:{
                //          path: "$includedDetail",
                //          preserveNullAndEmptyArrays:true
                //      },
                //  },
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
                  $unwind:{
                      path: "$excludedDetail",
                      preserveNullAndEmptyArrays:true
                  },
              },
                 {
                     $group: {
                         _id: "$_id",
                         name: { $first: "$name" },
                         description: { $first: "$description" },
                         code: { $first: "$code" },
                         discountType: { $first: "$discountType" },
                         unit: { $first: "$unit" },
                         value: { $first: "$value" },
                         brandName: { $first: "$brandDetail.name" },
                         outletDetail: {$first: "$outletDetail"},
                         includedDetail: { $first: "$includedDetail" },
                         excludedDetail: { $push: {userName:"$excludedDetail.fullName", email: "$excludedDetail.email.value"} },
                         startDate: { $first: "$startDate" },
                         endDate: { $first: "$endDate" },
                         pointtoredem: { $first: "$pointtoredem" },
                         usesPerCoupon: { $first: "$usesPerCoupon" },
                         status: {$first:"$status"},
                         term_conditions: {$first: "$termsCondition"}
                     }
                 },
                
 
             ]).then((coupon_Detail) => {
                 if (!coupon_Detail) {
                   throw {
                     statusCode: constants.code.dataNotFound,
                     msg: constants.message.dataNotFound,
                   };
                 } else {
                   res.status(constants.code.success).json({
                     status: constants.status.statusTrue,
                     userStatus: req.status,
                     message: message.couponDetail,
                     data: coupon_Detail,
                   });
                 }
               })
               .catch((err) => {
                 res.status(constants.code.preconditionFailed).json({
                   status: constants.status.statusFalse,
                   userStatus: req.status,
                   message: err.msg,
                 });
               });
         }
     }).catch((err: any) => {
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

 const updateCoupon = async(req:any, res:Response, next:NextFunction)=>{
  try{
    Coupon.findOne({
      _id: new mongoose.Types.ObjectId(req.params.coupon_id),
      isDeleted: false
    }).then(async (data) => {
      if (!data) {
        throw {
          statusCode: constants.code.dataNotFound,
          msg: constants.message.dataNotFound,
        };
      } else {
        let inclueds = [];
        for (let i = 0; i < req.body.included.length; i++) {
            inclueds.push(new mongoose.Types.ObjectId(req.body?.included[i]));
        }

        let excluded:any = [];
        for (let i = 0; i < req.body.excludeds.length; i++) {
          excluded.push(new mongoose.Types.ObjectId(req.body?.excludeds[i]));
        }

        let outlets:any = [];
        for (let i = 0; i < req.body.outlet.length; i++) {
          outlets.push(new mongoose.Types.ObjectId(req.body?.outlet[i]));
        }

        Coupon.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(req.params.coupon_id),
            isDeleted: false
          },
          {
            name: req.body.name,
            slug: await createSlug(req.body.name),
            description: req.body.description,
            code: req.body.code,
            discountType: req.body.discountType,
            unit: req.body.unit,
            value: req.body.value,                              
            base:{
                brandId:  !req.body.brandId ? null : new mongoose.Types.ObjectId(req.body.brandId),
                outletId:  !req.body.outlet ? null : outlets,
                minimumAmount: req.body.minimumAmount
            },
            included: inclueds,
            excluded: excluded,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            pointtoredem: req.body.pointtoredem,
            usesPerCoupon: req.body.usesPerCoupon,
            couponUsed: req.body.usesPerCoupon,
            usesPerUser:req.body.usesPerUser,
            termsCondition: req.body.termsCondition,
            status: req.body.status
          },
          {
            new:true,
            upsert:true
          }
        ).then((couponData)=>{
          if(!couponData){
            throw{
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            }
          }
          else{
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.updateCoupon
            })
          }
        }).catch((err)=>{
          res.status(constants.code.preconditionFailed).json({
              status: constants.status.statusFalse,
              userStatus: req.status,
              message: err.msg
          })
      })
      }
    })
    .catch((err) => {
      res.status(err.statusCode).json({
        status: constants.status.statusFalse,
        userStatus: req.status,
        message: err.msg,
      });
    });
  } catch(err){
    res.status(constants.code.internalServerError).json({
        status: constants.status.statusFalse,
        userStatus: req.status,
        message:err
    })
}
 }

 const listCoupon = async(req:any, res:Response, next:NextFunction)=>{
  try{
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;

    if (Number(req.query.limit) !== 0) {
      Coupon.aggregate([
        {
            $match:{
                isDeleted: false
            }
        },
        {
            $lookup:{
                from: "brands",
                let: {brandId: "$base.brandId"},
                pipeline:[
                    {
                        $match:{
                            $expr:{$eq:["$_id", "$$brandId"]},
                            isDeleted: false
                        }
                    }
                ],
                as: "brandDetail"
            }
        },
        {
            $unwind:{
                path: "$brandDetail",
                preserveNullAndEmptyArrays:true
            },
        },
        {
          $lookup:{
              from: "outlets",
              let: {outletId: "$base.outletId"},
              pipeline:[
                  {
                      $match:{
                          $expr:{$in:["$_id", "$$outletId"]},
                          isDeleted: false
                      }
                  }
              ],
              as: "outletDetail"
          }
      },
      // {
      //     $unwind:{
      //         path: "$outletDetail",
      //         preserveNullAndEmptyArrays:true
      //     },
      // },
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
       //    {
       //      $unwind:{
       //          path: "$includedDetail",
       //          preserveNullAndEmptyArrays:true
       //      },
       //  },
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
         $unwind:{
             path: "$excludedDetail",
             preserveNullAndEmptyArrays:true
         },
     },
        {
            $group: {
                _id: "$_id",
                name: { $first: "$name" },
                description: { $first: "$description" },
                code: { $first: "$code" },
                discountType: { $first: "$discountType" },
                unit: { $first: "$unit" },
                value: { $first: "$value" },
                brandName: { $first: "$brandDetail.name" },
                outletDetail: {$first: "$outletDetail"},
                includedDetail: { $first: "$includedDetail" },
                excludedDetail: { $push: {userName:"$excludedDetail.fullName", email: "$excludedDetail.email.value"} },
                startDate: { $first: "$startDate" },
                endDate: { $first: "$endDate" },
                pointtoredem: { $first: "$pointtoredem" },
                usesPerCoupon: { $first: "$usesPerCoupon" },
                status: {$first:"$status"},
                createdAt: {$first: "$createdAt"},
                term_conditions: {$first: "$termsCondition"}
            }
        },

        {
          $match: {
            $or: [
              {
                $and: [
                  {
                    brandName: { $eq: req.query.filter }
                  },
                  { outletDetail: { $size: 0 } }
                ]
              },
              {
                $and: [
                  { brandName: null },
                  { $or: [{ $expr: { $eq: [req.query.filter, ""] } }, { $expr: { $eq: [req.query.filter, "common"] } }] }
                ]
              },
              {
                $and: [
                  {
                    "outletDetail.name": { $eq: req.query.filter }
                  }
                ]
              },
              {
                $expr: { $eq: [req.query.filter, ""] }
              }
            ]
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
              message: message.couponListed,
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
            $match:{
                isDeleted: false
            }
        },
        {
            $lookup:{
                from: "brands",
                let: {brandId: "$base.brandId"},
                pipeline:[
                    {
                        $match:{
                            $expr:{$eq:["$_id", "$$brandId"]},
                            isDeleted: false
                        }
                    }
                ],
                as: "brandDetail"
            }
        },
        {
            $unwind:{
                path: "$brandDetail",
                preserveNullAndEmptyArrays:true
            },
        },
        {
          $lookup:{
              from: "outlets",
              let: {outletId: "$base.outletId"},
              pipeline:[
                  {
                      $match:{
                          $expr:{$in:["$_id", "$$outletId"]},
                          isDeleted: false
                      }
                  }
              ],
              as: "outletDetail"
          }
      },
      // {
      //     $unwind:{
      //         path: "$outletDetail",
      //         preserveNullAndEmptyArrays:true
      //     },
      // },
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
       //    {
       //      $unwind:{
       //          path: "$includedDetail",
       //          preserveNullAndEmptyArrays:true
       //      },
       //  },
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
         $unwind:{
             path: "$excludedDetail",
             preserveNullAndEmptyArrays:true
         },
     },
        {
            $group: {
                _id: "$_id",
                name: { $first: "$name" },
                description: { $first: "$description" },
                code: { $first: "$code" },
                discountType: { $first: "$discountType" },
                unit: { $first: "$unit" },
                value: { $first: "$value" },
                brandName: { $first: "$brandDetail.name" },
                outletDetail: {$first: "$outletDetail"},
                includedDetail: { $first: "$includedDetail" },
                excludedDetail: { $push: {userName:"$excludedDetail.fullName", email: "$excludedDetail.email.value"} },
                startDate: { $first: "$startDate" },
                endDate: { $first: "$endDate" },
                pointtoredem: { $first: "$pointtoredem" },
                usesPerCoupon: { $first: "$usesPerCoupon" },
                status: {$first:"$status"},
                createdAt: {$first: "$createdAt"},
                term_conditions: {$first: "$termsCondition"}

            }
        },
        {
          $match: {
            $or: [
              {
                $and: [
                  {
                    brandName: { $eq: req.query.filter }
                  },
                  { outletDetail: { $size: 0 } }
                ]
              },
              {
                $and: [
                  { brandName: null },
                  { $or: [{ $expr: { $eq: [req.query.filter, ""] } }, { $expr: { $eq: [req.query.filter, "common"] } }] }
                ]
              },
              {
                $and: [
                  {
                    "outletDetail.name": { $eq: req.query.filter }
                  }
                ]
              },
              {
                $expr: { $eq: [req.query.filter, ""] }
              }
            ]
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
              message: message.couponListed,
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


 const deleteCoupon = async(req:any, res:Response, next:NextFunction) =>{
  try {
    if (!req.body.is_delete) {
      throw {
        statusCode: constants.code.preconditionFailed,
        msg: constants.message.invalidType,
      };
    } else {
      Coupon.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.coupon_id),
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
              message: message.couponDeleted,
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

 const addQuiz = async(req:any, res:Response, next:NextFunction) =>{
  try{
   
    const outlets: any = await Outlet.find(
      {
        _id: { $in: req.body.outlet_id },
        isDeleted: false,
      },
      { _id: 0, outletId: "$_id" }
    );
        Quiz.findOneAndUpdate(
          {
            isDeleted: false
          },
          {
            name: req.body.name,
            outlets:outlets
          },
          {
            new:true,
            upsert:true
          }
        ).then((couponData)=>{
          if(!couponData){
            throw{
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            }
          }
          else{
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.quizadded
            })
          }
        }).catch((err)=>{
          res.status(constants.code.preconditionFailed).json({
              status: constants.status.statusFalse,
              userStatus: req.status,
              message: err.msg
          })
      })
      }
   catch(err){
    res.status(constants.code.internalServerError).json({
        status: constants.status.statusFalse,
        userStatus: req.status,
        message:err
    })
}
 }

export default {
    addCoupon,
    couponDetail,
    updateCoupon,
    listCoupon,
    deleteCoupon,
    addQuiz
}