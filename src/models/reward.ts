import { Schema, model } from "mongoose";
import { unixTime } from "../helpers/helper";


const rewardSchema = new Schema ({

    point: {type:Number},
    value: {type:Number},
    minimumAmount: {type:Number},
    maximumAmount: {type:Number},
    maximumPoints: {type:Number},
     isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },

},  { timestamps: true }
)

const Reward = model("reward", rewardSchema)

export default Reward