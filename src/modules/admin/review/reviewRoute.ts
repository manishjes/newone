import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import validation from "./reviewValidation";
import controller from "./reviewController"
import checkAuth from "../../../middlewares/checkAuth";


router.post(
    `/list-outletReview`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.reviewList,
    controller.outletReviews
  );

  router.post(
    `/review`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    controller.reviews
  );



export default router
