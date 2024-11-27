import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import Outlet from "../../../models/outlet";
import message from "./outletConstant";
import Address from "../../../models/address";
import {
  createSlug,
  imageUrl,
  getPinDetail,
  removeImage,
  getFileName,
} from "../../../helpers/helper";
import mongoose from "mongoose";
import User from "../../../models/user";

const addOutlet = async (req: any, res: Response, next: NextFunction) => {
  try {
    await getPinDetail(req.body.pin_code)
      .then(async (pinData: any) => {
        if (!pinData) {
          throw {
            statusCode: constants.code.dataNotFound,
            message: message.correctPin,
          };

        } else {
          Outlet.findOne({
            managerId: new mongoose.Types.ObjectId(req.body.managerId),
            isDeleted: false
          }).then(async (managerData) => {
            if (managerData) {
              throw {
                statusCode: constants.code.preconditionFailed,
                message: message.managerExists,
              }
            }
            else {
              await Outlet.findOne({
                slug: await createSlug(req.body.name),
                isDeleted: false,
                status: true,
              })
                .then(async (outletExists: any) => {
                  if (outletExists) {
                    throw {
                      statusCode: constants.code.badRequest,
                      message: message.OutletExists,
                    };
                  } else {
                    const imageList: any = [];
                    for (let i = 0; i < req.files.length; i++) {
                      imageList.push(
                        await imageUrl(req.headers.host, req.files[i].filename)
                      );
                    }

                    const latitude = req.body.latitude;
                    const longitude = req.body.longitude;

                    const timings = [];
                    for (let i = 0; i < req.body.timings.length; i++) {
                      const timing = {
                        day: req.body.timings[i].day,
                        openingTime: req.body.timings[i].openingTime,
                        closingTime: req.body.timings[i].closingTime,
                      };
                      timings.push(timing);
                    }

                    Outlet.create({
                      name: req.body.name,
                      slug: await createSlug(req.body.name),
                      description: req.body.description,
                      images: imageList,
                      brandId: new mongoose.Types.ObjectId(req.body.brandId),
                      managerId: new mongoose.Types.ObjectId(req.body.managerId),
                      location: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)],
                      },
                      priceForTwo: req.body.priceForTwo,
                      status: req.body.outletStatus,
                      timings: timings,

                      createdBy: req.id,
                    })
                      .then((outletDetail) => {
                        if (!outletDetail) {
                          throw {
                            statusCode: constants.code.badRequest,
                            message: message.outletAddFailed,
                          };
                        } else {
                          Address.findOneAndUpdate(
                            {
                              OutletId: new mongoose.Types.ObjectId(
                                outletDetail._id
                              ),
                              isDeleted: false,
                              status: true,
                            },
                            {
                              $set: {
                                address: {
                                  line_one: req.body.address_line_one,
                                  line_two: req.body.address_line_two,
                                  city: pinData.cityId,
                                  state: pinData.stateId,
                                  country: pinData.countryId,
                                  pin_code: req.body.pin_code,
                                },
                              },
                            },
                            {
                              new: true,
                              upsert: true,
                            }
                          )
                            .then((addressData) => {
                              if (!addressData) {
                                throw {
                                  statusCode: constants.code.dataNotFound,
                                  message: constants.message.dataNotFound,
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
                              res.status(constants.code.preconditionFailed).json({
                                status: constants.status.statusFalse,
                                userStatus: req.status,
                                message: err.message,
                              });
                            });
                        }
                      })
                      .catch((err) => {
                        res
                          .status(
                            err.statusCode || constants.code.preconditionFailed
                          )
                          .json({
                            status: constants.status.statusFalse,
                            userStatus: req.status,
                            message: err.message || message.outletAddFailed,
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

            }

          }).catch((err) => {
            res.status(constants.code.preconditionFailed).json({
              status: constants.status.statusFalse,
              userStatus: req.status,
              message: err.message,
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
  } catch (error) {
    res.status(constants.code.preconditionFailed).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: error,
    });
  }
};

// const updateOutlet = async (
//   req: any,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     await getPinDetail(req.body.pin_code)
//       .then(async (pinData) => {
//         if (!pinData) {
//           throw {
//             statusCode: constants.code.dataNotFound,
//             message: message.correctPin,
//           };
//         } else {
//           Outlet.exists({
//             _id: {
//               $nin: [new mongoose.Types.ObjectId(req.params.outlet_id)],
//             },
//             slug: await createSlug(req.body.name),
//             isDeleted: false,
//           })
//             .then(async (data) => {
//               if (data) {
//                 throw {
//                   statusCode: constants.code.badRequest,
//                   message: message.OutletExists,
//                 };
//               } else {
//                 Outlet.findOne({
//                   _id: new mongoose.Types.ObjectId(
//                     req.params.outlet_id
//                   )
//                 }, {
//                   images: 1,
//                 }).then(async (outlet_data) => {
//                   if (!outlet_data) {
//                     throw {
//                       statusCode:
//                         constants.code.dataNotFound,
//                       message: constants.message.dataNotFound,
//                     };
//                   } else {
//                     for (
//                       let i = 0;
//                       i < outlet_data.images.length;
//                       i++
//                     ) {
//                       await removeImage(
//                         await getFileName(
//                           outlet_data.images[i]
//                         )
//                       );
//                     }

//                     const imageList: any = [];
//                     for (
//                       let i = 0;
//                       i < req.files.length;
//                       i++
//                     ) {
//                       imageList.push(
//                         await imageUrl(
//                           req.headers.host,
//                           req.files[i].filename
//                         )
//                       );
//                     }
//                     Outlet.findOneAndUpdate(
//                       {
//                         _id: new mongoose.Types.ObjectId(req.params.outlet_id),
//                         isDeleted: false,
//                         status: true,
//                       },
//                       {
//                         outletName: req.body.name,
//                         slug: await createSlug(req.body.name),
//                         description: req.body.description,
//                         images: imageList,
//                         brandId: new mongoose.Types.ObjectId(req.body.brandId),
//                       },
//                       { upsert: true }
//                     )
//                       .then((updateOutlet) => {
//                         if (!updateOutlet) {
//                           throw {
//                             statusCode: constants.code.preconditionFailed,
//                             message: constants.code.dataNotFound,
//                           };
//                         } else {
//                           Address.findOneAndUpdate(
//                             {
//                               OutletId: new mongoose.Types.ObjectId(
//                                 updateOutlet._id
//                               ),
//                               isDeleted: false,
//                               status: true,
//                             },
//                             {
//                               $set: {
//                                 address: {
//                                   line_one: req.body.address_line_one,
//                                   line_two: req.body.address_line_two,
//                                   city: pinData.cityId,
//                                   state: pinData.stateId,
//                                   country: pinData.countryId,
//                                   pin_code: req.body.pin_code,
//                                 },
//                                 landmark: req.body.landmark,
//                                 latitude: req.body.latitude,
//                                 longitude: req.body.longitude,
//                               },
//                             },
//                             {
//                               new: true,
//                               upsert: true,
//                             }
//                           )
//                             .then((addressData) => {
//                               if (!addressData) {
//                                 throw {
//                                   statusCode: constants.code.dataNotFound,
//                                   message: constants.message.dataNotFound,
//                                 };
//                               } else {
//                                 res.status(constants.code.success).json({
//                                   status: constants.status.statusTrue,
//                                   userStatus: req.status,
//                                   message: message.ouletUpdate,
//                                 });
//                               }
//                             })
//                             .catch((err) => {
//                               res.status(err.statusCode).json({
//                                 status: constants.status.statusFalse,
//                                 userStatus: req.status,
//                                 message: err.message,
//                               });
//                             });
//                         }
//                       })
//                       .catch((err) => {
//                         res
//                           .status(
//                             err.statusCode || constants.code.preconditionFailed
//                           )
//                           .json({
//                             status: constants.status.statusFalse,
//                             userStatus: req.status,
//                             message: err.message || err,
//                           });
//                       });
//                   }
//                 }).catch((err) => {
//                   res.status(err.statusCode).json({
//                     status: constants.status.statusFalse,
//                     userStatus: req.status,
//                     message: err.message,
//                   });
//                 });

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
//         res.status(constants.code.preconditionFailed).json({
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


const updateOutlet = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    await getPinDetail(req.body.pin_code)
      .then(async (pinData) => {
        if (!pinData) {
          throw {
            statusCode: constants.code.dataNotFound,
            message: message.correctPin,
          };
        } else {

          Outlet.findOne({
            _id: {
              $nin: [new mongoose.Types.ObjectId(req.params.outlet_id)],
            },
            managerId: new mongoose.Types.ObjectId(req.body.managerId)
          }).then(async (managerData) => {
            if (managerData) {
              throw {
                statusCode: constants.code.preconditionFailed,
                message: message.managerExists,
              }
            }
            else {

              Outlet.exists({
                _id: {
                  $nin: [new mongoose.Types.ObjectId(req.params.outlet_id)],
                },
                slug: await createSlug(req.body.name),
                isDeleted: false,
              })
                .then(async (data) => {
                  if (data) {
                    throw {
                      statusCode: constants.code.badRequest,
                      message: message.OutletExists,
                    };
                  } else {
                    Outlet.findOne({
                      _id: new mongoose.Types.ObjectId(
                        req.params.outlet_id
                      )
                    }, {
                      images: 1,
                    }).then(async (outlet_data) => {
                      if (!outlet_data) {
                        throw {
                          statusCode:
                            constants.code.dataNotFound,
                          message: constants.message.dataNotFound,
                        };
                      } else {
                        for (
                          let i = 0;
                          i < outlet_data.images.length;
                          i++
                        ) {
                          await removeImage(
                            await getFileName(
                              outlet_data.images[i]
                            )
                          );
                        }

                        const imageList: any = [];
                        for (
                          let i = 0;
                          i < req.files.length;
                          i++
                        ) {
                          imageList.push(
                            await imageUrl(
                              req.headers.host,
                              req.files[i].filename
                            )
                          );
                        }


                        const latitude = req.body.latitude;
                        const longitude = req.body.longitude;

                        const timings = [];
                        for (let i = 0; i < req.body.timings.length; i++) {
                          const timing = {
                            day: req.body.timings[i].day,
                            openingTime: req.body.timings[i].openingTime,
                            closingTime: req.body.timings[i].closingTime,
                          };
                          timings.push(timing);
                        }


                        Outlet.findOneAndUpdate(
                          {
                            _id: new mongoose.Types.ObjectId(req.params.outlet_id),
                            isDeleted: false,
                            status: true,
                          },
                          {
                            name: req.body.name,
                            slug: await createSlug(req.body.name),
                            description: req.body.description,
                            images: imageList,
                            brandId: new mongoose.Types.ObjectId(req.body.brandId),
                            managerId: new mongoose.Types.ObjectId(req.body.managerId),
                            location: {
                              type: "Point",
                              coordinates: [parseFloat(longitude), parseFloat(latitude)],
                            },
                            priceForTwo: req.body.priceForTwo,
                            timings: timings,
                          },
                          { upsert: true }
                        )
                          .then((updateOutlet) => {
                            if (!updateOutlet) {
                              throw {
                                statusCode: constants.code.preconditionFailed,
                                message: constants.code.dataNotFound,
                              };
                            } else {
                              Address.findOneAndUpdate(
                                {
                                  OutletId: new mongoose.Types.ObjectId(
                                    updateOutlet._id
                                  ),
                                  isDeleted: false,
                                  status: true,
                                },
                                {
                                  $set: {
                                    address: {
                                      line_one: req.body.address_line_one,
                                      line_two: req.body.address_line_two,
                                      city: pinData.cityId,
                                      state: pinData.stateId,
                                      country: pinData.countryId,
                                      pin_code: req.body.pin_code,
                                    },
                                  },
                                },
                                {
                                  new: true,
                                  upsert: true,
                                }
                              )
                                .then((addressData) => {
                                  if (!addressData) {
                                    throw {
                                      statusCode: constants.code.dataNotFound,
                                      message: constants.message.dataNotFound,
                                    };
                                  } else {
                                    res.status(constants.code.success).json({
                                      status: constants.status.statusTrue,
                                      userStatus: req.status,
                                      message: message.ouletUpdate,
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
                            res
                              .status(
                                err.statusCode || constants.code.preconditionFailed
                              )
                              .json({
                                status: constants.status.statusFalse,
                                userStatus: req.status,
                                message: err.message || err,
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
          }).catch((err) => {
            res.status(constants.code.preconditionFailed).json({
              status: constants.status.statusFalse,
              userStatus: req.status,
              message: err.message,
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
  } catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
};


const outletUpdate = async (req: any, res: Response, next: NextFunction) => {
  try {
    Outlet.findOne({
      _id: new mongoose.Types.ObjectId(req.params.outlet_id),
      isDeleted: false,
    })
      .then(async (data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {

          await getPinDetail(req.body.pin_code)
            .then(async (pinData) => {
              if (!pinData) {
                throw {
                  statusCode: constants.code.dataNotFound,
                  message: message.correctPin,
                };
              } else {

                Outlet.findOne({
                  _id: {
                    $nin: [new mongoose.Types.ObjectId(req.params.outlet_id)],
                  },
                  managerId: new mongoose.Types.ObjectId(req.body.managerId)
                }).then(async (managerData) => {
                  if (managerData) {
                    throw {
                      statusCode: constants.code.preconditionFailed,
                      message: message.managerExists,
                    }
                  }
                  else {

                    Outlet.exists({
                      slug: await createSlug(req.body.name),
                      _id: { $nin: [new mongoose.Types.ObjectId(req.params.outlet_id)] },
                      isDeleted: false,
                    })
                      .then(async (dataExist) => {
                        if (dataExist) {
                          throw {
                            statusCode: constants.code.preconditionFailed,
                            msg: message.OutletExists,
                          };
                        } else if (!req.files.length) {

                          const latitude = req.body.latitude;
                          const longitude = req.body.longitude;

                          const timings = [];
                          for (let i = 0; i < req.body.timings.length; i++) {
                            const timing = {
                              day: req.body.timings[i].day,
                              openingTime: req.body.timings[i].openingTime,
                              closingTime: req.body.timings[i].closingTime,
                            };
                            timings.push(timing);
                          }
                          Outlet.findOneAndUpdate(
                            {
                              _id: new mongoose.Types.ObjectId(req.params.outlet_id),
                              isDeleted: false,
                              status: true,
                            },
                            {
                              name: req.body.name,
                              slug: await createSlug(req.body.name),
                              description: req.body.description,
                              brandId: new mongoose.Types.ObjectId(req.body.brandId),
                              managerId: new mongoose.Types.ObjectId(req.body.managerId),
                              location: {
                                type: "Point",
                                coordinates: [parseFloat(longitude), parseFloat(latitude)],
                              },
                              priceForTwo: req.body.priceForTwo,
                              status: req.body.outletStatus,
                              timings: timings,
                            },
                            { upsert: true }
                          )
                            .then((updateOutlet) => {
                              if (!updateOutlet) {
                                throw {
                                  statusCode: constants.code.preconditionFailed,
                                  message: constants.code.dataNotFound,
                                };
                              } else {
                                Address.findOneAndUpdate(
                                  {
                                    OutletId: new mongoose.Types.ObjectId(
                                      updateOutlet._id
                                    ),
                                    isDeleted: false,
                                    status: true,
                                  },
                                  {
                                    $set: {
                                      address: {
                                        line_one: req.body.address_line_one,
                                        line_two: req.body.address_line_two,
                                        city: pinData.cityId,
                                        state: pinData.stateId,
                                        country: pinData.countryId,
                                        pin_code: req.body.pin_code,
                                      },
                                    },
                                  },
                                  {
                                    new: true,
                                    upsert: true,
                                  }
                                )
                                  .then((addressData) => {
                                    if (!addressData) {
                                      throw {
                                        statusCode: constants.code.dataNotFound,
                                        message: constants.message.dataNotFound,
                                      };
                                    } else {
                                      res.status(constants.code.success).json({
                                        status: constants.status.statusTrue,
                                        userStatus: req.status,
                                        message: message.ouletUpdate,
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
                              res
                                .status(
                                  err.statusCode || constants.code.preconditionFailed
                                )
                                .json({
                                  status: constants.status.statusFalse,
                                  userStatus: req.status,
                                  message: err.message || err,
                                });
                            });
                        }

                        else {

                          for (
                            let i = 0;
                            i < data.images.length;
                            i++
                          ) {
                            await removeImage(
                              await getFileName(
                                data.images[i]
                              )
                            );
                          }
                          const imageList: any = [];
                          for (
                            let i = 0;
                            i < req.files.length;
                            i++
                          ) {
                            imageList.push(
                              await imageUrl(
                                req.headers.host,
                                req.files[i].filename
                              )
                            );
                          }


                          const latitude = req.body.latitude;
                          const longitude = req.body.longitude;

                          const timings = [];
                          for (let i = 0; i < req.body.timings.length; i++) {
                            const timing = {
                              day: req.body.timings[i].day,
                              openingTime: req.body.timings[i].openingTime,
                              closingTime: req.body.timings[i].closingTime,
                            };
                            timings.push(timing);
                          }


                          Outlet.findOneAndUpdate(
                            {
                              _id: new mongoose.Types.ObjectId(req.params.outlet_id),
                              isDeleted: false,
                              status: true,
                            },
                            {
                              name: req.body.name,
                              slug: await createSlug(req.body.name),
                              description: req.body.description,
                              images: imageList,
                              brandId: new mongoose.Types.ObjectId(req.body.brandId),
                              managerId: new mongoose.Types.ObjectId(req.body.managerId),
                              location: {
                                type: "Point",
                                coordinates: [parseFloat(longitude), parseFloat(latitude)],
                              },
                              priceForTwo: req.body.priceForTwo,
                              status: req.body.outletStatus,
                              timings: timings,
                            },
                            { upsert: true }
                          )
                            .then((updateOutlet) => {
                              if (!updateOutlet) {
                                throw {
                                  statusCode: constants.code.preconditionFailed,
                                  message: constants.code.dataNotFound,
                                };
                              } else {
                                Address.findOneAndUpdate(
                                  {
                                    OutletId: new mongoose.Types.ObjectId(
                                      updateOutlet._id
                                    ),
                                    isDeleted: false,
                                    status: true,
                                  },
                                  {
                                    $set: {
                                      address: {
                                        line_one: req.body.address_line_one,
                                        line_two: req.body.address_line_two,
                                        city: pinData.cityId,
                                        state: pinData.stateId,
                                        country: pinData.countryId,
                                        pin_code: req.body.pin_code,
                                      },
                                    },
                                  },
                                  {
                                    new: true,
                                    upsert: true,
                                  }
                                )
                                  .then((addressData) => {
                                    if (!addressData) {
                                      throw {
                                        statusCode: constants.code.dataNotFound,
                                        message: constants.message.dataNotFound,
                                      };
                                    } else {
                                      res.status(constants.code.success).json({
                                        status: constants.status.statusTrue,
                                        userStatus: req.status,
                                        message: message.ouletUpdate,
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
                              res
                                .status(
                                  err.statusCode || constants.code.preconditionFailed
                                )
                                .json({
                                  status: constants.status.statusFalse,
                                  userStatus: req.status,
                                  message: err.message || err,
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
                }).catch((err) => {
                  res.status(constants.code.preconditionFailed).json({
                    status: constants.status.statusFalse,
                    userStatus: req.status,
                    message: err.message,
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



const listOutlet = async (req: any, res: Response, next: NextFunction) => {

  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;


    if (Number(req.query.limit) !== 0) {
      Outlet.aggregate([
        {
          $match: {
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
          $lookup: {
            from: "users",
            let: { userId: "$managerId" },
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
          $project: {
            _id: 1,
            name: 1,
            slug: 1,
            description: 1,
            images: 1,
            timings: 1,
            status: 1,
            addressLineOne: "$addressDetail.address.line_one",
            addressLineTwo: "$addressDetail.address.line_two",
            city: "$cityDetail.name",
            state: "$stateDetail.name",
            country: "$countryDetail.name",
            landmark: "$addressDetail.landmark",
            latitude: "$addressDetail.latitude",
            longitude: "$addressDetail.longitude",
            brandName: "$brandDetail.name",
            managerName: "$userDetail.fname",

            createdAt: { $toLong: "$createdAt" },
          },
        },

        {
          $match: {
            $or: [
              {
                brandName: {
                  $regex: "^" + req.query.filter + ".*",
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
          if (!data) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            };
          } else {
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.outletListed,
              metadata: data[0].metadata,
              data: data[0].data,
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
    } else {
      Outlet.aggregate([
        {
          $match: {
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
          $lookup: {
            from: "users",
            let: { userId: "$managerId" },
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
          $project: {
            _id: 1,
            name: 1,
            slug: 1,
            description: 1,
            images: 1,
            timings: 1,
            status:1,
            addressLineOne: "$addressDetail.address.line_one",
            addressLineTwo: "$addressDetail.address.line_two",
            city: "$cityDetail.name",
            state: "$stateDetail.name",
            country: "$countryDetail.name",
            landmark: "$addressDetail.landmark",
            latitude: "$addressDetail.latitude",
            longitude: "$addressDetail.longitude",
            brandName: "$brandDetail.name",
            managerName: "$userDetail.fname",

            createdAt: { $toLong: "$createdAt" },
          },
        },

        {
          $match: {
            $or: [
              {
                brandName: {
                  $regex: "^" + req.query.filter + ".*",
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
          if (!data) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            };
          } else {
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.outletListed,
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

const outletDetail = async (req: any, res: Response, next: NextFunction) => {
  try {

    Outlet.findOne({ _id: new mongoose.Types.ObjectId(req.params.outlet_id), isDeleted: false })
      .then((outletData) => {
        if (!outletData) {
          throw {
            statusCode: constants.code.dataNotFound,
            message: constants.message.dataNotFound,
          };
        } else {

          Outlet.aggregate([
            {
              $match: {
                _id: new mongoose.Types.ObjectId(req.params.outlet_id),
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
              $lookup: {
                from: "users",
                let: { userId: "$managerId" },
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
              $project: {
                _id: 1,
                name: 1,
                slug: 1,
                description: 1,
                images: 1,
                priceForTwo: 1,
                timings: 1,
                status: 1,
                addressLineOne: "$addressDetail.address.line_one",
                addressLineTwo: "$addressDetail.address.line_two",
                city: "$cityDetail.name",
                state: "$stateDetail.name",
                country: "$countryDetail.name",
                landmark: "$addressDetail.landmark",
                latitude: "$addressDetail.latitude",
                longitude: "$addressDetail.longitude",
                brandName: "$brandDetail.name",
                managerName: "$userDetail.fname",

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
                  message: message.outletDetail,
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

const deleteOutlet = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.body.is_delete) {
      throw {
        statusCode: constants.code.preconditionFailed,
        msg: constants.message.invalidType,
      };
    } else {
      Outlet.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.outlet_id),
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
              message: message.outletDeleted,
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
  addOutlet,
  updateOutlet,
  outletUpdate,
  listOutlet,
  outletDetail,
  deleteOutlet
};
