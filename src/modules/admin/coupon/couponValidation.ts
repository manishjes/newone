import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/validator";
import constants from "../../../utils/constants";
import { getMessage, validateRequestData } from "../../../helpers/helper";



const addCoupon = async(req:any, res:Response, next:NextFunction)=>{
    try {
        const validationRule = {
            name: "required|string",
            description: "required|string",
            code: "required|string",
            discountType: "required|string",
            unit: "required|string",
            value: "required|numeric",
            startDate: "required|string",
            endDate: "required|string",
            pointtoredem: "required|numeric"
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
                userStatus: req.status,
                message: await getMessage(err),
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

const couponDetail = async(req:any, res:Response, next:NextFunction)=>{
    try {
        const validationRule = {
            coupon_id: "required|string|min:24",
        };
        const msg = {};
    
        await validator(
          req.params,
          validationRule,
          msg,
          async (err: any, status: boolean) => {
            if (!status) {
              res.status(constants.code.preconditionFailed).json({
                status: constants.status.statusFalse,
                userStatus: req.status,
                message: await getMessage(err),
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

const updateCoupon = async(req:any, res:Response, next:NextFunction)=>{
    try {
        const validationRule = {
            name: "required|string",
            description: "required|string",
            code: "required|string",
            discountType: "required|string",
            unit: "required|string",
            value: "required|numeric",
            startDate: "required|string",
            endDate: "required|string",
            pointtoredem: "required|numeric"
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
                userStatus: req.status,
                message: await getMessage(err),
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

const listCoupon = async(req:any, res:Response, next:NextFunction)=>{
    try {
        const validationRule = {
          page: "required|string",
          limit: "required|string",
          filter: "string"
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


const deleteCoupon = async(req:any, res:Response, next:NextFunction)=>{
  try {
    const validationRule = {
      is_delete: "required|boolean|in:true,false",
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
            userStatus: req.status,
            message: await getMessage(err),
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
    addCoupon,
    couponDetail,
    updateCoupon,
    listCoupon,
    deleteCoupon
}