import { Request, Response, NextFunction } from "express";
import validator from "../../helpers/validator";
import constants from "../../utils/constants";
import { getMessage, validateRequestData } from "../../helpers/helper";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationRule = {
      email: "required|string|email",
      password: "required|checkPSW",
      device_info:"required"
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

const changeProfilePicture = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationRule = {};
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
        } else if (!req.file) {
          res.status(constants.code.preconditionFailed).json({
            status: constants.status.statusFalse,
            userStatus: req.status,
            message: constants.message.reqProfilePic,
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

const updateDetail = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validationRule = {
      first_name: "required|string|min:3|max:20|checkPlainString",
      last_name: "required|string|min:3|max:20|checkPlainString",
      email: "required|string",
      phone: "required|string",
      gender: "required|string|in:male,female,other",
      date_of_birth: "required|string|checkISOstring|checkAge",
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
      userStatus: req.status,
      message: err,
    });
  }
};

const verifyEmail = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validationRule = {
      email: "required|string|email",
      otp: "required|numeric|OTP",
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
      userStatus: req.status,
      message: err,
    });
  }
};

const verifyPhone = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validationRule = {
      phone: "required|string|verifyPhone",
      otp: "required|numeric|OTP",
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
      userStatus: req.status,
      message: err,
    });
  }
};

const updateEmail = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validationRule = {
      email: "required|string|email|checkEmail",
      otp: "required|numeric|OTP",
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
      userStatus: req.status,
      message: err,
    });
  }
};

const updatePhone = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validationRule = {
      phone: "required|string|verifyPhone|checkPhone",
      otp: "required|numeric|OTP",
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
      userStatus: req.status,
      message: err,
    });
  }
};

const changePassword = async (req: any, res: Response, next: NextFunction) => {
  try {
    const validationRule = {
      old_password: "required|string|checkPSW",
      new_password: "required|string|checkPSW",
      new_password_confirmation: `required|checkPSW|validatePassword:${req.body.new_password}`,
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
      userStatus: req.status,
      message: err,
    });
  }
};

const manageAuthentication = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationRule = {
      is_2FA: "required|boolean|in:true,false",
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
      userStatus: req.status,
      message: err,
    });
  }
};

const manageNotification = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationRule = {
      is_notification: "required|boolean|in:true,false",
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
      userStatus: req.status,
      message: err,
    });
  }
};

const deactivateAccount = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationRule = {
      status: "required|boolean|in:true,false",
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
      userStatus: req.status,
      message: err,
    });
  }
};

const deleteAccount = async (req: any, res: Response, next: NextFunction) => {
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
      userStatus: req.status,
      message: err,
    });
  }
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationRule = {
      email: "required|string|email",
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

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationRule = {
      verify_token: "required|string|size:48",
      password: "required|checkPSW",
      password_confirmation: `required|checkPSW|validatePassword:${req.body.password}`,
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

export default {
  login,
  changeProfilePicture,
  updateDetail,
  verifyEmail,
  verifyPhone,
  updateEmail,
  updatePhone,
  changePassword,
  manageAuthentication,
  manageNotification,
  deactivateAccount,
  deleteAccount,
  forgotPassword,
  resetPassword,
};
