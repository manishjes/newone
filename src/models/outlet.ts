import { Schema, model } from "mongoose";
import constants from "../utils/constants";

const outletSchema = new Schema(
  {

    name: {
      type: String,
      required: true,
    },

    slug:{
        type:String, 
        required:true
    },

    description: {
        type: String,
        required: true,
      },

      priceForTwo: {
        type:Number,
        required: true
      },

      images: {
        type: Array,
      },
      imagesUrl: {
        type: Array,
      },

      location: {

        type: {
          type: String,

        },

      coordinates:{
        type: Array,
      },

    },

      brandId: { type: Schema.Types.ObjectId, ref: "Brand" },

      managerId: {type: Schema.Types.ObjectId, ref: "User"},




       timings: [
        {
          day: { type: String, 
            enum: [
              constants.week.monday,
              constants.week.tuesday,
              constants.week.wednesday,
              constants.week.thursday,
              constants.week.friday,
              constants.week.saturday,
              constants.week.sunday
            ] },
            openingTime: { type: String }, 
            closingTime: { type: String } 

        }
       ],
      
  
    isDeleted: { type: Boolean, required: true, default: false },
    status: { type: Boolean, required: true, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

outletSchema.index({ location: "2dsphere" });


const Outlet = model("outlet", outletSchema);

export default Outlet;