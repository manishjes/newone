import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/validator";
import constants from "../../../utils/constants";
import { getMessage, validateRequestData } from "../../../helpers/helper";

const addItem = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        name: "required|string|min:3",
        description: "required|string",
        categoryId: "required|string|size:24",
        brandId: "required|string|size:24",
        foodtypeId: "required|string|size:24",
        //price: "required|string",
        ingredient: "required|array",
        preparationTime: "required|string",
       // variantName: "required|string"
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


  const updateItem = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        name: "required|string|min:3",
        description: "required|string",
        categoryId: "required|string|size:24",
        foodtypeId: "required|string|size:24",
        brandId: "required|string|size:24",
        //price: "required|string",
        ingredient: "required|array",
        preparationTime: "required|string",
        //variantName: "required|string"
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

  const listItem = async (req: any, res: Response, next: NextFunction) => {
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



  const itemDetail = async (req: any, res: Response, next: NextFunction) => {

    try {
      const validationRule = {
        item_id: "required|string|min:24",
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


  // const deleteItem = async (req: any, res: Response, next: NextFunction) => {

  //   try {
  //     const validationRule = {
  //       is_delete: "required|boolean|in:true,false",
  //     };
  //     const msg = {};
  //     await validator(
  //       req.body,
  //       validationRule,
  //       msg,
  //       async (err: any, status: boolean) => {
  //         if (!status) {
  //           res.status(constants.code.preconditionFailed).json({
  //             status: constants.status.statusFalse,
  //             userStatus: req.status,
  //             message: await getMessage(err),
  //           });
  //         } else {
  //           next();
  //         }
  //       }
  //     );
  //   } catch (err) {
  //     res.status(constants.code.preconditionFailed).json({
  //       status: constants.status.statusFalse,
  //       userStatus: req.status,
  //       message: err,
  //     });
  //   }
  // }


const itemDelete =  async (req: any, res: Response, next: NextFunction) => {
  try {
    const validationRule = {
      item_id: "required|string|min:24",
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



  const addVariant =  async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        itemId: "required|string|size:24",
        price: "required|string",
        variantName: "required|string"
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


  const updateVariant = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        itemId: "required|string|size:24",
        price: "required|string",
        variantName: "required|string"
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


  const variantDetail = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        variant_id: "required|string|min:24",
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

  const deleteVariant =  async (req: any, res: Response, next: NextFunction) => {
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




  const listVariant = async (req: any, res: Response, next: NextFunction) => {
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


  export default {
    addItem,
    updateItem,
    listItem,
    itemDetail,
    //deleteItem,
    itemDelete,
    addVariant,
    updateVariant,
    variantDetail,
    deleteVariant,
    listVariant
  }