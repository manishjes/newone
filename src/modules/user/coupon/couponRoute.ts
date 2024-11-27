import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import validation from "./couponValidation"
import controller from "./couponController"
import checkAuth from "../../../middlewares/checkAuth";



router.post(
    `/list-Coupon`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.User,
    validation.couponList,
    controller.couponList
  );

  router.post(
    `/purchase-Coupon`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.User,
    validation.purchaseCoupon,
    controller.purchaseCoupon
  );


  router.post(
    `/list-PurchaseCoupon`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.User,
    validation.listPurchaseCoupon,
    controller.listPurchaseCoupon
  );

  router.post(
    `/list-AvailableCoupon`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.User,
    validation.listavailableCoupon,
    controller.listavailableCoupon
  );

  router.post(
    `/discount-amount`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.User,
    validation.couponDiscount,
    controller.couponDiscount
  )

  router.post(
    `/list-billcoupon`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.User,
    validation.listCouponForPurchase,
    controller.listCouponForPurchase
  )


  // router.post(
  //   `/list-outletCoupon`,
  //   accessRateLimiter,
  //   checkAccessKey,
  //   checkAuth.User,
  //   controller.outletCouponList
  // );

  export default router