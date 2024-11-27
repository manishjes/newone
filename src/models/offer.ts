import { Schema, model } from "mongoose";
import constants from "../utils/constants";
import { unixTime } from "../helpers/helper";


const offerSchema = new Schema ({

  brandId: { type: Schema.Types.ObjectId, ref: "Brand" },
  outletId: {type: Schema.Types.ObjectId, ref: "Outlet"},
    image: {
        type: String,
      },
      imageUrl: {
        type: String,
      },
     isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },

},  { timestamps: true }
)

const Offer = model("offer", offerSchema)

export default Offer