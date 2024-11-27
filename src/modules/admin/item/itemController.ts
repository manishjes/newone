import { Request, Response, NextFunction } from "express";
import constants from "../../../utils/constants";
import Item from "../../../models/item";
import User from "../../../models/user";
import {
  createSlug,
  imageUrl,
  removeImage,
  getFileName,
} from "../../../helpers/helper";
import message from "./itemConstant";
import Variant from "../../../models/variants";
import mongoose from "mongoose";
import Ingredient from "../../../models/ingredient";

// const addItem = async (req: any, res: Response, next: NextFunction) => {
//   try {

//     await Item.findOne({
//       slug: await createSlug(req.body.name),
//       isDeleted: false,
//     })
//       .then(async (itemExists) => {
//         if (itemExists) {
//           throw {
//             statusCode: constants.code.badRequest,
//             message: message.itemExists,
//           };
//         } else {
//           const imageList: any = [];
//           for (let i = 0; i < req.files.length; i++) {
//             imageList.push(
//               await imageUrl(req.headers.host, req.files[i].filename)
//             );
//           }
//           Item.create({
//             name: req.body.name,
//             slug: await createSlug(req.body.name),
//             description: req.body.description,
//             images: imageList,
//             categoryId: new mongoose.Types.ObjectId(req.body.categoryId),
//             price: req.body.price,
//             Ingredients: req.body.Ingredients,
//             preparationTime: req.body.preparationTime,
//             createdBy:req.id
//           })
//             .then(async(itemDetail) => {
//               if (!itemDetail) {
//                 throw {
//                   statusCode: constants.code.badRequest,
//                   message: message.itemFailed,
//                 };
//               } else {
//                 for (let i = 0; i < req.body.variantname.length; i++) {
//                   await Variant.create(
//                     {the
//                       itemId:  new mongoose.Types.ObjectId(itemDetail._id),
//                       name: req.body.variantname[i],
//                       slug: await createSlug(req.body.variantname[i]),
//                     },

//                   );
//                 }

// res.status(constants.code.success).json({
//   status: constants.status.statusTrue,
//   userStatus: req.status,
//   message: message.itemAdded,
//                 });
//               }
//             })
//             .catch((err) => {
//               res
//                 .status(err.statusCode || constants.code.preconditionFailed)
//                 .json({
//                   status: constants.status.statusFalse,
//                   userStatus: req.status,
//                   message: err.message || message.itemFailed,
//                 });
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
//   } catch (error) {
//     res.status(constants.code.preconditionFailed).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: error,
//     });
//   }
// };


// const addItem = async (req: any, res: Response, next: NextFunction) => {
//   try {

//     await Item.findOne({
//       slug: await createSlug(req.body.name),
//       isDeleted: false,
//     })
//       .then(async (itemExists) => {
//         if (itemExists) {
//           throw {
//             statusCode: constants.code.badRequest,
//             message: message.itemExists,
//           };
//         } else {
//           const imageList: any = [];
//           for (let i = 0; i < req.files.length; i++) {
//             imageList.push(
//               await imageUrl(req.headers.host, req.files[i].filename)
//             );
//           }
//           Item.create({
//             name: req.body.name,
//             slug: await createSlug(req.body.name),
//             description: req.body.description,
//             images: imageList,
//             categoryId: new mongoose.Types.ObjectId(req.body.categoryId),
//             price: req.body.price,
//             Ingredients: req.body.Ingredients,
//             preparationTime: req.body.preparationTime,
//             createdBy:req.id
//           })
//             .then(async(itemDetail) => {
//               if (!itemDetail) {
//                 throw {
//                   statusCode: constants.code.badRequest,
//                   message: message.itemFailed,
//                 };
//               } else {
//                 const variants = req.body.variants
//                 for (let i = 0; i < variants.length; i++) {
//                   const variant = variants[i]
//                   await Variant.create(
//                     {
//                       itemId:  new mongoose.Types.ObjectId(itemDetail._id),
//                       variants: {
//                         name: variant.name,
//                         price:variant.price,
//                          slug: await createSlug(variant.name),
//                     },

//                     },

//                   );
//                 }

//                 res.status(constants.code.success).json({
//                   status: constants.status.statusTrue,
//                   userStatus: req.status,
//                   message: message.itemAdded,
//                 });
//               }
//             })
//             .catch((err) => {
//               res
//                 .status(err.statusCode || constants.code.preconditionFailed)
//                 .json({
//                   status: constants.status.statusFalse,
//                   userStatus: req.status,
//                   message: err.message || message.itemFailed,
//                 });
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
//   } catch (error) {
//     res.status(constants.code.preconditionFailed).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: error,
//     });
//   }
// };


// const addItem = async (req: any, res: Response, next: NextFunction) => {
//   try {

//     await Item.findOne({
//       slug: await createSlug(req.body.name),
//       isDeleted: false,
//     })
//       .then(async (itemExists) => {
//         if (itemExists) {
//           throw {
//             statusCode: constants.code.badRequest,
//             message: message.itemExists,
//           };
//         } else {

//           Item.create({
//             name: req.body.name,
//             slug: await createSlug(req.body.name),
//             description: req.body.description,
//             categoryId: new mongoose.Types.ObjectId(req.body.categoryId),
//             Ingredients: req.body.Ingredients,
//             preparationTime: req.body.preparationTime,
//             createdBy:req.id
//           })
//             .then(async(itemDetail) => {
//               if (!itemDetail) {
//                 throw {
//                   statusCode: constants.code.badRequest,
//                   message: message.itemFailed,
//                 };
//               } else {
//                 const variants = req.body.variants
//                 for (let i = 0; i < variants.length; i++) {
//                   const variant = variants[i]
//                   await Variant.create(
//                     {
//                       itemId:  new mongoose.Types.ObjectId(itemDetail._id),
//                       variants: {
//                         name: variant.name,
//                         image: !req.file
//               ? null
//               : await imageUrl(req.headers.host, req.file.filename),
//                         price:variant.price,
//                          slug: await createSlug(variant.name),
//                     },

//                     },

//                   );
//                 }

