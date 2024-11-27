import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import Review from "../../../models/review";
import message from "./reviewConstant";
import mongoose from "mongoose";
import User from "../../../models/user";
import Outlet from "../../../models/outlet";



// const outletReviews = async (req: any, res: Response, next: NextFunction) => {
//     try {
//         const page = Number(req.query.page);
//         const limit = Number(req.query.limit);
//         const skip = page * limit;

//         if (Number(req.query.limit) !== 0) {
//             Review.aggregate([
//                 {
//                   $match: {
//                     isDeleted: false,
//                   },
//                 },
//                 {
//                   $lookup: {
//                     from: "users",
//                     let: { userId: "$userId" },
//                     pipeline: [
//                       {
//                         $match: {
//                           $expr: { $eq: ["$_id", "$$userId"] },
//                           isDeleted: false,
//                         },
//                       },
//                     ],
//                     as: "userDetail",
//                   },
//                 },
//                 {
//                   $unwind: {
//                     path: "$userDetail",
//                     preserveNullAndEmptyArrays: true,
//                   },
//                 },
//                 {
//                   $lookup: {
//                     from: "outlets",
//                     let: { outletId: "$OutletReview.outletId" },
//                     pipeline: [
//                       {
//                         $match: {
//                           $expr: { $eq: ["$_id", "$$outletId"] },
//                           isDeleted: false,
//                         },
//                       },
//                     ],
//                     as: "outletDetail",
//                   },
//                 },
//                 {
//                   $unwind: {
//                     path: "$outletDetail",
//                     preserveNullAndEmptyArrays: true,
//                   },
//                 },
//                 {
//                   $lookup: {
//                     from: "brands",
//                     let: { brandId: "$brandReview.brandId" },
//                     pipeline: [
//                       {
//                         $match: {
//                           $expr: { $eq: ["$_id", "$$brandId"] },
//                           isDeleted: false,
//                         },
//                       },
//                     ],
//                     as: "brandDetail",
//                   },
//                 },
//                 {
//                   $unwind: {
//                     path: "$brandDetail",
//                     preserveNullAndEmptyArrays: true,
//                   },
//                 },
//                 {
//                   $project: {
//                     userName: "$userDetail.fullName",
//                     userProfile: "$userDetail.profilePicture",
//                     outletId: "$outletDetail._id",
//                     outletName: "$outletDetail.name",
//                     brandName: "$brandDetail.name",
//                     outletReview: "$OutletReview.review",
//                     brandReview: "$brandReview.review",

