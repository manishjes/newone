 import{ Request, Response, NextFunction } from "express";
import constants from "../../utils/constants";
import mongoose from "mongoose";
import message from "./userConstant";
import {
  createToken,
  createTokenMobile,
  deleteAllToken,
  deleteToken,
} from "../../helpers/token";
import {
  checkPassword,
  getFileName,
  getUsername,
  hashPassword,
  jwtDecode,
  minutes,
  photoUrl,
  randomToken,
  removePhoto,
  toLowerCase,
  getIPInfo,
  randomNumber
} from "../../helpers/helper";
import sendMessage from "../../services/sms-service";
import User from "../../models/user";
import Device from "../../models/device";
import OTP from "../../models/otp";
import Spin from "../../models/spin";
import sendMail from "../../helpers/mail";
import firebaseMessaging from "../../config/firebaseConfig"




const register = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.create({
      fullName: req.body.fullName,
      username: await getUsername(req.body.email),
      email: { value: await toLowerCase(req.body.email) },
      phone: { value: req.body.phone },
      // password: await hashPassword(req.body.password),
      role: constants.accountLevel.user,
    })
      .then(async (user_detail) => {
        if (!user_detail) {
          throw {
            statusCode: constants.code.internalServerError,
            msg: constants.message.internalServerError,
          };
        } else {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: constants.status.statusFalse,
            message: constants.message.userSuccess,
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


const sendOTPMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    OTP.findOneAndUpdate(
      {
        phone: req.body.phone,
      },
      {
        phone: req.body.phone,
        otp: await randomNumber(),
      },
      { new: true, upsert: true }
    )
      .then(async (data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          const payload = {
            to: data?.phone,
            title: constants.smsTitle.otp,
            data: data?.otp,
          };

          await sendMessage(payload);
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: constants.status.statusFalse,
            message: constants.message.otpMessageSent,
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

const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    OTP.findOne({phone: req.body.phone})
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
          OTP.findOneAndDelete({
            phone: req.body.phone
          })
            .then((data) => {
              res.status(constants.code.success).json({
                status: constants.status.statusTrue,
                userStatus: constants.status.statusFalse,
                message: constants.message.otpSuccess,
              });
            })
            .catch((err) => {
              res.status(constants.code.preconditionFailed).json({
                status: constants.status.statusFalse,
                userStatus: constants.status.statusFalse,
                message: err,
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


const login = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOne({ "phone.value": req.body.phone })
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.invalidPhone,
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
        } else if (data.role !== constants.accountLevel.user) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.invalidUser,
          };
        } else if (
          !req.body.device_info.latitude &&
          !req.body.device_info.latitude
        ) {
          Device.findOneAndUpdate(
            { deviceId: req.body.device_info.deviceId, userId: data._id },
            {
              userId: data._id,
              deviceId: req.body.device_info.deviceId,
              appId: req.body.device_info.appId,
              name: req.body.device_info.name,
              model: req.body.device_info.model,
              platform: req.body.device_info.platform,
              version: req.body.device_info.version,
              ipAddress: !req.body.device_info.ip
                ? req.clientIp
                : req.body.device_info.ip,
              createdBy: data._id,
            },
            {
              upsert: true,
              new: true,
            }
          )
            .then(async (deviceDetail) => {
              if (!deviceDetail) {
                throw {
                  statusCode: constants.code.internalServerError,
                  msg: constants.message.internalServerError,
                };
              } else {
                const ipData = await getIPInfo(deviceDetail.ipAddress);
                Device.findOneAndUpdate(
                  { deviceId: deviceDetail.deviceId },
                  { latitude: ipData.lat, longitude: ipData.lon },
                  { upsert: true }
                )
                  .then(async (newDeviceDetail) => {
                    if (!newDeviceDetail) {
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
        } else {
          Device.findOneAndUpdate(
            { deviceId: req.body.device_info.deviceId, userId: data._id },
            {
              userId: data._id,
              deviceId: req.body.device_info.deviceId,
              appId: req.body.device_info.appId,
              name: req.body.device_info.name,
              model: req.body.device_info.model,
              platform: req.body.device_info.platform,
              version: req.body.device_info.version,
              ipAddress: !req.body.device_info.ip
                ? req.clientIp
                : req.body.device_info.ip,
              latitude: req.body.device_info.latitude,
              longitude: req.body.device_info.longitude,
              createdBy: data._id,
            },
            {
              upsert: true,
              new: true,
            }
          )
            .then(async (deviceDetail) => {
              if (!deviceDetail) {
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

const userlogin = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOne({ "phone.value": req.body.phone })
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.invalidPhone,
          };
        }  else if (!data.status) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.userInactive,
          };
        } else if (data.isDeleted) {
         
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.userDeleted,
          };
        }
        else{
          OTP.findOneAndUpdate(
            {
              phone: req.body.phone,
            },
            {
              phone: req.body.phone,
              otp: await randomNumber(),
            },
            { new: true, upsert: true }
          )
            .then(async (data) => {
              if (!data) {
                throw {
                  statusCode: constants.code.dataNotFound,
                  msg: constants.message.dataNotFound,
                };
              } else {
                const payload = {
                  to: data?.phone,
                  title: constants.smsTitle.otp,
                  data: data?.otp,
                };
      
                await sendMessage(payload);
                res.status(constants.code.success).json({
                  status: constants.status.statusTrue,
                  userStatus: constants.status.statusFalse,
                  message: constants.message.otpMessageSent,
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


const userVerify = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOne({ "phone.value": req.body.phone })
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.invalidPhone,
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
        } else if (data.role !== constants.accountLevel.user) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.invalidUser,
          };
        } 
        else{
          OTP.findOne({ phone: req.body.phone })
          .then(async (otpData: any) => {
            if (!otpData) {
              throw {
                statusCode: constants.code.dataNotFound,
                msg: constants.message.dataNotFound,
              };
            } else if ((await minutes(otpData.updatedAt)) >= 5) {
              throw {
                statusCode: constants.code.preconditionFailed,
                msg: constants.message.otpExpire,
              };
            } else if (otpData.otp !== req.body.otp) {
              throw {
                statusCode: constants.code.preconditionFailed,
                msg: constants.message.invalidOTP,
              };
            } else {
              OTP.findOneAndDelete({
                phone: req.body.phone,
              })
                .then((otpdeleteData) => {
              if (
                !req.body.device_info.latitude &&
                !req.body.device_info.latitude
              ) {
                Device.findOneAndUpdate(
                  { deviceId: req.body.device_info.deviceId, userId: data._id },
                  {
                    userId: data._id,
                    deviceId: req.body.device_info.deviceId,
                    appId: req.body.device_info.appId,
                    name: req.body.device_info.name,
                    model: req.body.device_info.model,
                    platform: req.body.device_info.platform,
                    version: req.body.device_info.version,
                    fcm_Token: req.body.device_info.fcmToken,
                    ipAddress: !req.body.device_info.ip
                      ? req.clientIp
                      : req.body.device_info.ip,
                    createdBy: data._id,
                  },
                  {
                    upsert: true,
                    new: true,
                  }
                )
                  .then(async (deviceDetail) => {
                    if (!deviceDetail) {
                      throw {
                        statusCode: constants.code.internalServerError,
                        msg: constants.message.internalServerError,
                      };
                    } else {
                      const ipData = await getIPInfo(deviceDetail.ipAddress);
                      Device.findOneAndUpdate(
                        { deviceId: deviceDetail.deviceId },
                        { latitude: ipData.lat, longitude: ipData.lon },
                        { upsert: true }
                      )
                        .then(async (newDeviceDetail) => {
                          if (!newDeviceDetail) {
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
              } else {
                Device.findOneAndUpdate(
                  { deviceId: req.body.device_info.deviceId, userId: data._id },
                  {
                    userId: data._id,
                    deviceId: req.body.device_info.deviceId,
                    appId: req.body.device_info.appId,
                    name: req.body.device_info.name,
                    model: req.body.device_info.model,
                    platform: req.body.device_info.platform,
                    version: req.body.device_info.version,
                    fcm_Token: req.body.device_info.fcmToken,
                    ipAddress: !req.body.device_info.ip
                      ? req.clientIp
                      : req.body.device_info.ip,
                    latitude: req.body.device_info.latitude,
                    longitude: req.body.device_info.longitude,
                    createdBy: data._id,
                  },
                  {
                    upsert: true,
                    new: true,
                  }
                )
                  .then(async (deviceDetail) => {
                    if (!deviceDetail) {
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
            }).catch((err) => {
              res.status(err.statusCode).json({
                status: constants.status.statusFalse,
                userStatus: constants.status.statusFalse,
                message: err.msg,
              });
            });
            }
          }).catch((err) => {
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
}



const googleLogin = async (req: any, res: Response, next: NextFunction) => {
  try {
    const googleData: any = await jwtDecode(req.body.credential);
    User.findOne({ "email.value": await toLowerCase(googleData.email) })
      .then(async (data: any) => {
        if (!data) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.invalidEmail,
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
        } else if (data.role !== constants.accountLevel.user) {
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
      role: constants.accountLevel.user,
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
      role: constants.accountLevel.user,
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
              role: constants.accountLevel.user,
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
              role: constants.accountLevel.user,
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


    User.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.id),
        role: constants.accountLevel.user,
        status: true,
        isDeleted: false,
      },
      {
        fullName: req.body.fullName,
        email: { value: await toLowerCase(req.body.email) },
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
    User.findOne({
      _id: new mongoose.Types.ObjectId(req.id),
      role: constants.accountLevel.user,
      status: true,
      isDeleted: false,
    })
      .then(async (user_detail: any) => {
        if (!user_detail) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          OTP.findOne({ email: await toLowerCase(user_detail.email.value) })
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
                    _id: new mongoose.Types.ObjectId(user_detail._id),
                    role: constants.accountLevel.user,
                    status: true,
                    isDeleted: false,
                  },
                  {
                    "email.is_verified": true,
                  },
                  { new: true }
                )
                  .then(async (data) => {
                    if (!data) {
                      throw {
                        statusCode: constants.code.internalServerError,
                        msg: constants.message.internalServerError,
                      };
                    } else {
                      OTP.findOneAndDelete({
                        email: await toLowerCase(user_detail.email.value),
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
    User.findOne({
      _id: new mongoose.Types.ObjectId(req.id),
      role: constants.accountLevel.user,
      status: true,
      isDeleted: false,
    })
      .then(async (user_detail: any) => {
        if (!user_detail) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else if (!user_detail.email.is_verified) {
          throw {
            statusCode: constants.code.badRequest,
            msg: constants.message.verifyEmail,
          };
        } else {
          OTP.findOne({ phone: user_detail.phone.value })
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
                    _id: new mongoose.Types.ObjectId(user_detail._id),
                    role: constants.accountLevel.user,
                    status: true,
                    isDeleted: false,
                  },
                  {
                    "phone.is_verified": true,
                    is_verified: true,
                  },
                  { new: true }
                )
                  .then(async (data) => {
                    if (!data) {
                      throw {
                        statusCode: constants.code.internalServerError,
                        msg: constants.message.internalServerError,
                      };
                    } else {
                      OTP.findOneAndDelete({
                        phone: user_detail.phone.value,
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
              role: constants.accountLevel.user,
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

    User.exists({
      "phone.value": req.body.phone,
      _id: {
        $nin: [new mongoose.Types.ObjectId(req.id)],
      },
    })
      .then(async (data) => {
        if (data) {
          throw {
            statusCode: constants.code.preconditionFailed,
            msg: constants.message.phoneTaken,
          };
        } else {

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
              role: constants.accountLevel.user,
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
        role: constants.accountLevel.user,
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
                role: constants.accountLevel.user,
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

const managePushNotification = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    User.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.id),
        role: constants.accountLevel.user,
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
        role: constants.accountLevel.user,
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
        role: constants.accountLevel.user,
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
          role: constants.accountLevel.user,
          status: true,
          isDeleted: false,
        },
        {
          status: req.body.status,
          deactivateReason: req.body.reason
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
          role: constants.accountLevel.user,
          status: true,
          isDeleted: false,
        },
        {
          isDeleted: req.body.is_delete,
          deleteReason: req.body.deleteReason
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
      role: constants.accountLevel.user,
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
      role: constants.accountLevel.user,
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
        "email.value": req.body.email,
        role: constants.accountLevel.user,
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
            msg: constants.message.invalidPhone,
          };
        } else {
          const payload = {
            to: data?.email.value,
            title: constants.emailTitle.resetPassword,
            data: `${process.env.MAIN}${data.verifyToken}`,
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



const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    User.findOne({
      verifyToken: req.body.verify_token,
      role: constants.accountLevel.user,
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
              role: constants.accountLevel.user,
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


const sendNotification = async(req:any, res:Response, next:NextFunction)=>{
  try {
    const { title, body, imageUrl } = req.body;
    const token:any = await Device.find({ fcm_Token: { $exists: true } });
    const tokens:any = token.map((token:any) => token.fcm_Token);
   // const tokens:any = ["d6fyub2TQ7GQ91BVpqQAHz:APA91bFj9UzZoVE7Wr9nrBgGIZ3KE0nbCYi725fvN23HOkc3N6rZFdrejVWX0SqYd-I4CjiGiJNTr4FYydXoicDmRi8Rk-lFMoP0BT5fssNOCHFCsea9IzEJLRqFwdqujYgrvfPoiieG"];
   await firebaseMessaging.sendMulticast({
    tokens,
    notification: {
      title,
      body,
      imageUrl,
    },
    android: {
      notification: {
        sound: "https://firebasestorage.googleapis.com/v0/b/message-3e081.appspot.com/o/sounds%2Fnotification-3-158189.mp3?alt=media&token=ab052eca-b792-4cfc-8b14-6621de83d647", 
      },
    },
  });
    res.status(200).json({ message: "Successfully sent notifications!" });
  } catch (err) {
    res
      .status(500)
      .json({message:"Something went wrong!" });
  }
}




const sendNotificationss = async (req: any, res: Response, next: NextFunction) => {
  try {
    // const { title, body, imageUrl } = req.body;
    // const token:any = await Device.find({ fcm_Token: { $exists: true } });
    // const tokens:any = token.map((token:any) => token.fcm_Token);
    // const tokens:any = ["d6fyub2TQ7GQ91BVpqQAHz:APA91bFj9UzZoVE7Wr9nrBgGIZ3KE0nbCYi725fvN23HOkc3N6rZFdrejVWX0SqYd-I4CjiGiJNTr4FYydXoicDmRi8Rk-lFMoP0BT5fssNOCHFCsea9IzEJLRqFwdqujYgrvfPoiieG"];

     let token = "dj9acH4l4Ziqof9P1820dz:APA91bFg0PEpJQf1bBrUF6icp5sgFw9CezmJb8iFA_gZ38YOmjFThPQJY_xlon4FI7xOqOooopplFSfYwqpaXPJhxfPgYtKT04u_g2tdt7Q0UwmdY59swfhom1omplUySwxaETySgiTp"
    const message = {
      
      notification: {
        title: req.body.title,
        body: req.body.body,
       // imageUrl: req.body.imageUrl
      },
    
      token,
    };
    const response = await firebaseMessaging.send(message);
    res.status(constants.code.success).json({

      message: "success"
    })
  } catch (error:any) {
    console.log(error);
    throw new Error(error?.message || `Internal server error!`);
  }
  }







export default {
  register,
  login,
  userlogin,
  userVerify,
  googleLogin,
  getDetail,
  changeProfilePicture,
  updateDetail,
  verifyEmail,
  verifyPhone,
  updateEmail,
  updatePhone,
  changePassword,
  managePushNotification,
  manageEmailNotification,
  manageMessageNotification,
  deactivateAccount,
  deleteAccount,
  logout,
  logoutFromAll,
  forgotPassword,
  resetPassword,
  sendOTPMessage,
  verifyOTP,
  sendNotification,
  sendNotificationss
};