//                 res.status(constants.code.success).json({
//                   status: constants.status.statusTrue,
//                   userStatus: req.status,
//                   message: message.itemAdded,
//                 });
//               }
//             })
//             .catch((err) => {
//               res
//                 .status(err.statusCode || constants.code.preconditionFailed)
//                 .json({
//                   status: constants.status.statusFalse,
//                   userStatus: req.status,
//                   message: err.message || message.itemFailed,
//                 });
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
//   } catch (error) {
//     res.status(constants.code.preconditionFailed).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: error,
//     });
//   }
// };

// const addItem = async (req: any, res: Response, next: NextFunction) => {
//   try {

//     await Item.findOne({
//       slug: await createSlug(req.body.name),
//       isDeleted: false,
//     })
//       .then(async (itemExists) => {
//         if (itemExists) {
//           throw {
//             statusCode: constants.code.badRequest,
//             message: message.itemExists,
//           };
//         } else {
//           Item.create({
//             name: req.body.name,
//             slug: await createSlug(req.body.name),
//             description: req.body.description,
//             image: !req.file
//             ? null
//             : await imageUrl(req.headers.host, req.file.filename),
//             categoryId: new mongoose.Types.ObjectId(req.body.categoryId),
//             foodtypeId: new mongoose.Types.ObjectId(req.body.foodtypeId),
//             Ingredients: new mongoose.Types.ObjectId(req.body.ingredientId),
//             preparationTime: req.body.preparationTime,
//             createdBy: req.id
//           })
//             .then(async (itemDetail) => {
//               if (!itemDetail) {
//                 throw {
//                   statusCode: constants.code.badRequest,
//                   message: message.itemFailed,
//                 };
//               } else {
//                 const variants = req.body.variants
//                 for (let i = 0; i < variants.length; i++) {
//                   const variant = variants[i]
//                   await Variant.create(
//                     {
//                       itemId: new mongoose.Types.ObjectId(itemDetail._id),
//                       variants: {
//                         name: variant.name,
//                         image: !req.file
//                           ? null
//                           : await imageUrl(req.headers.host, req.file.filename),
//                         price: variant.price,
//                         slug: await createSlug(variant.name),
//                       },

//                     },

//                   );
//                 }

//                 res.status(constants.code.success).json({
//                   status: constants.status.statusTrue,
//                   userStatus: req.status,
//                   message: message.itemAdded,
//                 });
//               }
//             })
//             .catch((err) => {
//               res
//                 .status(err.statusCode || constants.code.preconditionFailed)
//                 .json({
//                   status: constants.status.statusFalse,
//                   userStatus: req.status,
//                   message: err.message || message.itemFailed,
//                 });
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
//   } catch (error) {
//     res.status(constants.code.preconditionFailed).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: error,
//     });
//   }
// };

// const addItem = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     await Item.findOne({
//       slug: await createSlug(req.body.name),
//       isDeleted: false,
//     })
//       .then(async (itemExists) => {
//         if (itemExists) {
//           throw {
//             statusCode: constants.code.badRequest,
//             message: message.itemExists,
//           };
//         } else {
//           const imageList: any = [];
//           for (let i = 0; i < req.files.length; i++) {
//             imageList.push(
//               await imageUrl(req.headers.host, req.files[i].filename)
//             );
//           }

//           Item.create({
//             name: req.body.name,
//             slug: await createSlug(req.body.name),
//             description: req.body.description,
//             images: imageList,
//             categoryId: new mongoose.Types.ObjectId(req.body.categoryId),
//             price: req.body.price,
//             Ingredients: req.body.Ingredients,
//             preparationTime: req.body.preparationTime,
//             createdBy: req.id,
//           })
//             .then(async (itemDetail) => {
//               if (!itemDetail) {
//                 throw {
//                   statusCode: constants.code.badRequest,
//                   message: message.itemFailed,
//                 };
//               } else {
//                 for (let i = 0; i < req.body.variantname.length; i++) {
//                   Variant.create({
//                     variantname: req.body.variantname[i],
//                     slug: await createSlug(req.body.variantname[i]),
//                     itemId: new mongoose.Types.ObjectId(itemDetail._id),
//                     createdBy: req.id,
//                   })
//                     .then((variantDetail) => {
//                       if (!variantDetail) {
//                         throw {
//                           statusCode: constants.code.badRequest,
//                           message: message.variantFailed,
//                         };
//                       }
//                       else{
//                         res.status(constants.code.success).json({
//                           status: constants.status.statusTrue,
//                           userStatus: req.status,
//                           message: message.itemAdded,
//                         });
//                       }
//                     })
//                     .catch((err) => {
//                       res
//                         .status(
//                           err.statusCode || constants.code.preconditionFailed
//                         )
//                         .json({
//                           status: constants.status.statusFalse,
//                           userStatus: req.status,
//                           message: err.message || message.variantFailed,
//                         });
//                     });
//                 }

//               }
//             })
//             .catch((err) => {
//               res
//                 .status(err.statusCode || constants.code.preconditionFailed)
//                 .json({
//                   status: constants.status.statusFalse,
//                   userStatus: req.status,
//                   message: err.message || message.itemFailed,
//                 });
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
//   } catch (error) {
//     res.status(constants.code.preconditionFailed).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: error,
//     });
//   }
// };

