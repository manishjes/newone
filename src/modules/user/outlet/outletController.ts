import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import mongoose from "mongoose";
import Brand from "../../../models/brand";
import message from "./outletConstant";
import Outlet from "../../../models/outlet";
import Menu from "../../../models/menu";
import User from "../../../models/user";
import Device from "../../../models/device";
import Review from "../../../models/review";
import MenuImage from "../../../models/menuImage";



const listBrand = async (req: any, res: Response, next: NextFunction) => {
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
            status: true,
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
            image: 1,
            status: 1,
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
            status: true,
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
            image: 1,
            status: 1,
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


// const listOutlet = async (req: any, res: Response, next: NextFunction) => {

//   try{
//     const page = Number(req.query.page);
//     const limit = Number(req.query.limit);
//     const skip = page * limit;
//     const sort = req.query.sort === "desc" ? -1 : 1;

//     if (Number(req.query.limit) !== 0) {
//       Outlet.aggregate([

//         {
//           $match: {
//             isDeleted: false,
//             brandId: new mongoose.Types.ObjectId(req.body.brand_id),
//             name: {
//               $regex: "^" + req.query.search + ".*",
//               $options: "i",
//             },
//           },
//         },


//         {
//           $lookup: {
//             from: "addresses",
//             let: { outletId: "$_id" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $eq: ["$OutletId", "$$outletId"] },
//                   isDeleted: false,
//                 },
//               },
//             ],
//             as: "addressDetail",
//           },
//         },
//         {
//           $unwind: {
//             path: "$addressDetail",
//             preserveNullAndEmptyArrays: true,
//           },
//         },


//         {
//           $lookup: {
//             from: "cities",
//             let: { cityId: "$addressDetail.address.city" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $eq: ["$_id", "$$cityId"] },
//                  isDeleted: false
//                 },
//               },
//             ],
//             as: "cityDetail",
//           },
//         },
//         {
//           $unwind: {
//             path: "$cityDetail",
//             preserveNullAndEmptyArrays: true
//           },
//         },
//         {
//           $lookup: {
//             from: "states",
//             let: { stateId: "$addressDetail.address.state" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $eq: ["$_id", "$$stateId"] },
//                  isDeleted: false
//                 },
//               },
//             ],
//             as: "stateDetail",
//           },
//         },
//         {
//           $unwind: {
//             path: "$stateDetail",
//             preserveNullAndEmptyArrays: true
//           },
//         },

//         {
//           $lookup: {
//             from: "countries",
//             let: { countryId: "$addressDetail.address.country" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $eq: ["$_id", "$$countryId"] },
//                  isDeleted: false
//                 },
//               },
//             ],
//             as: "countryDetail",
//           },
//         },
//         {
//           $unwind: {
//             path: "$countryDetail",
//             preserveNullAndEmptyArrays: true
//           },
//         },


//         {
//           $lookup: {
//             from: "brands",
//             let: { brandId: "$brandId" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $eq: ["$_id", "$$brandId"] },
//                   isDeleted: false,
//                 },
//               },
//             ],
//             as: "brandDetail",
//           },
//         },
//         {
//           $unwind: {
//             path: "$brandDetail",
//             preserveNullAndEmptyArrays: true,
//           },
//         },


//         {
//           $project: {
//             _id: 1,
//             name: 1,
//             slug: 1,
//             description:1,
//             images: 1,
//              addressLineOne: "$addressDetail.address.line_one",
//             addressLineTwo: "$addressDetail.address.line_two",
//             city: "$cityDetail.name",
//             state: "$stateDetail.name",
//             country: "$countryDetail.name",
//             landmark: "$addressDetail.landmark",
//             latitude: "$addressDetail.latitude",
//             longitude: "$addressDetail.longitude",
//             brandName: "$brandDetail.name",

//             createdAt: { $toLong: "$createdAt" },
//           },
//         },
//         {
//           $sort: { createdAt: sort },
//         },
//         {
//           $facet: {
//             metadata: [
//               { $count: "total" },
//               { $addFields: { page: Number(page) } },
//               {
//                 $addFields: {
//                   totalPages: {
//                     $ceil: { $divide: ["$total", limit] },
//                   },
//                 },
//               },
//               {
//                 $addFields: {
//                   hasPrevPage: {
//                     $cond: {
//                       if: {
//                         $lt: [{ $subtract: [page, Number(1)] }, Number(0)],
//                       },
//                       then: false,
//                       else: true,
//                     },
//                   },
//                 },
//               },
//               {
//                 $addFields: {
//                   prevPage: {
//                     $cond: {
//                       if: {
//                         $lt: [{ $subtract: [page, Number(1)] }, Number(0)],
//                       },
//                       then: null,
//                       else: { $subtract: [page, Number(1)] },
//                     },
//                   },
//                 },
//               },
//               {
//                 $addFields: {
//                   hasNextPage: {
//                     $cond: {
//                       if: {
//                         $gt: [
//                           {
//                             $subtract: [
//                               {
//                                 $ceil: { $divide: ["$total", limit] },
//                               },
//                               Number(1),
//                             ],
//                           },
//                           "$page",
//                         ],
//                       },
//                       then: true,
//                       else: false,
//                     },
//                   },
//                 },
//               },
//               { $addFields: { nextPage: { $sum: [page, Number(1)] } } },
//             ],
//             data: [{ $skip: skip }, { $limit: limit }],
//           },
//         },
//       ])
//         .then((data: any) => {
//           if (!data) {
//             throw {
//               statusCode: constants.code.dataNotFound,
//               msg: constants.message.dataNotFound,
//             };
//           } else {
//             res.status(constants.code.success).json({
//               status: constants.status.statusTrue,
//               userStatus: req.status,
//               message: message.outletListed,
//               metadata: data[0].metadata,
//               data: data[0].data,
//             });
//           }
//         })
//         .catch((err) => {
//           res.status(constants.code.preconditionFailed).json({
//             status: constants.status.statusFalse,
//             userStatus: req.status,
//             message: err.msg,
//           });
//         });
//     } else {
//       Outlet.aggregate([
//         {
//           $match: {
//             isDeleted: false,
//             brandId: new mongoose.Types.ObjectId(req.body.brand_id),
//             name: {
//               $regex: "^" + req.query.search + ".*",
//               $options: "i",
//             },
//           },
//         },


//         {
//           $lookup: {
//             from: "addresses",
//             let: { outletId: "$_id" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $eq: ["$OutletId", "$$outletId"] },
//                   isDeleted: false,
//                 },
//               },
//             ],
//             as: "addressDetail",
//           },
//         },
//         {
//           $unwind: {
//             path: "$addressDetail",
//             preserveNullAndEmptyArrays: true,
//           },
//         },


//         {
//           $lookup: {
//             from: "cities",
//             let: { cityId: "$addressDetail.address.city" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $eq: ["$_id", "$$cityId"] },
//                  isDeleted: false
//                 },
//               },
//             ],
//             as: "cityDetail",
//           },
//         },
//         {
//           $unwind: {
//             path: "$cityDetail",
//             preserveNullAndEmptyArrays: true
//           },
//         },
//         {
//           $lookup: {
//             from: "states",
//             let: { stateId: "$addressDetail.address.state" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $eq: ["$_id", "$$stateId"] },
//                  isDeleted: false
//                 },
//               },
//             ],
//             as: "stateDetail",
//           },
//         },
//         {
//           $unwind: {
//             path: "$stateDetail",
//             preserveNullAndEmptyArrays: true
//           },
//         },

//         {
//           $lookup: {
//             from: "countries",
//             let: { countryId: "$addressDetail.address.country" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $eq: ["$_id", "$$countryId"] },
//                  isDeleted: false
//                 },
//               },
//             ],
//             as: "countryDetail",
//           },
//         },
//         {
//           $unwind: {
//             path: "$countryDetail",
//             preserveNullAndEmptyArrays: true
//           },
//         },


//         {
//           $lookup: {
//             from: "brands",
//             let: { brandId: "$brandId" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $eq: ["$_id", "$$brandId"] },
//                   isDeleted: false,
//                 },
//               },
//             ],
//             as: "brandDetail",
//           },
//         },
//         {
//           $unwind: {
//             path: "$brandDetail",
//             preserveNullAndEmptyArrays: true,
//           },
//         },




//         {
//           $project: {
//             _id: 1,
//             name: 1,
//             slug: 1,
//             description:1,
//             images: 1,
//              addressLineOne: "$addressDetail.address.line_one",
//             addressLineTwo: "$addressDetail.address.line_two",
//             city: "$cityDetail.name",
//             state: "$stateDetail.name",
//             country: "$countryDetail.name",
//             landmark: "$addressDetail.landmark",
//             latitude: "$addressDetail.latitude",
//             longitude: "$addressDetail.longitude",
//             brandName: "$brandDetail.name",

//             createdAt: { $toLong: "$createdAt" },
//           },
//         },
//         {
//           $sort: { createdAt: sort },
//         },
//         {
//           $facet: {
//             metadata: [
//               { $count: "total" },
//               { $addFields: { page: Number(page) } },
//               {
//                 $addFields: { totalPages: { $sum: [Number(page), Number(1)] } },
//               },
//               { $addFields: { hasPrevPage: false } },
//               { $addFields: { prevPage: null } },
//               { $addFields: { hasNextPage: false } },
//               { $addFields: { nextPage: null } },
//             ],
//             data: [],
//           },
//         },
//       ])
//         .then((data) => {
//           if (!data) {
//             throw {
//               statusCode: constants.code.dataNotFound,
//               msg: constants.message.dataNotFound,
//             };
//           } else {
//             res.status(constants.code.success).json({
//               status: constants.status.statusTrue,
//               userStatus: req.status,
//               message: message.outletListed,
//               metadata: data[0].metadata,
//               data: data[0].data,
//             });
//           }
//         })
//         .catch((err) => {
//           res.status(err.statusCode).json({
//             status: constants.status.statusFalse,
//             userStatus: req.status,
//             message: err.msg,
//           });
//         });
//     }

//   } catch (err) {
//     res.status(constants.code.internalServerError).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: err,
//     });
//   }

// }


const listItem = async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;
    const sort = req.query.sort === "desc" ? -1 : 1;

    if (Number(req.query.limit) !== 0) {
      Menu.aggregate([

        {
          $match: {
            isDeleted: false,
            outletId: new mongoose.Types.ObjectId(req.body.outlet_id),
            categoryId: new mongoose.Types.ObjectId(req.body.category_id)
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
            from: "categories",
            let: { categoryId: "$categoryId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$categoryId"] },
                  isDeleted: false
                },
              },
            ],
            as: "category_detail",
          },
        },
        {
          $unwind: {
            path: "$category_detail",
            preserveNullAndEmptyArrays: true
          },
        },

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
            itemDescription: { $first: "$item_detail.description" },
            category: { $first: "$category_detail.name" },
            images: { $first: "$item_detail.image" },
            ingredient: { $first: "$ingredient_detail" },
            createdAt: { $first: "$createdAt" },
            // price: { $push: "$item.price" },
            // variantDetail: { $push: "$variant_detail" },
            variant: {
              $push: { variantName: "$variant_detail.name", price: "$item.price" },
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
      Menu.aggregate([

        {
          $match: {
            isDeleted: false,
            outletId: new mongoose.Types.ObjectId(req.body.outlet_id),
            categoryId: new mongoose.Types.ObjectId(req.body.category_id)
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
            from: "categories",
            let: { categoryId: "$categoryId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$categoryId"] },
                  isDeleted: false
                },
              },
            ],
            as: "category_detail",
          },
        },
        {
          $unwind: {
            path: "$category_detail",
            preserveNullAndEmptyArrays: true
          },
        },

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
            itemDescription: { $first: "$item_detail.description" },
            category: { $first: "$category_detail.name" },
            images: { $first: "$item_detail.image" },
            ingredient: { $first: "$ingredient_detail" },
            createdAt: { $first: "$createdAt" },
            // price: { $push: "$item.price" },
            // variantDetail: { $push: "$variant_detail" },
            variant: {
              $push: { variantName: "$variant_detail.name", price: "$item.price" },
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


const listnearOutlet = async (req: any, res: Response, next: NextFunction) => {

  try {

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;

    User.findOne({
      _id: new mongoose.Types.ObjectId(req.id),
      status: true,
      isDeleted: false,
    }).then(async (user_detail: any) => {
      if (!user_detail) {
        throw {
          statusCode: constants.code.unAuthorized,
          msg: constants.message.unAuthAccess,
        };
      }


      else {

        const loc: any = await Device.findOne(
          { userId: new mongoose.Types.ObjectId(user_detail._id) },
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
                isDeleted: false,
                brandId: new mongoose.Types.ObjectId(req.body.brand_id),
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

            // {
            //   $addFields: {
            //     distanceInKm: {
            //       $divide: ["$dist.calculated", 1000]
            //     }
            //   }
            // },


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
                latitude: "$addressDetail.latitude",
                longitude: "$addressDetail.longitude",
                brandName: "$brandDetail.name",
                brandId: "$brandDetail._id",

                createdAt: { $toLong: "$createdAt" },
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
                  {
                    addressLineOne: {
                      $regex: "^" + req.query.search + ".*",
                      $options: "i",
                    },
                  },
                  {
                   
                    priceForTwo: {
                        $lte: Number(req.query.search)
                      }
                    
                  }
                ],
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
                  message: message.outletListed,
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
                isDeleted: false,
                brandId: new mongoose.Types.ObjectId(req.body.brand_id),
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
                latitude: "$addressDetail.latitude",
                longitude: "$addressDetail.longitude",
                brandName: "$brandDetail.name",
                brandId: "$brandDetail._id",

                createdAt: { $toLong: "$createdAt" },
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
                  {
                    addressLineOne: {
                      $regex: "^" + req.query.search + ".*",
                      $options: "i",
                    },
                  },
                ],
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
                  message: message.outletListed,
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


const listCategoryItem = async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;

    if (Number(req.query.limit) !== 0) {
      Menu.aggregate([
        {
          $match: {
            isDeleted: false,
            outletId: new mongoose.Types.ObjectId(req.body.outlet_id),
          },
        },


        {
          $lookup: {
            from: "categories",
            let: { categoryId: "$categoryId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$categoryId"] },
                  isDeleted: false
                },
              },
            ],
            as: "category_detail",
          },
        },
        {
          $unwind: {
            path: "$category_detail",
            preserveNullAndEmptyArrays: true
          },
        },


        {
          $group: {
            _id: "$category_detail._id",
            category: { $first: "$category_detail.name" },
            categoryImage: { $first: "$category_detail.image" },
          }
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
      Menu.aggregate([
        {
          $match: {
            isDeleted: false,
            outletId: new mongoose.Types.ObjectId(req.body.outlet_id),
          },
        },


        {
          $lookup: {
            from: "categories",
            let: { categoryId: "$categoryId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$categoryId"] },
                  isDeleted: false
                },
              },
            ],
            as: "category_detail",
          },
        },
        {
          $unwind: {
            path: "$category_detail",
            preserveNullAndEmptyArrays: true
          },
        },


        {
          $group: {
            _id: "$category_detail._id",
            category: { $first: "$category_detail.name" },
            categoryImage: { $first: "$category_detail.image" },
          }
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

    Outlet.findOne({ _id: new mongoose.Types.ObjectId(req.body.outlet_id), isDeleted: false })
      .then(async(outletData) => {
        if (!outletData) {
          throw {
            statusCode: constants.code.dataNotFound,
            message: constants.message.dataNotFound,
          };
        } else {
          const loc: any = await Device.findOne(
            { userId: new mongoose.Types.ObjectId(req.id) },
            { latitude: 1, longitude: 1 }
          )
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
                _id: new mongoose.Types.ObjectId(req.body.outlet_id),
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
                images: 1,
                priceForTwo: 1,
                timings: 1,
                distanceInKm: { $substr: [{ $toString: { $divide: ["$dist.calculated", 1000] } }, 0, 4] },
                addressLineOne: "$addressDetail.address.line_one",
                addressLineTwo: "$addressDetail.address.line_two",
                city: "$cityDetail.name",
                state: "$stateDetail.name",
                country: "$countryDetail.name",
                landmark: "$addressDetail.landmark",
                latitude: "$addressDetail.latitude",
                longitude: "$addressDetail.longitude",
                brandName: "$brandDetail.name",
                brandId: "$brandDetail._id",
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

const listUploadedMenu = async(req:any, res:Response, next:NextFunction) =>{
  try{
    MenuImage.findOne(
      { outletId:new mongoose.Types.ObjectId(req.body.outletId), isDeleted: false },
      { images:1 }
    ).sort({createdAt:-1})
      .then((data:any) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: req.status,
            message: message.uploadedMenu,
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

  } catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
}


const userReview = async (req: any, res: Response, next: NextFunction) => {
  try {
    User.findOne({
      _id: new mongoose.Types.ObjectId(req.id),
      role: constants.accountLevel.user,
      status: true,
      isDeleted: false,
    }).then(async (user_detail: any) => {
      if (!user_detail) {
        throw {
          statusCode: constants.code.unAuthorized,
          msg: constants.message.unAuthAccess,
        };
      }
      else {
        const brand:any = await Outlet.findOne({
          _id: new mongoose.Types.ObjectId(req.body.outletId)
        }, {_id:0, brandId:1})

      await  Review.create({
          userId: new mongoose.Types.ObjectId(user_detail._id),
          OutletReview:{
            outletId: new mongoose.Types.ObjectId(req.body.outletId),
            review: req.body.reviewOutlet
          },
          brandReview:{
            brandId: new mongoose.Types.ObjectId(brand.brandId),
            review: req.body.reviewBrand
          },
          comment: req.body.comment
        }).then(async(reviewData)=>{
          if(!reviewData){
            throw{
              statusCode: constants.code.dataNotFound,
              message: constants.message.dataNotFound
            }
          }
          else{
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.addReview
            })
          }
        }).catch((err)=>{
          res.status(constants.code.preconditionFailed).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: err.message
          })
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


const recommendedOutlet =  async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;


    User.findOne({
      _id: new mongoose.Types.ObjectId(req.id),
      status: true,
      isDeleted: false,
    }).then(async (user_detail: any) => {
      if (!user_detail) {
        throw {
          statusCode: constants.code.unAuthorized,
          msg: constants.message.unAuthAccess,
        };
      }

      else {

        const loc: any = await Device.findOne(
          { userId: new mongoose.Types.ObjectId(user_detail._id) },
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
            isDeleted: false,
            brandId: new mongoose.Types.ObjectId(req.body.brand_id)

          },
        },
        {
          $lookup: {
            from: "tables",
            let: { outletId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$outletId", "$$outletId"] },
                  isDeleted: false,
                },
              },
            ],
            as: "bookingCount",
          },
        },
        
        // {
        //   $match: {
        //     "bookingCount": { $ne: [] }
        //   }
        // },

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
          $addFields: {
            bookingCount: { $size: "$bookingCount" },
          },
        },


        {
          $group: {
            _id: "$_id",
            timings: {$first: "$timings"},
            name: { $first: "$name" },
            brandName: {$first: "$brandDetail.name"},
            description: { $first: "$description" },
            priceForTwo: { $first: "$priceForTwo" },
            images: { $first: "$images" },
            distanceInKm: { $first:{$substr: [{ $toString: { $divide: ["$dist.calculated", 1000] } }, 0, 4] }},
            addressLineOne: { $first: "$addressDetail.address.line_one" },
            city: { $first: "$cityDetail.name" },
            state: { $first: "$stateDetail.name" },
            bookingCount: { $first: "$bookingCount" },
          },
        },


        { $sort: { bookingCount: -1 } },

        
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
            isDeleted: false,
            brandId: new mongoose.Types.ObjectId(req.body.brand_id)

          },
        },
        {
          $lookup: {
            from: "tables",
            let: { outletId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$outletId", "$$outletId"] },
                  isDeleted: false,
                },
              },
            ],
            as: "bookingCount",
          },
        },
        

        // {
        //   $match: {
        //     "bookingCount": { $ne: [] }
        //   }
        // },

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
          $addFields: {
            bookingCount: { $size: "$bookingCount" },
          },
        },           


        {
          $group: {
            _id: "$_id",
            timings: {$first: "$timings"},
            name: { $first: "$name" },
            brandName: {$first: "$brandDetail.name"},
            description: { $first: "$description" },
            priceForTwo: { $first: "$priceForTwo" },
            images: { $first: "$images" },
            distanceInKm: { $first:{$substr: [{ $toString: { $divide: ["$dist.calculated", 1000] } }, 0, 4] }},
            addressLineOne: { $first: "$addressDetail.address.line_one" },
            city: { $first: "$cityDetail.name" },
            state: { $first: "$stateDetail.name" },
            bookingCount: { $first: "$bookingCount" },
          },
        },


        { $sort: { bookingCount: -1 } },
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


const exploreOutlet = async(req:any, res:Response, next:NextFunction)=>{
  try{

    const loc: any = await Device.findOne(
      { userId: new mongoose.Types.ObjectId(req.id) },
      { latitude: 1, longitude: 1 }
    )

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
            $nin: [new mongoose.Types.ObjectId(req.body.outlet_id)],
          },
          isDeleted: false,
          brandId: new mongoose.Types.ObjectId(req.body.brand_id),
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
          latitude: "$addressDetail.latitude",
          longitude: "$addressDetail.longitude",
          brandName: "$brandDetail.name",

          createdAt: { $toLong: "$createdAt" },
        },
      },
      {
        $limit: 10
      }

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
            message: message.exploreOutlet,
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

  } catch (err) {
    res.status(constants.code.internalServerError).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
}


export default {
  listBrand,
  //listOutlet,
  listItem,
  listnearOutlet,
  listCategoryItem,
  outletDetail,
  userReview,
  recommendedOutlet,
  exploreOutlet,
  listUploadedMenu
}