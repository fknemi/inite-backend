import mongoose, { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { USER } from "../../common/types";
import { DocumentDefinition } from "mongoose";

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value: string) => {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email Address");
      }
    },
  },
  gender: {
    type: String,
    required: true,
    lowercase: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  instagramVerified: {
    type: Boolean,
    default: false,
    required: false,
  },
  media: {
    type: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    required: false,
  },
  followLimit: {
    type: Number,
    default: 3,
    required: false,
  },
  followingCount: {
    type: Number,
    default: 0,
  },
  following: {
    type: [
      {
        instagramUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "instagramUser",
        },
        timestamp: {
          type: String,
          default: new Date().getTime(),
        },
      },
    ],
    required: false,
  },
  followingHistory: {
    type: [
      {
        instagramUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "instagramUser",
        },
        timestamp: {
          type: String,
          default: new Date().getTime(),
        },
      },
    ],
    required: false,
  },
  isBanned: {
    type: Boolean,
    required: false,
    default: false,
  },
  banReason: {
    type: String,
    required: false,
  },
  reports: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
      },
    ],
    required: false,
  },
  instagramProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instagramUser",
    required: false,
  },
  isAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  isOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
  },
  notifications: {
    newAccountNameChange: {
      type: Boolean,
      default: true,
    },
    newPosts: {
      type: Boolean,
      default: true,
    },
    newFollowers: {
      type: Boolean,
      default: true,
    },
    startedFollowingNewUsers: {
      type: Boolean,
      default: true,
    },
    newBiography: {
      type: Boolean,
      default: true,
    },
    newAvatar: {
      type: Boolean,
      default: true,
    },
    newAccountPrivacyChange: {
      type: Boolean,
      default: true,
    },
  },
  notifyEmail: {
    type: Boolean,
    default: true,
  },
  timestamp: {
    type: String,
    default: new Date().getTime(),
  },
});

userSchema.methods.validatePassword = async function validatePassword(
  password: string
) {
  return bcrypt.compare(password.repeat(32), this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password.repeat(32), salt);
  return next();
});

export const User = model("User", userSchema);
