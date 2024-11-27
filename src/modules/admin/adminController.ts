import { Request, Response, NextFunction } from "express";
import constants from "../../utils/constants";
import mongoose from "mongoose";
import User from "../../models/user";
import Device from "../../models/device";
import {
  checkPassword,
  getFileName,
  hashPassword,
  minutes,
  photoUrl,
  randomToken,
  removePhoto,
  toLowerCase,
} from "../../helpers/helper";
import {
  createToken,
  createTokenMobile,
  deleteAllToken,
  deleteToken,
} from "../../helpers/token";
import OTP from "../../models/otp";
import sendMail from "../../helpers/mail";

const login = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOne({ "email.value": await toLowerCase(req.body.email) })
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.invalidEmail,
          };
        } else if (
          (await checkPassword(req.body.password, data.password)) !== true
        ) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.invalidPassword,
          };
        } else if (!data.status) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.userInactive,
          };
        } else if (data.isDeleted) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.userDeleted,
          };
        } else if (
          data.role !== constants.accountLevel.superAdmin &&
          data.role !== constants.accountLevel.admin &&
          data.role !== constants.accountLevel.manager
        ) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.invalidUser,
          };
        } else {
          Device.findOneAndUpdate(
            { deviceId: req.body.device_info.device_id, userId: data._id },
            {
              userId: data._id,
              deviceId: req.body.device_info.device_id,
              appId: req.body.device_info.app_id,
              name: req.body.device_info.name,
              model: req.body.device_info.model,
              platform: req.body.device_info.platform,
              version: req.body.device_info.version,
              ipAddress: req.body.device_info.ip,
              latitude: req.body.device_info.latitude,
              longitude: req.body.device_info.longitude,
              createdBy: data._id,
            },
            {
              upsert: true,
              new: true,
            }
          )
            .then(async (device_detail) => {
              if (!device_detail) {
                throw {
                  statusCode: constants.code.internalServerError,
                  msg: constants.message.internalServerError,
                };
              } else {
                const payload = {
                  id: data._id,
                };
                res.status(constants.code.success).json({
                  status: constants.status.statusTrue,
                  userStatus: data.status,
                  message: constants.message.userLogin,
                  token:
                    req.body.device_info.platform !==
                      constants.deviceTypes.android &&
                    req.body.device_info.platform !==
                      constants.deviceTypes.iphone
                      ? await createToken(payload)
                      : await createTokenMobile(payload),
                  data: await data.getAuthDetail(),
                });
              }
            })
            .catch((err) => {
              res.status(err.statusCode).json({
                status: constants.status.statusFalse,
                userStatus: constants.status.statusFalse,
                message: err.msg,
              });
            });
        }
      })
      .catch((err) => {
        res.status(err.statusCode).json({
          status: constants.status.statusFalse,
          userStatus: constants.status.statusFalse,
          message: err.msg,
        });
      });
  } catch (err) {
    res.status(constants.code.preconditionFailed).json({
      status: constants.status.statusFalse,
      userStatus: constants.status.statusFalse,
      message: err,
    });
  }
};

