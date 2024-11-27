import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import message from "./addressConstant";
import mongoose from "mongoose";
import User from "../../../models/user";
import Address from "../../../models/address";
import { generateAddressSlug, getPinDetail } from "../../../helpers/helper";



const addAddress = async(req:any, res:Response, next:NextFunction) =>{
  try{

    User.findOne({
      _id: new mongoose.Types.ObjectId(req.id),
      role: constants.accountLevel.user,
      status: true,
      isDeleted: false,
    }) .then(async (user_detail: any) => {
      if (!user_detail) {
        throw {
          statusCode: constants.code.unAuthorized,
          msg: constants.message.unAuthAccess,
        };
      }
      else{
        Address.countDocuments({
          userId: new mongoose.Types.ObjectId(user_detail._id),
          isDeleted: false,
        })
          .then(async(address_count) => {
            if (address_count === 10) {
              throw {
                statusCode: constants.code.badRequest,
                msg: message.addressLimit,
              };
            }
            else{
              const pinData: any = await getPinDetail(
                req.body.pin_code
              );
              Address.create({
                userId: user_detail._id,
                type: req.body.address_type,
                address: {
                  line_one: req.body.address_line_one,
                  line_two: req.body.address_line_two,
                  city: pinData.cityId,
                  state: pinData.stateId,
                  country: pinData.countryId,
                  pin_code: pinData.pinCode,
                },
                createdBy: req.id,
              })
                .then(async (data) => {
                  if (!data) {
                    throw {
                      statusCode: constants.code.internalServerError,
                      msg: constants.message.internalServerError,
                    };
                  } else {
                    res.status(constants.code.success).json({
                      status: constants.status.statusTrue,
                      userStatus: req.status,
                      message: message.addressSuccess,
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
              message: err.msg,
            });
          });

      }
    }).catch((err) => {
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

const addressList = async (req: any, res: Response, next: NextFunction) => {
  try {
    Address.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.id),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "cities",
          foreignField: "_id",
          localField: "address.city",
          as: "city_detail",
        },
      },
      { $unwind: "$city_detail" },
      {
        $lookup: {
          from: "states",
          foreignField: "_id",
          localField: "address.state",
          as: "state_detail",
        },
      },
      { $unwind: "$state_detail" },
      {
        $lookup: {
          from: "countries",
          foreignField: "_id",
          localField: "address.country",
          as: "country_detail",
        },
      },
      { $unwind: "$country_detail" },
      {
        $project: {
          _id: 1,
          constraint: 1,
          slug: 1,
          type: 1,
          name: 1,
          email: 1,
          phone: 1,
          createdAt: 1,
          is_verified: 1,
          address: {
            line_one: 1,
            line_two: 1,
            city: "$city_detail.name",
            state: "$state_detail.name",
            country: "$country_detail.name",
            pin_code: 1,
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ])
      .then((data) => {
        if (!data.length) {
          throw {
            statusCode: constants.code.internalServerError,
            msg: constants.message.internalServerError,
          };
        } else {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: message.addressListSuccess,
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
  } catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
};

const detail = async (req: any, res: Response, next: NextFunction) => {
  try {
    Address.findOne({
      _id: new mongoose.Types.ObjectId(req.params.address_id),
      userId: new mongoose.Types.ObjectId(req.id),
      isDeleted: false,
    })
      .then((address_detail) => {
        if (!address_detail) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          Address.aggregate([
            {
              $match: {
                _id: new mongoose.Types.ObjectId(address_detail._id),
                userId: new mongoose.Types.ObjectId(req.id),
                isDeleted: false,
              },
            },
            {
              $lookup: {
                from: "cities",
                foreignField: "_id",
                localField: "address.city",
                as: "city_detail",
              },
            },
            { $unwind: "$city_detail" },
            {
              $lookup: {
                from: "states",
                foreignField: "_id",
                localField: "address.state",
                as: "state_detail",
              },
            },
            { $unwind: "$state_detail" },
            {
              $lookup: {
                from: "countries",
                foreignField: "_id",
                localField: "address.country",
                as: "country_detail",
              },
            },
            { $unwind: "$country_detail" },
            {
              $project: {
                _id: 1,
                constraint: 1,
                slug: 1,
                type: 1,
                name: 1,
                email: 1,
                phone: 1,
                is_verified: 1,
                address: {
                  line_one: 1,
                  line_two: 1,
                  city: "$city_detail.name",
                  state: "$state_detail.name",
                  country: "$country_detail.name",
                  pin_code: 1,
                },
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
                  message: message.addressDetailSuccess,
                  data: data[0],
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

const update = async (req: any, res: Response, next: NextFunction) => {
  try {
    Address.exists({
      _id: { $nin: [new mongoose.Types.ObjectId(req.params.address_id)] },
      userId: new mongoose.Types.ObjectId(req.id),
      type: req.body.address_type,
      "address.pin_code": req.body.pin_code,
      isDeleted: false,
    })
      .then(async (data) => {
        if (data) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: message.addressExist,
          };
        } else {
          const pinData: any = await getPinDetail(req.body.pin_code);
          Address.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(req.params.address_id),
              userId: new mongoose.Types.ObjectId(req.id),
              constraint: constants.constraint.secondary,
              isDeleted: false,
            },
            {
              slug: await generateAddressSlug(
                req.body.full_name,
                req.body.address_type,
                pinData.pinCode
              ),
              constraint: constants.constraint.secondary,
              type: req.body.address_type,
              name: req.body.full_name,
              phone: req.body.phone,
              address: {
                line_one: req.body.address_line_one,
                line_two: req.body.address_line_two,
                city: pinData.cityId,
                state: pinData.stateId,
                country: pinData.countryId,
                pin_code: pinData.pinCode,
              },
              landmark: req.body.landmark,
              latitude: req.body.latitude,
              longitude: req.body.longitude,
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
                  message: message.addressUpdateSuccess,
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

const deleteAddress = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.body.is_delete) {
      throw {
        statusCode: constants.code.preconditionFailed,
        msg: constants.message.invalidType,
      };
    } else {
      Address.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.address_id),
          userId: new mongoose.Types.ObjectId(req.id),
          constraint: constants.constraint.secondary,
          isDeleted: false,
        },
        {
          isDeleted: req.body.is_delete,
        },
        { new: true }
      )
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
              message: message.addressDeletedSuccess,
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

export default {
  addAddress,
  addressList,
  detail,
  update,
  deleteAddress,
};
