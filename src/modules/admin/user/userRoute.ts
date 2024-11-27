import { Router } from "express";
const router = Router({ caseSensitive: true, strict: false });
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import checkAuth from "../../../middlewares/checkAuth";
import { handleProfileUpload } from "../../../middlewares/multer";
import validation from "./userValidation";
import controller from "./userController";

router.post(
  `/add-user`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.create,
  controller.create
);

router.post(
  `/user-list`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.usersList,
  controller.usersList
);


router.post(
  `/customer-list`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  controller.customerList
);

router.post(
  `/user-detail/:user_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.detail,
  controller.detail
);


router.post(
  `/customer-detail/:user_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.customerDetail,
  controller.customerDetail
);



router.put(
  `/change-profilePicture/:user_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  handleProfileUpload,
  validation.changeProfilePicture,
  controller.changeProfilePicture
);

router.put(
  `/update-detail/:user_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.update,
  controller.update
);

router.put(
  `/reset-password/:user_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.resetPassword,
  controller.resetPassword
);

router.put(
  `/manage-account/:user_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.manageAccount,
  controller.manageAccount
);

router.delete(
  `/delete-account/:user_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.deleteAccount,
  controller.deleteAccount
);


router.post(
  `/booking-list/:user_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.userBookingList,
  controller.userBookingList
);

router.post(
  `/point-history/:user_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.userPointHistory,
  controller.userPointHistory
);





export default router;
