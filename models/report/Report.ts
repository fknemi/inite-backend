import mongoose, { Schema, model } from "mongoose";

const reportSchema = new Schema({
  userInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reason: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  accountReported: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instagramUser",
    required: false
  },
  accountReportedUsername: {
    type: String,
    required: false
  }
  ,
  readStatus: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: String,
    default: new Date().getTime(),
  },
});
export const Report = model("Report", reportSchema);
