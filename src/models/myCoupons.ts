import { Schema, model } from "mongoose";
import { unixTime } from "../helpers/helper";
import constants from "../utils/constants";

const mycouponSchema = new Schema(
  {

   userId: { type: Schema.Types.ObjectId, ref: "User" },

   couponId: { type: Schema.Types.ObjectId, ref: "Coupon" },

   isUsed: { type: Boolean, required: true, default: false },

  
    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);




const MyCoupon = model("mycoupon", mycouponSchema);

export default MyCoupon;