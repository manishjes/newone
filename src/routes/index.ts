import constants from "../utils/constants";
import adminRoute from "../modules/admin/adminRoute";
import adminUserRoute from "../modules/admin/user/userRoute";
import adminEmailRoute from "../modules/admin/email/emailRoute";
import adminSMSRoute from "../modules/admin/sms/smsRoute";
import adminCMSRoute from "../modules/admin/cms/cmsRoute";
import userRoute from "../modules/user/userRoute"
import userAddressRoute from "../modules/user/address/addressRoute"
import adminOutletRoute from "../modules/admin/outlet/outletRoute"
import adminCategoryRoute from "../modules/admin/category/categoryRoute"
import adminItemRoute from "../modules/admin/item/itemRoute"
import adminbrandRoute from "../modules/admin/brand/brandRoute"
import admincatalougeRoute from "../modules/admin/catalouge/catalougeRoute"
import adminmenuRoute from "../modules/admin/menu/menuRoute"
import adminReviewRoute from "../modules/admin/review/reviewRoute"
import adminDashboardRoute from "../modules/admin/dashboard/dashboardRoute"
import useroutletRoute from "../modules/user/outlet/outletRoute"
import usertableRoute from "../modules/user/table/tableRoute"
import userfavouriteRoute from "../modules/user/favourite/favouriteRoute"
import userOfferRoute from "../modules/user/offer/offerRoute"
import userSpinRoute from "../modules/user/Spin/spinRoute"
import userCouponRoute from "../modules/user/coupon/couponRoute"
import adminbookingRoute from "../modules/admin/booking/bookingRoute"
import adminofferRoute from "../modules/admin/offer/offerRoute"
import adminSpinRoute from "../modules/admin/spin/spinRoute"
import adminRewardRoute from "../modules/admin/reward/rewardRoute"
// import adminFeedbackRoute from "../modules/admin/feedback/feedbackRoute";


import adminSettingRoute from "../modules/admin/setting/settingRoute";

import adminCouponRoute from "../modules/admin/coupon/couponRoute"


import commonRoute from "../modules/common/commonRoute"

export default (app: any) => {
  //Public
//   app.use(`/api/public`, publicRoute);
  //Admin
  app.use(`/api/admin`, adminRoute);
  app.use(`/api/admin/user`, adminUserRoute);
  app.use(`/api/admin/email`, adminEmailRoute);
  app.use(`/api/admin/sms`, adminSMSRoute);
  app.use(`/api/admin/cms`, adminCMSRoute);
  app.use(`/api/admin/catalouge`, admincatalougeRoute)
  app.use(`/api/admin/category`,adminCategoryRoute)
  app.use(`/api/admin/item`, adminItemRoute)
  app.use(`/api/admin/brand`, adminbrandRoute)
  app.use(`/api/admin/booking`, adminbookingRoute)
//   app.use(`/api/admin/feedback`, adminFeedbackRoute);

//   app.use(`/api/admin/catalouge`, adminCatalougeRoute);
  app.use(`/api/admin/setting`, adminSettingRoute);
  app.use(`/api/admin/outlet`, adminOutletRoute)
  app.use(`/api/admin/menu`, adminmenuRoute)

  app.use(`/api/admin/review`, adminReviewRoute)

  app.use(`/api/admin/dashboard`, adminDashboardRoute)

  app.use(`/api/admin/offer`, adminofferRoute)

  app.use(`/api/admin/spin`, adminSpinRoute)

  app.use(`/api/admin/reward`, adminRewardRoute)

  app.use(`/api/admin/coupon`, adminCouponRoute)

  //User
   app.use(`/api/user`, userRoute);
   app.use(`/api/user/outlet`, useroutletRoute)
   app.use(`/api/user/table`, usertableRoute)
   app.use(`/api/user/favourite`, userfavouriteRoute)
   app.use(`/api/user/offer`, userOfferRoute)
   app.use(`/api/user/spin`, userSpinRoute) 
   app.use(`/api/user/coupon`, userCouponRoute)
   // common

   app.use(`/api/common`, commonRoute)

//   app.use(`/api/user/home`, userHomeRoute);
//   app.use(`/api/user/address`, userAddressRoute);
//   app.use(`/api/user/wishlist`, userWishlistRoute);
//   app.use(`/api/user/vehicle`, userVehicleRoute);

  app.use(`*`, (req: any, res: any) => {
    res.status(constants.code.badRequest).json({
      status: constants.status.statusFalse,
      userStatus: constants.status.statusFalse,
      message: constants.message.badRequest,
    });
  });
};
