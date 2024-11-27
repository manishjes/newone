import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/validator";
import constants from "../../../utils/constants";
import { getMessage, validateRequestData } from "../../../helpers/helper";



const tableBooking = async(req:any, res:Response, next:NextFunction)=>{
    try {
        const validationRule = {
            outlet_id: "required|string|size:24",
            bookingTime: "required|string|checkISOstring",
            guestNum: "required|numeric"
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


const modifyBooking = async(req:any, res:Response, next:NextFunction)=>{
  try {
    const validationRule = {
        bookingTime: "required|string",
        guestNum: "required|numeric"
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

const cancelBooking = async(req:any, res:Response, next:NextFunction)=>{
  try {
    const validationRule = {
      userReason: "required|string",
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
    tableBooking,
    modifyBooking,
    cancelBooking
}