import { Schema, model } from "mongoose";
import constants from "../utils/constants";

const addressSchema = new Schema(
  {

    OutletId: { type: Schema.Types.ObjectId, ref: "Outlet" },
    // type: {
    //   type: String,
    //   required: true,
    //   enum: [
    //     constants.addressTypes.home,
    //     constants.addressTypes.work,
    //     constants.addressTypes.other,
    //   ],
    //   default: constants.addressTypes.home,
    // },
    // name: { type: String, required: true },
    // email: { type: String, required: true },
    // phone: { type: String, required: true },
    // alternate_phone: { type: String },
    address: {
      line_one: { type: String, required: true },
      line_two: { type: String },
      city: { type: Schema.Types.ObjectId, ref: "City", required: true },
      state: { type: Schema.Types.ObjectId, ref: "State", required: true },
      country: {
        type: Schema.Types.ObjectId,
        ref: "Country",
        required: true,
      },
      pin_code: { type: String, required: true },
    },
    landmark: { type: String },
    latitude: { type: Schema.Types.Decimal128 },
    longitude: { type: Schema.Types.Decimal128 },
    status: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Address = model("address", addressSchema);

export default Address;
