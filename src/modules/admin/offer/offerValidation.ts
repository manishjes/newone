import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/validator";
import constants from "../../../utils/constants";
import { getMessage, validateRequestData } from "../../../helpers/helper";


const addOffer = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        brand_id: "required|string|size:24",

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
  };


  const updateOffer = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        brand_id: "required|string|size:24",

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
  };

  const listOffer = async(req:any, res:Response, next:NextFunction)=>{
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

  const offerDetail = async(req:any, res:Response, next:NextFunction)=>{
    try {
        const validationRule = {
            offer_id: "required|string|min:24",
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

  const deleteOffer = async(req:any, res:Response, next:NextFunction)=>{
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
    addOffer,
    updateOffer,
    listOffer,
    offerDetail,
    deleteOffer
  }