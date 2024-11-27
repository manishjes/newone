import { Schema, model } from "mongoose";
import constants from "../utils/constants";

const reviewSchema = new Schema(
  {

    userId: { type: Schema.Types.ObjectId, ref: "User" },

    OutletReview: {
      outletId: { type: Schema.Types.ObjectId, ref: "Outlet" },
      review: {type:Number}
      },
      brandReview: {
        brandId: { type: Schema.Types.ObjectId, ref: "Brand" },
        review: {type:Number}
        },

        comment: {type:String},

    isDeleted: { type: Boolean, required: true, default: false },
    status: { type: Boolean, required: true, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);



const Review = model("review", reviewSchema);

export default Review;