//                     createdAt: 1,
//                     comment: 1,
//                   },
//                 },
//                 {
//                     $match: {
//                       $or: [
//                         {
//                           outletName: {
//                             $regex: "^" + req.query.filter + ".*",
//                             $options: "i",
//                           },
//                         },
//                         {
//                             brandName: {
//                               $regex: "^" + req.query.filter + ".*",
//                               $options: "i",
//                             },
//                           },
//                       ],
//                     },
//                   },
//                   { $sort: { createdAt: -1 } },
//                   {
//                     $facet: {
//                       metadata: [
//                         {
//                           $project: {
//                             rating: {
//                               $cond: {
//                                 if: { $eq: ["$outletName", req.query.filter] },
//                                 then: "$outletReview",
//                                 else: "$brandReview",
//                               },
//                             },
//                           },
//                         },
//                         {
//                           $group: {
//                             _id: null,
//                             total: { $sum: 1 },
//                             averageRating: { $avg: "$rating" },
//                             ratings: {
//                               $push: "$rating",
//                             },
//                           },
//                         },
//                         {
//                           $addFields: {
//                             ratingCounts: {
//                               $arrayToObject: {
//                                 $map: {
//                                   input: [1, 2, 3, 4, 5],
//                                   as: "rating",
//                                   in: {
//                                     k: {
//                                       $switch: {
//                                         branches: [
//                                           { case: { $eq: ["$$rating", 1] }, then: "one" },
//                                           { case: { $eq: ["$$rating", 2] }, then: "two" },
//                                           { case: { $eq: ["$$rating", 3] }, then: "three" },
//                                           { case: { $eq: ["$$rating", 4] }, then: "four" },
//                                           { case: { $eq: ["$$rating", 5] }, then: "five" },
//                                         ],
//                                       },
//                                     },
//                                     v: {
//                                       $size: {
//                                         $filter: {
//                                           input: "$ratings",
//                                           as: "r",
//                                           cond: { $eq: ["$$r", "$$rating"] },
//                                         },
//                                       },
//                                     },
//                                   },
//                                 },
//                               },
//                             },
//                           },
//                         },
//                       {
//                         $addFields: {
//                           page: Number(page),
//                         },
//                       },
//                       {
//                         $addFields: {
//                           totalPages: {
//                             $ceil: { $divide: ["$total", limit] },
//                           },
//                         },
//                       },
//                       {
//                         $addFields: {
//                           hasPrevPage: {
//                             $cond: {
//                               if: {
//                                 $lt: [{ $subtract: [page, Number(1)] }, Number(0)],
//                               },
//                               then: false,
//                               else: true,
//                             },
//                           },
//                         },
//                       },
//                       {
//                         $addFields: {
//                           prevPage: {
//                             $cond: {
//                               if: {
//                                 $lt: [{ $subtract: [page, Number(1)] }, Number(0)],
//                               },
//                               then: null,
//                               else: { $subtract: [page, Number(1)] },
//                             },
//                           },
//                         },
//                       },
//                       {
//                         $addFields: {
//                           hasNextPage: {
//                             $cond: {
//                               if: {
//                                 $gt: [
//                                   {
//                                     $subtract: [
//                                       {
//                                         $ceil: { $divide: ["$total", limit] },
//                                       },
//                                       Number(1),
//                                     ],
//                                   },
//                                   "$page",
//                                 ],
//                               },
//                               then: true,
//                               else: false,
//                             },
//                           },
//                         },
//                       },
//                       { $addFields: { nextPage: { $sum: [page, Number(1)] } } },

                    
                      

                        
//                     ],
//                     data: [
//                       { $skip: skip },
//                       { $limit: limit },
                      
                      
//                     ],
//                   },
//                 },
//               ])
              
//                 .then((data: any) => {
//                     if (!data[0].data.length) {
//                         throw {
//                             statusCode: constants.code.dataNotFound,
//                             msg: constants.message.dataNotFound,
//                         };
//                     } else {
//                         res.status(constants.code.success).json({
//                             status: constants.status.statusTrue,
//                             userStatus: req.status,
//                             message: message.outletReview,
//                             metadata: data[0].metadata,
//                             data: data[0].data,
//                         });
//                     }
//                 })
//                 .catch((err) => {
//                     res.status(constants.code.preconditionFailed).json({
//                         status: constants.status.statusFalse,
//                         userStatus: req.status,
//                         message: err.msg,
//                     });
//                 });
//         } else {
//             Review.aggregate([
//                 {
//                     $match: {
//                       isDeleted: false,
//                     },
//                   },
//                   {
//                     $lookup: {
//                       from: "users",
//                       let: { userId: "$userId" },
//                       pipeline: [
//                         {
//                           $match: {
//                             $expr: { $eq: ["$_id", "$$userId"] },
//                             isDeleted: false,
//                           },
//                         },
//                       ],
//                       as: "userDetail",
//                     },
//                   },
//                   {
//                     $unwind: {
//                       path: "$userDetail",
//                       preserveNullAndEmptyArrays: true,
//                     },
//                   },
//                   {
//                     $lookup: {
//                       from: "outlets",
//                       let: { outletId: "$OutletReview.outletId" },
//                       pipeline: [
//                         {
//                           $match: {
//                             $expr: { $eq: ["$_id", "$$outletId"] },
//                             isDeleted: false,
//                           },
//                         },
//                       ],
//                       as: "outletDetail",
//                     },
//                   },
//                   {
//                     $unwind: {
//                       path: "$outletDetail",
//                       preserveNullAndEmptyArrays: true,
//                     },
//                   },
//                   {
//                     $lookup: {
//                       from: "brands",
//                       let: { brandId: "$brandReview.brandId" },
//                       pipeline: [
//                         {
//                           $match: {
//                             $expr: { $eq: ["$_id", "$$brandId"] },
//                             isDeleted: false,
//                           },
//                         },
//                       ],
//                       as: "brandDetail",
//                     },
//                   },
//                   {
//                     $unwind: {
//                       path: "$brandDetail",
//                       preserveNullAndEmptyArrays: true,
//                     },
//                   },
//                   {
//                     $project: {
//                       userName: "$userDetail.fullName",
//                       userProfile: "$userDetail.profilePicture",
//                       outletId: "$outletDetail._id",
//                       outletName: "$outletDetail.name",
//                       brandName: "$brandDetail.name",
//                       outletReview: "$OutletReview.review",
//                       brandReview: "$brandReview.review",
  
