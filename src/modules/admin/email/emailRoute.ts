import { Router } from "express";
const router = Router({ caseSensitive: true, strict: false });
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import checkAuth from "../../../middlewares/checkAuth";
import validation from "./emailValidation";
import controller from "./emailController";

router.post(
  `/add-email`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.create,
  controller.create
);

router.post(
  `/email-list`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.emailList,
  controller.emailList
);

router.post(
  `/email-detail/:slug`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.detail,
  controller.detail
);

router.put(
  `/update-detail/:slug`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.update,
  controller.update
);

router.delete(
  `/delete-email/:slug`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.deleteEmail,
  controller.deleteEmail
);

export default router;