const getDetail = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOne({
      _id: new mongoose.Types.ObjectId(req.id),
      $or: [
        { role: constants.accountLevel.superAdmin },
        { role: constants.accountLevel.admin },
        { role: constants.accountLevel.manager },
      ],
      status: true,
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
            message: constants.message.userDetail,
            data: await data.getUserDetail(),
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

const changeProfilePicture = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    User.findOne({
      _id: new mongoose.Types.ObjectId(req.id),
      $or: [
        { role: constants.accountLevel.superAdmin },
        { role: constants.accountLevel.admin },
        { role: constants.accountLevel.manager },
      ],
      status: true,
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
              _id: new mongoose.Types.ObjectId(req.id),
              $or: [
                { role: constants.accountLevel.superAdmin },
                { role: constants.accountLevel.admin },
                { role: constants.accountLevel.manager },
              ],
              status: true,
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
                  message: constants.message.profileSuccess,
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
              _id: new mongoose.Types.ObjectId(req.id),
              $or: [
                { role: constants.accountLevel.superAdmin },
                { role: constants.accountLevel.admin },
                { role: constants.accountLevel.manager },
              ],
              status: true,
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
                  message: constants.message.profileSuccess,
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

const updateDetail = async (req: any, res: Response, next: NextFunction) => {
  try {

    User.exists({
      "email.value": await toLowerCase(req.body.email),
      _id: { $nin: [new mongoose.Types.ObjectId(req.id)] },
    })
      .then(async(data) => {
        if (data) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.emailTaken,
          };
        } else {
          User.exists({
            "phone.value": req.body.phone,
            _id: { $nin: [new mongoose.Types.ObjectId(req.id)] },
          })
            .then(async(data) => {
              if (data) {
                throw {
                  statusCode: constants.code.preconditionFailed,
                  msg: constants.message.phoneTaken,
                };
              } else {
    User.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.id),
        $or: [
          { role: constants.accountLevel.superAdmin },
          { role: constants.accountLevel.admin },
          { role: constants.accountLevel.manager },
        ],
        status: true,
        isDeleted: false,
      },
      {
        fname: req.body.first_name,
        lname: req.body.last_name,
        email: {
          value: await toLowerCase(req.body.email),
          is_verified: false,
        },
        phone: { value: req.body.phone, is_verified: false },
        gender: req.body.gender,
        dob: req.body.date_of_birth,
      },
      { new: true }
    )
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
            message: constants.message.userUpdate,
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

const verifyEmail = async (req: any, res: Response, next: NextFunction) => {
  try {
    OTP.findOne({ email: await toLowerCase(req.body.email) })
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else if ((await minutes(data.updatedAt)) >= 5) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.otpExpire,
          };
        } else if (data.otp !== req.body.otp) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.invalidOTP,
          };
        } else {
          User.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(req.id),
              "email.value": await toLowerCase(data.email),
              $or: [
                { role: constants.accountLevel.superAdmin },
                { role: constants.accountLevel.admin },
              ],
              status: true,
              isDeleted: false,
            },
            {
              "email.is_verified": true,
            },
            { new: true }
          )
            .then(async (user_detail) => {
              if (!user_detail) {
                throw {
                  statusCode: constants.code.internalServerError,
                  msg: constants.message.internalServerError,
                };
              } else {
                OTP.findOneAndDelete({
                  email: await toLowerCase(data.email),
                })
                  .then((data) => {
                    res.status(constants.code.success).json({
                      status: constants.status.statusTrue,
                      userStatus: req.status,
                      message: constants.message.emailVerified,
                    });
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

const verifyPhone = async (req: any, res: Response, next: NextFunction) => {
  try {
    OTP.findOne({ phone: req.body.phone })
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else if ((await minutes(data.updatedAt)) >= 5) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.otpExpire,
          };
        } else if (data.otp !== req.body.otp) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.invalidOTP,
          };
        } else {
          User.findOne({
            _id: new mongoose.Types.ObjectId(req.id),
            $or: [
              { role: constants.accountLevel.superAdmin },
              { role: constants.accountLevel.admin },
            ],
            status: true,
            isDeleted: false,
          })
            .then((user_detail) => {
              if (!user_detail) {
                throw {
                  statusCode: constants.code.preconditionFailed,
                  msg: constants.message.invalidPhone,
                };
              } else if (!user_detail.email?.is_verified) {
                throw {
                  statusCode: constants.code.notAcceptable,
                  msg: constants.message.verifyEmail,
                };
              } else {
                User.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(req.id),
                    "phone.value": data.phone,
                    $or: [
                      { role: constants.accountLevel.superAdmin },
                      { role: constants.accountLevel.admin },
                    ],
                    status: true,
                    isDeleted: false,
                  },
                  {
                    "phone.is_verified": true,
                    is_verified: true,
                  },
                  { new: true }
                )
                  .then(async (user_detail) => {
                    if (!user_detail) {
                      throw {
                        statusCode: constants.code.internalServerError,
                        msg: constants.message.internalServerError,
                      };
                    } else {
                      OTP.findOneAndDelete({
                        phone: data.phone,
                      })
                        .then((data) => {
                          res.status(constants.code.success).json({
                            status: constants.status.statusTrue,
                            userStatus: req.status,
                            message: constants.message.phoneVerified,
                          });
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

const updateEmail = async (req: any, res: Response, next: NextFunction) => {
  try {
    OTP.findOne({ email: await toLowerCase(req.body.email) })
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else if ((await minutes(data.updatedAt)) >= 5) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.otpExpire,
          };
        } else if (data.otp !== req.body.otp) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.invalidOTP,
          };
        } else {
          User.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(req.id),
              role: constants.accountLevel.admin,
              status: true,
              isDeleted: false,
            },
            {
              email: {
                value: await toLowerCase(data.email),
                is_verified: true,
              },
            },
            { new: true }
          )
            .then(async (user_detail) => {
              if (!user_detail) {
                throw {
                  statusCode: constants.code.internalServerError,
                  msg: constants.message.internalServerError,
                };
              } else {
                OTP.findOneAndDelete({
                  email: await toLowerCase(data.email),
                })
                  .then((data) => {
                    res.status(constants.code.success).json({
                      status: constants.status.statusTrue,
                      userStatus: req.status,
                      message: constants.message.emailUpdated,
                    });
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

const updatePhone = async (req: any, res: Response, next: NextFunction) => {
  try {
    OTP.findOne({ phone: req.body.phone })
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else if ((await minutes(data.updatedAt)) >= 5) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.otpExpire,
          };
        } else if (data.otp !== req.body.otp) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.invalidOTP,
          };
        } else {
          User.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(req.id),
              role: constants.accountLevel.admin,
              status: true,
              isDeleted: false,
            },
            {
              phone: {
                value: data.phone,
                is_verified: true,
              },
            },
            { new: true }
          )
            .then(async (user_detail) => {
              if (!user_detail) {
                throw {
                  statusCode: constants.code.internalServerError,
                  msg: constants.message.internalServerError,
                };
              } else {
                OTP.findOneAndDelete({
                  phone: data.phone,
                })
                  .then((data) => {
                    res.status(constants.code.success).json({
                      status: constants.status.statusTrue,
                      userStatus: req.status,
                      message: constants.message.phoneUpdated,
                    });
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

const changePassword = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.body.old_password === req.body.new_password) {
      throw {
        statusCode: constants.code.preconditionFailed,
        msg: constants.message.diffPassword,
      };
    } else {
      User.findOne({
        _id: new mongoose.Types.ObjectId(req.id),
        $or: [
          { role: constants.accountLevel.superAdmin },
          { role: constants.accountLevel.admin },
          { role: constants.accountLevel.manager },
        ],
        status: true,
        isDeleted: false,
      })
        .then(async (data: any) => {
          if (!data) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            };
          } else if (
            (await checkPassword(req.body.old_password, data.password)) !== true
          ) {
            throw {
              statusCode: constants.code.preconditionFailed,
              msg: constants.message.invalidOldPassword,
            };
          } else {
            User.findOneAndUpdate(
              {
                _id: new mongoose.Types.ObjectId(req.id),
                $or: [
                  { role: constants.accountLevel.superAdmin },
                  { role: constants.accountLevel.admin },
                  { role: constants.accountLevel.manager },
                ],
                status: true,
                isDeleted: false,
              },
              {
                password: await hashPassword(req.body.new_password),
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

const manageAuthentication = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    User.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.id),
        $or: [
          { role: constants.accountLevel.superAdmin },
          { role: constants.accountLevel.admin },
        ],
        status: true,
        isDeleted: false,
      },
      {
        is_2FA: {
          value: req.body.is_2FA,
          is_verified: false,
        },
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
        } else if (!data.is_2FA?.value) {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: constants.message.twoFactorOff,
          });
        } else {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: constants.message.twoFactoreOn,
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

const managePushNotification = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    User.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.id),
        $or: [
          { role: constants.accountLevel.superAdmin },
          { role: constants.accountLevel.admin },
        ],
        status: true,
        isDeleted: false,
      },
      {
        "notification.push_notification": req.body.is_notification,
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
        } else if (!data.notification?.push_notification) {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: constants.message.pushNotificationOff,
          });
        } else {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: constants.message.pushNotificationOn,
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

const manageEmailNotification = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    User.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.id),
        $or: [
          { role: constants.accountLevel.superAdmin },
          { role: constants.accountLevel.admin },
        ],
        status: true,
        isDeleted: false,
      },
      {
        "notification.email_notification": req.body.is_notification,
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
        } else if (!data.notification?.email_notification) {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: constants.message.emailNotificationOff,
          });
        } else {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: constants.message.emailNotificationOn,
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

const manageMessageNotification = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    User.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.id),
        $or: [
          { role: constants.accountLevel.superAdmin },
          { role: constants.accountLevel.admin },
        ],
        status: true,
        isDeleted: false,
      },
      {
        "notification.sms_notification": req.body.is_notification,
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
        } else if (!data.notification?.sms_notification) {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: constants.message.messageNotificationOff,
          });
        } else {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: constants.message.messageNotificationOn,
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

const deactivateAccount = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.status) {
      throw {
        statusCode: constants.code.preconditionFailed,
        msg: constants.message.invalidType,
      };
    } else {
      User.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.id),
          role: constants.accountLevel.admin,
          status: true,
          isDeleted: false,
        },
        {
          status: req.body.status,
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
              message: constants.message.userDisable,
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
          _id: new mongoose.Types.ObjectId(req.id),
          role: constants.accountLevel.admin,
          status: true,
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
              message: constants.message.userRemove,
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

const logout = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOne({
      _id: new mongoose.Types.ObjectId(req.id),
      $or: [
        { role: constants.accountLevel.superAdmin },
        { role: constants.accountLevel.admin },
        { role: constants.accountLevel.manager },
      ],
      status: true,
      isDeleted: false,
    })
      .then(async (data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          await deleteToken(req.token);
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: constants.status.statusFalse,
            message: constants.message.logout,
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

const logoutFromAll = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOne({
      _id: new mongoose.Types.ObjectId(req.id),
      $or: [
        { role: constants.accountLevel.superAdmin },
        { role: constants.accountLevel.admin },
        { role: constants.accountLevel.manager },
      ],
      status: true,
      isDeleted: false,
    })
      .then(async (data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          await deleteAllToken(req.token);
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: constants.status.statusFalse,
            message: constants.message.logoutAll,
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

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    User.findOneAndUpdate(
      {
        "email.value": await toLowerCase(req.body.email),
        $or: [
          { role: constants.accountLevel.superAdmin },
          { role: constants.accountLevel.admin },
          { role: constants.accountLevel.manager },
        ],
      },
      {
        verifyToken: await randomToken(),
      },
      {
        new: true,
      }
    )
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.invalidEmail,
          };
        } else {
          const payload = {
            to: data?.email.value,
            title: constants.emailTitle.resetPassword,
            data: `${process.env.ADMIN}${data.verifyToken}`,
          };
          await sendMail(payload);
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: constants.status.statusFalse,
            message: constants.message.resetEmail,
          });
        }
      })
      .catch((err) => {
        res.status(err.statusCode).json({
          status: constants.status.statusFalse,
          userStatus: constants.status.statusFalse,
          message: err.msg,
        });
      });
  } catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: constants.status.statusFalse,
      message: err,
    });
  }
};

// const resetPassword = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     User.findOne({
//       verifyToken: req.body.verify_token,
//       role: constants.accountLevel.admin,
//     })
//       .then(async (data: any) => {
//         if (!data) {
//           throw {
//             statusCode: constants.code.dataNotFound,
//             msg: constants.message.invalidVerifyToken,
//           };
//         } else if ((await minutes(data.updatedAt)) >= 10) {
//           throw {
//             statusCode: constants.code.preconditionFailed,
//             msg: constants.message.tokenExpire,
//           };
//         } else if (
//           (await checkPassword(req.body.password, data.password)) === true
//         ) {
//           throw {
//             statusCode: constants.code.preconditionFailed,
//             msg: constants.message.diffPassword,
//           };
//         } else {
//           User.findOneAndUpdate(
//             {
//               verifyToken: req.body.verify_token,
//               role: constants.accountLevel.admin,
//             },
//             {
//               password: await hashPassword(req.body.password),
//               verifyToken: null,
//             },
//             {
//               new: true,
//             }
//           )
//             .then((data) => {
//               if (!data) {
//                 throw {
//                   statusCode: constants.code.dataNotFound,
//                   msg: constants.message.dataNotFound,
//                 };
//               } else {
//                 res.status(constants.code.success).json({
//                   status: constants.status.statusTrue,
//                   userStatus: constants.status.statusFalse,
//                   message: constants.message.passChange,
//                 });
//               }
//             })
//             .catch((err) => {
//               res.status(err.statusCode).json({
//                 status: constants.status.statusFalse,
//                 userStatus: constants.status.statusFalse,
//                 message: err.msg,
//               });
//             });
//         }
//       })
//       .catch((err) => {
//         res.status(err.statusCode).json({
//           status: constants.status.statusFalse,
//           userStatus: constants.status.statusFalse,
//           message: err.msg,
//         });
//       });
//   } catch (err) {
//     res.status(constants.code.internalServerError).json({
//       status: constants.status.statusFalse,
//       userStatus: constants.status.statusFalse,
//       message: err,
//     });
//   }
// };

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    User.findOne({
      verifyToken: req.body.verify_token,
      $or: [
        { role: constants.accountLevel.superAdmin },
        { role: constants.accountLevel.admin },
        { role: constants.accountLevel.manager },
      ],
    })
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.invalidVerifyToken,
          };
        } else if ((await minutes(data.updatedAt)) >= 10) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.tokenExpire,
          };
        } else if (
          (await checkPassword(req.body.password, data.password)) === true
        ) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.diffPassword,
          };
        } else {
          User.findOneAndUpdate(
            {
              verifyToken: req.body.verify_token,
              $or: [
                { role: constants.accountLevel.superAdmin },
                { role: constants.accountLevel.admin },
                { role: constants.accountLevel.manager },
              ],
            },
            {
              password: await hashPassword(req.body.password),
              verifyToken: null,
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
              } else {
                res.status(constants.code.success).json({
                  status: constants.status.statusTrue,
                  userStatus: constants.status.statusFalse,
                  message: constants.message.passChange,
                });
              }
            })
            .catch((err) => {
              res.status(err.statusCode).json({
                status: constants.status.statusFalse,
                userStatus: constants.status.statusFalse,
                message: err.msg,
              });
            });
        }
      })
      .catch((err) => {
        res.status(err.statusCode).json({
          status: constants.status.statusFalse,
          userStatus: constants.status.statusFalse,
          message: err.msg,
        });
      });
  } catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: constants.status.statusFalse,
      message: err,
    });
  }
};


export default {
  login,
  getDetail,
  changeProfilePicture,
  updateDetail,
  verifyEmail,
  verifyPhone,
  updateEmail,
  updatePhone,
  changePassword,
  manageAuthentication,
  managePushNotification,
  manageEmailNotification,
  manageMessageNotification,
  deactivateAccount,
  deleteAccount,
  logout,
  logoutFromAll,
  forgotPassword,
  resetPassword,
};
