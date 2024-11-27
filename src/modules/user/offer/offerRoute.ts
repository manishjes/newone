import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import validation from "./offerValidation";
import controller from "./offerController";
import checkAuth from "../../../middlewares/checkAuth";




  router.post(
    `/list-offer`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.User,
    validation.listOffer,
    controller.listoffer
  );


  router.post(
    `/list-outletoffer`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.User,
    validation.listOutletOffer,
    controller.listOutletoffer
  );

export default router