const addItem = async (req: any, res: Response, next: NextFunction) => {
  try {

    await Item.findOne({
      slug: await createSlug(req.body.name),
      isDeleted: false,
    })
      .then(async (itemExists) => {
        if (itemExists) {
          throw {
            statusCode: constants.code.preconditionFailed,
            message: message.itemExists,
          };
        } else {
          let ingredients = [];
          for (let i = 0; i < req.body.ingredient.length; i++) {
            ingredients.push(new mongoose.Types.ObjectId(req.body?.ingredient[i]));
          }
          await Item.create({
            name: req.body.name,
            slug: await createSlug(req.body.name),
            description: req.body.description,
            image: !req.file
              ? null
              : await imageUrl(req.headers.host, req.file.filename),
            categoryId: new mongoose.Types.ObjectId(req.body.categoryId),
            brandId: new mongoose.Types.ObjectId(req.body.brandId),
            foodtypeId: new mongoose.Types.ObjectId(req.body.foodtypeId),
            Ingredients: ingredients,
            preparationTime: req.body.preparationTime,
            createdBy: req.id
          })
            .then(async (itemDetail) => {
              if (!itemDetail) {
                throw {
                  statusCode: constants.code.badRequest,
                  message: message.itemFailed,
                };
              } else {
                const variants = req.body.variants
                for (let i = 0; i < variants.length; i++) {
                  let variant = variants[i]
                  await Variant.create({
                    itemId: new mongoose.Types.ObjectId(itemDetail._id),
                    name: variant.variantName,
                    slug: await createSlug(variant.variantName),
                    price: variant.price,
                  })

                }
                res.status(constants.code.success).json({
                  status: constants.status.statusTrue,
                  userStatus: req.status,
                  message: message.itemAdded,
                });

              }
            })
            .catch((err) => {
              res
                .status(err.statusCode || constants.code.preconditionFailed)
                .json({
                  status: constants.status.statusFalse,
                  userStatus: req.status,
                  message: err.message || message.itemFailed,
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


// const addItem = async (req: any, res: Response, next: NextFunction) => {
//   try {

//     await Item.findOne({
//       slug: await createSlug(req.body.name),
//       isDeleted: false,
//     })
//       .then(async (itemExists) => {
//         if (itemExists) {
//           throw {
//             statusCode: constants.code.preconditionFailed,
//             message: message.itemExists,
//           };
//         } else {
//           let ingredients = [];
//           for (let i = 0; i < req.body.ingredient.length; i++) {
//             ingredients.push(new mongoose.Types.ObjectId(req.body?.ingredient[i]));
//           }
//           await Item.create({
//             name: req.body.name,
//             slug: await createSlug(req.body.name),
//             description: req.body.description,
//             image: !req.file
//               ? null
//               : await imageUrl(req.headers.host, req.file.filename),
//             categoryId: new mongoose.Types.ObjectId(req.body.categoryId),
//             foodtypeId: new mongoose.Types.ObjectId(req.body.foodtypeId),
//             Ingredients: ingredients,
//             preparationTime: req.body.preparationTime,
//             createdBy: req.id
//           })
//             .then(async (itemDetail) => {
//               if (!itemDetail) {
//                 throw {
//                   statusCode: constants.code.badRequest,
//                   message: message.itemFailed,
//                 };
//               } else {
//                 Variant.create({
//                   itemId: new mongoose.Types.ObjectId(itemDetail._id),
//                   name: req.body.variantName,
//                   slug: await createSlug(req.body.variantName),
//                   price: req.body.price,
//                 }).then(async (data) => {
//                   if (!data) {
//                     throw {
//                       statusCode: constants.code.dataNotFound,
//                       message: constants.message.dataNotFound
//                     }
//                   }
//                   else {
//                     res.status(constants.code.success).json({
//                       status: constants.status.statusTrue,
//                       userStatus: req.status,
//                       message: message.itemAdded,
//                     });

//                   }
//                 }).catch((err) => {
//                   res
//                     .status(constants.code.preconditionFailed)
//                     .json({
//                       status: constants.status.statusFalse,
//                       userStatus: req.status,
//                       message: err.message,
//                     });
//                 });


//               }
//             })
//             .catch((err) => {
//               res
//                 .status(err.statusCode || constants.code.preconditionFailed)
//                 .json({
//                   status: constants.status.statusFalse,
//                   userStatus: req.status,
//                   message: err.message || message.itemFailed,
//                 });
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
//   } catch (error) {
//     res.status(constants.code.internalServerError).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: error,
//     });
//   }
// };


// const updateItem = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     Item.exists({
//       _id: {
//         $nin: [new mongoose.Types.ObjectId(req.params.item_id)],
//       },
//       slug: await createSlug(req.body.name),
//       isDeleted: false,
//     })
//       .then(async (data) => {
//         if (data) {
//           throw {
//             statusCode: constants.code.badRequest,
//             message: message.itemExists,
//           };
//         } else {
//           Item.findOne(
//             { _id: new mongoose.Types.ObjectId(req.params.item_id) },
//             {
//               image: 1,
//             }
//           )
//             .then(async (item_data: any) => {
//               if (!item_data) {
//                 throw {
//                   statusCode: constants.code.dataNotFound,
//                   message: constants.message.dataNotFound,
//                 };
//               } else {
//                 await removeImage(await getFileName(item_data.image));
//                 let ingredients = [];
//                 for (let i = 0; i < req.body.ingredient.length; i++) {
//                   ingredients.push(new mongoose.Types.ObjectId(req.body?.ingredient[i]));
//                 }

//                 Item.findOneAndUpdate(
//                   {
//                     _id: new mongoose.Types.ObjectId(req.params.item_id),
//                     isDeleted: false,
//                   },
//                   {
//                     name: req.body.name,
//                     slug: await createSlug(req.body.name),
//                     description: req.body.description,
//                     image: !req.file
//                       ? null
//                       : await imageUrl(req.headers.host, req.file.filename),
//                     categoryId: new mongoose.Types.ObjectId(req.body.categoryId),
//                     foodtypeId: new mongoose.Types.ObjectId(req.body.foodtypeId),
//                     Ingredients: ingredients,
//                     preparationTime: req.body.preparationTime,
//                   },
//                   { upsert: true }
//                 )
//                   .then(async (updateItem) => {
//                     if (!updateItem) {
//                       throw {
//                         statusCode: constants.code.preconditionFailed,
//                         message: constants.code.dataNotFound,
//                       };
//                     } else {
//                       Variant.findOneAndUpdate(
//                         {
//                           itemId: new mongoose.Types.ObjectId(req.params.item_id),
//                           _id: new mongoose.Types.ObjectId(req.body.variantId),
//                           isDeleted: false
//                         },
//                         {
//                           itemId: new mongoose.Types.ObjectId(req.params.item_id),
//                           name: req.body.variantName,
//                           slug: await createSlug(req.body.variantName),
//                           price: req.body.price,
//                         },

//                         { upsert: true }

//                       ).then((variantData) => {
//                         if (!variantData) {
//                           throw {
//                             statusCode: constants.code.dataNotFound,
//                             message: constants.message.dataNotFound,
//                           }
//                         }
//                         else {
//                           res.status(constants.code.success).json({
//                             status: constants.status.statusTrue,
//                             userStatus: req.status,
//                             message: message.itemUpdated,
//                           });
//                         }
//                       }).catch((err) => {
//                         res.status(err.statusCode).json({
//                           status: constants.status.statusFalse,
//                           userStatus: req.status,
//                           message: err.message,
//                         });
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

const updateItem = async (req: any, res: Response, next: NextFunction) => {
  try {
    Item.findOne({
      _id: new mongoose.Types.ObjectId(req.params.item_id),
      isDeleted: false,
    })
      .then(async (data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          Item.exists({
            slug: await createSlug(req.body.name),
            _id: { $nin: [new mongoose.Types.ObjectId(req.params.item_id)] },
            isDeleted: false,
          })
            .then(async (dataExist) => {
              if (dataExist) {
                throw {
                  statusCode: constants.code.preconditionFailed,
                  msg: message.itemExists,
                };
              } else if (!req.file) {
                let ingredients = [];
                for (let i = 0; i < req.body.ingredient.length; i++) {
                  ingredients.push(new mongoose.Types.ObjectId(req.body?.ingredient[i]));
                }
                Item.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(req.params.item_id),
                    isDeleted: false,
                  },
                  {
                    name: req.body.name,
                    slug: await createSlug(req.body.name),
                    description: req.body.description,
                    categoryId: new mongoose.Types.ObjectId(req.body.categoryId),
                    brandId: new mongoose.Types.ObjectId(req.body.brandId),
                    foodtypeId: new mongoose.Types.ObjectId(req.body.foodtypeId),
                    Ingredients: ingredients,
                    preparationTime: req.body.preparationTime,
                  },
                  { upsert: true }
                )
                  .then(async (updatedItem: any) => {
                    if (!updatedItem) {
                      throw {
                        statusCode: constants.code.preconditionFailed,
                        message: constants.code.dataNotFound,
                      };
                    } else {
                      const variants = req.body.variants
                      for (let i = 0; i < variants.length; i++) {
                        let variant = variants[i]
                        await Variant.findOneAndUpdate(
                          {
                            itemId: new mongoose.Types.ObjectId(req.params.item_id),
                            _id: new mongoose.Types.ObjectId(variant.variantId),
                            isDeleted: false
                          },
                          {
                            itemId: new mongoose.Types.ObjectId(req.params.item_id),
                            name: variant.variantName,
                            slug: await createSlug(variant.variantName),
                            price: variant.price,
                          },

                          { upsert: true, new: true }

                        )
                      }
                      res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.itemUpdated,
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
                let ingredients = [];
                for (let i = 0; i < req.body.ingredient.length; i++) {
                  ingredients.push(new mongoose.Types.ObjectId(req.body?.ingredient[i]));
                }

                Item.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(req.params.item_id),
                    isDeleted: false,
                  },
                  {
                    name: req.body.name,
                    slug: await createSlug(req.body.name),
                    description: req.body.description,
                    image: await imageUrl(req.headers.host, req.file.filename),
                    categoryId: new mongoose.Types.ObjectId(req.body.categoryId),
                    brandId: new mongoose.Types.ObjectId(req.body.brandId),
                    foodtypeId: new mongoose.Types.ObjectId(req.body.foodtypeId),
                    Ingredients: ingredients,
                    preparationTime: req.body.preparationTime,
                  },
                  { upsert: true, new: true }
                )
                  .then(async (updateItem) => {
                    if (!updateItem) {
                      throw {
                        statusCode: constants.code.preconditionFailed,
                        message: constants.code.dataNotFound,
                      };
                    } else {
                      const variants = req.body.variants
                      for (let i = 0; i < variants.length; i++) {
                        let variant = variants[i]
                        await Variant.findOneAndUpdate(
                          {
                            itemId: new mongoose.Types.ObjectId(req.params.item_id),
                            _id: new mongoose.Types.ObjectId(variant.variantId),
                            isDeleted: false
                          },
                          {
                            itemId: new mongoose.Types.ObjectId(req.params.item_id),
                            name: variant.variantName,
                            slug: await createSlug(variant.variantName),
                            price: variant.price,
                          },

                          { upsert: true, new: true }

                        )
                      }
                      res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.itemUpdated,
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
                let ingredients = [];
                for (let i = 0; i < req.body.ingredient.length; i++) {
                  ingredients.push(new mongoose.Types.ObjectId(req.body?.ingredient[i]));
                }

                Item.findOneAndUpdate(
                  {
                    _id: new mongoose.Types.ObjectId(req.params.item_id),
                    isDeleted: false,
                  },
                  {
                    name: req.body.name,
                    slug: await createSlug(req.body.name),
                    description: req.body.description,
                    image: await imageUrl(req.headers.host, req.file.filename),
                    categoryId: new mongoose.Types.ObjectId(req.body.categoryId),
                    brandId: new mongoose.Types.ObjectId(req.body.brandId),
                    foodtypeId: new mongoose.Types.ObjectId(req.body.foodtypeId),
                    Ingredients: ingredients,
                    preparationTime: req.body.preparationTime,
                  },
                  { upsert: true }
                )
                  .then(async (updateItem) => {
                    if (!updateItem) {
                      throw {
                        statusCode: constants.code.preconditionFailed,
                        message: constants.code.dataNotFound,
                      };
                    } else {
                      const variants = req.body.variants
                      for (let i = 0; i < variants.length; i++) {
                        let variant = variants[i]
                        await Variant.findOneAndUpdate(
                          {
                            itemId: new mongoose.Types.ObjectId(req.params.item_id),
                            _id: new mongoose.Types.ObjectId(variant.variantId),
                            isDeleted: false
                          },
                          {
                            itemId: new mongoose.Types.ObjectId(req.params.item_id),
                            name: variant.variantName,
                            slug: await createSlug(variant.variantName),
                            price: variant.price,
                          },

                          { upsert: true }

                        )
                      }
                      res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.itemUpdated,
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

// const updateItem = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     Item.findOne({
//       _id: new mongoose.Types.ObjectId(req.params.item_id),
//       isDeleted: false,
//     })
//       .then(async (data) => {
//         if (!data) {
//           throw {
//             statusCode: constants.code.dataNotFound,
//             msg: constants.message.dataNotFound,
//           };
//         } else {
//           Item.exists({
//             slug: await createSlug(req.body.name),
//             _id: { $nin: [new mongoose.Types.ObjectId(req.params.item_id)] },
//             isDeleted: false,
//           })
//             .then(async (dataExist) => {
//               if (dataExist) {
//                 throw {
//                   statusCode: constants.code.preconditionFailed,
//                   msg: message.itemExists,
//                 };
//               } else if (!req.file) {
//                 let ingredients = [];
//                 for (let i = 0; i < req.body.ingredient.length; i++) {
//                   ingredients.push(new mongoose.Types.ObjectId(req.body?.ingredient[i]));
//                 }
//                 Item.findOneAndUpdate(
//                   {
//                     _id: new mongoose.Types.ObjectId(req.params.item_id),
//                     isDeleted: false,
//                   },
//                   {
//                     name: req.body.name,
//                     slug: await createSlug(req.body.name),
//                     description: req.body.description,
//                     categoryId: new mongoose.Types.ObjectId(req.body.categoryId),
//                     foodtypeId: new mongoose.Types.ObjectId(req.body.foodtypeId),
//                     Ingredients: ingredients,
//                     preparationTime: req.body.preparationTime,
//                   },
//                   { upsert: true }
//                 )
//                   .then(async (updatedItem: any) => {
//                     if (!updatedItem) {
//                       throw {
//                         statusCode: constants.code.preconditionFailed,
//                         message: constants.code.dataNotFound,
//                       };
//                     } else {
//                       Variant.findOneAndUpdate(
//                         {
//                           itemId: new mongoose.Types.ObjectId(req.params.item_id),
//                           _id: new mongoose.Types.ObjectId(req.body.variantId),
//                           isDeleted: false
//                         },
//                         {
//                           itemId: new mongoose.Types.ObjectId(req.params.item_id),
//                           name: req.body.variantName,
//                           slug: await createSlug(req.body.variantName),
//                           price: req.body.price,
//                         },

//                         { upsert: true }

//                       ).then((variantData: any) => {
//                         if (!variantData) {
//                           throw {
//                             statusCode: constants.code.dataNotFound,
//                             message: constants.message.dataNotFound,
//                           }
//                         }
//                         else {
//                           res.status(constants.code.success).json({
//                             status: constants.status.statusTrue,
//                             userStatus: req.status,
//                             message: message.itemUpdated,
//                           });
//                         }
//                       }).catch((err) => {
//                         res.status(err.statusCode).json({
//                           status: constants.status.statusFalse,
//                           userStatus: req.status,
//                           message: err.message,
//                         });
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
//               } else if (!data.image) {
//                 let ingredients = [];
//                 for (let i = 0; i < req.body.ingredient.length; i++) {
//                   ingredients.push(new mongoose.Types.ObjectId(req.body?.ingredient[i]));
//                 }

//                 Item.findOneAndUpdate(
//                   {
//                     _id: new mongoose.Types.ObjectId(req.params.item_id),
//                     isDeleted: false,
//                   },
//                   {
//                     name: req.body.name,
//                     slug: await createSlug(req.body.name),
//                     description: req.body.description,
//                     image: await imageUrl(req.headers.host, req.file.filename),
//                     categoryId: new mongoose.Types.ObjectId(req.body.categoryId),
//                     foodtypeId: new mongoose.Types.ObjectId(req.body.foodtypeId),
//                     Ingredients: ingredients,
//                     preparationTime: req.body.preparationTime,
//                   },
//                   { upsert: true }
//                 )
//                   .then(async (updateItem) => {
//                     if (!updateItem) {
//                       throw {
//                         statusCode: constants.code.preconditionFailed,
//                         message: constants.code.dataNotFound,
//                       };
//                     } else {
//                       Variant.findOneAndUpdate(
//                         {
//                           itemId: new mongoose.Types.ObjectId(req.params.item_id),
//                           _id: new mongoose.Types.ObjectId(req.body.variantId),
//                           isDeleted: false
//                         },
//                         {
//                           itemId: new mongoose.Types.ObjectId(req.params.item_id),
//                           name: req.body.variantName,
//                           slug: await createSlug(req.body.variantName),
//                           price: req.body.price,
//                         },

//                         { upsert: true }

//                       ).then((variantData) => {
//                         if (!variantData) {
//                           throw {
//                             statusCode: constants.code.dataNotFound,
//                             message: constants.message.dataNotFound,
//                           }
//                         }
//                         else {
//                           res.status(constants.code.success).json({
//                             status: constants.status.statusTrue,
//                             userStatus: req.status,
//                             message: message.itemUpdated,
//                           });
//                         }
//                       }).catch((err) => {
//                         res.status(err.statusCode).json({
//                           status: constants.status.statusFalse,
//                           userStatus: req.status,
//                           message: err.message,
//                         });
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
//               } else {
//                 await removeImage(await getFileName(data.image));
//                 let ingredients = [];
//                 for (let i = 0; i < req.body.ingredient.length; i++) {
//                   ingredients.push(new mongoose.Types.ObjectId(req.body?.ingredient[i]));
//                 }

//                 Item.findOneAndUpdate(
//                   {
//                     _id: new mongoose.Types.ObjectId(req.params.item_id),
//                     isDeleted: false,
//                   },
//                   {
//                     name: req.body.name,
//                     slug: await createSlug(req.body.name),
//                     description: req.body.description,
//                     image: await imageUrl(req.headers.host, req.file.filename),
//                     categoryId: new mongoose.Types.ObjectId(req.body.categoryId),
//                     foodtypeId: new mongoose.Types.ObjectId(req.body.foodtypeId),
//                     Ingredients: ingredients,
//                     preparationTime: req.body.preparationTime,
//                   },
//                   { upsert: true }
//                 )
//                   .then(async (updateItem) => {
//                     if (!updateItem) {
//                       throw {
//                         statusCode: constants.code.preconditionFailed,
//                         message: constants.code.dataNotFound,
//                       };
//                     } else {
//                       Variant.findOneAndUpdate(
//                         {
//                           itemId: new mongoose.Types.ObjectId(req.params.item_id),
//                           _id: new mongoose.Types.ObjectId(req.body.variantId),
//                           isDeleted: false
//                         },
//                         {
//                           itemId: new mongoose.Types.ObjectId(req.params.item_id),
//                           name: req.body.variantName,
//                           slug: await createSlug(req.body.variantName),
//                           price: req.body.price,
//                         },

//                         { upsert: true }

//                       ).then((variantData) => {
//                         if (!variantData) {
//                           throw {
//                             statusCode: constants.code.dataNotFound,
//                             message: constants.message.dataNotFound,
//                           }
//                         }
//                         else {
//                           res.status(constants.code.success).json({
//                             status: constants.status.statusTrue,
//                             userStatus: req.status,
//                             message: message.itemUpdated,
//                           });
//                         }
//                       }).catch((err) => {
//                         res.status(err.statusCode).json({
//                           status: constants.status.statusFalse,
//                           userStatus: req.status,
//                           message: err.message,
//                         });
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
//                 message: err.msg,
//               });
//             });
//         }
//       })
//       .catch((err) => {
//         res.status(err.statusCode).json({
//           status: constants.status.statusFalse,
//           userStatus: req.status,
//           message: err.msg,
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

const listItem = async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;
    // const sort = req.query.sort === "desc" ? -1 : 1;

    if (Number(req.query.limit) !== 0) {
      Item.aggregate([
        {
          $match: {
            isDeleted: false,

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
                  isDeleted: false,
                },
              },
            ],
            as: "categoryDetail",
          },
        },
        {
          $unwind: {
            path: "$categoryDetail",
            preserveNullAndEmptyArrays: true,
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
            from: "variants",
            let: { itemId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$itemId", "$$itemId"] },
                  isDeleted: false,
                },
              },
            ],
            as: "variantDetail",
          },
        },
        {
          $unwind: {
            path: "$variantDetail",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "foodtypes",
            let: { foodtypeid: "$foodtypeId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$foodtypeid"] },
                  isDeleted: false,
                },
              },
            ],
            as: "foodTypeDetail",
          },
        },
        {
          $unwind: {
            path: "$foodTypeDetail",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "ingredients",
            let: { ingredient: "$Ingredients" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$ingredient"] },
                  isDeleted: false,
                },
              },
            ],
            as: "ingredientDetail",
          },
        },
        // {
        //   $unwind: {
        //     path: "$ingredientDetail",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },

        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            description: { $first: "$description" },
            image: { $first: "$image" },
            createdAt: { $first: "$createdAt" },
            preparationTime: { $first: "$preparationTime" },
            category: { $first: "$categoryDetail.name" },
            brandName: { $first: "$brandDetail.name" },
            foodTYpe: { $first: "$foodTypeDetail.name" },
            variantDetail: {
              $push: { variantId: "$variantDetail._id", variantName: "$variantDetail.name", price: "$variantDetail.price" },
            }, ingredientDetail: { $first: "$ingredientDetail" },


          }
        },

        {
          $match: {
            $or: [
              {
                category: {
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
          if (!data[0].data.length) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            };
          } else {
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.itemListSuccess,
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
      Item.aggregate([
        {
          $match: {
            isDeleted: false,

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
                  isDeleted: false,
                },
              },
            ],
            as: "categoryDetail",
          },
        },
        {
          $unwind: {
            path: "$categoryDetail",
            preserveNullAndEmptyArrays: true,
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
            from: "variants",
            let: { itemId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$itemId", "$$itemId"] },
                  isDeleted: false,
                },
              },
            ],
            as: "variantDetail",
          },
        },
        {
          $unwind: {
            path: "$variantDetail",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "foodtypes",
            let: { foodtypeid: "$foodtypeId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$foodtypeid"] },
                  isDeleted: false,
                },
              },
            ],
            as: "foodTypeDetail",
          },
        },
        {
          $unwind: {
            path: "$foodTypeDetail",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "ingredients",
            let: { ingredient: "$Ingredients" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$_id", "$$ingredient"] },
                  isDeleted: false,
                },
              },
            ],
            as: "ingredientDetail",
          },
        },
        // {
        //   $unwind: {
        //     path: "$ingredientDetail",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },


        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            description: { $first: "$description" },
            createdAt: { $first: "$createdAt" },
            image: { $first: "$image" },
            preparationTime: { $first: "$preparationTime" },
            category: { $first: "$categoryDetail.name" },
            brandName: { $first: "$brandDetail.name" },
            foodTYpe: { $first: "$foodTypeDetail.name" },
            variantDetail: {
              $push: { variantId: "$variantDetail._id", variantName: "$variantDetail.name", price: "$variantDetail.price" },
            }, ingredientDetail: { $first: "$ingredientDetail" },


          }
        },
        {
          $match: {
            $or: [
              {
                category: {
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
          if (!data[0].data.length) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            };
          } else {
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.itemListSuccess,
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

const itemDetail = async (req: any, res: Response, next: NextFunction) => {
  try {
    Item.findOne({
      _id: new mongoose.Types.ObjectId(req.params.item_id),
      isDeleted: false,
    })
      .then((data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          Item.aggregate([
            {
              $match: {
                _id: new mongoose.Types.ObjectId(req.params.item_id),
                isDeleted: false,
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
                      isDeleted: false,
                    },
                  },
                ],
                as: "categoryDetail",
              },
            },
            {
              $unwind: {
                path: "$categoryDetail",
                preserveNullAndEmptyArrays: true,
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
                from: "ingredients",
                let: { ingredient: "$Ingredients" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $in: ["$_id", "$$ingredient"] },
                      isDeleted: false,
                    },
                  },
                ],
                as: "ingredientDetail",
              },
            },
            // {
            //   $unwind: {
            //     path: "$ingredientDetail",
            //     preserveNullAndEmptyArrays: true,
            //   },
            // },

            {
              $lookup: {
                from: "foodtypes",
                let: { foodtypeid: "$foodtypeId" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$foodtypeid"] },
                      isDeleted: false,
                    },
                  },
                ],
                as: "foodTypeDetail",
              },
            },
            {
              $unwind: {
                path: "$foodTypeDetail",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $lookup: {
                from: "variants",
                let: { itemId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$itemId", "$$itemId"] },
                      isDeleted: false,
                    },
                  },
                ],
                as: "variantDetail",
              },
            },
            {
              $unwind: {
                path: "$variantDetail",
                preserveNullAndEmptyArrays: true,
              },
            },

            // { $unwind: "$variantDetail" },
            // { $sort: { "variantDetail.createdAt": 1 } },
            // { $limit: 1 },

            {
              $group: {
                _id: "$_id",
                name: { $first: "$name" },
                description: { $first: "$description" },
                image: { $first: "$image" },
                preparationTime: { $first: "$preparationTime" },
                category: { $first: "$categoryDetail.name" },
                categoryId: { $first: "$categoryDetail._id" },
                brandId: { $first: "$brandDetail._id" },
                brandName: { $first: "$brandDetail.name" },
                foodTYpe: { $first: "$foodTypeDetail.name" },
                foodTYpeId: { $first: "$foodTypeDetail._id" },
                variantDetail: {
                  $push: { variantId: "$variantDetail._id", variantName: "$variantDetail.name", price: "$variantDetail.price" },
                }, ingredientDetail: { $first: "$ingredientDetail" },

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
                  message: message.itemGetSuccess,
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
      .catch((err: any) => {
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

const getItem = async (req: any, res: Response, next: NextFunction) => {
  try {
    Item.findOne({
      _id: new mongoose.Types.ObjectId(req.params.item_id),
      isDeleted: false,
    })
      .then((data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        } else {
          Item.aggregate([
            {
              $match: {
                _id: new mongoose.Types.ObjectId(req.params.item_id),
                isDeleted: false,
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
                      isDeleted: false,
                    },
                  },
                ],
                as: "categoryDetail",
              },
            },
            {
              $unwind: {
                path: "$categoryDetail",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $lookup: {
                from: "variants",
                let: { itemId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$itemId", "$$itemId"] },
                      isDeleted: false,
                    },
                  },
                ],
                as: "variantDetail",
              },
            },
            {
              $unwind: {
                path: "$variantDetail",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $group: {
                _id: "$_id",
                name: { $first: "$name" },
                images: { $first: "$images" },
                Ingredients: { $first: "$Ingredients" },
                price: { $first: "$price" },
                categoryDetail: { $first: "$categoryDetail" },
                variantDetail: { $push: "$variantDetail" },


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
                  message: message.itemGetSuccess,
                  data: item_Detail,
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
      .catch((err: any) => {
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

// const deleteItem = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     if (!req.body.is_delete) {
//       throw {
//         statusCode: constants.code.preconditionFailed,
//         msg: constants.message.invalidType,
//       };
//     } else {
//       Item.findOneAndUpdate(
//         {
//           _id: new mongoose.Types.ObjectId(req.params.item_id),
//           isDeleted: false,
//         },
//         {
//           isDeleted: req.body.is_delete,
//         }
//       )
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
//               message: message.itemDeleted,
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
//   } catch (err: any) {
//     res.status(err.statusCode).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: err.msg,
//     });
//   }
// };

const itemDelete = async (req: any, res: Response, next: NextFunction) => {
  try {

    Item.findOne({
      _id: new mongoose.Types.ObjectId(req.params.item_id),
      isDeleted: false,
    })
      .then((data) => {
        if (!data) {
          throw {
            statusCode: constants.code.dataNotFound,
            msg: constants.message.dataNotFound,
          };
        }
        else {

          Item.updateOne({ _id: req.params.item_id, isDeleted: false },
            { isDeleted: true },
            { new: true }).then((data) => {
              if (!data) {
                throw {
                  statusCode: constants.code.preconditionFailed,
                  message: message.failedDeleteItem
                }
              }
              else {
                Variant.updateMany({ itemId: req.params.item_id, isDeleted: false },
                  { isDeleted: true },
                  { new: true }).then((deleteVariant) => {
                    if (!deleteVariant) {
                      throw {
                        statusCode: constants.code.preconditionFailed,
                        message: message.failedDeleteVariant
                      }
                    }
                    else {
                      res.status(constants.code.success).json({
                        status: constants.status.statusTrue,
                        userStatus: req.status,
                        message: message.itemDeleted,
                      });

                    }
                  }).catch((err) => {
                    res
                      .status(constants.code.preconditionFailed)
                      .json({
                        status: constants.status.statusFalse,
                        userStatus: req.status,
                        message: err.message,
                      });
                  });

              }
            }).catch((err) => {
              res
                .status(constants.code.preconditionFailed)
                .json({
                  status: constants.status.statusFalse,
                  userStatus: req.status,
                  message: err.message,
                });
            });
        }
      }).catch((err: any) => {
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

const listVariants = async (req: any, res: Response, next: NextFunction) => {
  try {
    Variant.find(
      { itemId: req.params.item_id, isDeleted: false },
      { _id: 1, name: 1, price: 1 }
    )
      .then((data) => {
        if (!data.length) {
          throw {
            statusCode: constants.code.internalServerError,
            msg: constants.message.internalServerError,
          };
        } else {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: constants.status.statusFalse,
            message: message.variantListSuccessfully,
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
    res.status(constants.code.preconditionFailed).json({
      status: constants.status.statusFalse,
      userStatus: constants.status.statusFalse,
      message: err,
    });
  }
}


const addVariant = async (req: any, res: Response, next: NextFunction) => {
  try {
    await Variant.findOne({
      itemId: new mongoose.Types.ObjectId(req.body.itemId),
      slug: await createSlug(req.body.variantName),
      isDeleted: false
    }).then(async (data) => {
      if (data) {
        throw {
          statusCode: constants.code.badRequest,
          message: message.variantExist,
        }
      }
      else {
        Variant.create({
          itemId: new mongoose.Types.ObjectId(req.body.itemId),
          name: req.body.variantName,
          slug: await createSlug(req.body.variantName),
          price: req.body.price
        }).then(async (data) => {
          if (!data) {
            throw {
              statusCode: constants.code.dataNotFound,
              message: constants.message.dataNotFound
            }
          }
          else {
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.variantAdded,
            });

          }
        }).catch((err) => {
          res
            .status(constants.code.preconditionFailed)
            .json({
              status: constants.status.statusFalse,
              userStatus: req.status,
              message: err.message,
            });
        });


      }
    }).catch((err) => {
      res
        .status(constants.code.preconditionFailed)
        .json({
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


const updateVariant = async (req: any, res: Response, next: NextFunction) => {
  try {
    Variant.exists({
      _id: {
        $nin: [new mongoose.Types.ObjectId(req.params.variant_id)],
      },
      itemId: new mongoose.Types.ObjectId(req.body.itemId),
      slug: await createSlug(req.body.variantName),
      isDeleted: false,
    })
      .then(async (data) => {
        if (data) {
          throw {
            statusCode: constants.code.badRequest,
            message: message.variantExist,
          };
        } else {
          Variant.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(req.params.variant_id),
              isDeleted: false,
            },
            {
              itemId: new mongoose.Types.ObjectId(req.body.itemId),
              name: req.body.variantName,
              slug: await createSlug(req.body.variantName),
              price: req.body.price
            },
            { upsert: true }
          )
            .then((updateVariant) => {
              if (!updateVariant) {
                throw {
                  statusCode: constants.code.preconditionFailed,
                  message: constants.code.dataNotFound,
                };
              } else {
                res.status(constants.code.success).json({
                  status: constants.status.statusTrue,
                  userStatus: req.status,
                  message: message.variantUpdated,
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

const variantDetail = async (req: any, res: Response, next: NextFunction) => {
  try {
    Variant.findOne({
      _id: new mongoose.Types.ObjectId(req.params.variant_id),
      isDeleted: false,
    }, { _id: 1, name: 1, price: 1, itemId: 1 })
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
            message: message.variantDetail,
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
}


const deleteVariant = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.body.is_delete) {
      throw {
        statusCode: constants.code.preconditionFailed,
        msg: constants.message.invalidType,
      };
    } else {
      Variant.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.variant_id),
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
              message: message.variantDeleted,
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
  } catch (err: any) {
    res.status(constants.code.preconditionFailed).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err.msg,
    });
  }
}


// const updateitem = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     Item.exists({
//       _id: {
//         $nin: [new mongoose.Types.ObjectId(req.params.item_id)],
//       },
//       slug: await createSlug(req.body.name),
//       isDeleted: false,
//     })
//       .then(async (data) => {
//         if (data) {
//           throw {
//             statusCode: constants.code.badRequest,
//             message: message.itemExists,
//           };
//         } else {
//           Variant.findOne(
//             { _id: new mongoose.Types.ObjectId(req.body.variantId) },
//             {
//               image: 1,
//             }
//           ).then(async (variantData: any) => {
//             if (!variantData) {
//               throw {
//                 statusCode: constants.code.dataNotFound,
//                 message: constants.message.dataNotFound,
//               }
//             }
//             else {
//               Item.findOneAndUpdate(
//                 {
//                   _id: new mongoose.Types.ObjectId(req.params.item_id),
//                   isDeleted: false,
//                 },
//                 {
//                   name: req.body.name,
//                   slug: await createSlug(req.body.name),
//                   description: req.body.description,
//                   categoryId: new mongoose.Types.ObjectId(
//                     req.body.categoryId
//                   ),
//                   preparationTime: req.body.preparationTime,
//                 },
//                 { upsert: true }
//               )
//                 .then(async (updateItem) => {
//                   if (!updateItem) {
//                     throw {
//                       statusCode: constants.code.preconditionFailed,
//                       message: constants.code.dataNotFound,
//                     };
//                   } else {
//                     await removeImage(await getFileName(variantData.image));
//                     Variant.findOneAndUpdate(
//                       {
//                         itemId: new mongoose.Types.ObjectId(
//                           req.params.item_id
//                         ),
//                         isDeleted: false,
//                         _id: new mongoose.Types.ObjectId(
//                           req.body.variantId
//                         )
//                       },
//                       {
//                         itemId: new mongoose.Types.ObjectId(
//                           req.params.item_id),
//                         name: req.body.variantname,
//                         slug: await createSlug(req.body.variantname),
//                         price: req.body.price,
//                         image: await imageUrl(req.headers.host, req.file.filename),
//                       }
//                     ).then((data) => {
//                       if (!data) {
//                         throw {
//                           statusCode: constants.code.preconditionFailed,
//                           message: constants.code.dataNotFound,
//                         }
//                       }
//                       else {
//                         res.status(constants.code.success).json({
//                           status: constants.status.statusTrue,
//                           userStatus: req.status,
//                           message: message.itemUpdated
//                         })

//                       }
//                     }).catch((err) => {
//                       res
//                         .status(constants.code.preconditionFailed)
//                         .json({
//                           status: constants.status.statusFalse,
//                           userStatus: req.status,
//                           message: err.message,
//                         });
//                     });

//                   }
//                 }).catch((err) => {
//                   res
//                     .status(constants.code.preconditionFailed)
//                     .json({
//                       status: constants.status.statusFalse,
//                       userStatus: req.status,
//                       message: err.message,
//                     });
//                 });


//             }
//           }).catch((err) => {
//             res
//               .status(constants.code.preconditionFailed)
//               .json({
//                 status: constants.status.statusFalse,
//                 userStatus: req.status,
//                 message: err.message,
//               });
//           });

//         }
//       }).catch((err) => {
//         res
//           .status(constants.code.preconditionFailed)
//           .json({
//             status: constants.status.statusFalse,
//             userStatus: req.status,
//             message: err.message,
//           });
//       });

//   } catch (err) {
//     res.status(constants.code.internalServerError).json({
//       status: constants.status.statusFalse,
//       userStatus: req.status,
//       message: err,
//     });
//   }


// }



const variantList = async (req: any, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = page * limit;


    if (Number(req.query.limit) !== 0) {
      Variant.aggregate([
        {
          $match: {
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
            as: "itemDetail",
          },
        },
        {
          $unwind: {
            path: "$itemDetail",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$itemDetail._id",
            itemName: { $first: "$itemDetail.name" },
            itemImage: { $first: "$itemDetail.image" },
            createdAt: { $first: "$createdAt" },
            variant: {
              $push: { id: "$_id", variantName: "$name", price: "$price" },
            },


          }
        },
        {
          $match: {
            $or: [
              {
                itemName: {
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
          if (!data[0].data.length) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            };
          } else {
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.itemListSuccess,
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
      Variant.aggregate([
        {
          $match: {
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
            as: "itemDetail",
          },
        },
        {
          $unwind: {
            path: "$itemDetail",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$itemDetail._id",
            itemName: { $first: "$itemDetail.name" },
            itemImage: { $first: "$itemDetail.image" },
            createdAt: { $first: "$createdAt" },
            variant: {
              $push: { id: "$_id", variantName: "$name", price: "$price" },
            },


          }
        },
        {
          $match: {
            $or: [
              {
                itemName: {
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
          if (!data[0].data.length) {
            throw {
              statusCode: constants.code.dataNotFound,
              msg: constants.message.dataNotFound,
            };
          } else {
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: req.status,
              message: message.itemListSuccess,
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





export default {
  addItem,
  updateItem,
  listItem,
  getItem,
  //deleteItem, 
  itemDelete,
  listVariants,
  addVariant,
  itemDetail,
  updateVariant,
  variantDetail,
  deleteVariant,
  variantList
};