//                       createdAt: 1,
//                       comment: 1,
//                     },
//                   },
//                   {
//                       $match: {
//                         $or: [
//                           {
//                             outletName: {
//                               $regex: "^" + req.query.filter + ".*",
//                               $options: "i",
//                             },
//                           },
//                           {
//                               brandName: {
//                                 $regex: "^" + req.query.filter + ".*",
//                                 $options: "i",
//                               },
//                             },
//                         ],
//                       },
//                     },
//                     { $sort: { createdAt: -1 } },
//                 {
//                     $facet: {
//                         metadata: [
//                           {
//                             $project: {
//                               rating: {
//                                 $cond: {
//                                   if: { $eq: ["$outletName", req.query.filter] },
//                                   then: "$outletReview",
//                                   else: "$brandReview",
//                                 },
//                               },
//                             },
//                           },
//                           {
//                             $group: {
//                               _id: null,
//                               total: { $sum: 1 },
//                               averageRating: { $avg: "$rating" },
//                               ratings: {
//                                 $push: "$rating",
//                               },
//                             },
//                           },
//                           {
//                             $addFields: {
//                               ratingCounts: {
//                                 $arrayToObject: {
//                                   $map: {
//                                     input: [1, 2, 3, 4, 5],
//                                     as: "rating",
//                                     in: {
//                                       k: {
//                                         $switch: {
//                                           branches: [
//                                             { case: { $eq: ["$$rating", 1] }, then: "one" },
//                                             { case: { $eq: ["$$rating", 2] }, then: "two" },
//                                             { case: { $eq: ["$$rating", 3] }, then: "three" },
//                                             { case: { $eq: ["$$rating", 4] }, then: "four" },
//                                             { case: { $eq: ["$$rating", 5] }, then: "five" },
//                                           ],
//                                         },
//                                       },
//                                       v: {
//                                         $size: {
//                                           $filter: {
//                                             input: "$ratings",
//                                             as: "r",
//                                             cond: { $eq: ["$$r", "$$rating"] },
//                                           },
//                                         },
//                                       },
//                                     },
//                                   },
//                                 },
//                               },
//                             },
//                           },
//                             { $addFields: { page: Number(page) } },
//                             {
//                                 $addFields: { totalPages: { $sum: [Number(page), Number(1)] } },
//                             },
//                             { $addFields: { hasPrevPage: false } },
//                             { $addFields: { prevPage: null } },
//                             { $addFields: { hasNextPage: false } },
//                             { $addFields: { nextPage: null } },
//                         ],
//                         data: [],
//                     },
//                 },
//             ])
//                 .then((data) => {
//                     if (!data[0].data.length) {
//                         throw {
//                             statusCode: constants.code.dataNotFound,
//                             msg: constants.message.dataNotFound,
//                         };
//                     } else {
//                         res.status(constants.code.success).json({
//                             status: constants.status.statusTrue,
//                             userStatus: req.status,
//                             message: message.outletReview,
//                             metadata: data[0].metadata,
//                             data: data[0].data,
//                         });
//                     }
//                 })
//                 .catch((err) => {
//                     res.status(err.statusCode).json({
//                         status: constants.status.statusFalse,
//                         userStatus: req.status,
//                         message: err.msg,
//                     });
//                 });
//         }
//     } catch (err) {
//         res.status(constants.code.internalServerError).json({
//             status: constants.status.statusFalse,
//             userStatus: req.status,
//             message: err,
//         });
//     }
// }


