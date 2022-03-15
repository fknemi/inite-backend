// Get User Data
import { Router, Request, Response } from "express";
const router = Router();
router.post("/get/", async (req: Request, res: Response, context) => {
  let user: any;
  try {
    user = await res.locals.user.populate("following.instagramUser");
  } catch (err: any) {
    return res.status(400).send("Invalid User");
  }

  if (!user) {
    return res.status(400).send("Invalid User");
  }
  const following: Object[] = [];
  let avatar: string;
  user.following.forEach((data: any) => {
    const iguser = data.instagramUser;
    if(!iguser){return}
    if(iguser.isBanned){return;}
    if (iguser.avatars.length < 1) {
      for (let i = 0; i <= iguser.avatars.length - 1; i++) {
        if (iguser.avatars[i].recent) {
          avatar = iguser.avatars[i].url;
          break;
        }
      }
    } else {
      avatar = iguser.avatars[0].url;
    }
    following.push({
      name: iguser.name,
      username: iguser.username,
      followingCount: iguser.followingCount,
      followedByCount: iguser.followedByCount,
      postsCount: iguser.postsCount,
      avatar: avatar,
    });
  });

  if (user) {
    const userData = {
      name: user.name,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      instagramVerified: user.instagramVerified,
      followLimit: user.followLimit,
      following: following,
      isBanned: user.isBanned,
    };
    return res.send(userData);
  }
  return res.status(404).send("Invalid Login");
});
export { router };
