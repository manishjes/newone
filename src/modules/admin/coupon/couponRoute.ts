import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import checkAuth from "../../../middlewares/checkAuth";
import validation from "./couponValidation"
import controller from "./couponController"



router.post(
    `/add-coupon`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.addCoupon,
    controller.addCoupon
)


router.post(
    `/coupon-detail/:coupon_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.couponDetail,
    controller.couponDetail
)

router.put(
    `/update-coupon/:coupon_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.updateCoupon,
    controller.updateCoupon
)

router.post(
    `/list-coupon`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.listCoupon,
    controller.listCoupon
)


router.delete(
    `/delete-coupon/:coupon_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.deleteCoupon,
    controller.deleteCoupon
  )


  router.post(
    `/add-quiz`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    controller.addQuiz
)
export default router