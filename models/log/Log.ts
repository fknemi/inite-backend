import { Schema, model } from "mongoose";


const logSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    default: new Date().getTime(),
  },
});

export const Log = model("Logs", logSchema);
