import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/validator";
import constants from "../../../utils/constants";
import { getMessage, validateRequestData } from "../../../helpers/helper";

const addCategory = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        name: "required|string|min:3",
        cuisineType: "required|string"
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


  const updateCategory = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        name: "required|string|min:3",
        cuisineType: "required|string"
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


  const listCategory = async (req: any, res: Response, next: NextFunction) => {
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
  };


  const categoryDetail = async (req: any, res: Response, next: NextFunction) => {

    try {
      const validationRule = {
        categoryId: "required|string|min:24",
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


  const deleteCategory = async (req: any, res: Response, next: NextFunction) => {

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
    addCategory,
    updateCategory,
    listCategory,
    categoryDetail,
    deleteCategory
  }