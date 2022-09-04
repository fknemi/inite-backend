// Get Specific User Instagram Data By Username
import { instagramUser } from "../../models/ig/instagramUser";
import { Router, Request, Response } from "express";
import { uploadMedia } from "../../main";
const { getUserByUsername } = require("instagram-stories");
const router = Router();
router.get("/instagram/user/details", async (req: Request, res: Response) => {
  const username = req.body.username;
  if (!username) {
    return res.status(404).send("Invalid Username");
  }
  const user = await instagramUser
    .findOne({ username: username })
    .populate("followedBy.user");
  if (!user) {
    return res.status(404).send("User Not Found");
  }

  let avatar;
  let biography;

  if (!user.recentlyAdded) {
    for (let i = 0; i <= user.biography.length - 1; i++) {
      if (user.biography[i].recent) {
        biography = user.biography[i].text;
        break;
      }
    }
    for (let i = 0; i <= user.avatars.length - 1; i++) {
      if (user.avatars[i].recent) {
        avatar = user.avatars[i].url;
        break;
      }
    }
  } else {
    biography = user.biography[0].text;
    avatar = user.avatars[0].url;
  }
  const followers = user.followedBy.map((follower: any) => {
    console.log('====================================');
    console.log(follower.user.username,);
    console.log('====================================');
    return {
      username: follower.user.username,
      timestamp: follower.timestamp,
    };
  });

  const userData = {
    name: user.name,
    username: user.username,
    avatar: avatar,
    biography: biography,
    isPrivate: user.isPrivate,
    postsCount: user.postsCount,
    followingCount: user.followingCount,
    followedByCount: user.followedByCount,
    timestamp: user.timestamp,
    recentlyAdded: user.recentlyAdded,
    isBanned: user.isBanned,
    isCollect: user.isCollect,
    followedBy: followers,
};

  return res.send(userData);
});

export { router };
