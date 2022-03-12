// Follow Instagram User
import { Router, Request, Response } from "express";
import { instagramUser } from "../../models/ig/instagramUser";
const router = Router();
router.post("/instagram/follow", async (req: Request, res: Response) => {
  const user = res.locals.user;
  if (!user) {
    return res.status(404).send("Invalid User");
  }

  if (user.followLimit <= user.following.length) {
    return res.status(400).send("Reached Follow Limit");
  }

  const iguser = await instagramUser.findOne({ username: req.body.username });
  if (!iguser) {
    return res.status(404).send("User Not Found");
  }
  let isPresent: boolean = false;
  if (user.following.length) {
    for (let i = 0; i <= user.following.length - 1; i++) {
      if (String(iguser._id) === String(user.following[i].instagramUser)) {
        isPresent = true;
        break;
      }
    }
  }
  if (isPresent) {
    return res.status(400).send("User is already being followed");
  }

  if (user.followingHistory.length) {
    for (let k = 0; k <= user.followingHistory.length - 1; k++) {
      if (
        String(iguser._id) === String(user.followingHistory[k].instagramUser)
      ) {
        user.followingHistory.splice(k, 1);
        break;
      }
    }
  }

  user.following.push({ instagramUser: iguser._id });
  user.followingHistory.push({ instagramUser: iguser._id });
  iguser.followedBy.push({ user: user._id });
  await user.save();
  await iguser.save();
  return res.send("OK");
});
export { router };
