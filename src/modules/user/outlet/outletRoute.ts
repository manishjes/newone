import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import validation from "./outletValidation"
import controller from "./outletController"
import checkAuth from "../../../middlewares/checkAuth";




router.post(
    `/list-brand`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.User,
    validation.listBrand,
    controller.listBrand
)

// router.post(
//     `/list-Outlet`,
//     accessRateLimiter,
//     checkAccessKey,
//     checkAuth.User,
//     controller.listOutlet
//   );


  router.post(
    `/list-item`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.User,
    controller.listItem
)


router.post(
    `/list-nearbyOutlet`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.User,
    validation.listNearByOutlet,
    controller.listnearOutlet
)



router.post(
  `/list-categoryItem`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  controller.listCategoryItem
)


router.post(
  `/Outlet-Detail`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.outletDetail,
  controller.outletDetail
)

router.post(
  `/add-Review`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.userReview,
  controller.userReview
)


router.post(
  `/list-highlyrecommended`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.recommendedOutlet,
  controller.recommendedOutlet
)

router.post(
  `/explore-outlet`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.exploreOutlet,
  controller.exploreOutlet
)

router.post(
  `/list-uploadedmenu`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  controller.listUploadedMenu
)



  export default router