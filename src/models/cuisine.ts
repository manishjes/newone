import { Schema, model } from "mongoose";
import constants from "../utils/constants";
import { unixTime } from "../helpers/helper";

const cuisineSchema = new Schema(
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
    status: { type: Boolean, required: true, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);


cuisineSchema.method("getCuisineDetail", async function getCuisineDetail() {
  return {
    _id: this.id,
    name: this.name,
   slug: this.slug,
   image: this.image,
    createdAt: await unixTime(this.createdAt),
  }

} )

const Cuisine = model("cuisine", cuisineSchema);

export default Cuisine;