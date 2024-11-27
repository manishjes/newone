import {  Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import message from "./dashboardConstants";
import Review from "../../../models/review";
import Request from "../../../models/request";
import Outlet from "../../../models/outlet";
import User from "../../../models/user";
import {
  createSlug,
  imageUrl,
  removeImage,
  getFileName,
} from "../../../helpers/helper";
import mongoose from "mongoose";
import Table from "../../../models/table";
import Menu from "../../../models/menu";
import Item from "../../../models/item";

//optional chaining
// const dashboardApi = async(req: any, res: Response, next: NextFunction) => {
//     try {
  
//       const outletId: any = await Outlet.findOne(
//         { managerId: new mongoose.Types.ObjectId(req.id) },
//         { _id: 1 }
//       )
  
//       const totalItems = await Menu.countDocuments({
//         outletId: new mongoose.Types.ObjectId(outletId._id),
//         isDeleted: false
//       });

//       const totalItem = await Item.countDocuments({
//         isDeleted: false
//       })
  
//       res.status(constants.code.success).json({
//         status: constants.status.statusTrue,
//         userStatus: req.status,
//         message: constants.message.success,
//         data: {
//           items: totalItems,
//           item: totalItem
//         }
//       });
//     } catch (error) {
//       res.status(constants.code.internalServerError).json({
//         status: constants.status.statusFalse,
//         userStatus: req.status,
//         message: error,
//       });
//     }
//   }

const dashboardApi = async (req: any, res: Response, next: NextFunction) => {
  try {
    const customer = await User.countDocuments({
      role: constants.accountLevel.user,
      isDeleted: false,
    })

    const userData: any = await User.findOne(
      { _id: new mongoose.Types.ObjectId(req.id) },
      { _id: 1, role: 1 }
    )

    const outletId: any = await Outlet.findOne(
      { managerId: new mongoose.Types.ObjectId(req.id) },
      { _id: 1 }
    );

    let totalItems = 0;
    let totalBookings = 0;

    if (userData.role === constants.accountLevel.manager) {
      totalItems = (await Menu.aggregate([
        {
          $match: {
            outletId: new mongoose.Types.ObjectId(outletId._id),
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: "$itemId",
            count: { $sum: 1 },
          },
        },
        {
          $count: "count",
        },
      ]))?.[0]?.count || 0;

      totalBookings = await Table.countDocuments({
        isDeleted: false,
        outletId: new mongoose.Types.ObjectId(outletId._id)
      }) || 0;
    } else {
      totalItems = await Item.countDocuments({
        isDeleted: false
      }) || 0;

      totalBookings = await Table.countDocuments({
        isDeleted: false
      }) || 0;
    }

    res.status(constants.code.success).json({
      status: constants.status.statusTrue,
      userStatus: req.status,
      message: constants.message.success,
      data: {
        items: totalItems,
        customers: customer,
        bookings: totalBookings
      },
    });
  } catch (error) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: error,
    });
  }
};
// const dashboardApi = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     const customer = await User.countDocuments({
//       role: constants.accountLevel.user,
//       isDeleted: false,
//     })

//     let totalItems:any = 0;
//     let totalBookings = 0;
//     const userData: any = await User.findOne(
//       { _id: new mongoose.Types.ObjectId(req.id) },
//       { _id: 1, role: 1 }
//     )

//     const outletId: any = await Outlet.findOne(
//       { managerId: new mongoose.Types.ObjectId(req.id) },
//       { _id: 1 }
//     );

//     if (userData.role === constants.accountLevel.manager) {
//       try {
//         totalItems = await Menu.aggregate([
//           {
//             $match: {
//               outletId: new mongoose.Types.ObjectId(outletId._id),
//               isDeleted: false,
//             },
//           },
//           {
//             $group: {
//               _id: "$itemId",
//               count: { $sum: 1 },
//             },
//           },
//           {
//             $count: "count",
//           },
//         ]);

//         totalItems = totalItems[0].count;
//       } catch (error) {
//         totalItems = 0;
//       }

//       try {
//         totalBookings = await Table.countDocuments({
//           isDeleted: false,
//           outletId: new mongoose.Types.ObjectId(outletId._id)
//         })
//       } catch (error) {
//         totalBookings = 0;
//       }
//     } else {
//       try {
//         totalItems = await Item.countDocuments({
//           isDeleted: false
//         });
//       } catch (error) {
//         totalItems = 0;
//       }

//       try {
//         totalBookings = await Table.countDocuments({
//           isDeleted: false
//         });
//       } catch (error) {
//         totalBookings = 0;
//       }
//     }

//     res.status(constants.code.success).json({
//       status: constants.status.statusTrue,
//       userStatus: req.status,
//       message: constants.message.success,
//       data: {
//         items: totalItems,
//         customers: customer,
//         bookings: totalBookings
//       },
//     });
//   } catch (error) {
//     res.status(constants.code.internalServerError).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: error,
//     });
//   }
// };


const listReview = async(req:any, res:Response, next:NextFunction)=>{
    try{

        const sort = req.query.sort === "recent" ? -1 : 1;
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
                        as: "outlet_detail",
                      },
                    },
                    matchOutlet,
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
                        $sort: { createdAt: sort },
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
                      message: message.reviewList,
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

            })
            .catch((err) => {
              res.status(constants.code.preconditionFailed).json({
                status: constants.status.statusFalse,
                userStatus: req.status,
                message: err.message,
              });
            });
    } catch(err){
        res.status(constants.code.internalServerError).json({
            status: constants.status.statusFalse,
             userStatus: req.status,
             message: err,
        })
        
    }
}

const recentBookings = async(req:any, res:Response, next:NextFunction)=>{

    try{
        await User.findOne({
            _id: new mongoose.Types.ObjectId(req.id),
            role: constants.accountLevel.manager
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


                  Table.aggregate([
                    {
                      $match: {
                        isDeleted: false,
                        outletId: new mongoose.Types.ObjectId(outletId._id)
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
                        from: "requests",
                        let: {
                          tableId: "$_id",
                        },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $and: [
                                  { $eq: ["$tableId", "$$tableId"] },
                                  { $eq: ["$isDeleted", false] },
                                ],
                              },
                            },
                          },
                        ],
                        as: "request_detail",
                      },
                    },
                    { $unwind: "$request_detail" },
      
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
                      $project: {
                        _id: 1,
                        requestId: "$request_detail._id",
                        name: "$user_detail.fullName",
                        createdAt: { $toLong: "$createdAt" },
                        bookingTime: 1,
                        guestNum: 1,
                        tableBookingNum: 1,
                        status: "$request_detail.status"
                      },
                    },
                    {
                        $sort:{
                            createdAt: -1
                        }
                    }
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
                      message: message.bookingList,
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

        })
        .catch((err) => {
          res.status(constants.code.preconditionFailed).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: err.message,
          });
        });
    } catch(err){
        res.status(constants.code.internalServerError).json({
            status: constants.status.statusFalse,
             userStatus: req.status,
             message: err,
        })
        
    }
}


export default {
    listReview,
    recentBookings,
    dashboardApi
}