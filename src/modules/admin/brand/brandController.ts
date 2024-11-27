import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import Brand from "../../../models/brand";
import User from "../../../models/user";
import {
  createSlug,
  imageUrl,
  removeImage,
  getFileName,
} from "../../../helpers/helper";
import message from "./brandConstants";
import mongoose from "mongoose";

const addBrand = async (req: any, res: Response, next: NextFunction) => {
  try {
    Brand.exists({
      slug: await createSlug(req.body.name),
      isDeleted: false,
    })
      .then(async (data) => {
        if (data) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: message.brandExists,
          };
        } else {
          Brand.create({
            name: req.body.name,
            slug: await createSlug(req.body.name),
            description: req.body.description,
            image: !req.file
              ? null
              : await imageUrl(req.headers.host, req.file.filename),
              status: req.body.brandStatus
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
                  message: message.brandSuccess,
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


const updateBrand = async (req: any, res: Response, next: NextFunction) => {
  try {
    Brand.findOne({
      _id: new mongoose.Types.ObjectId(req.params.brand_id),
      isDeleted: false,
    })
      .then(async (data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          Brand.exists({
            slug: await createSlug(req.body.name),
            _id: { $nin: [new mongoose.Types.ObjectId(req.params.brand_id)] },
            isDeleted: false,
          })
            .then(async (dataExist) => {
              if (dataExist) {
                throw {
                  statusCode: constants.code.preconditionFailed,
                  msg: message.brandExists,
                };
              } else if (!req.file) {
                Brand.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(req.params.brand_id),
                    isDeleted: false,
                  },
                  {
                    name: req.body.name,
                    slug: await createSlug(req.body.name),
                    description: req.body.description,
                    status: req.body.brandStatus
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
                        message: message.brandUpdated,
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
                Brand.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(req.params.brand_id),
                    isDeleted: false,
                  },
                  {
                    name: req.body.name,
                    slug: await createSlug(req.body.name),
                    description: req.body.description,
                    status: req.body.brandStatus,
                    image: await imageUrl(req.headers.host, req.file.filename),
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
                        message: message.brandUpdated,
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
                Brand.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(req.params.brand_id),
                    isDeleted: false,
                  },
                  {
                    name: req.body.name,
                    slug: await createSlug(req.body.name),
                    description: req.body.description,
                    status: req.body.brandStatus,
                    image: await imageUrl(req.headers.host, req.file.filename),
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
                        message: message.brandUpdated,
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

// const updateBrand = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     Brand.exists({
//       _id: {
//         $nin: [new mongoose.Types.ObjectId(req.params.brand_id)],
//       },
//       slug: await createSlug(req.body.name),
//       isDeleted: false,
//     })
//       .then(async (data) => {
//         if (data) {
//           throw {
//             statusCode: constants.code.badRequest,
//             message: message.brandExists,
//           };
//         } else {
//           Brand.findOne(
//             { _id: new mongoose.Types.ObjectId(req.params.brand_id) },
//             {
//               image: 1,
//             }
//           )
//             .then(async (data: any) => {
//               if (!data) {
//                 throw {
//                   statusCode: constants.code.dataNotFound,
//                   message: constants.message.dataNotFound,
//                 };
//               } else {
//                 await removeImage(await getFileName(data.image));
//                 Brand.findOneAndUpdate(
//                   {
//                     _id: new mongoose.Types.ObjectId(req.params.brand_id),
//                     isDeleted: false,
//                   },
//                   {
//                     name: req.body.name,
//                     slug: await createSlug(req.body.name),
//                     description: req.body.description,
//                     image:  await imageUrl(req.headers.host, req.file.filename),
//                     status: req.body.brandStatus
//                   },
//                   { upsert: true }
//                 )
//                   .then((updateBrand) => {
//                     if (!updateBrand) {
//                       throw {
//                         statusCode: constants.code.preconditionFailed,
//                         message: constants.code.dataNotFound,
//                       };
//                     } else {
//                       res.status(constants.code.success).json({
//                         status: constants.status.statusTrue,
//                         userStatus: req.status,
//                         message: message.brandUpdated,
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

const listBrand = async(req: any, res:Response, next:NextFunction)=>{
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;
    const sort = req.query.sort === "desc" ? -1 : 1;

    if (Number(req.query.limit) !== 0) {
      Brand.aggregate([
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
            description: 1,
            image:1,
            status:1,
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
          if (!data[0].data.length) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            };
          } else {
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.brandListSuccessfully,
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
      Brand.aggregate([
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
            description: 1,
            image:1,
            status:1,
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
          if (!data[0].data.length) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            };
          } else {
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.brandListSuccessfully,
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

const brandDetail = async(req:any, res:Response, next:NextFunction)=>{
  try {
    Brand.findOne({
      _id: new mongoose.Types.ObjectId(req.params.brand_id),
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
            message: message.brandDetailSuccess,
            data: await data.getBrandDetail(),
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

const deleteBrand = async(req:any, res:Response, next:NextFunction)=>{
  try {
    if (!req.body.is_delete) {
      throw {
        statusCode: constants.code.preconditionFailed,
        msg: constants.message.invalidType,
      };
    } else {
      Brand.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.brand_id),
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
              message: message.brandDeleted,
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
  addBrand,
  updateBrand,
  listBrand,
  brandDetail,
  deleteBrand
};
