import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/validator";
import constants from "../../../utils/constants";
import { getMessage, validateRequestData } from "../../../helpers/helper";



const bookingRequest = async(req:any, res:Response, next:NextFunction) =>{
    try {
        const validationRule = {
          page: "required|string",
          limit: "required|string",
          search: "string",
          filter:"string"
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

const acceptBooking = async(req:any, res:Response, next:NextFunction)=>{
    try {
        const validationRule = {
            request_id: "required|string|min:24",
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


const rejectBooking = async(req:any, res:Response, next:NextFunction)=>{
    try {
        const validationRule = {
          reason: "required|string|min:10",
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

const requestDetail = async(req:any, res:Response, next:NextFunction)=>{
  try {
      const validationRule = {
          request_id: "required|string|min:24",
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

export default {
    bookingRequest,
    acceptBooking,
    rejectBooking,
    requestDetail
}