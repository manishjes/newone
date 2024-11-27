import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/validator";
import constants from "../../../utils/constants";
import { getMessage, validateRequestData } from "../../../helpers/helper";



const addPoint = async(req:any, res:Response, next:NextFunction) =>{
    try {
        const validationRule = {
            points: "required|numeric"
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

const billPOints = async(req:any, res:Response, next:NextFunction)=>{
  try {
    const validationRule = {
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


const earnPoint = async(req:any, res:Response, next:NextFunction)=>{
  try {
    const validationRule = {
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


export default {
    addPoint,
    billPOints,
    earnPoint
}