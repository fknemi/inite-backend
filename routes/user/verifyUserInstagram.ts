// verify Instagram User
import { Router, Request, Response } from "express";
import { uploadMedia, logEvent } from "../../main";
import { instagramUser } from "../../models/ig/instagramUser";
import { User } from "../../models/user/User";
const { getUserByUsername } = require("instagram-stories");
const router = Router();
router.post("/verify/instagram", async (req: Request, res: Response) => {
  const user = res.locals.user;
  if (!user) {
    return res.status(400).send("Invalid User");
  }
  if (user.instagramVerified) {
    return res.status(405).send("Instagram Already Verified");
  }

  const username = req.body.username;
  if (!username) {
    return res.status(206).send("Username is Required");
  }
  const iguser: any = await instagramUser.findOne({ username: username });
  if (iguser) {
    const isAlreadyLinked = await User.findOne({ instagramProfile: iguser.id });
    if (isAlreadyLinked) {
      return res
        .status(206)
        .send("Instagram Is Already Linked To Another Account");
    }
    user.instagramProfile = iguser._id;
  } else {
    const userProfile: any = await getUserByUsername({
      username: username,
      userid: process.env.USER_ID,
      sessionid: process.env.SESSION_ID,
    });
    if (!userProfile) {
      return res.status(404).send("User Not Found");
    }
    const newInstagramUser = new instagramUser({
      name: userProfile.user.full_name,
      username: userProfile.user.username,
      biography: [{ text: userProfile.user.biography, recent: false }],
      avatars: [
        {
          url: await uploadMedia(
            userProfile.user.profile_pic_url_hd,
            `InstagramUsers/${userProfile.user.username}/avatars`
          ),
          recent: false,
        },
      ],
      isPrivate: userProfile.user.is_private,
      postsCount: userProfile.user.edge_owner_to_timeline_media.count,
      followingCount: userProfile.user.edge_follow.count,
      followedByCount: userProfile.user.edge_followed_by.count,
    });
    await newInstagramUser.save();
    user.instagramProfile = newInstagramUser._id;
  }
  user.instagramVerified = true;
  await user.save();
  return res.send("OK");
});
export { router };
