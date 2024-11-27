import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import validation from "./brandValidation"
import controller from "./brandController";
import checkAuth from "../../../middlewares/checkAuth";
import {
    handleImageUpload,
  } from "../../../middlewares/multer";



  router.post(
    `/add-brand`,
    accessRateLimiter,
    handleImageUpload,
    checkAccessKey,
    checkAuth.Admin,
    validation.addBrand,
    controller.addBrand
  );
  

  router.put(
    `/update-brand/:brand_id`,
    accessRateLimiter,
    handleImageUpload,
    checkAccessKey,
    checkAuth.Admin,
    validation.updateBrand,
    controller.updateBrand
  );

  router.post(
    `/list-brand`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.listBrand,
    controller.listBrand
  )

  router.post(
    `/brand-detail/:brand_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.brandDetail,
    controller.brandDetail
  )

  router.delete(
    `/delete-brand/:brand_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.deleteBrand,
    controller.deleteBrand
  )

  export default router