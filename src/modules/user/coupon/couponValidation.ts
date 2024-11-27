import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/validator";
import constants from "../../../utils/constants";
import { getMessage, validateRequestData } from "../../../helpers/helper";



const couponList = async(req:any, res:Response, next:NextFunction)=>{
    try {
        const validationRule = {
          page: "required|string",
          limit: "required|string",
        };
        const msg = {};
    
        await validator(
          req.query,
          validationRule,
          msg,
          async (err: any, status: boolean) => {
            if (!status) {
              res.status(constants.code.preconditionFailed).json({
                status: constants.status.statusFalse,
                userStatus: req.status,
                message: await getMessage(err),
              });
            } else if (
              (await validateRequestData(validationRule, req.query)) !== true
            ) {
              res.status(constants.code.expectationFailed).json({
                status: constants.status.statusFalse,
                userStatus: req.status,
                message: constants.message.unwantedData,
              });
            } else {
              next();
            }
          }
        );
      } catch (err) {
        res.status(constants.code.preconditionFailed).json({
          status: constants.status.statusFalse,
          userStatus: req.status,
          message: err,
        });
      }
}

const purchaseCoupon = async(req:any, res:Response, next:NextFunction)=>{
  try {
    const validationRule = {
      coupon_id: "required|string|size:24"
    };
    const msg = {};
    await validator(
      req.body,
      validationRule,
      msg,
      async (err: any, status: boolean) => {
        if (!status) {
          res.status(constants.code.preconditionFailed).json({
            status: constants.status.statusFalse,
            userStatus: constants.status.statusFalse,
            message: await getMessage(err),
          });
        } else if (
          (await validateRequestData(validationRule, req.body)) !== true
        ) {
          res.status(constants.code.expectationFailed).json({
            status: constants.status.statusFalse,
            userStatus: constants.status.statusFalse,
            message: constants.message.unwantedData,
          });
        } else {
          next();
        }
      }
    );
  } catch (err) {
    res.status(constants.code.preconditionFailed).json({
      status: constants.status.statusFalse,
      userStatus: constants.status.statusFalse,
      message: err,
    });
  }
}


const listPurchaseCoupon = async(req:any, res:Response, next:NextFunction)=>{
  try {
    const validationRule = {
      page: "required|string",
      limit: "required|string",
    };
    const msg = {};

    await validator(
      req.query,
      validationRule,
      msg,
      async (err: any, status: boolean) => {
        if (!status) {
          res.status(constants.code.preconditionFailed).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: await getMessage(err),
          });
        } else if (
          (await validateRequestData(validationRule, req.query)) !== true
        ) {
          res.status(constants.code.expectationFailed).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: constants.message.unwantedData,
          });
        } else {
          next();
        }
      }
    );
  } catch (err) {
    res.status(constants.code.preconditionFailed).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
}


const listavailableCoupon = async(req:any, res:Response, next:NextFunction)=>{
  try {
    const validationRule = {
      page: "required|string",
      limit: "required|string",
    };
    const msg = {};

    await validator(
      req.query,
      validationRule,
      msg,
      async (err: any, status: boolean) => {
        if (!status) {
          res.status(constants.code.preconditionFailed).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: await getMessage(err),
          });
        } else if (
          (await validateRequestData(validationRule, req.query)) !== true
        ) {
          res.status(constants.code.expectationFailed).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: constants.message.unwantedData,
          });
        } else {
          next();
        }
      }
    );
  } catch (err) {
    res.status(constants.code.preconditionFailed).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
}

 const couponDiscount = async(req:any, res:Response, next:NextFunction)=>{
  try {
    const validationRule = {
      coupon_id: "required|string|size:24",
      amount: "required|numeric"
    };
    const msg = {};
    await validator(
      req.body,
      validationRule,
      msg,
      async (err: any, status: boolean) => {
        if (!status) {
          res.status(constants.code.preconditionFailed).json({
            status: constants.status.statusFalse,
            userStatus: constants.status.statusFalse,
            message: await getMessage(err),
          });
        } else if (
          (await validateRequestData(validationRule, req.body)) !== true
        ) {
          res.status(constants.code.expectationFailed).json({
            status: constants.status.statusFalse,
            userStatus: constants.status.statusFalse,
            message: constants.message.unwantedData,
          });
        } else {
          next();
        }
      }
    );
  } catch (err) {
    res.status(constants.code.preconditionFailed).json({
      status: constants.status.statusFalse,
      userStatus: constants.status.statusFalse,
      message: err,
    });
  }
 }

 const listCouponForPurchase = async(req:any, res:Response, next:NextFunction)=>{
  try {
    const validationRule = {
      page: "required|string",
      limit: "required|string",
    };
    const msg = {};

    await validator(
      req.query,
      validationRule,
      msg,
      async (err: any, status: boolean) => {
        if (!status) {
          res.status(constants.code.preconditionFailed).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: await getMessage(err),
          });
        } else if (
          (await validateRequestData(validationRule, req.query)) !== true
        ) {
          res.status(constants.code.expectationFailed).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: constants.message.unwantedData,
          });
        } else {
          next();
        }
      }
    );
  } catch (err) {
    res.status(constants.code.preconditionFailed).json({
      status: constants.status.statusFalse,
      userStatus: req.status,
      message: err,
    });
  }
 }

export default {
    couponList,
    purchaseCoupon,
    listPurchaseCoupon,
    listavailableCoupon,
    couponDiscount,
    listCouponForPurchase
}