import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import validation from "./dashboardValidation"
import controller from "./dashboardController";
import checkAuth from "../../../middlewares/checkAuth";




router.post(
    `/data`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    controller.dashboardApi
  );

router.post(
  `/list-review`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.listReview,
  controller.listReview
);

router.post(
    `/list-bookings`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    controller.recentBookings
  );



export default router