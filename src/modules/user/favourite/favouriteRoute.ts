import { Router } from "express";
const router = Router({ caseSensitive: true, strict: false });
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import checkAuth from "../../../middlewares/checkAuth";
import validation from "./favouriteValidation";
import controller from "./favouriteController";

router.post(
  `/add-outlet`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.addFavourites,
  controller.addFavourites
);

router.post(
    `/list-favourite`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.User,
    validation.favouriteList,
    controller.favouriteList
  );

  router.delete(
    `/delete-favourite/:outlet_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.User,
    validation.deleteFavourite,
    controller.deleteFavourite
  );


export default router