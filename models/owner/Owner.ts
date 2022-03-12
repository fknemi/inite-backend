import mongoose, { Schema, model } from "mongoose";
const ownerSchema = new Schema({
  userInfo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isOwner: {
    type: Boolean,
    default: true,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: true,
  },
  ownerPermissions: {
    deleteUser: {
      type: Boolean,
      default: true,
      required: false,
    },
    deleteInstagramUser: {
      type: Boolean,
      default: true,
      required: false,
    },
    deleteInstagramUserMedia: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
});

export const Owner = model("Owner", ownerSchema);
