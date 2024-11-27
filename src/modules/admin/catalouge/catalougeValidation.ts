import { Request, Response, NextFunction } from "express";
import validator from "../../../helpers/validator";
import constants from "../../../utils/constants";
import { getMessage, validateRequestData } from "../../../helpers/helper";



const addCuisine = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        cuisineName: "required|string|min:3",
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


  const updateCuisine = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        cuisineName: "required|string|min:3",
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

  const cuisineDetail = async (req:any, res:Response, next:NextFunction)=>{
    try {
      const validationRule = {
        cuisine_id: "required|string|min:24",
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

  const listCuisine =  async (req:any, res:Response, next:NextFunction)=>{
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

  const deleteCuisine = async (req:any, res:Response, next:NextFunction)=>{
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


  const addCategory = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        categoryName: "required|string|min:3",
        cuisineId: "required|string|size:24"
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
        categoryName: "required|string|min:3",
        cuisineId: "required|string|size:24"
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
        filter: "string",
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
        category_id: "required|string|min:24",
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



  const addFoodType = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        foodtypeName: "required|string|min:3",
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


  const updateFoodType = async (req: any, res: Response, next: NextFunction) => {
    try {
      const validationRule = {
        foodtypeName: "required|string|min:3",
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



  const listFoodType = async(req:any, res:Response, next:NextFunction)=>{
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


  const foodtypeDetail = async(req:any, res:Response, next:NextFunction)=>{
    try {
      const validationRule = {
        foodtype_id: "required|string|min:24",
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


const deleteFoodtype =  async(req:any, res:Response, next:NextFunction)=>{
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


const addIngredient = async(req:any, res:Response, next:NextFunction)=>{
  try {
    const validationRule = {
      ingredientName: "required|string|min:3",
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


const updateIngredient = async(req:any, res:Response, next:NextFunction)=>{
  try {
    const validationRule = {
      ingredientName: "required|string|min:3",
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


const listIngredient = async(req:any, res:Response, next:NextFunction)=>{
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


const ingredientDetail = async(req:any, res:Response, next:NextFunction)=>{
  try {
    const validationRule = {
      ingredient_id: "required|string|min:24",
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



const deleteIngredient = async(req:any, res:Response, next:NextFunction)=>{
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
    addCuisine,
    updateCuisine,
    cuisineDetail,
    listCuisine,
    deleteCuisine,
    addCategory,
    updateCategory,
    listCategory,
    categoryDetail,
    deleteCategory,
    addFoodType,
    updateFoodType,
    listFoodType,
    foodtypeDetail,
    deleteFoodtype,
    addIngredient,
    updateIngredient,
    listIngredient,
    ingredientDetail,
    deleteIngredient
  }