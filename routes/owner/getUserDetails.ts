// Get Specific User Details
import { instagramUser } from "../../models/ig/instagramUser";
import { Router, Request, Response } from "express";
import { uploadMedia } from "../../main";
import { User } from "../../models/user/User";
const { getUserByUsername } = require("instagram-stories");
const router = Router();
router.post("/user/details", async (req: Request, res: Response) => {
  const username = req.body.username;
  if (!username) {
    return res.status(404).send("Invalid Username");
  }
  const user = await User.findOne({ username: username }).populate(
    "following.instagramUser followingHistory.instagramUser"
  );
  if (!user) {
    return res.status(404).send("User Not Found");
  }
  let following, followingHistory;
  if (user.followingHistory.length > 0) {
    followingHistory = user.followingHistory.map((following: any) => {
      return {
        username: following.instagramUser.username,
        timestamp: following.timestamp,
      };
    });
    if (user.following.length > 0) {
      following = user.following.map((data: any) => {
        return {
          username: data.instagramUser.username,
          timestamp: data.timestamp,
        };
      });
    }
  }

  const userData = {
    name: user.name,
    username: user.username,
    avatar: user.avatar,
    email: user.email,
    gender: user.gender,
    emailVerified: user.emailVerified,
    instagramVerified: user.instagramVerified,
    isBanned: user.isBanned,
    timestamp: user.timestamp,
    following: following,
    followingHistory: followingHistory,
    followLimit: user.followLimit,
    followingCount: user.followingCount,
  };

  return res.send(userData);
});

export { router };
