import { Schema, model } from "mongoose";
import constants from "../utils/constants";
import { unixTime } from "../helpers/helper";

const menuImageSchema = new Schema(
  {


    outletId: {type: Schema.Types.ObjectId, ref: "Outlet"},
    images: {
        type: Array,
      },
      imagesUrl: {
        type: Array,
      },
    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);


const MenuImage = model("menuimage", menuImageSchema);

export default MenuImage