import { Schema, model } from "mongoose";
import constants from "../utils/constants";

const spinSchema = new Schema(
  {

    userId: { type: Schema.Types.ObjectId, ref: "User" },

    spinValue: [
      {
        value: {type:Number},
        probability: {type:Number},
        color: {type:String}
      }
     ],
     
    isDeleted: { type: Boolean, required: true, default: false },
    status: { type: Boolean, required: true, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);



const Spin = model("spin", spinSchema);

export default Spin;