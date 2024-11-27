import { Router } from "express";
const router = Router({ caseSensitive: true, strict: false });
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import checkAuth from "../../../middlewares/checkAuth";
import validation from "./smsValidation";
import controller from "./smsController";

router.post(
  `/add-sms`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.create,
  controller.create
);

router.post(
  `/sms-list`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.smsList,
  controller.smsList
);

router.post(
  `/sms-detail/:slug`,
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
  `/delete-sms/:slug`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.deleteSMS,
  controller.deleteSMS
);

export default router;
