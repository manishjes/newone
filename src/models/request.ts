import { Schema, model } from "mongoose";
import constants from "../utils/constants";
import cron from 'node-cron';

const requestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tableId: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    status: {
      type: Number,
      required: true,
      default: constants.requestStatus.pending,
      enum: [
        constants.requestStatus.pending,
        constants.requestStatus.approved,
        constants.requestStatus.rejected,
        constants.requestStatus.cancelled
      ],
    },
    reason: {
      type: String,
    },

    userReason : {
      type: String
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Request = model("request", requestSchema);

cron.schedule('* * * * *', async () => {

  const pendingRequests = await Request.find({
    status: constants.requestStatus.pending,
    updatedAt: { $lt: new Date(Date.now() - 3 * 60 * 1000) },
  });

  for (const request of pendingRequests) {
    request.status = constants.requestStatus.rejected;
    await request.save();
  }

});

export default Request;



