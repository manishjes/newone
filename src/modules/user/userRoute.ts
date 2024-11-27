import { Router } from "express";
const router = Router({ caseSensitive: true, strict: true });
import accessRateLimiter from "../../middlewares/accessRateLimiter";
import checkAccessKey from "../../middlewares/checkAccessKey";
import checkAuth from "../../middlewares/checkAuth";
import validation from "./userValidation";
import controller from "./userController";
import { handleProfileUpload } from "../../middlewares/multer";

router.post(
  `/register`,
  accessRateLimiter,
  checkAccessKey,
  validation.register,
  controller.register
);

router.post(
  `/send-otp`,
  accessRateLimiter,
  checkAccessKey,
  validation.sendOTPMessage,
  controller.sendOTPMessage
)

router.post(
  `/verify-otp`,
  accessRateLimiter,
  checkAccessKey,
  validation.verifyOTP,
  controller.verifyOTP
);



router.post(
  `/login`,
  accessRateLimiter,
  checkAccessKey,
  validation.login,
  controller.login
);

router.post(
  `/user-login`,
  accessRateLimiter,
  checkAccessKey,
  validation.userLogin,
  controller.userlogin
);

router.post(
  `/user-verify`,
  accessRateLimiter,
  checkAccessKey,
  validation.userVerify,
  controller.userVerify
);

router.post(
  `/google-login`,
  accessRateLimiter,
  checkAccessKey,
  validation.googleLogin,
  controller.googleLogin
);

router.post(
  `/get-detail`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  controller.getDetail
);

router.put(
  `/change-profilePicture`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  handleProfileUpload,
  validation.changeProfilePicture,
  controller.changeProfilePicture
);

router.put(
  `/update-detail`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.updateDetail,
  controller.updateDetail
);

router.post(
  `/verify-email`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.verifyDetail,
  controller.verifyEmail
);

router.post(
  `/verify-phone`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.verifyDetail,
  controller.verifyPhone
);

router.put(
  `/update-email`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.updateEmail,
  controller.updateEmail
);

router.put(
  `/update-phone`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.updatePhone,
  controller.updatePhone
);

router.put(
  `/change-password`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.changePassword,
  controller.changePassword
);

router.put(
  `/manage/push/notification`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.manageNotification,
  controller.managePushNotification
);

router.put(
  `/manage/email/notification`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.manageNotification,
  controller.manageEmailNotification
);

router.put(
  `/manage/message/notification`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.manageNotification,
  controller.manageMessageNotification
);

router.post(
  `/deactivate-account`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.deactivateAccount,
  controller.deactivateAccount
);

router.delete(
  `/delete-account`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.deleteAccount,
  controller.deleteAccount
);

router.post(
  `/logout`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  controller.logout
);

router.post(
  `/logout-all`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  controller.logoutFromAll
);

router.post(
  `/forgot-password`,
  accessRateLimiter,
  checkAccessKey,
  validation.forgotPassword,
  controller.forgotPassword
);

router.put(
  `/reset-password`,
  accessRateLimiter,
  checkAccessKey,
  validation.resetPassword,
  controller.resetPassword
);


router.post(
  `/send-notification`,
  accessRateLimiter,
  //checkAccessKey,
 // checkAuth.User,
  controller.sendNotificationss
);


export default router;
