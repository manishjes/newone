import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import checkAuth from "../../../middlewares/checkAuth";
import {
  handleImagesUpload,
} from "../../../middlewares/multer";
import controller from "./menuController"





router.post(
    `/add-Menu`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    controller.createMenu
  );


  router.post(
    `/update-Menu`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    controller.updateMenu
  );


        

  router.post(
    `/list-Menu`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    controller.menuList
  );


  router.post(
    `/menuitem-detail/:item_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    controller.menuDetail
  );

  router.post(
    `/upload-menuimage`,
    accessRateLimiter,
    checkAccessKey,
    handleImagesUpload,
    checkAuth.Admin,
    controller.uploadMenu
  )

  router.post(
    `/update-menuimage`,
    accessRateLimiter,
    checkAccessKey,
    handleImagesUpload,
    checkAuth.Admin,
    controller.updateUploadMenu
  )


  router.post(
    `/update-menuimage`,
    accessRateLimiter,
    checkAccessKey,
    handleImagesUpload,
    checkAuth.Admin,
    controller.updateUploadMenu
  )


  router.post(
    `/detail-menuimage`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    controller.getMenuImages
  )


  export default router