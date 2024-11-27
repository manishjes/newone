import { Schema, model } from "mongoose";
import constants from "../utils/constants";

const rewardPointSchema = new Schema(
  {

    userId: { type: Schema.Types.ObjectId, ref: "User" },
    activity: {type:String},
    points: {type:Number},
    pointStatus: {type:String},
    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);



const RewardPOint = model("rewardpoint", rewardPointSchema);

export default RewardPOint;