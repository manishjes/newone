import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/validator";
import constants from "../../../utils/constants";
import { getMessage, validateRequestData } from "../../../helpers/helper";

const create = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validationRule = {
      address_type: `required|string|in:${constants.addressTypes.home},${constants.addressTypes.work}, ${constants.addressTypes.other}`,
      address_line_one: "required|string|min:3|max:50",
      address_line_two: "string|min:3|max:50",
      city: "required|string|min:3|max:30",
      state: "required|string|min:3|max:30|checkString",
      country: "required|string|min:3|checkString",
      pin_code: "required|string|min:5|checkPinCode",
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
        } else if (
          (await validateRequestData(validationRule, req.body)) !== true
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

const detail = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validationRule = {
      address_id: "required|string|min:24",
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
        } else if (
          (await validateRequestData(validationRule, req.params)) !== true
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

const update = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validationRule = {
      full_name: "required|string|min:3|max:50|checkString",
      phone: "required|string|verifyPhone",
      address_type: `required|string|in:${constants.addressTypes.home},${constants.addressTypes.work}`,
      address_line_one: "required|string|min:3|max:50",
      address_line_two: "string|min:3|max:50",
      city: "required|string|min:3|max:30",
      state: "required|string|min:3|max:30|checkString",
      country: "required|string|min:3|checkString",
      pin_code: "required|string|min:5|checkPinCode",
      landmark: "string|min:3|max:25",
      latitude: "string|min:3|max:15",
      longitude: "string|min:3|max:15",
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
        } else if (
          (await validateRequestData(validationRule, req.body)) !== true
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

const deleteAddress = async (req: any, res: Response, next: NextFunction) => {
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
        } else if (
          (await validateRequestData(validationRule, req.body)) !== true
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

export default {
  create,
  detail,
  update,
  deleteAddress,
};
