import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import controller from "./categoryController";
import validation from "./categoryValidation"
import checkAuth from "../../../middlewares/checkAuth";
import {
    handleImagesUpload,
  } from "../../../middlewares/multer";


router.post(
  `/add-Category`,
  accessRateLimiter,
  handleImagesUpload,
  checkAccessKey,
  checkAuth.Admin,
  validation.addCategory,
  controller.addCategory
);


router.post(
    `/list-Category`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.listCategory,
    controller.listCategory
  );

  // router.put(
  //   `/update-Category/:categoryId`,
  //   accessRateLimiter,
  //   handleImagesUpload,
  //   checkAccessKey,
  //   checkAuth.Admin,
  //   validation.updateCategory,
  //   controller.updateCategory
  // );


  router.post(
    `/category-detail/:categoryId`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.categoryDetail,
    controller.categoryDetail
  );

  router.delete(
    `/delete-category/:categoryId`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.deleteCategory,
    controller.deleteCategory
  );


export default router