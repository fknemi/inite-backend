import mongoose, { Schema, model } from "mongoose";
import { ADMIN } from "../../common/types";
const adminSchema: Schema<ADMIN> = new Schema({
  userInfo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isAdmin: {
    type: Boolean,
    required: true,
    default: true,
  },
  adminPermissions: {
    banUser: {
      type: Boolean,
      default: true,
      required: false,
    },
    unbanUser: {
      type: Boolean,
      default: true,
      required: false,
    },
    banInstagramUser: {
      type: Boolean,
      default: true,
      required: false,
    },
    unbanInstagramUser: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
});

export const Admin = model("Admin", adminSchema);
