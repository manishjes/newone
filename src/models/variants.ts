import { Schema, model } from "mongoose";
import constants from "../utils/constants";
import { unixTime } from "../helpers/helper";

// const variantsSchema = new Schema(
//   {

//     name: {
//         type: String,
//         required: true,
//       },

//       // variantPrice: {
//       //   type: String,
//       //   required: true,
//       // },


//       slug: {
//         type: String,
//         required: true,
//       },
   

//     itemId: { type: Schema.Types.ObjectId, ref: "Item" },

//     isDeleted: { type: Boolean, required: true, default: false },
//     createdBy: { type: Schema.Types.ObjectId, ref: "User" },
//     updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
//     deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );


// const Variant = model("variant", variantsSchema);

// export default Variant;



// const variantsSchema = new Schema(
//   {

//     variants: {
//     name: {
//         type: String,
//         required: true,
//       },

//       slug: {
//         type: String,
//         required: true,
//       },

//       image: {
//         type: String,
//       },
//       imageUrl: {
//         type: String,
//       },

//       price: {
//         type: String,
//         required: true,
//       },
//     },

     
   

//     itemId: { type: Schema.Types.ObjectId, ref: "Item" },

//     isDeleted: { type: Boolean, required: true, default: false },
//     createdBy: { type: Schema.Types.ObjectId, ref: "User" },
//     updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
//     deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );


// const Variant = model("variant", variantsSchema);

// export default Variant;


const variantsSchema = new Schema(
  {


    name: {
        type: String,
        required: true,
      },

      slug: {
        type: String,
        required: true,
      },


      price: {
        type: String,
        required: true,
      },
    

    itemId: { type: Schema.Types.ObjectId, ref: "Item" },

    isDeleted: { type: Boolean, required: true, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);


variantsSchema.method("getVariantDetail", async function getVariantDetail() {
  return {
    _id: this.id,
    name: this.name,
   slug: this.slug,
   price: this.price,
    createdAt: await unixTime(this.createdAt),
  }

} ) 


const Variant = model("variant", variantsSchema);

export default Variant;