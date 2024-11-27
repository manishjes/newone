import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import Item from "../../../models/item";
import User from "../../../models/user";
import Outlet from "../../../models/outlet";
import {
  createSlug,
  imageUrl,
  removeImage,
  getFileName,
} from "../../../helpers/helper";
import Variant from "../../../models/variants";
import Menu from "../../../models/menu";
import MenuImage from "../../../models/menuImage";
import message from "./menuConstant";
import mongoose from "mongoose";



const createMenu = async (req: any, res: Response, next: NextFunction) => {
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
    }).then(async (user_detail: any) => {
      if (!user_detail) {
        throw {
          statusCode: constants.code.unAuthorized,
          msg: constants.message.unAuthAccess,
        };
      }
      else if (
        user_detail.role === constants.accountLevel.admin ||
        user_detail.role === constants.accountLevel.superAdmin
      ) {


        const items = req.body.items

        for (let i = 0; i < items.length; i++) {
          const item = items[i]


          const ItemId: any = await Variant.findOne({
            _id: new mongoose.Types.ObjectId(item.id)
          }, { _id: 0, itemId: 1 })

          const category: any = await Item.findOne({
            _id: new mongoose.Types.ObjectId(ItemId.itemId)
          }, { _id: 0, categoryId: 1 })

          await Menu.create({
            outletId: new mongoose.Types.ObjectId(req.body.outletId),
            item: {
              variantId: item.id,
              price: item.price,
            },
            itemId: new mongoose.Types.ObjectId(ItemId.itemId),
            categoryId: new mongoose.Types.ObjectId(category.categoryId),

          })


        }

        // items.map(async (item: any) => {

        //       await Menu.create({
        //         item: {
        //           VariantId: item.VariantId,
        //           price: item.price,
        //         },
        //         itemId: new mongoose.Types.ObjectId(item.itemId),
        //         outletId: new mongoose.Types.ObjectId(outletId._id),
        //       })

        //     })

        res.status(constants.code.success).json({
          status: constants.status.statusTrue,
          userStatus: req.status,
          message: message.menuAdded
        })

      }
      else if (user_detail.role === constants.accountLevel.manager) {
        const outletId: any = await Outlet.findOne(
          { managerId: new mongoose.Types.ObjectId(user_detail._id) },
          { _id: 1 }
        )


        const items = req.body.items

        for (let i = 0; i < items.length; i++) {
          const item = items[i]


          const ItemId: any = await Variant.findOne({
            _id: new mongoose.Types.ObjectId(item.id)
          }, { _id: 0, itemId: 1 })

          const category: any = await Item.findOne({
            _id: new mongoose.Types.ObjectId(ItemId.itemId)
          }, { _id: 0, categoryId: 1 })

          await Menu.create({
            item: {
              variantId: item.id,
              price: item.price
            },
            itemId: new mongoose.Types.ObjectId(ItemId.itemId),
            categoryId: new mongoose.Types.ObjectId(category.categoryId),
            outletId: new mongoose.Types.ObjectId(outletId._id),

          })


        }

        // items.map(async (item: any) => {

        //       await Menu.create({
        //         item: {
        //           VariantId: item.VariantId,
        //           price: item.price,
        //         },
        //         itemId: new mongoose.Types.ObjectId(item.itemId),
        //         outletId: new mongoose.Types.ObjectId(outletId._id),
        //       })

        //     })

        res.status(constants.code.success).json({
          status: constants.status.statusTrue,
          userStatus: req.status,
          message: message.menuAdded
        })

      }

    }).catch((err) => {
      res
        .status(constants.code.preconditionFailed)
        .json({
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


const updateMenu = async (req: any, res: Response,) => {
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
    }).then(async (user_detail: any) => {
      if (!user_detail) {
        throw {
          statusCode: constants.code.unAuthorized,
          msg: constants.message.unAuthAccess,
        };
      }
      else if (
        user_detail.role === constants.accountLevel.admin ||
        user_detail.role === constants.accountLevel.superAdmin
      ) {

        await Menu.deleteMany({
          outletId: new mongoose.Types.ObjectId(req.body.outletId)
        }).then(async (data) => {
          if (!data) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            }
          }
          else {

            const items = req.body.items

            for (let i = 0; i < items.length; i++) {
              const item = items[i]


              const ItemId: any = await Variant.findOne({
                _id: new mongoose.Types.ObjectId(item.id)
              }, { _id: 0, itemId: 1 })

              const category: any = await Item.findOne({
                _id: new mongoose.Types.ObjectId(ItemId.itemId)
              }, { _id: 0, categoryId: 1 })

              await Menu.create({
                outletId: new mongoose.Types.ObjectId(req.body.outletId),
                item: {
                  variantId: item.id,
                  price: item.price
                },
                itemId: new mongoose.Types.ObjectId(ItemId.itemId),
                categoryId: new mongoose.Types.ObjectId(category.categoryId)

              })


            }

            // items.map(async (item: any) => {

            //       await Menu.create({
            //         item: {
            //           VariantId: item.VariantId,
            //           price: item.price,
            //         },
            //         itemId: new mongoose.Types.ObjectId(item.itemId),
            //         outletId: new mongoose.Types.ObjectId(outletId._id),
            //       })

            //     })

            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.menuUpdated
            })

          }

        }).catch((err) => {
          res
            .status(constants.code.preconditionFailed)
            .json({
              status: constants.status.statusFalse,
              userStatus: req.status,
              message: err.msg,
            });
        });
      }
      else if (user_detail.role === constants.accountLevel.manager) {
        const outletId: any = await Outlet.findOne(
          { managerId: new mongoose.Types.ObjectId(user_detail._id) },
          { _id: 1 }
        )

        await Menu.deleteMany({
          outletId: new mongoose.Types.ObjectId(outletId._id)
        }).then(async (data) => {
          if (!data) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            }
          }
          else {

            const items = req.body.items

            for (let i = 0; i < items.length; i++) {
              const item = items[i]


              const ItemId: any = await Variant.findOne({
                _id: new mongoose.Types.ObjectId(item.id)
              }, { _id: 0, itemId: 1 })

              const category: any = await Item.findOne({
                _id: new mongoose.Types.ObjectId(ItemId.itemId)
              }, { _id: 0, categoryId: 1 })

              await Menu.create({
                item: {
                  variantId: item.id,
                  price: item.price
                },
                itemId: new mongoose.Types.ObjectId(ItemId.itemId),
                categoryId: new mongoose.Types.ObjectId(category.categoryId),
                outletId: new mongoose.Types.ObjectId(outletId._id),

              })


            }

            // items.map(async (item: any) => {

            //       await Menu.create({
            //         item: {
            //           VariantId: item.VariantId,
            //           price: item.price,
            //         },
            //         itemId: new mongoose.Types.ObjectId(item.itemId),
            //         outletId: new mongoose.Types.ObjectId(outletId._id),
            //       })

            //     })

            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.menuUpdated
            })

          }

        }).catch((err) => {
          res
            .status(constants.code.preconditionFailed)
            .json({
              status: constants.status.statusFalse,
              userStatus: req.status,
              message: err.msg,
            });
        });
      }

    }).catch((err) => {
      res
        .status(constants.code.preconditionFailed)
        .json({
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


const menuList = async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;
    const sort = req.query.sort === "desc" ? -1 : 1;

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
          let outletId;
          if (data.role === constants.accountLevel.manager) {
            outletId = await Outlet.findOne(
              { managerId: new mongoose.Types.ObjectId(data._id) },
              { _id: 1 }
            );
          } else {
            outletId = req.body.outletId;
          }

          if (Number(req.query.limit) !== 0) {
            Menu.aggregate([

              {
                $match: {
                  isDeleted: false,
                  outletId: new mongoose.Types.ObjectId(outletId),
                },
              },

              {
                $lookup: {
                  from: "variants",
                  let: { variantId: "$item.variantId" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$variantId"] },
                        isDeleted: false,
                      },
                    },
                  ],
                  as: "variant_detail",
                },
              },
              {
                $unwind: {
                  path: "$variant_detail",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "items",
                  let: { itemId: "$itemId" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$itemId"] },
                        isDeleted: false
                      },
                    },
                  ],
                  as: "item_detail",
                },
              },
              {
                $unwind: {
                  path: "$item_detail",
                  preserveNullAndEmptyArrays: true
                },
              },

              {
                $lookup: {
                  from: "ingredients",
                  let: { ingredients: "$item_detail.Ingredients" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $in: ["$_id", "$$ingredients"] },
                        isDeleted: false
                      },
                    },
                  ],
                  as: "ingredient_detail",
                },
              },
              // {
              //   $unwind: {
              //     path: "$ingredient_detail",
              //     preserveNullAndEmptyArrays: true
              //   },
              // },



              // {
              //   $project: {
              //     _id: 1,
              //     itemName: "$item_detail.name",
              //     variantName: "$variant_detail.name",
              //     image: "$item_detail.image",
              //     price: "$item.price",

              //     createdAt: { $toLong: "$createdAt" },
              //   },
              // },

              {
                $group: {
                  _id: "$item_detail._id",
                  menu: { $first: "$_id" },
                  itemName: { $first: "$item_detail.name" },
                  preparationTime: { $first: "$item_detail.preparationTime" },
                  images: { $first: "$item_detail.image" },
                  ingredient: { $first: "$ingredient_detail" },
                  createdAt: { $first: "$createdAt" },
                  // price: { $push: "$item.price" },
                  // variantDetail: { $push: "$variant_detail" },
                  variant: {
                    $push: { id: "$variant_detail._id", variantName: "$variant_detail.name", price: "$item.price" },
                  },


                }
              },
              {
                $match: {
                  $or: [
                    {
                      itemName: {
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
                if (!data) {
                  throw {
                    statusCode: constants.code.dataNotFound,
                    msg: constants.message.dataNotFound,
                  };
                } else {
                  res.status(constants.code.success).json({
                    status: constants.status.statusTrue,
                    userStatus: req.status,
                    message: message.menuListed,
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
            Menu.aggregate([
              {
                $match: {
                  isDeleted: false,
                  outletId: new mongoose.Types.ObjectId(outletId),
                },
              },

              {
                $lookup: {
                  from: "variants",
                  let: { variantId: "$item.variantId" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$variantId"] },
                        isDeleted: false,
                      },
                    },
                  ],
                  as: "variant_detail",
                },
              },
              {
                $unwind: {
                  path: "$variant_detail",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "items",
                  let: { itemId: "$itemId" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$itemId"] },
                        isDeleted: false
                      },
                    },
                  ],
                  as: "item_detail",
                },
              },
              {
                $unwind: {
                  path: "$item_detail",
                  preserveNullAndEmptyArrays: true
                },
              },

              {
                $lookup: {
                  from: "ingredients",
                  let: { ingredients: "$item_detail.Ingredients" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $in: ["$_id", "$$ingredients"] },
                        isDeleted: false
                      },
                    },
                  ],
                  as: "ingredient_detail",
                },
              },
              // {
              //   $unwind: {
              //     path: "$ingredient_detail",
              //     preserveNullAndEmptyArrays: true
              //   },
              // },



              // {
              //   $project: {
              //     _id: 1,
              //     itemName: "$item_detail.name",
              //     variantName: "$variant_detail.name",
              //     image: "$item_detail.image",
              //     price: "$item.price",

              //     createdAt: { $toLong: "$createdAt" },
              //   },
              // },

              {
                $group: {
                  _id: "$item_detail._id",
                  menu: { $first: "$_id" },
                  itemName: { $first: "$item_detail.name" },
                  preparationTime: { $first: "$item_detail.preparationTime" },
                  images: { $first: "$item_detail.image" },
                  ingredient: { $first: "$ingredient_detail" },
                  createdAt: { $first: "$createdAt" },
                  // price: { $push: "$item.price" },
                  // variantDetail: { $push: "$variant_detail" },
                  variant: {
                    $push: { id: "$variant_detail._id", variantName: "$variant_detail.name", price: "$item.price" },
                  },
                }
              },
              {
                $match: {
                  $or: [
                    {
                      itemName: {
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
                if (!data) {
                  throw {
                    statusCode: constants.code.dataNotFound,
                    msg: constants.message.dataNotFound,
                  };
                } else {
                  res.status(constants.code.success).json({
                    status: constants.status.statusTrue,
                    userStatus: req.status,
                    message: message.menuListed,
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
}


const menuDetail = async (req: any, res: Response, next: NextFunction) => {
  try {


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
          Menu.aggregate([
            {
              $match: {
                itemId: new mongoose.Types.ObjectId(req.params.item_id),
                outletId: new mongoose.Types.ObjectId(outletId._id),
                isDeleted: false,
              },
            },
            {
              $lookup: {
                from: "items",
                let: { itemId: "$itemId" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$itemId"] },
                      isDeleted: false,
                    },
                  },
                ],
                as: "item_detail",
              },
            },
            {
              $unwind: {
                path: "$item_detail",
                preserveNullAndEmptyArrays: true,
              },
            },



            {
              $lookup: {
                from: "variants",
                let: { variantId: "$item.variantId" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$variantId"] },
                      isDeleted: false,
                    },
                  },
                ],
                as: "variant_detail",
              },
            },
            {
              $unwind: {
                path: "$variant_detail",
                preserveNullAndEmptyArrays: true,
              },
            },



            {
              $group: {
                _id: "$item_detail._id",
                menu: { $first: "$_id" },
                itemName: { $first: "$item_detail.name" },
                images: { $first: "$item_detail.image" },
                createdAt: { $first: "$createdAt" },
                // price: { $push: "$item.price" },
                // variantDetail: { $push: "$variant_detail" },
                variant: {
                  $push: { id: "$variant_detail._id", variantName: "$variant_detail.name", price: "$item.price" },
                },

              }
            },

          ])
            .then((item_Detail) => {
              if (!item_Detail) {
                throw {
                  statusCode: constants.code.dataNotFound,
                  msg: constants.message.dataNotFound,
                };
              } else {
                res.status(constants.code.success).json({
                  status: constants.status.statusTrue,
                  userStatus: req.status,
                  message: message.menuDetail,
                  data: item_Detail,
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

}


// const uploadMenu = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     const outletId: any = await Outlet.findOne(
//       { managerId: new mongoose.Types.ObjectId(req.id) },
//       { _id: 1 }
//     )

//     const imageList: any = [];
//     for (let i = 0; i < req.files.length; i++) {
//       imageList.push(
//         await imageUrl(req.headers.host, req.files[i].filename)
//       );
//     }

//   MenuImage.create({
//     outletId: new mongoose.Types.ObjectId(outletId._id),
//     images:imageList
//   }).then((data)=>{
//     if(!data){
//       throw{
//         statusCode: constants.code.dataNotFound,
//         message: constants.message.dataNotFound
//       }
//     }
//     else{
//       res.status(constants.code.success).json({
//         status:constants.status.statusTrue,
//         userStatus: req.status,
//         message: message.uploadMenu
//       })
//     }
//   }).catch((err)=>{
//     res.status(constants.code.preconditionFailed).json({
//       status:constants.status.statusFalse,
//       userStatus: req.status,
//       message:err.message
//     })
//   })

//   } catch (err) {
//     res.status(constants.code.internalServerError).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: err,
//     });
//   }
// }

const uploadMenu = async (req: any, res: Response, next: NextFunction) => {
  try {
    const outletId: any = await Outlet.findOne(
      { managerId: new mongoose.Types.ObjectId(req.id) },
      { _id: 1 }
    )

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
    MenuImage.findOneAndUpdate({
      outletId: new mongoose.Types.ObjectId(
        outletId._id
      )
    },
  {
    $push:{
      images: { $each: imageList }
    }
    
  },
{
  upsert:true,
  new:true
}).then((menuData)=>{
  if(!menuData){
    throw{
      statusCode:
      constants.code.dataNotFound,
    message: constants.message.dataNotFound,
    }
  }
  else{
    res.status(constants.code.success).json({
      status:constants.status.statusTrue,
      userStatus: req.status,
      message: message.uploadMenu
    })
  }
}).catch((err)=>{
  res.status(constants.code.preconditionFailed).json({
    status:constants.status.statusFalse,
    userStatus: req.status,
    message:err.message
  })
})
  } catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
}



const updateUploadMenu = async(req:any, res:Response, next:NextFunction)=>{
  try{
    const outletId: any = await Outlet.findOne(
      { managerId: new mongoose.Types.ObjectId(req.id) },
      { _id: 1 }
    )

    MenuImage.findOne({
      outletId: new mongoose.Types.ObjectId(
        outletId._id
      )
    }, {
      images: 1,
    }).then(async (data) => {
      if (!data) {
        throw {
          statusCode:
            constants.code.dataNotFound,
          message: constants.message.dataNotFound,
        };
      } else {
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
        MenuImage.findOneAndUpdate({
          outletId: new mongoose.Types.ObjectId(
            outletId._id
          )
        },
      {
        images:imageList
      },
    {
      upsert:true,
      new:true
    }).then((menuData)=>{
      if(!menuData){
        throw{
          statusCode:
          constants.code.dataNotFound,
        message: constants.message.dataNotFound,
        }
      }
      else{
        res.status(constants.code.success).json({
          status:constants.status.statusTrue,
          userStatus: req.status,
          message: message.menuimageDeleted
        })
      }
    }).catch((err)=>{
      res.status(constants.code.preconditionFailed).json({
        status:constants.status.statusFalse,
        userStatus: req.status,
        message:err.message
      })
    })

      }
    }).catch((err)=>{
      res.status(constants.code.preconditionFailed).json({
        status:constants.status.statusFalse,
        userStatus: req.status,
        message:err.message
      })
    })

  
  } catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
}


const getMenuImages = async(req:any, res:Response, next:NextFunction) =>{
  try{
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
          let outletId;
          if (data.role === constants.accountLevel.manager) {
            outletId = await Outlet.findOne(
              { managerId: new mongoose.Types.ObjectId(data._id) },
              { _id: 1 }
            );
          } else {
            outletId = req.body.outletId;
          }

          MenuImage.findOne(
            { outletId:new mongoose.Types.ObjectId(outletId), isDeleted: false },
            { images:1 }
          ).sort({createdAt:-1})
            .then((data:any) => {
              if (!data) {
                throw {
                  statusCode: constants.code.internalServerError,
                  msg: constants.message.internalServerError,
                };
              } else {
                res.status(constants.code.success).json({
                  status: constants.status.statusTrue,
                  userStatus: req.status,
                  message: constants.message.success,
                  data: data,
                });
              }
            })
            .catch((err: any) => {
              res.status(err.statusCode).json({
                status: constants.status.statusFalse,
                userStatus: constants.status.statusFalse,
                message: err.msg,
              });
            });


        }
      }).catch((err)=>{
        res.status(constants.code.preconditionFailed).json({
          status:constants.status.statusFalse,
          userStatus: req.status,
          message:err.message
        })
      })
  } catch(err){
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
}




export default {
  createMenu,
  menuList,
  menuDetail,
  updateMenu,
  uploadMenu,
  updateUploadMenu,
  getMenuImages
}
