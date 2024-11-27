import { Schema, model } from "mongoose";
import constants from "../utils/constants";
import { unixTime } from "../helpers/helper";

const categorySchema = new Schema(
  {


    name: {
      type: String,
      required: true,
    },
    slug: { type: String, required: true },

    image: {
      type: String,
    },
    imageUrl: {
      type: String,
    },

      cuisineId: { type: Schema.Types.ObjectId, ref: "Cuisine" },


   
    // type: {
    //   type: String,
    //   required: true,
    // },
    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);


const Category = model("category", categorySchema);

export default Category;
