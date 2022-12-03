// Update User
import { Router, Request, Response } from "express";
import { User } from "../../models/user/User";
import { generateTokens } from "../../auth";
const router = Router();
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).send("Invalid Login");
  }
  const user: any = await User.findOne({ email: email }).populate(
    "following.instagramUser"
  );
  if (!user) {
    return res.status(404).send("Invalid Login");
  }
  const following: Object[] = [];
  let avatar: string;
  user.following.forEach((data: any) => {
    const iguser = data.instagramUser;
    if (iguser?.isBanned || false) {
      return;
    }
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

  const checkPassword = await user.validatePassword(password);
  if (!checkPassword) {
    return res.status(404).send("Invalid Login");
  }
  const newTokens = await generateTokens(
    user,
    process.env.SECRET_2 + user.password
  );
  res.set({
    "x-token": newTokens.token,
    "x-refresh-token": newTokens.refreshToken,
    "Access-Control-Expose-Headers": "*",
  });
  const userData = {
    name: user.name,
    username: user.username,
    email: user.email,
    emailVerified: user.emailVerified,
    instagramVerified: user.instagramVerified,
    followLimit: user.followLimit,
    following: following,
    isBanned: user.isBanned || false,
  };
  return res.send(userData);
});
export { router };
