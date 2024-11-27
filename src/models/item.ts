import { Schema, model } from "mongoose";
import constants from "../utils/constants";
import { unixTime } from "../helpers/helper";

const itemSchema = new Schema(
  {

    name: {
      type: String,
      required: true,
    },
    slug: { type: String, required: true },

    description: {
        type: String,
        required: true,
      },

      image: {
        type: String,
      },
      imageUrl: {
        type: String,
      },

    Ingredients: {
        type: Array
    },

    brandId: { type: Schema.Types.ObjectId, ref: "Brand" },


    foodtypeId: { type: Schema.Types.ObjectId, ref: "FoodType" },

 


    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },

    preparationTime: {
      type:String
    },



    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);




const Item = model("item", itemSchema);

export default Item;
