import { Router } from "express";
const router = Router({ caseSensitive: true, strict: false });
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import checkAuth from "../../../middlewares/checkAuth";
import validation from "./cmsValidation";
import controller from "./cmsController";

router.post(
  `/add-page`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.create,
  controller.create
);

router.post(
  `/page-list`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.pageList,
  controller.pageList
);

router.post(
  `/page-detail/:slug`,
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
  `/delete-page/:slug`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.Admin,
  validation.deletePage,
  controller.deletePage
);

export default router;
