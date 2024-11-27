import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import Category from "../../../models/category";
import User from "../../../models/user";
import {
  createSlug,
  imageUrl,
  removeImage,
  getFileName,
} from "../../../helpers/helper";
import message from "./categoryConstants";
import mongoose from "mongoose";

const addCategory = async (req: any, res: Response, next: NextFunction) => {
  try {
    await Category.findOne({
      slug: await createSlug(req.body.name),
      isDeleted: false,
    })
      .then(async (catagoryExists) => {
        if (catagoryExists) {
          throw {
            statusCode: constants.code.badRequest,
            message: message.catagoryExists,
          };
        } else {
          const imageList: any = [];
          for (let i = 0; i < req.files.length; i++) {
            imageList.push(
              await imageUrl(req.headers.host, req.files[i].filename)
            );
          }
          Category.create({
            name: req.body.name,
            cuisineType: req.body.cuisineType,
            slug: await createSlug(req.body.name),
            images: imageList,
            createdBy:req.id
          })
            .then((categoryDetail) => {
              if (!categoryDetail) {
                throw {
                  statusCode: constants.code.badRequest,
                  message: message.categoryFailed,
                };
              } else {
                res.status(constants.code.success).json({
                  status: constants.status.statusTrue,
                  userStatus: req.status,
                  message: message.categoryAdded,
                });
              }
            })
            .catch((err) => {
              res
                .status(err.statusCode || constants.code.preconditionFailed)
                .json({
                  status: constants.status.statusFalse,
                  userStatus: req.status,
                  message: err.message || message.categoryFailed,
                });
            });
        }
      })
      .catch((err) => {
        res.status(err.statusCode).json({
          status: constants.status.statusFalse,
          userStatus: req.status,
          message: err.message,
        });
      });
  } catch (error) {
    res.status(constants.code.preconditionFailed).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: error,
    });
  }
};

// const updateCategory = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     Category.exists({
//       _id: {
//         $nin: [new mongoose.Types.ObjectId(req.params.categoryId)],
//       },
//       slug: await createSlug(req.body.name),
//       isDeleted: false,
//     })
//       .then(async (data) => {
//         if (data) {
//           throw {
//             statusCode: constants.code.badRequest,
//             message: message.catagoryExists,
//           };
//         } else {
//           Category.findOne(
//             { _id: new mongoose.Types.ObjectId(req.params.categoryId) },
//             {
//               images: 1,
//             }
//           )
//             .then(async (category_data) => {
//               if (!category_data) {
//                 throw {
//                   statusCode: constants.code.dataNotFound,
//                   message: constants.message.dataNotFound,
//                 };
//               } else {
//                 for (let i = 0; i < category_data.images.length; i++) {
//                   await removeImage(await getFileName(category_data.images[i]));
//                 }

//                 const imageList: any = [];
//                 for (let i = 0; i < req.files.length; i++) {
//                   imageList.push(
//                     await imageUrl(req.headers.host, req.files[i].filename)
//                   );
//                 }
//                 Category.findOneAndUpdate(
//                   {
//                     _id:  new mongoose.Types.ObjectId(req.params.categoryId) ,
//                     isDeleted: false,
//                   },
//                   {
//                     name: req.body.name,
//                     slug: await createSlug(req.body.name),
//                     images: imageList,
//                     cuisineType: req.body.cuisineType,
//                   },
//                   { upsert: true }
//                 )
//                   .then((updateCategory) => {
//                     if (!updateCategory) {
//                       throw {
//                         statusCode: constants.code.preconditionFailed,
//                         message: constants.code.dataNotFound,
//                       };
//                     } else {
//                       res.status(constants.code.success).json({
//                         status: constants.status.statusTrue,
//                         userStatus: req.status,
//                         message: message.categoryUpdated,
//                       });
//                     }
//                   })
//                   .catch((err) => {
//                     res.status(err.statusCode).json({
//                       status: constants.status.statusFalse,
//                       userStatus: req.status,
//                       message: err.message,
//                     });
//                   });
//               }
//             })
//             .catch((err) => {
//               res.status(err.statusCode).json({
//                 status: constants.status.statusFalse,
//                 userStatus: req.status,
//                 message: err.message,
//               });
//             });
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

const listCategory = async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;
    const sort = req.query.sort === "desc" ? -1 : 1;

    if (Number(req.query.limit) !== 0) {
      Category.aggregate([
        {
          $match: {
            isDeleted: false,
            name: {
              $regex: "^" + req.query.search + ".*",
              $options: "i",
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            slug: 1,
            images: 1,
            cuisineType:1,
            createdAt: { $toLong: "$createdAt" },
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
          if (!data) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            };
          } else {
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.categoryListSuccess,
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
      Category.aggregate([
        {
          $match: {
            isDeleted: false,
            name: {
              $regex: "^" + req.query.search + ".*",
              $options: "i",
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            slug: 1,
            images: 1,
            cuisineType:1,
            createdAt: { $toLong: "$createdAt" },
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
          if (!data) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            };
          } else {
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.categoryListSuccess,
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


const categoryDetail = async (req: any, res: Response, next: NextFunction) => {
  try {
    Category.findOne({
      _id: new mongoose.Types.ObjectId(req.params.categoryId),
      isDeleted: false,
    })
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: message.categoryDetailSuccess,
            data: await data.getCategoryDetail(),
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



const deleteCategory = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.body.is_delete) {
      throw {
        statusCode: constants.code.preconditionFailed,
        msg: constants.message.invalidType,
      };
    } else {
      Category.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.categoryId),
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
              message: message.categoryDeleted,
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


export default { addCategory, 
  listCategory, 
  //updateCategory, 
  categoryDetail, deleteCategory };
