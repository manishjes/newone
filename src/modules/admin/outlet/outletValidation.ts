import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/validator";
import constants from "../../../utils/constants";
import { getMessage, validateRequestData } from "../../../helpers/helper";


const addOutlet = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        name: "required|string|min:3",
        description:"required|string",
        brandId: "string|size:24",
        managerId: "string|size:24",
        outletStatus: "required|boolean|in:true,false",
        address_line_one: "required|string",
        address_line_two: "string",
        pin_code: "required|string|min:5",

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


const updateOutlet = async (req: any, res: Response, next: NextFunction) => {
    try {
        const validationRule = {
          name: "required|string|min:3",
          description:"required|string",
          brandId: "string|size:24",
          managerId: "string|size:24",
          outletStatus: "required|boolean|in:true,false",
          address_line_one: "required|string",
          address_line_two: "string",
          pin_code: "required|string|min:5",

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


const listOutlet = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        page: "required|string",
        limit: "required|string",
        filter: "string",
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
  };


  const outletDetail = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        outlet_id: "required|string|min:24",
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
  };


  const deleteOutlet = async (req: any, res: Response, next: NextFunction) => {
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
  };


  export default {
    addOutlet,
    updateOutlet,
    listOutlet,
    outletDetail,
    deleteOutlet
  }