const outletReviews = async (req: any, res: Response, next: NextFunction) => {
  try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const skip = page * limit;

      await User.findOne({
        _id: new mongoose.Types.ObjectId(req.id),
        role: {
          $in: [
            constants.accountLevel.admin,
            constants.accountLevel.superAdmin,
            constants.accountLevel.manager,
          ],
        },
      })
        .then(async (data: any) => {
          if (!data) {
            throw {
              statusCode: constants.code.dataNotFound,
              message: constants.message.dataNotFound,
            };
          } else {

            const outletId: any = await Outlet.findOne(
              { managerId: new mongoose.Types.ObjectId(data._id) },
              { _id: 1 }
            )
            let matchOutlet: any = {};
            if (data.role == constants.accountLevel.manager) {
              matchOutlet = {
                $match: {
                  "outletDetail._id": new mongoose.Types.ObjectId(
                    outletId._id
                  ),
                },
              };
            } else {
              matchOutlet = {
                $match: {
                  "outletDetail._id": { $nin: [null] },
                  isDeleted: false,
                },
              };
            }
      if (Number(req.query.limit) !== 0) {
          Review.aggregate([
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
                $lookup: {
                  from: "outlets",
                  let: { outletId: "$OutletReview.outletId" },
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
              matchOutlet,
              {
                $unwind: {
                  path: "$outletDetail",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "brands",
                  let: { brandId: "$brandReview.brandId" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$brandId"] },
                        isDeleted: false,
                      },
                    },
                  ],
                  as: "brandDetail",
                },
              },
              {
                $unwind: {
                  path: "$brandDetail",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $project: {
                  userName: "$userDetail.fullName",
                  userProfile: "$userDetail.profilePicture",
                  outletId: "$outletDetail._id",
                  outletName: "$outletDetail.name",
                  brandName: "$brandDetail.name",
                  outletReview: "$OutletReview.review",
                  brandReview: "$brandReview.review",

                  createdAt: 1,
                  comment: 1,
                },
              },
              {
                  $match: {
                    $or: [
                      {
                        outletName: {
                          $regex: "^" + req.query.filter + ".*",
                          $options: "i",
                        },
                      },
                      {
                          brandName: {
                            $regex: "^" + req.query.filter + ".*",
                            $options: "i",
                          },
                        },
                    ],
                  },
                },
                { $sort: { createdAt: -1 } },
                {
                  $facet: {
                    metadata: [
                      {
                        $project: {
                          rating: {
                            $cond: {
                              if: { $eq: ["$brandName", req.query.filter] },
                              then: "$brandReview",
                              else: "$outletReview",
                            },
                          },
                        },
                      },
                      {
                        $group: {
                          _id: null,
                          total: { $sum: 1 },
                          averageRating: { $avg: "$rating" },
                          ratings: {
                            $push: "$rating",
                          },
                        },
                      },
                      {
                        $addFields: {
                          ratingCounts: {
                            $arrayToObject: {
                              $map: {
                                input: [1, 2, 3, 4, 5],
                                as: "rating",
                                in: {
                                  k: {
                                    $switch: {
                                      branches: [
                                        { case: { $eq: ["$$rating", 1] }, then: "one" },
                                        { case: { $eq: ["$$rating", 2] }, then: "two" },
                                        { case: { $eq: ["$$rating", 3] }, then: "three" },
                                        { case: { $eq: ["$$rating", 4] }, then: "four" },
                                        { case: { $eq: ["$$rating", 5] }, then: "five" },
                                      ],
                                    },
                                  },
                                  v: {
                                    $size: {
                                      $filter: {
                                        input: "$ratings",
                                        as: "r",
                                        cond: { $eq: ["$$r", "$$rating"] },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    {
                      $addFields: {
                        page: Number(page),
                      },
                    },
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
                  data: [
                    { $skip: skip },
                    { $limit: limit },
                    
                    
                  ],
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
                          message: message.outletReview,
                          metadata: data[0].metadata,
                          data: data[0].data,
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
      } else {
          Review.aggregate([
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
                  $lookup: {
                    from: "outlets",
                    let: { outletId: "$OutletReview.outletId" },
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
                matchOutlet,
                {
                  $unwind: {
                    path: "$outletDetail",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "brands",
                    let: { brandId: "$brandReview.brandId" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$_id", "$$brandId"] },
                          isDeleted: false,
                        },
                      },
                    ],
                    as: "brandDetail",
                  },
                },
                {
                  $unwind: {
                    path: "$brandDetail",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    userName: "$userDetail.fullName",
                    userProfile: "$userDetail.profilePicture",
                    outletId: "$outletDetail._id",
                    outletName: "$outletDetail.name",
                    brandName: "$brandDetail.name",
                    outletReview: "$OutletReview.review",
                    brandReview: "$brandReview.review",

                    createdAt: 1,
                    comment: 1,
                  },
                },
                {
                    $match: {
                      $or: [
                        {
                          outletName: {
                            $regex: "^" + req.query.filter + ".*",
                            $options: "i",
                          },
                        },
                        {
                            brandName: {
                              $regex: "^" + req.query.filter + ".*",
                              $options: "i",
                            },
                          },
                      ],
                    },
                  },
                  { $sort: { createdAt: -1 } },
              {
                  $facet: {
                      metadata: [
                        {
                          $project: {
                            rating: {
                              $cond: {
                                if: { $eq: ["$brandName", req.query.filter] },
                                then: "$brandReview",
                                else: "$outletReview",
                              },
                            },
                          },
                        },
                        {
                          $group: {
                            _id: null,
                            total: { $sum: 1 },
                            averageRating: { $avg: "$rating" },
                            ratings: {
                              $push: "$rating",
                            },
                          },
                        },
                        {
                          $addFields: {
                            ratingCounts: {
                              $arrayToObject: {
                                $map: {
                                  input: [1, 2, 3, 4, 5],
                                  as: "rating",
                                  in: {
                                    k: {
                                      $switch: {
                                        branches: [
                                          { case: { $eq: ["$$rating", 1] }, then: "one" },
                                          { case: { $eq: ["$$rating", 2] }, then: "two" },
                                          { case: { $eq: ["$$rating", 3] }, then: "three" },
                                          { case: { $eq: ["$$rating", 4] }, then: "four" },
                                          { case: { $eq: ["$$rating", 5] }, then: "five" },
                                        ],
                                      },
                                    },
                                    v: {
                                      $size: {
                                        $filter: {
                                          input: "$ratings",
                                          as: "r",
                                          cond: { $eq: ["$$r", "$$rating"] },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
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
                          message: message.outletReview,
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
    }
  })
  .catch((err:any) => {
    res.status(constants.code.preconditionFailed).json({
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



//     let brandFilter = {};
//     if (req.body.brand_id) {
//       const brandData: any = await Brand.findOne({
//         _id: new mongoose.Types.ObjectId(req.body.brand_id),
//         isDeleted: false,
//       });
//       if (!brandData) {
//         throw {
//           statusCode: constants.code.dataNotFound,
//           message: message.brandNotFound,
//         };
//       }
//       brandFilter = { brandId: brandData._id };
//     }

//   {
//           $match: {
//             isDeleted: false,
//             name: {
//               $regex: "^" + req.query.search + ".*",
//               $options: "i",
//             },
//             ...brandFilter,
//           },
//         },

const rating = async (req: any, res: Response, next: NextFunction) => {
    try {
        if(!req.body.outletId){
        await Review.aggregate([
            {
                $match: {
                    isDeleted:false
                },
            },
            {
                $group: {                                                           
                    _id: null,
                    average: { $avg: "$OutletReview.review" },
                    reviewCount: { $sum: 1 }
                    //count : {$count: "$OutletReview.review"}
                },
            },
        ]).then((data) => {
            if (!data) {
                throw {
                    statusCode: constants.code.dataNotFound,
                    msg: constants.message.dataNotFound,
                };
            } else {
                res.status(constants.code.success).json({
                    status: constants.status.statusTrue,
                    userStatus: req.status,
                    message: constants.message.success,
                    data: data,
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
    else{
        await Review.aggregate([
            {
                $match: {
                    "OutletReview.outletId": new mongoose.Types.ObjectId(
                        req.body.outletId
                    ),
                },
            },
            {
                $group: {
                    _id: null,
                    average: { $avg: "$OutletReview.review" },
                    reviewCount: { $sum: 1 }
                    //count : {$count: "$OutletReview.review"}
                },
            },
        ]).then((data) => {
            if (!data) {
                throw {
                    statusCode: constants.code.dataNotFound,
                    msg: constants.message.dataNotFound,
                };
            } else {
                res.status(constants.code.success).json({
                    status: constants.status.statusTrue,
                    userStatus: req.status,
                    message: constants.message.success,
                    data: data,
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


const reviews = async(req:any, res:Response, next:NextFunction)=>{
    try{
        
        let outletFilter = {}
             if (req.body.outletId) {
    const outletData: any = await Review.findOne({
       "OutletReview.outletId": new mongoose.Types.ObjectId(
    req.body.outletId
),
        isDeleted: false,
      });
      if (!outletData) {
        throw {
          statusCode: constants.code.dataNotFound,
          message: constants.message.dataNotFound,
        };
      }
      outletFilter = { "OutletReview.outletId": outletData.OutletReview.outletId };
    }

     Review.aggregate([
        {
            $match: {
                isDeleted:false,
                ...outletFilter
            
            
            },
        },
        {
            $group: {                                                           
                _id: null,
                average: { $avg: "$OutletReview.review" },
                reviewCount: { $sum: 1 }
                //count : {$count: "$OutletReview.review"}
            },
        },
    ]).then((data) => {
        if (!data) {
            throw {
                statusCode: constants.code.dataNotFound,
                msg: constants.message.dataNotFound,
            };
        } else {
            res.status(constants.code.success).json({
                status: constants.status.statusTrue,
                userStatus: req.status,
                message: constants.message.success,
                data: data,
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

catch (err) {
        res.status(constants.code.internalServerError).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: err,
        });
    }
}


// const outletReviewss = async (req: any, res: Response, next: NextFunction) => {
//     try {
//         const page = Number(req.query.page);
//         const limit = Number(req.query.limit);
//         const skip = page * limit;

//       //  let outletFilter = {}
//         let brandFilter = {};
// //              if (req.body.outletId) {
// //     const outletData: any = await Review.findOne({
// //        "OutletReview.outletId": new mongoose.Types.ObjectId(
// //     req.body.outletId
// // ),
// //         isDeleted: false,
// //       });
// //       if (!outletData) {
// //         throw {
// //           statusCode: constants.code.dataNotFound,
// //           message: constants.message.dataNotFound,
// //         };
// //       }
// //       outletFilter = { "OutletReview.outletId": outletData.OutletReview.outletId };
// //     }

//     if (req.body.brandId) {
//         brandFilter = { "brandReview.brandId": new mongoose.Types.ObjectId(req.body.brandId) };
//     }

//         if (Number(req.query.limit) !== 0) {
//             Review.aggregate([
//                 {
//                     $match: {
//                         isDeleted: false,
//                         //...brandFilter
//                         $or: [
//                             {
//                               "OutletReview.outletId": new mongoose.Types.ObjectId(req.query.search)
//                             },
                            
//                           ],
                    
//                     },
//                 },
//                 {
//                     $lookup: {
//                         from: "users",
//                         let: { userId: "$userId" },
//                         pipeline: [
//                             {
//                                 $match: {
//                                     $expr: { $eq: ["$_id", "$$userId"] },
//                                     isDeleted: false,
//                                 },
//                             },
//                         ],
//                         as: "userDetail",
//                     },
//                 },
//                 {
//                     $unwind: {
//                         path: "$userDetail",
//                         preserveNullAndEmptyArrays: true,
//                     },
//                 },

//                 {
//                     $lookup: {
//                         from: "outlets",
//                         let: { outletId: "$OutletReview.outletId" },
//                         pipeline: [
//                             {
//                                 $match: {
//                                     $expr: { $eq: ["$_id", "$$outletId"] },
//                                     isDeleted: false,
//                                 },
//                             },
//                         ],
//                         as: "outletDetail",
//                     },
//                 },
//                 {
//                     $unwind: {
//                         path: "$outletDetail",
//                         preserveNullAndEmptyArrays: true,
//                     },
//                 },


//                 {
//                     $lookup: {
//                         from: "brand",
//                         let: { brandId: "$brandReview.brandId" },
//                         pipeline: [
//                             {
//                                 $match: {
//                                     $expr: { $eq: ["$_id", "$$brandId"] },
//                                     isDeleted: false,
                                    
//                                 },
//                             },
//                         ],
//                         as: "brandDetail",
//                     },
//                 },
//                 {
//                     $unwind: {
//                         path: "$brandDetail",
//                         preserveNullAndEmptyArrays: true,
//                     },
//                 },



//                 // {
//                 //     $project: {
//                 //         userName: "$userDetail.fullName",
//                 //         userProfile: "$userDetail.profilePicture",
//                 //         outletId: "$outletDetail._id",
//                 //         outletName: "$outletDetail.name",
//                 //         outletReview: "$OutletReview.review",
//                 //         brandReview: "$brandReview.review",
//                 //         createdAt: 1,
//                 //         comment: 1,
                       

//                 //     }
//                 // },

//                 {
//                     $group: {
//                         _id: null,
//                 averageOutletReview: { $avg: "$OutletReview.review" },
//                 averageBrandReview: { $avg: "$brandReview.review" },
//                 outletReviewCount: { $sum: 1 },
//                         reviews: {
//                             $push: {
//                                 userName: "$userDetail.fullName",
//                                 userProfile: "$userDetail.profilePicture",
//                                 outletName: "$outletDetail.name",
//                                 outletReview: "$OutletReview.review",
//                                 brandReview: "$brandReview.review",
//                                 comment: "$comment"
//                             }
//                         }
//                     }
//                 },


//                 // {
//                 //     $match: {
//                 //         $or: [
//                 //             {
//                 //                 "reviews.outletName": {
//                 //                     $regex: "^" + req.query.filter + ".*",
//                 //                     $options: "i",
//                 //                 },
//                 //             },
//                 //         ],
//                 //     },
//                 // },

            
            
                
               

//                 // {
//                 //     $group: {
//                 //       _id: null,
//                 //       outletName: { $first: "$outletDetail.name" },
//                 //       userName: {$first:"$userDetail.fullName"},
//                 //         userProfile: {$first:"$userDetail.profilePicture"},
//                 //         average: { $first: "$OutletReview.review" },
//                 //         comment: { $first: "$comment" }
//                 //     }
//                 //   },


//                 {
//                     $sort: { createdAt: -1 }
//                 },

//                 {
//                     $facet: {
//                       metadata: [
//                         { $count: "total" },
//                         {
//                           $group: {
//                             _id: null,
//                             averageOutletReview: { $avg: "$OutletReview.review" }
//                           }
//                         },
//                         { $addFields: { page: Number(page) } },
//                         {
//                           $addFields: {
//                             totalPages: {
//                               $ceil: { $divide: ["$total", limit] },
//                             },
//                           },
//                         },
//                         {
//                           $addFields: {
//                             hasPrevPage: {
//                               $cond: {
//                                 if: {
//                                   $lt: [{ $subtract: [page, Number(1)] }, Number(0)],
//                                 },
//                                 then: false,
//                                 else: true,
//                               },
//                             },
//                           },
//                         },
//                       ],
//                       data: [{ $skip: skip }, { $limit: limit }]
//                     }
//                   }
                
//             ])
//                 .then((data: any) => {
//                     if (!data[0].data.length) {
//                         throw {
//                             statusCode: constants.code.dataNotFound,
//                             msg: constants.message.dataNotFound,
//                         };
//                     } else {
//                         res.status(constants.code.success).json({
//                             status: constants.status.statusTrue,
//                             userStatus: req.status,
//                             message: message.outletReview,
//                             metadata: data[0].metadata,
//                             data: data[0].data,
//                         });
//                     }
//                 })
//                 .catch((err) => {
//                     res.status(constants.code.preconditionFailed).json({
//                         status: constants.status.statusFalse,
//                         userStatus: req.status,
//                         message: err.msg,
//                     });
//                 });
//         } else {
//             Review.aggregate([
//                 {
//                     $match: {
//                         isDeleted: false,

//                     },
//                 },
//                 {
//                     $lookup: {
//                         from: "users",
//                         let: { userId: "$userId" },
//                         pipeline: [
//                             {
//                                 $match: {
//                                     $expr: { $eq: ["$_id", "$$userId"] },
//                                     isDeleted: false,
//                                 },
//                             },
//                         ],
//                         as: "userDetail",
//                     },
//                 },
//                 {
//                     $unwind: {
//                         path: "$userDetail",
//                         preserveNullAndEmptyArrays: true,
//                     },
//                 },

//                 {
//                     $lookup: {
//                         from: "outlets",
//                         let: { outletId: "$OutletReview.outletId" },
//                         pipeline: [
//                             {
//                                 $match: {
//                                     $expr: { $eq: ["$_id", "$$outletId"] },
//                                     isDeleted: false,
//                                 },
//                             },
//                         ],
//                         as: "outletDetail",
//                     },
//                 },
//                 {
//                     $unwind: {
//                         path: "$outletDetail",
//                         preserveNullAndEmptyArrays: true,
//                     },
//                 },


//                 {
//                     $lookup: {
//                         from: "brand",
//                         let: { brandId: "$brandReview.brandId" },
//                         pipeline: [
//                             {
//                                 $match: {
//                                     $expr: { $eq: ["$_id", "$$brandId"] },
//                                     isDeleted: false,
//                                 },
//                             },
//                         ],
//                         as: "brandDetail",
//                     },
//                 },
//                 {
//                     $unwind: {
//                         path: "$brandDetail",
//                         preserveNullAndEmptyArrays: true,
//                     },
//                 },
                

//                 {
//                     $project: {
//                         userName: "$userDetail.fullName",
//                         userProfile: "$userDetail.profilePicture",
//                         outletId: "$outletDetail._id",
//                         outletName: "$outletDetail.name",
//                         outletReview: "$OutletReview.review",
//                         createdAt: 1,
//                         comment: 1

//                     }
//                 },

//                 // {
//                 //     $group: {
//                 //       _id: null,
//                 //       outletName: { $first: "$outletDetail.name" },
//                 //       userName: {$first:"$userDetail.fullName"},
//                 //         userProfile: {$first:"$userDetail.profilePicture"},
//                 //         average: { $first: "$OutletReview.review" },
//                 //         comment: { $first: "$comment" }
//                 //     }
//                 //   },
//                 //   {
//                 //     $match: {
//                 //       $or: [
//                 //         {
//                 //             outletName: {
//                 //             $regex: "^" + req.query.filter + ".*",
//                 //             $options: "i",
//                 //           },
//                 //         },
//                 //       ],
//                 //     },
//                 //   },

//                 {
//                     $match: {
//                       $or: [
//                         {
//                             outletName: {
//                             $regex: "^" + req.query.filter + ".*",
//                             $options: "i",
//                           },
//                         },
//                       ],
//                     },
//                   },


//                 {
//                     $sort: { createdAt: -1 }
//                 },

//                 {
//                     $facet: {
//                         metadata: [
//                             { $count: "total" },
//                             { $addFields: { page: Number(page) } },
//                             {
//                                 $addFields: { totalPages: { $sum: [Number(page), Number(1)] } },
//                             },
//                             { $addFields: { hasPrevPage: false } },
//                             { $addFields: { prevPage: null } },
//                             { $addFields: { hasNextPage: false } },
//                             { $addFields: { nextPage: null } },
//                         ],
//                         data: [],
//                     },
//                 },
//             ])
//                 .then((data) => {
//                     if (!data[0].data.length) {
//                         throw {
//                             statusCode: constants.code.dataNotFound,
//                             msg: constants.message.dataNotFound,
//                         };
//                     } else {
//                         res.status(constants.code.success).json({
//                             status: constants.status.statusTrue,
//                             userStatus: req.status,
//                             message: message.outletReview,
//                             metadata: data[0].metadata,
//                             data: data[0].data,
//                         });
//                     }
//                 })
//                 .catch((err) => {
//                     res.status(err.statusCode).json({
//                         status: constants.status.statusFalse,
//                         userStatus: req.status,
//                         message: err.msg,
//                     });
//                 });
//         }
//     } catch (err) {
//         res.status(constants.code.internalServerError).json({
//             status: constants.status.statusFalse,
//             userStatus: req.status,
//             message: err,
//         });
//     }
// }


export default {
    outletReviews,
    rating,
    reviews,
    //outletReviewss
}