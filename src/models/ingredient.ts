import { Schema, model } from "mongoose";
import { unixTime } from "../helpers/helper";

const ingredientSchema = new Schema(
  {

    name: {
      type: String,
      required: true,
    },

    slug:{
        type:String, 
        required:true
    },


  
    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);


ingredientSchema.method("getIngredientDetail", async function getIngredientDetail() {
  return {
    _id: this.id,
    name: this.name,
   slug: this.slug,
    createdAt: await unixTime(this.createdAt),
  }

} )     

const Ingredient = model("ingredient", ingredientSchema);

export default Ingredient;