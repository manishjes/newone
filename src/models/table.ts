import { Schema, model } from "mongoose";
import constants from "../utils/constants";
import { unixTime } from "../helpers/helper";

const tableSchema = new Schema(
  {

    bookingTime: {type:Date, required:true},
    guestNum: {type:Number, required:true},
    tableBookingNum:  { type: String, required: true },
    userId:{type:Schema.Types.ObjectId,required:true,ref:'User'},
    outletId: { type: Schema.Types.ObjectId, ref: "Outlet" },
    is_approved: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted: { type: Boolean, required: true, default: false },
    status: { type: Boolean, required: true, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);



const Table = model("table", tableSchema);

export default Table;