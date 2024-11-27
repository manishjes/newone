import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/validator";
import constants from "../../../utils/constants";
import { getMessage, validateRequestData } from "../../../helpers/helper";



const listBrand = async(req:any, res:Response, next:NextFunction)=>{
    try {
      const validationRule = {
        page: "required|string",
        limit: "required|string",
        sort: "required|string|in:asc,desc",
        search: "string",
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


  const listNearByOutlet = async(req:any, res:Response, next:NextFunction)=>{
    try {
      const validationRule = {
        page: "required|string",
        limit: "required|string",
        search: "string",
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

  const outletDetail = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        outlet_id: "required|string|size:24"
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
  };

  const userReview = async(req:any, res:Response, next:NextFunction)=>{
    try {
      const validationRule = {
        outletId: "required|string|size:24",
        reviewOutlet: "required|numeric",
        reviewBrand: "required|numeric",
        comment: "required|string"

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


  const recommendedOutlet = async(req:any, res:Response, next: NextFunction)=>{
    try {
      const validationRule = {
        page: "required|string",
        limit: "required|string"
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


  const exploreOutlet = async(req:any, res:Response, next:NextFunction) =>{
    try {
      const validationRule = {
        brand_id: "required|string|size:24",
        outlet_id: "required|string|size:24"
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
    listBrand,
    listNearByOutlet,
    outletDetail,
    userReview,
    recommendedOutlet,
    exploreOutlet
  }