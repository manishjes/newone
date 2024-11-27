import { Schema, model } from "mongoose";
import { unixTime } from "../helpers/helper";


const earnPointSchema = new Schema ({

    minimumAmount: {type:Number},
    maximumAmount: {type:Number},
    maximumPoints: {type:Number},
     isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },

},  { timestamps: true }
)

const EarnPoint = model("earnpoint", earnPointSchema)

export default EarnPoint