import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import message from "./userConstant";
import mongoose from "mongoose";
import User from "../../../models/user";
import Table from "../../../models/table";
import RewardPOint from "../../../models/rewardPoint";
import {
  createPassword,
  getFileName,
  getUsername,
  hashPassword,
  photoUrl,
  removePhoto,
  toLowerCase,
} from "../../../helpers/helper";
import sendMail from "../../../helpers/mail";

// const create = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     //check manager exists for the outlet or not
//     User.findOne({
//       $and: [
//         { role: constants.accountLevel.manager },
//         { outletId: new mongoose.Types.ObjectId(req.body.outletId) },
//       ],
//     })
//       .then(async (managerData) => {
//         //if manager does not exists for the outlet
//         if (!managerData) {
//           User.create({
//             fname: req.body.first_name,
//             lname: req.body.last_name,
//             email: {
//               value: await toLowerCase(req.body.email),
//               is_verified: false,
//             },
//             username: await getUsername(req.body.email),
//             password: await hashPassword(
//               await createPassword(req.body.first_name, req.body.date_of_birth)
//             ),
//             dob: req.body.date_of_birth,
//             phone: { value: req.body.phone, is_verified: false },
//             gender: req.body.gender,
//             role: req.body.role,
//             outletId: new mongoose.Types.ObjectId(req.body.outletId),
//             privileges: req.body.privileges,
//             createdBy: req.id,
//           })
//             .then(async (data) => {
//               if (!data) {
//                 throw {
//                   statusCode: constants.code.dataNotFound,
//                   message: constants.message.dataNotFound,
//                 };
//               } else {

//                 const payload = {
//                   to: data?.email?.value,
//                   title: constants.emailTitle.credential,
//                   data: {
//                     name: data.fname,
//                     email: data?.email?.value,
//                   },
//                 };
//                 await sendMail(payload);

//                 res.status(constants.code.success).json({
//                   status: constants.status.statusTrue,
//                   userStatus: req.status,
//                   message: message.userAddSuccess,
//                 });
//               }
//             })
//             .catch((err) => {
//               res
//                 .status(err.statusCode || constants.code.preconditionFailed)
//                 .json({
//                   status: constants.status.statusFalse,
//                   userStatus: req.status,
//                   message: err.message,
//                 });
//             });
//         } else {
//           // if outlet has existing manager and we are adding new manager , throw error
//           if (req.body.role === constants.accountLevel.manager) {
//             throw {
//               statusCode: constants.code.preconditionFailed,
//               message: message.managerExists,
//             };
//           } else {
//             //if we are adding another roles, apart from manager
//             User.create({
//               fname: req.body.first_name,
//             lname: req.body.last_name,
//             email: {
//               value: await toLowerCase(req.body.email),
//               is_verified: false,
//             },
//             username: await getUsername(req.body.email),
//             password: await hashPassword(
//               await createPassword(req.body.first_name, req.body.date_of_birth)
//             ),
//             dob: req.body.date_of_birth,
//             phone: { value: req.body.phone, is_verified: false },
//             gender: req.body.gender,
//             role: req.body.role,
//             privileges: req.body.privileges,
//             createdBy: req.id,
//             })
//               .then(async (userData) => {
//                 if (!userData) {
//                   throw {
//                     status: constants.code.dataNotFound,
//                     message: constants.message.dataNotFound,
//                   };
//                 } else {
//                   const payload = {
//                     to: userData?.email?.value,
//                     title: constants.emailTitle.credential,
//                     data: {
//                       name: userData.fname,
//                       email: userData?.email?.value,
//                     },
//                   };
//                   await sendMail(payload);
//                   res.status(constants.code.success).json({
//                     status: constants.status.statusTrue,
//                     userStatus: req.status,
//                     message: constants.message.success,
//                   });
//                 }
//               })
//               .catch((err) => {
//                 res.status(err.statusCode).json({
//                   status: constants.status.statusFalse,
//                   userStatus: req.status,
//                   message: err.message,
//                 });
//               });
//           }
//         }
//       })
//       .catch((err) => {
//         res.status(err.statusCode).json({
//           status: constants.status.statusFalse,
//           userStatus: req.status,
//           message: err.message,
//         });
//       });
//   } catch (err) {
//     res.status(constants.code.internalServerError).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: err,
//     });
//   }
// };

