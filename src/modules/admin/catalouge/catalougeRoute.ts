import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import controller from "./catalougeController";
import validation from "./catalougeValidation"
import checkAuth from "../../../middlewares/checkAuth";
import {
    handleImageUpload,
  } from "../../../middlewares/multer";


router.post(
  `/add-Cuisne`,
  accessRateLimiter,
  handleImageUpload,
  checkAccessKey,
  checkAuth.Admin,
  validation.addCuisine,
  controller.addCuisine
);


router.put(
  `/update-Cuisne/:cuisine_id`,
  accessRateLimiter,
  handleImageUpload,
  checkAccessKey,
  checkAuth.Admin,
  validation.updateCuisine,
  controller.updateCuisine
);

router.post(
  `/cuisine-Detail/:cuisine_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.cuisineDetail,
  controller.cuisineDetail
)

router.post(
  `/list-cuisine`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.listCuisine,
  controller.cuisineList
)

router.delete(
  `/delete-cuisine/:cuisine_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.deleteCuisine,
  controller.deleteCuisine
)


router.post(
  `/add-Category`,
  accessRateLimiter,
  handleImageUpload,
  checkAccessKey,
  checkAuth.Admin,
  validation.addCategory,
  controller.addCategory
);


router.put(
  `/update-Category/:category_id`,
  accessRateLimiter,
  handleImageUpload,
  checkAccessKey,
  checkAuth.Admin,
  validation.updateCategory,
  controller.updateCategory
);

router.post(
  `/list-Category`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.listCategory,
  controller.listCategory
);



router.post(
  `/category-detail/:category_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.categoryDetail,
  controller.categoryDetail
);

router.delete(
  `/delete-category/:category_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.deleteCategory,
  controller.deleteCategory
);


router.post(
  `/add-Foodtype`,
  accessRateLimiter,
  handleImageUpload,
  checkAccessKey,
  checkAuth.Admin,
  validation.addFoodType,
  controller.addFoodTYpe
);


router.put(
  `/update-Foodtype/:foodtype_id`,
  accessRateLimiter,
  handleImageUpload,
  checkAccessKey,
  checkAuth.Admin,
  validation.updateFoodType,
  controller.updateFoodTYpe
);



router.post(
  `/list-foodtype`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.listFoodType,
  controller.listFoodType
)


router.post(
  `/foodType-Detail/:foodtype_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.foodtypeDetail,
  controller.foodTYpeDetail
)


router.delete(
  `/delete-foodtype/:foodtype_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.deleteFoodtype,
  controller.deleteFoodTYpe
);

router.post(
  `/add-Ingredient`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.addIngredient,
  controller.addIngredient
);


router.put(
  `/update-Ingredient/:ingredient_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.updateIngredient,
  controller.updateIngredient
);            

router.post(
  `/list-Ingredient`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.listIngredient,
  controller.listIngredient
);         



router.post(
  `/get-Ingredient/:ingredient_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.ingredientDetail,
  controller.ingredientDetail
);  


router.delete(
  `/delete-Ingredient/:ingredient_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.deleteIngredient,
  controller.deleteIngredient
);  



export default  router