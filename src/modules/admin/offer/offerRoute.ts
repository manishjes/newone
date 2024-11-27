import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import validation from "./offerValidation"
import controller from "./offerController";
import checkAuth from "../../../middlewares/checkAuth";
import {
    handleImageUpload,
  } from "../../../middlewares/multer";



  router.post(
    `/add-offer`,
    accessRateLimiter,
    handleImageUpload,
    checkAccessKey,
    checkAuth.Admin,
    validation.addOffer,
    controller.addOffer
  );

  router.put(
    `/update-offer/:offer_id`,
    accessRateLimiter,
    handleImageUpload,
    checkAccessKey,
    checkAuth.Admin,
    validation.updateOffer,
    controller.updateOffer
  );


  router.post(
    `/list-offer`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.listOffer,
    controller.listoffer
  )


  router.post(
    `/offer-detail/:offer_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.offerDetail,
    controller.offerDetail
  )

  router.delete(
    `/delete-offer/:offer_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.deleteOffer,
    controller.deleteOffer
  );




  export default router
