import { Schema, model } from "mongoose";
import { unixTime } from "../helpers/helper";

const foodtypeSchema = new Schema(
  {

    name: {
      type: String,
      required: true,
    },

    slug:{
        type:String, 
        required:true
    },

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
  },
  { timestamps: true }
);


foodtypeSchema.method("getFoodTypeDetail", async function getFoodTypeDetail() {
  return {
    _id: this.id,
    name: this.name,
   slug: this.slug,
   image: this.image,
    createdAt: await unixTime(this.createdAt),
  }

} )

const FoodType = model("foodtype", foodtypeSchema);

export default FoodType;