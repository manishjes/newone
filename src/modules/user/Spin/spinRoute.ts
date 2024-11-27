import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import checkAuth from "../../../middlewares/checkAuth";
import validation from "./spinValidation";
import controller from "./spinController"





router.post(
    `/spin-data`,
    accessRateLimiter,
    checkAccessKey,
   checkAuth.User,
    controller.spin
  );

  router.post(
    `/spin-status`,
    accessRateLimiter,
    checkAccessKey,
   checkAuth.User,
    controller.spinStatus
  );

  router.post(
    `/add-point`,
    accessRateLimiter,
    checkAccessKey,
   checkAuth.User,
   validation.addPoint,
    controller.addPoint
  );

  router.post(
    `/get-points`,
    accessRateLimiter,
    checkAccessKey,
   checkAuth.User,
    controller.getPOints
  );
  

  router.post(
    `/redem-point`,
    accessRateLimiter,
    checkAccessKey,
   checkAuth.User,
   validation.billPOints,
    controller.billPOints
  );

  router.post(
    `/earn-point`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.User,
    validation.earnPoint,
    controller.earnPoint
  )

  export default router