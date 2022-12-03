import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import { INSTAGRAM_USER } from "../../@types/types";
const instagramUserSchema: Schema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  biography: {
    type: [
      {
        recent: {
          type: Boolean,
          default: true,
        },
        text: {
          type: String,
        },
        externalUrls: {
          type: [
            {
              type: String,
              trim: true,
            },
          ],
        },
        timestamp: {
          type: String,
          default: new Date().getTime(),
        },
      },
    ],
    required: false,
  },
  avatars: {
    type: [
      {
        url: {
          type: String,
          lowercase: true,
          trim: true,
          unique: true,
          required: true,
        },
        recent: {
          type: Boolean,
          default: true,
        },
        timestamp: {
          type: String,
          default: new Date().getTime(),
        },
      },
    ],
    required: true,
  },
  isPrivate: {
    type: Boolean,
    required: true,
  },
  media: {
    type: [
      {
        type: {
          type: String,
          lowercase: true,
          trim: true,
        },
        url: {
          type: String,
          lowercase: true,
          trim: true,
        },
        timestamp: {
          type: String,
          default: new Date().getTime(),
        },
        required: false,
      },
    ],
    required: false,
  },
  postsCount: {
    type: Number,
    required: true,
    default: 0,
  },
  followingCount: {
    type: Number,
    required: true,
    default: 0,
  },
  followedByCount: {
    type: Number,
    required: true,
    default: 0,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  isCollect: {
    type: Boolean,
    default: false,
  },
  recentlyAdded: {
    type: Boolean,
    default: true,
  },
  followedBy: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: {
          type: String,
          default: new Date().getTime(),
        },
      },
    ],
  },
  timestamp: {
    type: String,
    default: new Date().getTime(),
  },
});
export const instagramUser = model("instagramUser", instagramUserSchema);
