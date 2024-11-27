import { Schema, model } from "mongoose";
import { unixTime } from "../helpers/helper";
import constants from "../utils/constants";

const couponSchema = new Schema(
  {

    name: {
      type: String,
      required: true,
    },
    slug: { type: String, required: true },

    description:{
        type:String, 
        required:true
    },

    code: { type: String, required: true,},

    discountType: {type: String,
         required:true,
           enum:[
            constants.discountType.flat,
            constants.discountType.upto
           ]
        },

        unit : {type:String,
            required:true,
            enum:[
                constants.unit.percentage,
                constants.unit.value
            ]
        },

        value: {type:Number},

        base: {
          brandId: { type: Schema.Types.ObjectId, ref: "Brand" },
          outletId: {type:Array},
          minimumAmount: {type: Number}

        },

        included: {type:Array},

        excluded: {type:Array},
        

        startDate: {type:Date},
        endDate: {type:Date},

    pointtoredem: {type:Number},

    usesPerCoupon: {type:Number},

    couponUsed: {type:Number},

    usesPerUser: {type:Number},

    termsCondition: {type:String},

    status: { type: Boolean, required: true, default: true },

    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);




const Coupon = model("coupon", couponSchema);

export default Coupon;