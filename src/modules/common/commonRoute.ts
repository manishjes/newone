import express from "express";
const router = express.Router();
import accessRateLimiter from "../../middlewares/accessRateLimiter";
import checkAccessKey from "../../middlewares/checkAccessKey";
import validation from "./commonValidation";
import controller from "./commonController";


router.post(
  `/getAccessKey`,
  accessRateLimiter,
  validation.getAccessKey,
  controller.getAccessKey
);

router.post(
    `/list-cuisine`,
    accessRateLimiter,
    checkAccessKey,
    controller.cuisineList
  );

  router.post(
    `/list-category`,
    accessRateLimiter,
    checkAccessKey,
    controller.listCategory
  );


  router.post(
    `/list-foodtype`,
    accessRateLimiter,
    checkAccessKey,
    controller.listFoodType
  );

  router.post(
    `/list-ingredient`,
    accessRateLimiter,
    checkAccessKey,
    controller.listIngredient
  );


  router.post(
    `/list-items`,
    accessRateLimiter,
    checkAccessKey,
    controller.listItem
  )


  router.post(
    `/list-item`,
    accessRateLimiter,
    checkAccessKey,
    controller.listItemByCategory
  )



  router.post(
    `/list-brand`,
    accessRateLimiter,
    checkAccessKey,
    controller.listBrand
  );



  router.post(
    `/list-BrandOutlet`,
    accessRateLimiter,
    checkAccessKey,
    controller.listOutletByBrand
  );
  
  router.post(
    `/list-outlet`,
    accessRateLimiter,
    checkAccessKey,
    controller.listOutlet
  );


  router.post(
    `/list-manager`,
    accessRateLimiter,
    checkAccessKey,
    controller.managerList
  );

  router.post(
    `/list-customer`,
    accessRateLimiter,
    checkAccessKey,
    controller.customerList
  );

  router.post(
    `/list-branditem`,
    accessRateLimiter,
    checkAccessKey,
    validation.listItemByBrand,
    controller.listItemByBrand
  )



export default router;
