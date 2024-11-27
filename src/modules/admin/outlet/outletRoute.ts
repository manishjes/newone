import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import validation from "./outletValidation";
import controller from "./outletController";
import checkAuth from "../../../middlewares/checkAuth";
import {
    handleImagesUpload,
  } from "../../../middlewares/multer";


router.post(
  `/add-outlet`,
  accessRateLimiter,
  handleImagesUpload,
  checkAccessKey,
  checkAuth.Admin,
  validation.addOutlet,
  controller.addOutlet
);

router.put(
  `/update-outlet/:outlet_id`,
  accessRateLimiter,
  handleImagesUpload,
  checkAccessKey,
  checkAuth.Admin,
  validation.updateOutlet,
  controller.outletUpdate
);

router.post(
  `/list-Outlet`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.listOutlet,
  controller.listOutlet
);

router.post(
  `/outlet-detail/:outlet_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.outletDetail,
  controller.outletDetail
);

router.delete(
  `/delete-Outlet/:outlet_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.deleteOutlet,
  controller.deleteOutlet
);


export default router