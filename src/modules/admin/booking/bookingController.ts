import { Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import User from "../../../models/user";
import {
  createSlug,
  imageUrl,
  removeImage,
  getFileName,
  convertToIST
} from "../../../helpers/helper";
import Request from "../../../models/request";
import sendMail from "../../../helpers/mail";
import message from "./bookingConstants";
import mongoose from "mongoose";
import Table from "../../../models/table";
import Outlet from "../../../models/outlet";
import Device from "../../../models/device";
import firebaseMessaging from "../../../config/firebaseConfig";



// const tableBookingRequest = async(req:any, res:Response, next:NextFunction)=>{
//     try {
//         const page = Number(req.query.page);
//         const limit = Number(req.query.limit);
//         const skip = page * limit;
//         const sort = req.query.sort === "desc" ? -1 : 1;

//         if (Number(req.query.limit) !== 0) {
//           Request.aggregate([
//             {
//               $match: {
//                 isDeleted: false,
//               },
//             },
//             {
//               $lookup: {
//                 from: "users",
//                 let: {
//                   userId: "$userId",
//                 },
//                 pipeline: [
//                   {
//                     $match: {
//                       $expr: {
//                         $and: [
//                           { $eq: ["$_id", "$$userId"] },
//                           { $eq: ["$isDeleted", false] },
//                         ],
//                       },
//                     },
//                   },
//                 ],
//                 as: "user_detail",
//               },
//             },
//             { $unwind: "$user_detail" },
//             {
//               $lookup: {
//                 from: "tables",
//                 let: {
//                   tableId: "$tableId",
//                 },
//                 pipeline: [
//                   {
//                     $match: {
//                       $expr: {
//                         $and: [
//                           { $eq: ["$_id", "$$tableId"] },
//                           { $eq: ["$isDeleted", false] },
//                         ],
//                       },
//                     },
//                   },
//                 ],
//                 as: "table_detail",
//               },
//             },
//             { $unwind: "$table_detail" },

//             {
//               $project: {
//                 _id: 1,
//                name: "$user_detail.fname",
//                date: "$table_detail.createdAt",
//                createdAt: { $toLong: "$createdAt" },
//                visitingTime: "$table_detail.slotTime",
//                status:1
//               },
//             },
//             {
//               $match: {
//                 $or: [
//                   {
//                     name: {
//                       $regex: "^" + req.query.search + ".*",
//                       $options: "i",
//                     },
//                   },
//                   {
//                     date: {
//                       $regex: "^" + req.query.search + ".*",
//                       $options: "i",
//                     },
//                   },
//                 ],
//               },
//             },
//             {
//               $sort: { createdAt: sort },
//             },
//             {
//               $facet: {
//                 metadata: [
//                   { $count: "total" },
//                   { $addFields: { page: Number(page) } },
//                   {
//                     $addFields: {
//                       totalPages: {
//                         $ceil: { $divide: ["$total", limit] },
//                       },
//                     },
//                   },
//                   {
//                     $addFields: {
//                       hasPrevPage: {
//                         $cond: {
//                           if: {
//                             $lt: [{ $subtract: [page, Number(1)] }, Number(0)],
//                           },
//                           then: false,
//                           else: true,
//                         },
//                       },
//                     },
//                   },
//                   {
//                     $addFields: {
//                       prevPage: {
//                         $cond: {
//                           if: {
//                             $lt: [{ $subtract: [page, Number(1)] }, Number(0)],
//                           },
//                           then: null,
//                           else: { $subtract: [page, Number(1)] },
//                         },
//                       },
//                     },
//                   },
//                   {
//                     $addFields: {
//                       hasNextPage: {
//                         $cond: {
//                           if: {
//                             $gt: [
//                               {
//                                 $subtract: [
//                                   {
//                                     $ceil: { $divide: ["$total", limit] },
//                                   },
//                                   Number(1),
//                                 ],
//                               },
//                               "$page",
//                             ],
//                           },
//                           then: true,
//                           else: false,
//                         },
//                       },
//                     },
//                   },
//                   { $addFields: { nextPage: { $sum: [page, Number(1)] } } },
//                 ],
//                 data: [{ $skip: skip }, { $limit: limit }],
//               },
//             },
//           ])
//             .then((data: any) => {
//               if (!data[0].data.length) {
//                 throw {
//                   statusCode: constants.code.dataNotFound,
//                   msg: constants.message.dataNotFound,
//                 };
//               } else {
//                 res.status(constants.code.success).json({
//                   status: constants.status.statusTrue,
//                   userStatus: req.status,
//                   message: message.tablerequestListSuccess,
//                   metadata: data[0].metadata,
//                   data: data[0].data,
//                 });
//               }
//             })
//             .catch((err) => {
//               res.status(err.statusCode).json({
//                 status: constants.status.statusFalse,
//                 userStatus: req.status,
//                 message: err.msg,
//               });
//             });
//         } else {
//           Request.aggregate([
//             {
//               $match: {
//                 isDeleted: false,
//               },
//             },
//             {
//                 $lookup: {
//                   from: "users",
//                   let: {
//                     userId: "$userId",
//                   },
//                   pipeline: [
//                     {
//                       $match: {
//                         $expr: {
//                           $and: [
//                             { $eq: ["$_id", "$$userId"] },
//                             { $eq: ["$isDeleted", false] },
//                           ],
//                         },
//                       },
//                     },
//                   ],
//                   as: "user_detail",
//                 },
//               },
//               { $unwind: "$user_detail" },
//               {
//                 $lookup: {
//                   from: "tables",
//                   let: {
//                     tableId: "$tableId",
//                   },
//                   pipeline: [
//                     {
//                       $match: {
//                         $expr: {
//                           $and: [
//                             { $eq: ["$_id", "$$tableId"] },
//                             { $eq: ["$isDeleted", false] },
//                           ],
//                         },
//                       },
//                     },
//                   ],
//                   as: "table_detail",
//                 },
//               },
//               { $unwind: "$table_detail" },

//               {
//                 $project: {
//                   _id: 1,
//                  name: "$user_detail.fname",
//                  date: "$table_detail.createdAt",
//                  createdAt: { $toLong: "$createdAt" },
//                  visitingTime: "$table_detail.slotTime",
//                  status:1
//                 },
//               },
//               {
//                 $match: {
//                   $or: [
//                     {
//                       name: {
//                         $regex: "^" + req.query.search + ".*",
//                         $options: "i",
//                       },
//                     },
//                     {
//                       date: {
//                         $regex: "^" + req.query.search + ".*",
//                         $options: "i",
//                       },
//                     },
//                   ],
//                 },
//               },
//             {
//               $sort: { createdAt: sort },
//             },
//             {
//               $facet: {
//                 metadata: [
//                   { $count: "total" },
//                   { $addFields: { page: Number(page) } },
//                   {
//                     $addFields: { totalPages: { $sum: [Number(page), Number(1)] } },
//                   },
//                   { $addFields: { hasPrevPage: false } },
//                   { $addFields: { prevPage: null } },
//                   { $addFields: { hasNextPage: false } },
//                   { $addFields: { nextPage: null } },
//                 ],
//                 data: [],
//               },
//             },
//           ])
//             .then((data) => {
//               if (!data[0].data.length) {
//                 throw {
//                   statusCode: constants.code.dataNotFound,
//                   msg: constants.message.dataNotFound,
//                 };
//               } else {
//                 res.status(constants.code.success).json({
//                   status: constants.status.statusTrue,
//                   userStatus: req.status,
//                   message: message.tablerequestListSuccess,
//                   metadata: data[0].metadata,
//                   data: data[0].data,
//                 });
//               }
//             })
//             .catch((err) => {
//               res.status(err.statusCode).json({
//                 status: constants.status.statusFalse,
//                 userStatus: req.status,
//                 message: err.msg,
//               });
//             });
//         }
//       } catch (err) {
//         res.status(constants.code.internalServerError).json({
//           status: constants.status.statusFalse,
//           userStatus: req.status,
//           message: err,
//         });
//       }

// }



const RequestList = async (req: any, res: Response, next: NextFunction) => {
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
                "outlet_detail._id": new mongoose.Types.ObjectId(
                  outletId._id
                ),
              },
            };
          } else {
            matchOutlet = {
              $match: {
                "outlet_detail._id": { $nin: [null] },
                isDeleted: false,
              },
            };
          }
          if (Number(req.query.limit) !== 0) {
            Request.aggregate([
              {
                $match: {
                  isDeleted: false,
                },
              },
              {
                $lookup: {
                  from: "users",
                  let: {
                    userId: "$userId",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$_id", "$$userId"] },
                            { $eq: ["$isDeleted", false] },
                          ],
                        },
                      },
                    },
                  ],
                  as: "user_detail",
                },
              },
              { $unwind: "$user_detail" },
              {
                $lookup: {
                  from: "tables",
                  let: {
                    tableId: "$tableId",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$_id", "$$tableId"] },
                            { $eq: ["$isDeleted", false] },
                          ],
                        },
                      },
                    },
                  ],
                  as: "table_detail",
                },
              },
              { $unwind: "$table_detail" },
              {
                $lookup: {
                  from: "outlets",
                  let: {
                    outletId: "$table_detail.outletId",
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
              matchOutlet,
              {
                $project: {
                  _id: 1,
                  name: "$user_detail.fullName",
                  createdAt: { $toLong: "$createdAt" },
                  bookingTime: "$table_detail.bookingTime",
                  guestNum: "$table_detail.guestNum",
                  bookingId: "$table_detail.tableBookingNum",
                  status: 1,
                },
              },
              {
                $match: {
                  $or: [
                    {
                      name: {
                        $regex: "^" + req.query.search + ".*",
                        $options: "i",
                      },
                    },
                    {
                      bookingId: {
                        $regex: "^" + req.query.search + ".*",
                        $options: "i",
                      },
                    },
                  ],
                },
              },
              {
                $match: {
                  $expr: {
                    $switch: {
                      branches: [
                        {
                          case: { $eq: [req.query.filter, "today"] },
                          then: {
                            $eq: [
                              {
                                $dateToString: { format: "%Y-%m-%d", date: "$bookingTime" }
                              },
                              {
                                $dateToString: { format: "%Y-%m-%d", date: new Date() }
                              }
                            ]
                          }
                        },
                        {
                          case: { $eq: [req.query.filter, "tomorrow"] },
                          then: {
                            $eq: [
                              {
                                $dateToString: { format: "%Y-%m-%d", date: "$bookingTime" }
                              },
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: { $add: [new Date(), 24 * 60 * 60 * 1000] }
                                }
                              }
                            ]
                          }
                        },
                        {
                          case: { $eq: [req.query.filter, "nextSevenDays"] },
                          then: {
                            $and: [
                              {
                                $lte: [
                                  { $dateToString: { format: "%Y-%m-%d", date: "$bookingTime" } },
                                  { $dateToString: { format: "%Y-%m-%d", date: { $add: [new Date(), 7 * 24 * 60 * 60 * 1000] } } }
                                ]
                              },
                              {
                                $gt: [
                                  { $dateToString: { format: "%Y-%m-%d", date: "$bookingTime" } },
                                  { $dateToString: { format: "%Y-%m-%d", date: new Date() } }
                                ]
                              }
                            ]
                          }
                        },
                        {
                          case: { $eq: [req.query.filter, "pastSevenDays"] },
                          then: {
                            $and: [
                              {
                                $lt: [
                                  { $dateToString: { format: "%Y-%m-%d", date: "$bookingTime" } },
                                  { $dateToString: { format: "%Y-%m-%d", date: new Date() } }
                                ]
                              },
                              {
                                $gte: [
                                  { $dateToString: { format: "%Y-%m-%d", date: "$bookingTime" } },
                                  { $dateToString: { format: "%Y-%m-%d", date: { $subtract: [new Date(), 7 * 24 * 60 * 60 * 1000] } } }
                                ]
                              }
                            ]
                          }
                        }
                      ],
                      default: {} 
                    }
                  }
                }
              },
           
              {
                $sort: {
                  createdAt:-1
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
                                  $ceil: { $divide: ["$total", limit] },
                                },
                                Number(1),
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
                    message: message.tablerequestListSuccess,
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
            Request.aggregate([
              {
                $match: {
                  isDeleted: false,
                },
              },
              {
                $lookup: {
                  from: "users",
                  let: {
                    userId: "$userId",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$_id", "$$userId"] },
                            { $eq: ["$isDeleted", false] },
                          ],
                        },
                      },
                    },
                  ],
                  as: "user_detail",
                },
              },
              { $unwind: "$user_detail" },
              {
                $lookup: {
                  from: "tables",
                  let: {
                    tableId: "$tableId",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$_id", "$$tableId"] },
                            { $eq: ["$isDeleted", false] },
                          ],
                        },
                      },
                    },
                  ],
                  as: "table_detail",
                },
              },
              { $unwind: "$table_detail" },

              {
                $lookup: {
                  from: "outlets",
                  let: {
                    outletId: "$table_detail.outletId",
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
              matchOutlet,


              {
                $project: {
                  _id: 1,
                  name: "$user_detail.fullName",
                  createdAt: { $toLong: "$createdAt" },
                  bookingTime: "$table_detail.bookingTime",
                  guestNum: "$table_detail.guestNum",
                  bookingId: "$table_detail.tableBookingNum",
                  status: 1
                },
              },
              {
                $match: {
                  $or: [
                    {
                      name: {
                        $regex: "^" + req.query.search + ".*",
                        $options: "i",
                      },
                    },
                    {
                      bookingId: {
                        $regex: "^" + req.query.search + ".*",
                        $options: "i",
                      },
                    },
                  ],
                },
              },
              {
                $match: {
                  $expr: {
                    $switch: {
                      branches: [
                        {
                          case: { $eq: [req.query.filter, "today"] },
                          then: {
                            $eq: [
                              {
                                $dateToString: { format: "%Y-%m-%d", date: "$bookingTime" }
                              },
                              {
                                $dateToString: { format: "%Y-%m-%d", date: new Date() }
                              }
                            ]
                          }
                        },
                        {
                          case: { $eq: [req.query.filter, "tomorrow"] },
                          then: {
                            $eq: [
                              {
                                $dateToString: { format: "%Y-%m-%d", date: "$bookingTime" }
                              },
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: { $add: [new Date(), 24 * 60 * 60 * 1000] }
                                }
                              }
                            ]
                          }
                        },
                        {
                          case: { $eq: [req.query.filter, "nextSevenDays"] },
                          then: {
                            $and: [
                              {
                                $lte: [
                                  { $dateToString: { format: "%Y-%m-%d", date: "$bookingTime" } },
                                  { $dateToString: { format: "%Y-%m-%d", date: { $add: [new Date(), 7 * 24 * 60 * 60 * 1000] } } }
                                ]
                              },
                              {
                                $gt: [
                                  { $dateToString: { format: "%Y-%m-%d", date: "$bookingTime" } },
                                  { $dateToString: { format: "%Y-%m-%d", date: new Date() } }
                                ]
                              }
                            ]
                          }
                        },
                        {
                          case: { $eq: [req.query.filter, "pastSevenDays"] },
                          then: {
                            $and: [
                              {
                                $lt: [
                                  { $dateToString: { format: "%Y-%m-%d", date: "$bookingTime" } },
                                  { $dateToString: { format: "%Y-%m-%d", date: new Date() } }
                                ]
                              },
                              {
                                $gte: [
                                  { $dateToString: { format: "%Y-%m-%d", date: "$bookingTime" } },
                                  { $dateToString: { format: "%Y-%m-%d", date: { $subtract: [new Date(), 7 * 24 * 60 * 60 * 1000] } } }
                                ]
                              }
                            ]
                          }
                        }
                      ],
                      default: {} 
                    }
                  }
                }
              },
           
              {
                $sort: {
                  createdAt:-1
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
                if (!data) {
                  throw {
                    statusCode: constants.code.dataNotFound,
                    msg: constants.message.dataNotFound,
                  };
                } else {
                  res.status(constants.code.success).json({
                    status: constants.status.statusTrue,
                    userStatus: req.status,
                    message: message.tablerequestListSuccess,
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
      .catch((err) => {
        res.status(constants.code.preconditionFailed).json({
          status: constants.status.statusFalse,
          userStatus: req.status,
          message: err.message,
        });
      });
  } catch (error) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: error,
    });
  }
};

const acceptRequest = async (req: any, res: Response, next: NextFunction) => {
  try {
    Request.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.request_id),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "tables",
          let: {
            tableId: "$tableId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$tableId"] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
          ],
          as: "table_detail",
        },
      },
      {
        $unwind: {
          path: "$table_detail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "outlets",
          let: {
            outletId: "$table_detail.outletId",
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
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          let: {
            userId: "$userId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$userId"] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
          ],
          as: "user_detail",
        },
      },
      {
        $unwind: {
          path: "$user_detail",
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
      .then((request_detail: any) => {
        if (!request_detail.length) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          Table.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(
                request_detail[0].table_detail._id
              ),
              isDeleted: false,
            },
            { is_approved: true },
            { new: true }
          )
            .then((data) => {
              if (!data) {
                throw {
                  statusCode: constants.code.internalServerError,
                  msg: constants.message.internalServerError,
                };
              } else {
                Request.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(request_detail[0]._id),
                    isDeleted: false,
                  },
                  { status: constants.requestStatus.approved },
                  { new: true }
                )
                  .then(async (data) => {
                    if (!data) {
                      throw {
                        statusCode: constants.code.internalServerError,
                        msg: constants.message.internalServerError,
                      };
                    } else {

                      // let token:any = await Device.findOne({userId:new mongoose.Types.ObjectId(request_detail[0].user_detail._id)}, { fcm_Token: 1});
                      // let fcmToken:any = token.fcm_Token
                      // await firebaseMessaging.send({
                      //  token:fcmToken,
                      //   notification: {
                      //     title: `table booking request accepted`,
                      //     body: `your request for table booking at ${request_detail[0].outlet_detail.name} accepted`
                      //   },
                      // });
                      const payload = {
                        to: request_detail[0].user_detail.email.value,
                        title: constants.emailTitle.acceptRequest,
                        data: {
                          name: request_detail[0].user_detail.fullName,
                          outletName: request_detail[0].outlet_detail.name,
                          date: await convertToIST(request_detail[0].table_detail.bookingTime)
                        },
                      };

                      await sendMail(payload);
                      res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.requestAccepted,
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
            })
            .catch((err) => {
              res.status(err.statusCode).json({
                status: constants.status.statusFalse,
                userStatus: req.status,
                message: err.msg,
              });
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
};

const rejectRequest = async (req: any, res: Response, next: NextFunction) => {
  try {
    Request.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.request_id),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "tables",
          let: {
            tableId: "$tableId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$tableId"] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
          ],
          as: "table_detail",
        },
      },
      {
        $unwind: {
          path: "$table_detail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "outlets",
          let: {
            outletId: "$table_detail.outletId",
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
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          let: {
            userId: "$userId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$userId"] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
          ],
          as: "user_detail",
        },
      },
      {
        $unwind: {
          path: "$user_detail",
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
      .then((request_detail: any) => {
        if (!request_detail.length) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          Table.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(
                request_detail[0].table_detail._id
              ),
              isDeleted: false,
            },
            { is_approved: false },
            { new: true }
          )
            .then((data) => {
              if (!data) {
                throw {
                  statusCode: constants.code.internalServerError,
                  msg: constants.message.internalServerError,
                };
              } else {
                Request.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(request_detail[0]._id),
                    isDeleted: false,
                  },
                  { 
                    status: constants.requestStatus.rejected,
                    reason: req.body.reason },
                  { new: true }
                )
                  .then(async (data) => {
                    if (!data) {
                      throw {
                        statusCode: constants.code.internalServerError,
                        msg: constants.message.internalServerError,
                      };
                    } else {
                      const payload = {
                        to: request_detail[0].user_detail.email.value,
                        title: constants.emailTitle.rejectRequest,
                        data: {
                          name: request_detail[0].user_detail.fullName,
                          outletName: request_detail[0].outlet_detail.name,
                          date: await convertToIST(request_detail[0].table_detail.bookingTime)
                        },
                      };

                      await sendMail(payload);
                      res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.requestRejected,
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
            })
            .catch((err) => {
              res.status(err.statusCode).json({
                status: constants.status.statusFalse,
                userStatus: req.status,
                message: err.msg,
              });
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
};


const requestDetail = async (req: any, res: Response, next: NextFunction) => {
  try {

    Request.findOne({ _id: new mongoose.Types.ObjectId(req.params.request_id), isDeleted: false })
      .then((requestData) => {
        if (!requestData) {
          throw {
            statusCode: constants.code.dataNotFound,
            message: constants.message.dataNotFound,
          };
        } else {

          Request.aggregate([
            {
              $match: {
                _id: new mongoose.Types.ObjectId(req.params.request_id),
                isDeleted: false,
              },
            },
            {
              $lookup: {
                from: "tables",
                let: {
                  tableId: "$tableId",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$_id", "$$tableId"] },
                          { $eq: ["$isDeleted", false] },
                        ],
                      },
                    },
                  },
                ],
                as: "table_detail",
              },
            },
            {
              $unwind: {
                path: "$table_detail",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "outlets",
                let: {
                  outletId: "$table_detail.outletId",
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
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "addresses",
                let: {
                  outletId: "$outlet_detail._id",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$OutletId", "$$outletId"] },
                          { $eq: ["$isDeleted", false] },
                        ],
                      },
                    },
                  },
                ],
                as: "address_detail",
              },
            },
            {
              $unwind: {
                path: "$address_detail",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $lookup: {
                from: "users",
                let: {
                  userId: "$userId",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$_id", "$$userId"] },
                          { $eq: ["$isDeleted", false] },
                        ],
                      },
                    },
                  },
                ],
                as: "user_detail",
              },
            },
            {
              $unwind: {
                path: "$user_detail",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $project: {
                _id: 1,
                userReason:1,
                bookingId: "$table_detail.tableBookingNum",
                name: "$user_detail.fullName",
                outletName: "$outlet_detail.name",
                area: "$address_detail.address.line_one",
                time: "$table_detail.bookingTime",
                guestNum: "$table_detail.guestNum",
                status: 1
              },
            },
          ]).then((data: any) => {
            if (!data) {
              throw {
                statusCode: constants.code.dataNotFound,
                msg: constants.message.dataNotFound,
              };
            } else {
              res.status(constants.code.success).json({
                status: constants.status.statusTrue,
                userStatus: req.status,
                message: message.requestDetail,
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
      message: err
    })
  }
}





export default {
  //tableBookingRequest,
  acceptRequest,
  rejectRequest,
  RequestList,
  requestDetail
}