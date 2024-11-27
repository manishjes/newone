import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import controller from "./spinController";
import checkAuth from "../../../middlewares/checkAuth";


// router.post(
//     `/add-spinvalue`,
//     accessRateLimiter,
//     checkAccessKey,
//     checkAuth.Admin,
//     controller.addSpinValue
//   );

  router.put(
    `/update-spinvalue`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    controller.updateSpinValue
  );

  router.post(
    `/spin-data`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    controller.spin
  );



  export default router