import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import validation from "./tableValidation"
import controller from "./tableController"
import checkAuth from "../../../middlewares/checkAuth";




router.post(
    `/book-table`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.User,
    validation.tableBooking,
    controller.bookTable
)


router.post(
  `/booking-list`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  controller.bookingListStatus
)


router.post(
  `/modify-booking/:table_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.modifyBooking,
  controller.modifyBooking
)

router.post(
  `/cancel-booking/:table_id`,
  accessRateLimiter,
  checkAccessKey,
  checkAuth.User,
  validation.cancelBooking,
  controller.cancelBooking
)




  export default router