import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import validation from "./bookingValidation"
import controller from "./bookingController"
import checkAuth from "../../../middlewares/checkAuth";


// router.post(
//     `/list-request`,
//     // accessRateLimiter,
//     // checkAccessKey,
//     // checkAuth.Admin,
//     controller.tableBookingRequest
// )

router.post(
    `/list-bookingrequest`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.bookingRequest,
    controller.RequestList
)


router.post(
    `/accept-request/:request_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.acceptBooking,
    controller.acceptRequest
)


router.post(
    `/reject-request/:request_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.rejectBooking,
    controller.rejectRequest
)

router.post(
    `/request-detail/:request_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.requestDetail,
    controller.requestDetail
)



export default router