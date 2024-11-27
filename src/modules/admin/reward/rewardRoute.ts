import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import validation from "./rewardValidation";
import controller from "./rewardController"
import checkAuth from "../../../middlewares/checkAuth";

router.put(
    `/update-pointValue`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.pointValue,
    controller.pointValue
)

router.post(
    `/detail-pointvalue`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    controller.pointValueDeatil
)


router.put(
    `/update-distributepoint`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.distributepoints,
    controller.distributepoints
)

router.post(
    `/detail-distributepoint`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    controller.distributePointValue
)


router.post(
    `/point-list`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.listPOintsDetail,
    controller.listPOintsDetail
)

router.post(
    `/point-detail/:reward_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.PointDetail,
    controller.PointDetail
)


export default router