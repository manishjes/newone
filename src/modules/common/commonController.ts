import { Request, Response, NextFunction } from "express";
import constants from "../../utils/constants";
import CMS from "../../models/cms";
import message from "./commonConstant";
import Setting from "../../models/setting";
import State from "../../models/state";
import City from "../../models/city";
import Location from "../../models/location";
import Country from "../../models/country";
// import Feedback from "../../models/feedback";
// import mongoose from "mongoose";
import { getFileName } from "../../helpers/helper";
import { readFileSync } from "fs";

import mongoose from "mongoose";
import User from '../../models/user'
import Cuisine from "../../models/cuisine";
import FoodType from "../../models/foodtype";
import Ingredient from "../../models/ingredient";
import Category from "../../models/category";
import Item from "../../models/item";
import Brand from "../../models/brand";
import Outlet from "../../models/outlet";




const getAccessKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.access_token !== process.env.ACCESS_TOKEN) {
      throw {
        statusCode: constants.code.preconditionFailed,
        msg: message.invalidToken,
      };
    } else {
      Setting.findOne({}, { AccessKey: 1 }).then((data: any) => {
        if (data) {
          res.status(constants.code.success).json({
            status: constants.status.statusTrue,
            userStatus: constants.status.statusFalse,
            message: constants.message.success,
            AccessKey: data.AccessKey,
          });
        }
      });
    }
  } catch (err: any) {
    res.status(err.statusCode).json({
      status: constants.status.statusFalse,
      userStatus: constants.status.statusFalse,
      message: err.msg,
    });
  }
};




const cuisineList = async (req: any, res: Response, next: NextFunction) => {
  try {
    Cuisine.find(
      { isDeleted: false },
      { _id: 1, name: 1, }
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
            message: message.cuisineListSuccess,
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


  const listCategory = async (req: any, res: Response, next: NextFunction) => {
    try {
      Category.find(
        { isDeleted: false },
        { _id: 1, name: 1, }
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
              message: message.categoryListSuccess,
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
  };


  const listFoodType = async (req: any, res: Response, next: NextFunction) => {
    try {
      FoodType.find(
        { isDeleted: false },
        { _id: 1, name: 1, }
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
              message: message.foodtypelisted,
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


  const listIngredient = async (req: any, res: Response, next: NextFunction) => {
    try {

      await Ingredient.aggregate([
        {
          $match: {
            isDeleted: false,
            name: { $regex: "^" + req.body.ingredientName + ".*", $options: "i" },
          
          },
        },
        {
          $project: {
            _id: 1,
             name: 1
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
              message: message.ingredientList,
              data: data,
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
    } catch (error) {
      res.status(constants.code.internalServerError).json({
        status: constants.status.statusFalse,
        userStatus: constants.status.statusFalse,
        message: error,
      });
    }
  }


  const listItem = async (req: any, res: Response, next: NextFunction) => {
    try {
      Item.find(
        { isDeleted: false },
        { _id: 1, name: 1, }
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
              message: message.itemLists,
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



  const listItemByCategory =  async (req: any, res: Response, next: NextFunction) => {
    try {
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
            itemName:  { $first: "$name" },
            categoryName: { $first: "$categoryDetail.name" },
            createdAt:  { $first: "$createdAt" },
            variant: {
              $push: { id: "$variantDetail._id", variantName: "$variantDetail.name", price: "$variantDetail.price" },
            },
            
          }
        },

        {
          $match: {
            $or: [
              {
                categoryName: {
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
                itemName: {
                  $regex: "^" + req.query.search + ".*",
                  $options: "i",
                },
              },
              {
                categoryName: {
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
              message: message.itemList,
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
      res.status(constants.code.preconditionFailed).json({
        status: constants.status.statusFalse,
        userStatus: constants.status.statusFalse,
        message: err,
      });
    }
  }


  const listItemByBrand = async(req:any, res:Response, next:NextFunction) =>{
    try {
      Item.aggregate([
        {
          $match: {
            brandId:new mongoose.Types.ObjectId(req.body.brand_id),
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
            itemName:  { $first: "$name" },
            categoryName: { $first: "$categoryDetail.name" },
            createdAt:  { $first: "$createdAt" },
            variant: {
              $push: { id: "$variantDetail._id", variantName: "$variantDetail.name", price: "$variantDetail.price" },
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
          $sort: { createdAt: -1 },
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
              message: message.itemList,
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
      res.status(constants.code.preconditionFailed).json({
        status: constants.status.statusFalse,
        userStatus: constants.status.statusFalse,
        message: err,
      });
    }
  }

  const listBrand = async (req: any, res: Response, next: NextFunction) => {
    try {
      Brand.find(
        { isDeleted: false },
        { _id: 1, name: 1, }
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
              message: message.brandList,
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
  };


  const listOutletByBrand = async (req: any, res: Response, next: NextFunction) => {
    try {
      Outlet.find(
        { brandId:new mongoose.Types.ObjectId(req.body.brand_id), isDeleted: false },
        { _id: 1, name: 1, }
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
              message: message.brandList,
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

  const listOutlet = async(req:any, res:Response, next:NextFunction)=>{
    try {

      await Outlet.aggregate([
        {
          $match: {
            isDeleted: false
          },
        },

        {
          $lookup: {
            from: "addresses",
            let: {
              outletId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$OutletId", "$$outletId"] },
                      { $eq: ["$isDeleted", false] },
                    ],
                  },
                },
              },
            ],
            as: "address_detail",
          },
        },
        {
          $unwind: {
            path: "$address_detail",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,
             name: 1,
             area: "$address_detail.address.line_one"
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
              message: message.outletList,
              data: data,
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
    } catch (error) {
      res.status(constants.code.internalServerError).json({
        status: constants.status.statusFalse,
        userStatus: constants.status.statusFalse,
        message: error,
      });
    }
  }
  


  const managerList = async(req:any, res:Response, next:NextFunction)=>{
    try {
      User.find(
        { isDeleted: false, role: constants.accountLevel.manager },
        { _id: 1, fname: 1, lname: 1}
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
              message: message.managerList,
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



  const customerList = async(req:any, res:Response, next:NextFunction)=>{
    try {
      User.find(
        { isDeleted: false, role: constants.accountLevel.user },
        { _id: 1, fullName:1, email:1}
      ).sort({createdAt:-1})
        .then((data:any) => {
          if (!data.length) {
            throw {
              statusCode: constants.code.internalServerError,
              msg: constants.message.internalServerError,
            };
          } else {
            const users = data.map((user:any) => ({
              name: user.fullName,
              _id: user._id,
            }));
            res.status(constants.code.success).json({
              status: constants.status.statusTrue,
              userStatus: constants.status.statusFalse,
              message: message.customerList,
              data: users,
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




export default{
  getAccessKey,
  cuisineList,
  listCategory,
  listFoodType,
  listIngredient,
  listItem,
  listItemByCategory,
 listItemByBrand, 
  listBrand,
  listOutletByBrand,
  listOutlet,
  managerList,
  customerList
}