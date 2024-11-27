import { Schema, model } from "mongoose";
import constants from "../utils/constants";
import { unixTime } from "../helpers/helper";

const menuSchema = new Schema(
  {


    item: {
    variantId: { type: Schema.Types.ObjectId, ref: "Variant" },
    price: {type:String, required: true}
    },
    
    outletId: {type: Schema.Types.ObjectId, ref: "Outlet"},
    itemId: {type: Schema.Types.ObjectId, ref: "Item"},
    categoryId: {type: Schema.Types.ObjectId, ref: "Category"},

    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);


const Menu = model("menu", menuSchema);

export default Menu;
