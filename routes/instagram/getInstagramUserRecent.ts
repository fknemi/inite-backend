// Checking for any changes of User on Instagram when a user visits their profile
import { instagramUser } from "../../models/ig/instagramUser";
import { Router, Request, Response } from "express";
import { is_same, uploadMedia } from "../../main";
const { getUserByUsername } = require("instagram-stories");
const router = Router();
router.post("/get/recent", async (req: Request, res: Response) => {
  let user: any = await instagramUser.findOne({ username: req.body.username });
  if (!user) {
    return res.status(404).send({ error: "User Not Found" });
  }
  const userCurrentData = await getUserByUsername({
    username: req.body.username,
    userid: process.env.USER_ID,
    sessionid: process.env.SESSION_ID,
  });
  let biography;
  let avatar;
  let updateBiography = Boolean(user.biography.length);
  let updateAvatars = Boolean(user.avatars.length);
  let changes: any = {
    name: { isRecent: false, value: undefined },
    biography: { isRecent: false, value: undefined },
    avatar: { isRecent: false, value: undefined },
    isPrivate: { isRecent: false, value: undefined },
    followedByCount: { isRecent: false, value: undefined },
    followingCount: { isRecent: false, value: undefined },
    postsCount: { isRecent: false, value: undefined },
  };

  const currentUser = {
    name: userCurrentData.user.full_name,
    biography: userCurrentData.user.biography,
    avatar: userCurrentData.user.profile_pic_url_hd,
    isPrivate: userCurrentData.user.is_private,
    followedByCount: userCurrentData.user.edge_followed_by.count,
    followingCount: userCurrentData.user.edge_follow.count,
    postsCount: userCurrentData.user.edge_owner_to_timeline_media.count,
  };

  if (!user.recentlyAdded) {
    if (updateBiography) {
      for (let i = 0; i <= user.biography.length - 1; i++) {
        if (user.biography[i].recent) {
          biography = user.biography[i].text;
          break;
        }
      }
    }

    if (updateAvatars) {
      for (let i = 0; i <= user.avatars.length - 1; i++) {
        if (user.avatars[i].recent) {
          avatar = user.avatars[i].url;
          break;
        }
      }
    }
  } else {
    avatar = user.avatars[0].url;
    biography = user.biography[0].text;
  }

  if (biography !== currentUser.biography) {
    changes.biography.isRecent = true;
    if (updateBiography) {
      for (let i = 0; i <= user.biography.length - 1; i++) {
        let item = user.biography[i];
        item.recent = false;
      }
    }
    user.biography.push({ text: currentUser.biography });
  }

  const currentAvatar: any = await uploadMedia(
    currentUser.avatar,
    `temp/${req.body.username}`
  );
  let is_diff;

  if (avatar && currentAvatar) {
    is_diff = await is_same(currentUser.avatar, avatar).catch((err: any) => {
      return false;
    });
  } else {
    is_diff = false;
  }

  if (!is_diff) {
    avatar = await uploadMedia(
      currentUser.avatar,
      `InstagramUsers/${req.body.username}/avatars`
    );
    changes.avatar.isRecent = true;
    changes.avatar.value = avatar;
    if (updateAvatars) {
      for (let i = 0; i <= user.avatars.length - 1; i++) {
        let item = user.avatars[i];
        item.recent = false;
      }
    }
    user.avatars.push({ url: avatar });
  }
  if (user.name !== currentUser.name) {
    user.name = currentUser.name;
    changes.name.isRecent = true;
    changes.name.value = currentUser.name;
  }
  if (user.isPrivate !== currentUser.isPrivate) {
    user.isPrivate = currentUser.isPrivate;
    changes.isPrivate.isRecent = true;
    changes.isPrivate.value = currentUser.isPrivate;
  }
  if (user.followedByCount !== currentUser.followedByCount) {
    user.followedByCount = currentUser.followedByCount;
    changes.followedByCount.isRecent = true;
    changes.followedByCount.value = currentUser.followedByCount;
  }
  if (user.followingCount !== currentUser.followingCount) {
    user.followingCount = currentUser.followingCount;
    changes.followingCount.isRecent = true;
    changes.followingCount.value = currentUser.followingCount;
  }
  if (user.postsCount !== currentUser.postsCount) {
    user.postsCount = currentUser.postsCount;
    changes.postsCount.isRecent = true;
    changes.name.postsCount = currentUser.postsCount;
  }
  if (user.recentlyAdded) {
    user.recentlyAdded = false;
  }
  await user.save();
  return res.send(changes);
});

export { router };