const create = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.create({
      fname: req.body.first_name,
      lname: req.body.last_name,
      email: {
        value: await toLowerCase(req.body.email),
        is_verified: false,
      },
      username: await getUsername(req.body.email),
      password: await hashPassword(
        await createPassword(req.body.first_name, req.body.date_of_birth)
      ),
      phone: { value: req.body.phone, is_verified: false },
      gender: req.body.gender,
      dob: req.body.date_of_birth,
      role: req.body.role,
      privileges: req.body.privileges,
      is_verified: false,
      createdBy: req.id,
    })
      .then(async (data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          const payload = {
            to: data?.email?.value,
            title: constants.emailTitle.credential,
            data: {
              name: data.fname,
              email: data?.email?.value,
            },
          };

          await sendMail(payload);

          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: message.userAddSuccess,
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



// const create = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     //check manager exists for the restaurent or not
//     User.findOne({
//       $and: [
//         { role: constants.accountLevel.manager },
//         { restaurantId: new mongoose.Types.ObjectId(req.body.restaurantId) },
//       ],
//     })
//       .then(async (managerData) => {
//        if(managerData){
//         throw{
//           statusCode: constants.code.preconditionFailed,
//           message: message.managerExists,
//         }
//        }
//        else{
//             User.create({
//       fname: req.body.first_name,
//       lname: req.body.last_name,
//       email: {
//         value: await toLowerCase(req.body.email),
//         is_verified: false,
//       },
//       username: await getUsername(req.body.email),
//       password: await hashPassword(
//         await createPassword(req.body.first_name, req.body.date_of_birth)
//       ),
//       dob: req.body.date_of_birth,
//       phone: { value: req.body.phone, is_verified: false },
//       gender: req.body.gender,
//       restaurantId: new mongoose.Types.ObjectId(req.body.restaurantId),
//       role: req.body.role,
//       createdBy: req.id,
//     })
//       .then(async (data) => {
//         if (!data) {
//           throw {
//             statusCode: constants.code.dataNotFound,
//             msg: constants.message.dataNotFound,
//           };
//         } else {
// const payload = {
//   to: data?.email?.value,
//   title: constants.emailTitle.credential,
//   data: {
//     name: data.fname,
//     email: data?.email?.value,
//   },
// };

//           await sendMail(payload);

//           res.status(constants.code.success).json({
//             status: constants.status.statusTrue,
//             userStatus: req.status,
//             message: message.userAddSuccess,
//           });
//         }
//       })
//       .catch((err) => {
//         res.status(err.statusCode).json({
//           status: constants.status.statusFalse,
//           userStatus: req.status,
//           message: err.msg,
//         });
//       });
//        }

//       })
//       .catch((err) => {
//         res.status(err.statusCode).json({
//           status: constants.status.statusFalse,
//           userStatus: req.status,
//           message: err.message,
//         });
//       });
//   } catch (err) {
//     res.status(constants.code.internalServerError).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: err,
//     });
//   }
// };

// const update = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     User.findOne({
//       _id: new mongoose.Types.ObjectId(req.params.user_id),
//       role: { $nin: [constants.accountLevel.superAdmin] },
//       isDeleted: false,
//     })
//       .then(async (data) => {
//         if (!data) {
//           throw {
//             statusCode: constants.code.dataNotFound,
//             msg: constants.message.dataNotFound,
//           };
//         } else {
//           User.exists({
//             "email.value": await toLowerCase(req.body.email),
//             _id: { $nin: [new mongoose.Types.ObjectId(req.params.user_id)] },
//           })
//             .then((data) => {
//               if (data) {
//                 throw {
//                   statusCode: constants.code.preconditionFailed,
//                   msg: constants.message.emailTaken,
//                 };
//               } else {
//                 User.exists({
//                   "phone.value": req.body.phone,
//                   _id: {
//                     $nin: [new mongoose.Types.ObjectId(req.params.user_id)],
//                   },
//                 })
//                   .then(async (data) => {
//                     if (data) {
//                       throw {
//                         statusCode: constants.code.preconditionFailed,
//                         msg: constants.message.phoneTaken,
//                       };
//                     } else {
//                       if (req.body.role != constants.accountLevel.manager) {
//                         User.findOneAndUpdate(
//                           {
//                             _id: new mongoose.Types.ObjectId(req.params.user_id),
//                             role: { $nin: [constants.accountLevel.superAdmin] },
//                             isDeleted: false,
//                           },
//                           {
//                             fname: req.body.first_name,
//                             lname: req.body.last_name,
//                             email: {
//                               value: await toLowerCase(req.body.email),
//                               is_verified: false,
//                             },
//                             phone: {
//                               value: req.body.phone,
//                               is_verified: false,
//                             },
//                             gender: req.body.gender,
//                             dob: req.body.date_of_birth,
//                             role: req.body.role,
//                             is_verified: false,
//                             updatedBy: req.id,
//                           },
//                           { new: true }
//                         )
//                           .then((data) => {
//                             if (!data) {
//                               throw {
//                                 statusCode: constants.code.dataNotFound,
//                                 msg: constants.message.dataNotFound,
//                               };
//                             } else {
//                               res.status(constants.code.success).json({
//                                 status: constants.status.statusTrue,
//                                 userStatus: req.status,
//                                 message: message.userUpdateSuccess,
//                               });
//                             }
//                           })
//                           .catch((err) => {
//                             res.status(err.statusCode).json({
//                               status: constants.status.statusFalse,
//                               userStatus: req.status,
//                               message: err.msg,
//                             });
//                           });
//                       } 
//                       else{

//                       User.findOne({
//                         _id: {
//                           $nin: [
//                             new mongoose.Types.ObjectId(req.params.user_id),
//                           ],
//                         },
//                         role: constants.accountLevel.manager,
//                         restaurantId: new mongoose.Types.ObjectId(
//                           req.body.restaurantId
//                         ),
//                       })
//                         .then(async (managerExists) => {
//                           if (managerExists) {
//                             throw {
//                               statusCode: constants.code.preconditionFailed,
//                               message: message.managerExists,
//                             };
//                           } else {
//                             User.findOneAndUpdate(
//                               {
//                                 _id: new mongoose.Types.ObjectId(
//                                   req.params.user_id
//                                 ),
//                                 role: {
//                                   $nin: [constants.accountLevel.superAdmin],
//                                 },
//                                 isDeleted: false,
//                               },
//                               {
//                                 fname: req.body.first_name,
//                                 lname: req.body.last_name,
//                                 email: {
//                                   value: await toLowerCase(req.body.email),
//                                   is_verified: false,
//                                 },
//                                 phone: {
//                                   value: req.body.phone,
//                                   is_verified: false,
//                                 },
//                                 gender: req.body.gender,
//                                 restaurantId: new mongoose.Types.ObjectId(
//                                   req.body.restaurantId
//                                 ),
//                                 dob: req.body.date_of_birth,
//                                 role: req.body.role,
//                                 is_verified: false,
//                                 updatedBy: req.id,
//                               },
//                               { new: true }
//                             )
//                               .then((data) => {
//                                 if (!data) {
//                                   throw {
//                                     statusCode: constants.code.dataNotFound,
//                                     msg: constants.message.dataNotFound,
//                                   };
//                                 } else {
//                                   res.status(constants.code.success).json({
//                                     status: constants.status.statusTrue,
//                                     userStatus: req.status,
//                                     message: message.userUpdateSuccess,
//                                   });
//                                 }
//                               })
//                               .catch((err) => {
//                                 res.status(err.statusCode).json({
//                                   status: constants.status.statusFalse,
//                                   userStatus: req.status,
//                                   message: err.msg,
//                                 });
//                               });
//                           }
//                         })
//                         .catch((err) => {
//                           res.status(err.statusCode).json({
//                             status: constants.status.statusFalse,
//                             userStatus: req.status,
//                             message: err.message,
//                           });
//                         });

//                       }

//                     }
//                   })
//                   .catch((err) => {
//                     res.status(err.statusCode).json({
//                       status: constants.status.statusFalse,
//                       userStatus: req.status,
//                       message: err.msg,
//                     });
//                   });
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
//       })
//       .catch((err) => {
//         res.status(err.statusCode).json({
//           status: constants.status.statusFalse,
//           userStatus: req.status,
//           message: err.msg,
//         });
//       });
//   } catch (err) {
//     res.status(constants.code.internalServerError).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: err,
//     });
//   }
// };



const update = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOne({
      _id: new mongoose.Types.ObjectId(req.params.user_id),
      role: { $nin: [constants.accountLevel.superAdmin] },
      isDeleted: false,
    })
      .then(async (data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          User.exists({
            "email.value": await toLowerCase(req.body.email),
            _id: { $nin: [new mongoose.Types.ObjectId(req.params.user_id)] },
          })
            .then((data) => {
              if (data) {
                throw {
                  statusCode: constants.code.preconditionFailed,
                  msg: constants.message.emailTaken,
                };
              } else {
                User.exists({
                  "phone.value": req.body.phone,
                  _id: {
                    $nin: [new mongoose.Types.ObjectId(req.params.user_id)],
                  },
                })
                  .then(async (data) => {
                    if (data) {
                      throw {
                        statusCode: constants.code.preconditionFailed,
                        msg: constants.message.phoneTaken,
                      };
                    } else {
                      User.findOneAndUpdate(
                        {
                          _id: new mongoose.Types.ObjectId(req.params.user_id),
                          role: { $nin: [constants.accountLevel.superAdmin] },
                          isDeleted: false,
                        },
                        {
                          fname: req.body.first_name,
                          lname: req.body.last_name,
                          email: {
                            value: await toLowerCase(req.body.email),
                            is_verified: false,
                          },
                          phone: {
                            value: req.body.phone,
                            is_verified: false,
                          },
                          gender: req.body.gender,
                          dob: req.body.date_of_birth,
                          role: req.body.role,
                          privileges: req.body.privileges,
                          is_verified: false,
                          updatedBy: req.id,
                        },
                        { new: true }
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
                              message: message.userUpdateSuccess,
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

const usersList = async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;
    const sort = req.query.sort === "desc" ? -1 : 1;

    if (Number(req.query.limit) !== 0) {
      User.aggregate([
        {
          $match: {
            _id: { $nin: [new mongoose.Types.ObjectId(req.id)] },
            role: { $nin: [constants.accountLevel.superAdmin, constants.accountLevel.user] },
            isDeleted: false,
          },
        },

        {
          $project: {
            _id: 1,
            profilePicture: 1,
            profilePictureUrl: 1,
            fname: 1,
            lname: 1,
            username: 1,
            email: 1,
            phone: 1,
            dob: { $toLong: "$dob" },
            gender: 1,
            status: 1,
            isDeleted: 1,
            role: 1,
            createdAt: { $toLong: "$createdAt" },
          },
        },
        {
          $match: {
            $or: [
              {
                fname: {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },
              {
                lname: {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },

              {
                "email.value": {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },
              {
                "phone.value": {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },
            ],
          },
        },
        {
          $sort: { createdAt: sort },
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
              message: message.userListSuccess,
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
      User.aggregate([
        {
          $match: {
            _id: { $nin: [new mongoose.Types.ObjectId(req.id)] },
            role: { $nin: [constants.accountLevel.superAdmin, constants.accountLevel.user] },
            isDeleted: false,
          },
        },

        {
          $project: {
            _id: 1,
            profilePicture: 1,
            profilePictureUrl: 1,
            fname: 1,
            lname: 1,
            username: 1,
            email: 1,
            phone: 1,
            dob: { $toLong: "$dob" },
            gender: 1,
            status: 1,
            isDeleted: 1,
            role: 1,
            createdAt: { $toLong: "$createdAt" },
          },
        },
        {
          $match: {
            $or: [
              {
                fname: {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },
              {
                lname: {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },

              {
                "email.value": {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },
              {
                "phone.value": {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },
            ],
          },
        },
        {
          $sort: { createdAt: sort },
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
              message: message.userListSuccess,
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
};

const customerList = async (req: any, res: Response, next: NextFunction) => {

  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;
    const sort = req.query.sort === "desc" ? -1 : 1;

    if (Number(req.query.limit) !== 0) {
      User.aggregate([
        {
          $match: {
            role: constants.accountLevel.user,
            isDeleted: false,
          },
        },

        {
          $project: {
            _id: 1,
            profilePicture: 1,
            profilePictureUrl: 1,
            fullName: 1,
            username: 1,
            email: 1,
            phone: 1,
            dob: { $toLong: "$dob" },
            gender: 1,
            status: 1,
            isDeleted: 1,
            role: 1,
            createdAt: { $toLong: "$createdAt" },
          },
        },
        {
          $match: {
            $or: [
              {
                fullName: {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },


              {
                "email.value": {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },
              {
                "phone.value": {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },
            ],
          },
        },
        {
          $sort: { createdAt: sort },
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
              message: message.userListSuccess,
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
      User.aggregate([
        {
          $match: {
            role: constants.accountLevel.user,
            isDeleted: false,
          },
        },

        {
          $project: {
            _id: 1,
            profilePicture: 1,
            profilePictureUrl: 1,
            fullName: 1,
            username: 1,
            email: 1,
            phone: 1,
            dob: { $toLong: "$dob" },
            gender: 1,
            status: 1,
            isDeleted: 1,
            role: 1,
            createdAt: { $toLong: "$createdAt" },
          },
        },
        {
          $match: {
            $or: [
              {
                fname: {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },
              {
                lname: {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },

              {
                "email.value": {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },
              {
                "phone.value": {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },
            ],
          },
        },
        {
          $sort: { createdAt: sort },
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
              message: message.userListSuccess,
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


const detail = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOne({
      _id: new mongoose.Types.ObjectId(req.params.user_id),
      role: { $nin: [constants.accountLevel.superAdmin] },
      isDeleted: false,
    })
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          User.aggregate([
            {
              $match: {
                _id: new mongoose.Types.ObjectId(req.params.user_id),
                isDeleted: false,
              },
            },


            {
              $project: {
                _id: 1,
                fname: 1,
                lname: 1,
                username: 1,
                email: 1,
                phone: 1,
                dob: { $toLong: "$dob" },
                gender: 1,
                privileges: 1,
                role: 1,

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
                  message: message.userDetailSuccess,
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

const customerDetail = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOne({
      _id: new mongoose.Types.ObjectId(req.params.user_id),
      role: constants.accountLevel.user,
      isDeleted: false,
    })
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          User.aggregate([
            {
              $match: {
                _id: new mongoose.Types.ObjectId(req.params.user_id),
                isDeleted: false,
              },
            },
            {
              $lookup: {
                from: "rewardpoints",
                let: {
                  userId: "$_id",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$userId", "$$userId"] },
                          { $eq: ["$isDeleted", false] },
                        ],
                      },
                    },
                  },
                ],
                as: "reward_detail",
              },
            },
            {
              $unwind: {
                path: "$reward_detail",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$_id",
                fullName: { $first: "$fullName" },
                username: { $first: "$username" },
                email: { $first: "$email" },
                phone: { $first: "$phone" },
                dob: { $first: "$dob" },
                gender: { $first: "$gender" },
                profilePicture: { $first: "$profilePicture" },
                existingPOints: { $first: "$points" },
                totalPoints: {
                  $sum: {
                    $cond: { if: { $eq: ["$reward_detail.pointStatus", "added"] }, then: "$reward_detail.points", else: 0 },
                  },
                },
                usedPoints: {
                  $sum: {
                    $cond: { if: { $eq: ["$reward_detail.pointStatus", "deduction"] }, then: "$reward_detail.points", else: 0 },
                  },
                }
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
                  message: message.customerDetailSuccess,
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

const changeProfilePicture = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    User.findOne({
      _id: new mongoose.Types.ObjectId(req.params.user_id),
      role: { $nin: [constants.accountLevel.superAdmin] },
      isDeleted: false,
    })
      .then(async (data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else if (!data.profilePicture) {
          User.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(req.params.user_id),
              role: { $nin: [constants.accountLevel.superAdmin] },
              isDeleted: false,
            },
            {
              profilePicture: await photoUrl(
                req.headers.host,
                req.file.filename
              ),
            },
            { new: true }
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
                  message: message.userPictureSuccess,
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
          await removePhoto(await getFileName(data.profilePicture));
          User.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(req.params.user_id),
              role: { $nin: [constants.accountLevel.superAdmin] },
              isDeleted: false,
            },
            {
              profilePicture: await photoUrl(
                req.headers.host,
                req.file.filename
              ),
            },
            { new: true }
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
                  message: message.userPictureSuccess,
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

const resetPassword = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.params.user_id),
        role: { $nin: [constants.accountLevel.superAdmin] },
        isDeleted: false,
      },
      {
        password: await hashPassword(req.body.password),
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
            message: constants.message.passChange,
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

const manageAccount = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.params.user_id),
        role: { $nin: [constants.accountLevel.superAdmin] },
        isDeleted: false,
      },
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    )
      .then((data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else if (!data.status) {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: message.accDeactivated,
          });
        } else {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: message.accActivated,
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

const deleteAccount = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.body.is_delete) {
      throw {
        statusCode: constants.code.preconditionFailed,
        msg: constants.message.invalidType,
      };
    } else {
      User.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.user_id),
          role: { $nin: [constants.accountLevel.superAdmin] },
          isDeleted: false,
        },
        {
          isDeleted: req.body.is_delete,
          deletedBy: req.id,
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
              message: message.accDeleted,
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
};


const userBookingList = async (req: any, res: Response, next: NextFunction) => {
  try {

    User.findOne({
      _id: new mongoose.Types.ObjectId(req.params.user_id),
      role: constants.accountLevel.user,
      isDeleted: false,
    })
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {

          Table.aggregate([
            {
              $match: {
                userId: new mongoose.Types.ObjectId(req.params.user_id),
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
              $project: {
                userName: "$userDetail.fullName",
                outletName: "$outletDetail.name",
                outletDescription: "$outletDetail.description",
                outletAddress: "$addressDetail.address.line_one",
                outletImages: "$outletDetail.images",
                guestNum: 1,
                bookingTime: 1,
                tableBookingNum: 1,
                requestId: "$requestDetail._id",
                rejectedReason: "$requestDetail.reason",
                bookingStatus: "$requestDetail.status",
                createdAt: 1
              }
            },
            {
              $sort: { createdAt: -1 }
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
                  message: message.userBookingList,
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

const userPointHistory = async (req: any, res: Response, next: NextFunction) => {
  try {

    User.findOne({
      _id: new mongoose.Types.ObjectId(req.params.user_id),
      role: constants.accountLevel.user,
      isDeleted: false,
    })
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {

          RewardPOint.aggregate([
            {
              $match: {
                userId: new mongoose.Types.ObjectId(req.params.user_id),
                isDeleted: false,

              },
            },

            {
              $project: {
                activity: 1,
                points: 1,
                pointStatus: 1,
                createdAt: 1
              }
            },
            {
              $sort: { createdAt: -1 }
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
                  message: message.userPOintHistory,
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
  create,
  usersList,
  customerList,
  detail,
  customerDetail,
  changeProfilePicture,
  update,
  resetPassword,
  manageAccount,
  deleteAccount,
  userBookingList,
  userPointHistory
};
