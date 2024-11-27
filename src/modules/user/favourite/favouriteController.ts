import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import message from "./favouriteConstant";
import mongoose from "mongoose";
import Outlet from "../../../models/outlet";
import Favourite from "../../../models/favourite";
import Device from "../../../models/device";

const addFavourites = async (req: any, res: Response, next: NextFunction) => {
  try {
    Outlet.exists({
      _id: new mongoose.Types.ObjectId(req.body.outlet_id),
      isDeleted: false,
    })
      .then((outlet_detail) => {
        if (!outlet_detail) {
          throw {
            statusCode: constants.code.badRequest,
            msg: message.invalidOutlet,
          };
        } else {
          Favourite.findOne({
            userId: new mongoose.Types.ObjectId(req.id),
            outlets: {
              $in: [new mongoose.Types.ObjectId(outlet_detail._id)],
            },
          })
            .then((favourite_detail) => {
              if (favourite_detail) {
                throw {
                  statusCode: constants.code.badRequest,
                  msg: message.outletExists,
                };
              } else {
                Favourite.findOneAndUpdate(
                  {
                    userId: new mongoose.Types.ObjectId(req.id),
                  },
                  {
                    userId: new mongoose.Types.ObjectId(req.id),
                    $push: {
                      outlets: new mongoose.Types.ObjectId(outlet_detail._id),
                    },
                  },
                  { upsert: true, new: true }
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
                        message: message.outletSuccess,
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


const favouriteList = async(req:any, res:Response, next:NextFunction)=>{
    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const skip = page * limit;

        Favourite.findOne({
          userId: new mongoose.Types.ObjectId(req.id),
          isDeleted: false,
        })
          .then(async (favouriteDetail: any) => {
            if (!favouriteDetail) {
              throw {
                statusCode: constants.code.dataNotFound,
                msg: constants.message.dataNotFound,
              };
            } else {
                const loc: any = await Device.findOne(
                    { userId: new mongoose.Types.ObjectId(req.id) },
                    { latitude: 1, longitude: 1 }
                  )

                  if (Number(req.query.limit) !== 0) {
                    Outlet.aggregate([

                        {
                            $geoNear: {
                              near: { type: "Point", coordinates: [loc?.longitude, loc?.latitude] },
                              key: "location",
                              distanceField: "dist.calculated",
                              // maxDistance:5600,
                              includeLocs: "dist.location",
                              spherical: true
                            }
                          },
                        {
                          $match: {
                            _id: {
                              $in: favouriteDetail.outlets,
                            },
                            isDeleted: false,
                          },
                        },
                       
                    {
                        $lookup: {
                          from: "addresses",
                          let: { outletId: "$_id" },
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
                          from: "states",
                          let: { stateId: "$addressDetail.address.state" },
                          pipeline: [
                            {
                              $match: {
                                $expr: { $eq: ["$_id", "$$stateId"] },
                                isDeleted: false
                              },
                            },
                          ],
                          as: "stateDetail",
                        },
                      },
                      {
                        $unwind: {
                          path: "$stateDetail",
                          preserveNullAndEmptyArrays: true
                        },
                      },
          
                      {
                        $lookup: {
                          from: "countries",
                          let: { countryId: "$addressDetail.address.country" },
                          pipeline: [
                            {
                              $match: {
                                $expr: { $eq: ["$_id", "$$countryId"] },
                                isDeleted: false
                              },
                            },
                          ],
                          as: "countryDetail",
                        },
                      },
                      {
                        $unwind: {
                          path: "$countryDetail",
                          preserveNullAndEmptyArrays: true
                        },
                      },
          
          
                      {
                        $lookup: {
                          from: "brands",
                          let: { brandId: "$brandId" },
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
                          _id: 1,
                          name: 1,
                          slug: 1,
                          description: 1,
                          timings: 1,
                          images: 1,
                          priceForTwo: 1,
                          distanceInKm: { $substr: [{ $toString: { $divide: ["$dist.calculated", 1000] } }, 0, 4] },
                          addressLineOne: "$addressDetail.address.line_one",
                          addressLineTwo: "$addressDetail.address.line_two",
                          city: "$cityDetail.name",
                          state: "$stateDetail.name",
                          country: "$countryDetail.name",
                          landmark: "$addressDetail.landmark",
                          brandName: "$brandDetail.name",
          
                          createdAt: { $toLong: "$createdAt" },
                        },
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
                            message: message.favouriteList,
                            data: data,
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
          
                  else {
                    Outlet.aggregate([

                        {
                            $geoNear: {
                              near: { type: "Point", coordinates: [loc?.longitude, loc?.latitude] },
                              key: "location",
                              distanceField: "dist.calculated",
                              // maxDistance:5600,
                              includeLocs: "dist.location",
                              spherical: true
                            }
                          },
                        {
                          $match: {
                            _id: {
                              $in: favouriteDetail.outlets,
                            },
                            isDeleted: false,
                          },
                        },
                       
                    {
                        $lookup: {
                          from: "addresses",
                          let: { outletId: "$_id" },
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
                          from: "states",
                          let: { stateId: "$addressDetail.address.state" },
                          pipeline: [
                            {
                              $match: {
                                $expr: { $eq: ["$_id", "$$stateId"] },
                                isDeleted: false
                              },
                            },
                          ],
                          as: "stateDetail",
                        },
                      },
                      {
                        $unwind: {
                          path: "$stateDetail",
                          preserveNullAndEmptyArrays: true
                        },
                      },
          
                      {
                        $lookup: {
                          from: "countries",
                          let: { countryId: "$addressDetail.address.country" },
                          pipeline: [
                            {
                              $match: {
                                $expr: { $eq: ["$_id", "$$countryId"] },
                                isDeleted: false
                              },
                            },
                          ],
                          as: "countryDetail",
                        },
                      },
                      {
                        $unwind: {
                          path: "$countryDetail",
                          preserveNullAndEmptyArrays: true
                        },
                      },
          
          
                      {
                        $lookup: {
                          from: "brands",
                          let: { brandId: "$brandId" },
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
                          _id: 1,
                          name: 1,
                          slug: 1,
                          description: 1,
                          timings: 1,
                          images: 1,
                          priceForTwo: 1,
                          distanceInKm: { $substr: [{ $toString: { $divide: ["$dist.calculated", 1000] } }, 0, 4] },
                          addressLineOne: "$addressDetail.address.line_one",
                          addressLineTwo: "$addressDetail.address.line_two",
                          city: "$cityDetail.name",
                          state: "$stateDetail.name",
                          country: "$countryDetail.name",
                          landmark: "$addressDetail.landmark",
                          brandName: "$brandDetail.name",
          
                          createdAt: { $toLong: "$createdAt" },
                        },
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
                            message: message.favouriteList,
                            data: data,
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


const deleteFavourite = async(req:any, res:Response, next:NextFunction)=>{
    try {
        if (!req.body.is_delete) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.invalidType,
          };
        } else {
          Favourite.findOneAndUpdate(
            {
              userId: new mongoose.Types.ObjectId(req.id),
              outlets: {
                $in: [new mongoose.Types.ObjectId(req.params.outlet_id)],
              },
            },
            {
              userId: new mongoose.Types.ObjectId(req.id),
              $pull: {
                outlets: new mongoose.Types.ObjectId(req.params.outlet_id),
              },
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
                  message: message.outletDeleteSuccss,
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
        res.status(constants.code.internalServerError).json({
          status: constants.status.statusFalse,
          userStatus: req.status,
          message: err.msg,
        });
      }
}




export default {
    addFavourites,
    favouriteList,
    deleteFavourite
}