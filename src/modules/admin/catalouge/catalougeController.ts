import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import Cuisine from "../../../models/cuisine";
import Category from "../../../models/category";
import FoodType from "../../../models/foodtype";
import Ingredient from "../../../models/ingredient";
import User from "../../../models/user";
import {
  createSlug,
  imageUrl,
  removeImage,
  getFileName,
} from "../../../helpers/helper";
import message from "./catalougeConstant";
import mongoose from "mongoose";



const addCuisine = async (req: any, res: Response, next: NextFunction) => {
  try {
    await Cuisine.findOne({
      slug: await createSlug(req.body.cuisineName),
      isDeleted: false,
    })
      .then(async (cuisineExists) => {
        if (cuisineExists) {
          throw {
            statusCode: constants.code.preconditionFailed,
            message: message.cuisineExists,
          };
        } else {

          Cuisine.create({
            name: req.body.cuisineName,
            slug: await createSlug(req.body.cuisineName),
            image: !req.file
              ? null
              : await imageUrl(req.headers.host, req.file.filename),
            createdBy: req.id
          })
            .then((cuisineDetail) => {
              if (!cuisineDetail) {
                throw {
                  statusCode: constants.code.badRequest,
                  message: message.cuisineFailed,
                };
              } else {
                res.status(constants.code.success).json({
                  status: constants.status.statusTrue,
                  userStatus: req.status,
                  message: message.cuisineAdded,
                });
              }
            })
            .catch((err) => {
              res
                .status(constants.code.preconditionFailed)
                .json({
                  status: constants.status.statusFalse,
                  userStatus: req.status,
                  message: err.message,
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
  } catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
}


// const updateCuisine = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     Cuisine.exists({
//       _id: {
//         $nin: [new mongoose.Types.ObjectId(req.params.cuisine_id)],
//       },
//       slug: await createSlug(req.body.cuisineName),
//       isDeleted: false,
//     })
//       .then(async (data) => {
//         if (data) {
//           throw {
//             statusCode: constants.code.badRequest,
//             message: message.cuisineExists,
//           };
//         } else {
//           Cuisine.findOne(
//             { _id: new mongoose.Types.ObjectId(req.params.cuisine_id) },
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
// Cuisine.findOneAndUpdate(
//   {
//     _id: new mongoose.Types.ObjectId(req.params.cuisine_id),
//     isDeleted: false,
//   },
//   {
//     name: req.body.cuisineName,
//     slug: await createSlug(req.body.cuisineName),
//     image: await imageUrl(req.headers.host, req.file.filename),
//   },
//   { upsert: true }
// )
//   .then((updateCuisine) => {
//     if (!updateCuisine) {
//       throw {
//         statusCode: constants.code.preconditionFailed,
//         message: constants.code.dataNotFound,
//       };
//     } else {
//       res.status(constants.code.success).json({
//         status: constants.status.statusTrue,
//         userStatus: req.status,
//         message: message.cuisineUpdated,
//       });
//     }
//   })
//   .catch((err) => {
//     res.status(err.statusCode).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: err.message,
//     });
//   });
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
// }


const updateCuisine = async (req: any, res: Response, next: NextFunction) => {
  try {
    Cuisine.findOne({
      _id: new mongoose.Types.ObjectId(req.params.cuisine_id),
      isDeleted: false,
    })
      .then(async (data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          Cuisine.exists({
            slug: await createSlug(req.body.cuisineName),
            _id: { $nin: [new mongoose.Types.ObjectId(req.params.cuisine_id)] },
            isDeleted: false,
          })
            .then(async (dataExist) => {
              if (dataExist) {
                throw {
                  statusCode: constants.code.preconditionFailed,
                  msg: message.cuisineExists,
                };
              } else if (!req.file) {
                Cuisine.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(req.params.cuisine_id),
                    isDeleted: false,
                  },
                  {
                    name: req.body.cuisineName,
                    slug: await createSlug(req.body.cuisineName),
                  },
                  { upsert: true }
                )
                  .then((updateCuisine) => {
                    if (!updateCuisine) {
                      throw {
                        statusCode: constants.code.preconditionFailed,
                        message: constants.code.dataNotFound,
                      };
                    } else {
                      res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.cuisineUpdated,
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
              } else if (!data.image) {
                Cuisine.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(req.params.cuisine_id),
                    isDeleted: false,
                  },
                  {
                    name: req.body.cuisineName,
                    slug: await createSlug(req.body.cuisineName),
                    image: await imageUrl(req.headers.host, req.file.filename),
                  },
                  { upsert: true }
                )
                  .then((updateCuisine) => {
                    if (!updateCuisine) {
                      throw {
                        statusCode: constants.code.preconditionFailed,
                        message: constants.code.dataNotFound,
                      };
                    } else {
                      res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.cuisineUpdated,
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
              } else {
                await removeImage(await getFileName(data.image));
                Cuisine.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(req.params.cuisine_id),
                    isDeleted: false,
                  },
                  {
                    name: req.body.cuisineName,
                    slug: await createSlug(req.body.cuisineName),
                    image: await imageUrl(req.headers.host, req.file.filename),
                  },
                  { upsert: true }
                )
                  .then((updateCuisine) => {
                    if (!updateCuisine) {
                      throw {
                        statusCode: constants.code.preconditionFailed,
                        message: constants.code.dataNotFound,
                      };
                    } else {
                      res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.cuisineUpdated,
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


const cuisineDetail = async (req: any, res: Response, next: NextFunction) => {
  try {
    Cuisine.findOne({
      _id: new mongoose.Types.ObjectId(req.params.cuisine_id),
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
            message: message.cuisineDetail,
            data: await data.getCuisineDetail(),
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

const cuisineList = async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;
    const sort = req.query.sort === "desc" ? -1 : 1;

    if (Number(req.query.limit) !== 0) {
      Cuisine.aggregate([
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
            image: 1,
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
              message: message.cuisineListSuccess,
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
      Cuisine.aggregate([
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
            image: 1,
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
              message: message.cuisineListSuccess,
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

const deleteCuisine = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.body.is_delete) {
      throw {
        statusCode: constants.code.preconditionFailed,
        msg: constants.message.invalidType,
      };
    } else {
      Cuisine.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.cuisine_id),
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
              message: message.cuisineDeleted,
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


const addCategory = async (req: any, res: Response, next: NextFunction) => {
  try {
    await Category.findOne({
      slug: await createSlug(req.body.categoryName),
      isDeleted: false,
    })
      .then(async (catagoryExists) => {
        if (catagoryExists) {
          throw {
            statusCode: constants.code.badRequest,
            message: message.catagoryExists,
          };
        } else {
          Category.create({
            name: req.body.categoryName,
            cuisineId: new mongoose.Types.ObjectId(req.body.cuisineId),
            slug: await createSlug(req.body.categoryName),
            image: !req.file
              ? null
              : await imageUrl(req.headers.host, req.file.filename),
            createdBy: req.id
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
                .status(constants.code.preconditionFailed)
                .json({
                  status: constants.status.statusFalse,
                  userStatus: req.status,
                  message: err.message,
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
    res.status(constants.code.internalServerError).json({
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
//         $nin: [new mongoose.Types.ObjectId(req.params.category_id)],
//       },
//       slug: await createSlug(req.body.categoryName),
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
//             { _id: new mongoose.Types.ObjectId(req.params.category_id) },
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
//                 Category.findOneAndUpdate(
//                   {
//                     _id: new mongoose.Types.ObjectId(req.params.category_id),
//                     isDeleted: false,
//                   },
//                   {
//                     name: req.body.categoryName,
//                     cuisineId: new mongoose.Types.ObjectId(req.body.cuisineId),
//                     slug: await createSlug(req.body.categoryName),
//                     image: await imageUrl(req.headers.host, req.file.filename),
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
// }


const updateCategory = async (req: any, res: Response, next: NextFunction) => {
  try {
    Category.findOne({
      _id: new mongoose.Types.ObjectId(req.params.category_id),
      isDeleted: false,
    })
      .then(async (data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          Category.exists({
            slug: await createSlug(req.body.categoryName),
            _id: { $nin: [new mongoose.Types.ObjectId(req.params.category_id)] },
            isDeleted: false,
          })
            .then(async (dataExist) => {
              if (dataExist) {
                throw {
                  statusCode: constants.code.preconditionFailed,
                  msg: message.catagoryExists,
                };
              } else if (!req.file) {
                Category.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(req.params.category_id),
                    isDeleted: false,
                  },
                  {
                    name: req.body.categoryName,
                    cuisineId: new mongoose.Types.ObjectId(req.body.cuisineId),
                    slug: await createSlug(req.body.categoryName),
                  },
                  { upsert: true }
                )
                  .then((updateCategory) => {
                    if (!updateCategory) {
                      throw {
                        statusCode: constants.code.preconditionFailed,
                        message: constants.code.dataNotFound,
                      };
                    } else {
                      res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.categoryUpdated,
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
              } else if (!data.image) {
                Category.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(req.params.category_id),
                    isDeleted: false,
                  },
                  {
                    name: req.body.categoryName,
                    cuisineId: new mongoose.Types.ObjectId(req.body.cuisineId),
                    slug: await createSlug(req.body.categoryName),
                    image: await imageUrl(req.headers.host, req.file.filename),
                  },
                  { upsert: true }
                )
                  .then((updateCategory) => {
                    if (!updateCategory) {
                      throw {
                        statusCode: constants.code.preconditionFailed,
                        message: constants.code.dataNotFound,
                      };
                    } else {
                      res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.categoryUpdated,
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
              } else {
                await removeImage(await getFileName(data.image));
                Category.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(req.params.category_id),
                    isDeleted: false,
                  },
                  {
                    name: req.body.categoryName,
                    cuisineId: new mongoose.Types.ObjectId(req.body.cuisineId),
                    slug: await createSlug(req.body.categoryName),
                    image: await imageUrl(req.headers.host, req.file.filename),
                  },
                  { upsert: true }
                )
                  .then((updateCategory) => {
                    if (!updateCategory) {
                      throw {
                        statusCode: constants.code.preconditionFailed,
                        message: constants.code.dataNotFound,
                      };
                    } else {
                      res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.categoryUpdated,
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



const listCategory = async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;


    if (Number(req.query.limit) !== 0) {
      Category.aggregate([
        {
          $match: {
            isDeleted: false,
            
          },
        },

        {
          $lookup: {
            from: "cuisines",
            let: { cuisineId: "$cuisineId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$cuisineId"] },
                  isDeleted: false,
                },
              },
            ],
            as: "cuisineDetail",
          },
        },
        {
          $unwind: {
            path: "$cuisineDetail",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,
            name: 1,
            slug: 1,
            image: 1,
            cuisineName: "$cuisineDetail.name",
            createdAt: { $toLong: "$createdAt" },
          },
        },
        {
          $match: {
            $or: [
              {
                cuisineName: {
                  $regex: "^" + req.query.filter + ".*",
                  $options: "i",
                },
              },
            ],
          },
        },
        // {
        //   $match: {
        //  $or: [
        // {
        //     cuisineName: req.query.filter ? { $eq: req.query.filter } : {},
        //   },
        //   {
        //     name: req.query.filter ? { $eq: req.query.filter } : {},
        //   }
        //  ]
        // }
        // },
        {
          $match: {
            $or: [
              {
                name: {
                  $regex: "^" + req.query.search + ".*",
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
            
          },
        },
        {
          $lookup: {
            from: "cuisines",
            let: { cuisineId: "$cuisineId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$cuisineId"] },
                  isDeleted: false,
                },
              },
            ],
            as: "cuisineDetail",
          },
        },
        {
          $unwind: {
            path: "$cuisineDetail",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,
            name: 1,
            slug: 1,
            image: 1,
            cuisineName: "$cuisineDetail.name",
            createdAt: { $toLong: "$createdAt" },
          },
        },
        {
          $match: {
            $or: [
              {
                cuisineName: {
                  $regex: "^" + req.query.filter + ".*",
                  $options: "i",
                },
              },
            ],
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

    Category.findOne({ _id: new mongoose.Types.ObjectId(req.params.category_id), isDeleted: false })
      .then((categoryData) => {
        if (!categoryData) {
          throw {
            statusCode: constants.code.dataNotFound,
            message: constants.message.dataNotFound,
          };
        } else {

          Category.aggregate([
            {
              $match: {
                _id: new mongoose.Types.ObjectId(req.params.category_id),
                isDeleted: false,
              },
            },
            {
              $lookup: {
                from: "cuisines",
                let: { cuisineId: "$cuisineId" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$cuisineId"] },
                      isDeleted: false,
                    },
                  },
                ],
                as: "cuisineDetail",
              },
            },
            {
              $unwind: {
                path: "$cuisineDetail",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $project: {
                _id: 1,
                name: 1,
                slug: 1,
                image: 1,
                cuisineId: "$cuisineDetail._id",
                cuisineName: "$cuisineDetail.name",
                createdAt: { $toLong: "$createdAt" },
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
                  message: message.categoryDetailSuccess,
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
          _id: new mongoose.Types.ObjectId(req.params.category_id),
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

const addFoodTYpe = async (req: any, res: Response, next: NextFunction) => {
  try {
    await FoodType.findOne({
      slug: await createSlug(req.body.foodtypeName),
      isDeleted: false,
    })
      .then(async (foodtypeExists) => {
        if (foodtypeExists) {
          throw {
            statusCode: constants.code.preconditionFailed,
            message: message.foodtypeExists,
          };
        } else {

          FoodType.create({
            name: req.body.foodtypeName,
            slug: await createSlug(req.body.foodtypeName),
            image: !req.file
              ? null
              : await imageUrl(req.headers.host, req.file.filename),
            createdBy: req.id
          })
            .then((foodtypeDetail) => {
              if (!foodtypeDetail) {
                throw {
                  statusCode: constants.code.dataNotFound,
                  message: message.foodtypeFailed,
                };
              } else {
                res.status(constants.code.success).json({
                  status: constants.status.statusTrue,
                  userStatus: req.status,
                  message: message.foodtypeAdded,
                });
              }
            })
            .catch((err) => {
              res
                .status(constants.code.preconditionFailed)
                .json({
                  status: constants.status.statusFalse,
                  userStatus: req.status,
                  message: err.message,
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
  } catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
}

// const updateFoodTYpe = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     FoodType.exists({
//       _id: {
//         $nin: [new mongoose.Types.ObjectId(req.params.foodtype_id)],
//       },
//       slug: await createSlug(req.body.foodtypeName),
//       isDeleted: false,
//     })
//       .then(async (data) => {
//         if (data) {
//           throw {
//             statusCode: constants.code.preconditionFailed,
//             message: message.foodtypeExists,
//           };
//         } else {
//           FoodType.findOne(
//             { _id: new mongoose.Types.ObjectId(req.params.foodtype_id) },
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
                // FoodType.findOneAndUpdate(
                //   {
                //     _id: new mongoose.Types.ObjectId(req.params.foodtype_id),
                //     isDeleted: false,
                //   },
                //   {
                //     name: req.body.foodtypeName,
                //     slug: await createSlug(req.body.foodtypeName),
                //     image: await imageUrl(req.headers.host, req.file.filename),
                //   },
                //   { upsert: true }
                // )
                //   .then((updateFoodtype) => {
                //     if (!updateFoodtype) {
                //       throw {
                //         statusCode: constants.code.preconditionFailed,
                //         message: constants.code.dataNotFound,
                //       };
                //     } else {
                //       res.status(constants.code.success).json({
                //         status: constants.status.statusTrue,
                //         userStatus: req.status,
                //         message: message.foodtypeUpdated,
                //       });
                //     }
                //   })
                //   .catch((err) => {
                //     res.status(err.statusCode).json({
                //       status: constants.status.statusFalse,
                //       userStatus: req.status,
                //       message: err.message,
                //     });
                //   });
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

// }

const updateFoodTYpe = async (req: any, res: Response, next: NextFunction) => {
  try {
    FoodType.findOne({
      _id: new mongoose.Types.ObjectId(req.params.foodtype_id),
      isDeleted: false,
    })
      .then(async (data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          FoodType.exists({
            slug: await createSlug(req.body.foodtypeName),
            _id: { $nin: [new mongoose.Types.ObjectId(req.params.foodtype_id)] },
            isDeleted: false,
          })
            .then(async (dataExist) => {
              if (dataExist) {
                throw {
                  statusCode: constants.code.preconditionFailed,
                  msg: message.foodtypeExists,
                };
              } else if (!req.file) {
                FoodType.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(req.params.foodtype_id),
                    isDeleted: false,
                  },
                  {
                    name: req.body.foodtypeName,
                    slug: await createSlug(req.body.foodtypeName),
                  },
                  { upsert: true }
                )
                  .then((updateFoodtype) => {
                    if (!updateFoodtype) {
                      throw {
                        statusCode: constants.code.preconditionFailed,
                        message: constants.code.dataNotFound,
                      };
                    } else {
                      res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.foodtypeUpdated,
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
              } else if (!data.image) {
                FoodType.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(req.params.foodtype_id),
                    isDeleted: false,
                  },
                  {
                    name: req.body.foodtypeName,
                    slug: await createSlug(req.body.foodtypeName),
                    image: await imageUrl(req.headers.host, req.file.filename),
                  },
                  { upsert: true }
                )
                  .then((updateFoodtype) => {
                    if (!updateFoodtype) {
                      throw {
                        statusCode: constants.code.preconditionFailed,
                        message: constants.code.dataNotFound,
                      };
                    } else {
                      res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.foodtypeUpdated,
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
              } else {
                await removeImage(await getFileName(data.image));
                FoodType.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(req.params.foodtype_id),
                    isDeleted: false,
                  },
                  {
                    name: req.body.foodtypeName,
                    slug: await createSlug(req.body.foodtypeName),
                    image: await imageUrl(req.headers.host, req.file.filename),
                  },
                  { upsert: true }
                )
                  .then((updateFoodtype) => {
                    if (!updateFoodtype) {
                      throw {
                        statusCode: constants.code.preconditionFailed,
                        message: constants.code.dataNotFound,
                      };
                    } else {
                      res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.foodtypeUpdated,
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


const listFoodType = async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;
    const sort = req.query.sort === "desc" ? -1 : 1;

    if (Number(req.query.limit) !== 0) {
      FoodType.aggregate([
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
            image: 1,
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
              message: message.foodtypelisted,
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
      FoodType.aggregate([
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
            image: 1,
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
              message: message.foodtypelisted,
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


const foodTYpeDetail = async (req: any, res: Response, next: NextFunction) => {
  try {
    FoodType.findOne({
      _id: new mongoose.Types.ObjectId(req.params.foodtype_id),
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
            message: message.foodtypeDetail,
            data: await data.getFoodTypeDetail(),
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


const deleteFoodTYpe = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.body.is_delete) {
      throw {
        statusCode: constants.code.preconditionFailed,
        msg: constants.message.invalidType,
      };
    } else {
      FoodType.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.foodtype_id),
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
              message: message.foodtypedeleted,
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



const addIngredient = async (req: any, res: Response, next: NextFunction) => {
  try {
    await Ingredient.findOne({
      slug: await createSlug(req.body.ingredientName),
      isDeleted: false,
    })
      .then(async (ingredientExists) => {
        if (ingredientExists) {
          throw {
            statusCode: constants.code.preconditionFailed,
            message: message.ingredientExists,
          };
        } else {

          Ingredient.create({
            name: req.body.ingredientName,
            slug: await createSlug(req.body.ingredientName),
            createdBy: req.id
          })
            .then((ingredientDetail) => {
              if (!ingredientDetail) {
                throw {
                  statusCode: constants.code.badRequest,
                  message: message.ingredientFailed,
                };
              } else {
                res.status(constants.code.success).json({
                  status: constants.status.statusTrue,
                  userStatus: req.status,
                  message: message.ingredientAdded,
                });
              }
            })
            .catch((err) => {
              res
                .status(constants.code.preconditionFailed)
                .json({
                  status: constants.status.statusFalse,
                  userStatus: req.status,
                  message: err.message,
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
  } catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
}


const updateIngredient = async (req: any, res: Response, next: NextFunction) => {
  try {
    Ingredient.exists({
      _id: {
        $nin: [new mongoose.Types.ObjectId(req.params.ingredient_id)],
      },
      slug: await createSlug(req.body.ingredientName),
      isDeleted: false,
    })
      .then(async (data) => {
        if (data) {
          throw {
            statusCode: constants.code.badRequest,
            message: message.ingredientExists,
          };
        } else {
          Ingredient.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(req.params.ingredient_id),
              isDeleted: false,
            },
            {
              name: req.body.ingredientName,
              slug: await createSlug(req.body.ingredientName),
            },
            { upsert: true }
          )
            .then((updateIngredient) => {
              if (!updateIngredient) {
                throw {
                  statusCode: constants.code.preconditionFailed,
                  message: constants.code.dataNotFound,
                };
              } else {
                res.status(constants.code.success).json({
                  status: constants.status.statusTrue,
                  userStatus: req.status,
                  message: message.ingredientUpdated,
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
        }
      })
      .catch((err) => {
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



const listIngredient = async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;
    const sort = req.query.sort === "desc" ? -1 : 1;

    if (Number(req.query.limit) !== 0) {
      Ingredient.aggregate([
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
              message: message.ingredientList,
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
      Ingredient.aggregate([
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
              message: message.ingredientList,
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


const ingredientDetail = async (req: any, res: Response, next: NextFunction) => {
  try {
    Ingredient.findOne({
      _id: new mongoose.Types.ObjectId(req.params.ingredient_id),
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
            message: message.ingredientDetail,
            data: await data.getIngredientDetail(),
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



const deleteIngredient = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.body.is_delete) {
      throw {
        statusCode: constants.code.preconditionFailed,
        msg: constants.message.invalidType,
      };
    } else {
      Ingredient.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.ingredient_id),
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
              message: message.ingredientDeleted,
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
  addCuisine,
  updateCuisine,
  cuisineDetail,
  cuisineList,
  deleteCuisine,
  addCategory,
  updateCategory,
  listCategory,
  categoryDetail,
  deleteCategory,
  addFoodTYpe,
  updateFoodTYpe,
  listFoodType,
  foodTYpeDetail,
  deleteFoodTYpe,
  addIngredient,
  updateIngredient,
  listIngredient,
  ingredientDetail,
  deleteIngredient
}