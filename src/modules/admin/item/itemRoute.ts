import express from "express";
const router = express.Router();
import accessRateLimiter from "../../../middlewares/accessRateLimiter";
import checkAccessKey from "../../../middlewares/checkAccessKey";
import checkAuth from "../../../middlewares/checkAuth";
import validation from "./itemValidation"
import controller from "./itemController"
import {
    handleImagesUpload,handleImageUpload
  } from "../../../middlewares/multer";


  router.post(
    `/add-Item`,
    accessRateLimiter,
    handleImageUpload,
    checkAccessKey,
    checkAuth.Admin,
    validation.addItem,
    controller.addItem
  );

  router.put(
    `/update-Item/:item_id`,
    accessRateLimiter,
    handleImageUpload,
    checkAccessKey,
    checkAuth.Admin,
    validation.updateItem,
    controller.updateItem
  )


  router.post(
    `/list-Item`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.listItem,
    controller.listItem
  )


  // router.delete(
  //   `/delete-Item/:item_id`,
  //   accessRateLimiter,
  //   checkAccessKey,
  //   checkAuth.Admin,
  //   validation.deleteItem,
  //   controller.deleteItem
  // )

  router.delete(
    `/item-delete/:item_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.itemDelete,
    controller.itemDelete
  )

  router.post(
    `/list-Variants/:item_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    controller.listVariants
  )


  // router.post(
  //   `/Item`,
  //   accessRateLimiter,
  //   checkAccessKey,
  //   checkAuth.Admin,
  //   handleImageUpload,
  //   //validation.addItem,
  //   controller.item
  // );

  router.post(
    `/add-variant`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.addVariant,
    controller.addVariant
  );


  router.put(
    `/update-variant/:variant_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.updateVariant,
    controller.updateVariant
  );


  router.post(
    `/variant-detail/:variant_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.variantDetail,
    controller.variantDetail
  );


  router.delete(
    `/delete-variant/:variant_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.deleteVariant,
    controller.deleteVariant
  );







  // router.put(
  //   `/update-Items/:item_id`,
  //   accessRateLimiter,
  //   handleImageUpload,
  //   checkAccessKey,
  //   checkAuth.Admin,
  //   //validation.addItem,
  //   controller.updateitem
  // );



  // router.post(
  //   `/item-details/:item_id`,
  //   // accessRateLimiter,
  //   // checkAccessKey,
  //   // checkAuth.Admin,
  //   //validation.addItem,
  //   controller.getItems
  // );


  router.post(
    `/item-detail/:item_id`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.itemDetail,
    controller.itemDetail
  );



  router.post(
    `/variant-List`,
    accessRateLimiter,
    checkAccessKey,
    checkAuth.Admin,
    validation.listVariant,
    controller.variantList
  )




export default router
