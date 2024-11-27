import { Schema, model } from "mongoose";
import constants from "../utils/constants";


const outletSchema = new Schema(
    {
      outletId: {
        type: Schema.Types.ObjectId,
        ref: "Outlet",
        required: true,
      },
    },
    
  );

const quizSchema = new Schema ({

  outlets: [outletSchema],

  name: {
    required: true,
    type: String,
  },
  
     isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },

},  { timestamps: true }
)

const Quiz = model("quiz", quizSchema)

export default Quiz