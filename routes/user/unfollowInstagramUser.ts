import { Router, Request, Response } from "express";
import { instagramUser } from "../../models/ig/instagramUser";
const router = Router();
// Follow Instagram User
router.put("/instagram/unfollow", async (req: Request, res: Response) => {
  const user = res.locals.user;
  if (!user) {
    return res.status(404).send("Invalid User");
  }
  const iguser = await instagramUser.findOne({ username: req.body.username });
  if (!iguser) {
    return res.status(404).send("User Not Found");
  }
  let isPresent: boolean = false;
  if (user.following.length) {
    for (let i = 0; i <= user.following.length - 1; i++) {
      if (String(iguser._id) === String(user.following[i].instagramUser)) {
        user.following.splice(i, 1);
        isPresent = true;
        break;
      }
    }
    if (!isPresent) {
      return res
        .status(400)
        .send(`User Currently Not Following ${req.body.username}`);
    }
  } else {
    return res.send("User Not Following Anyone");
  }
  for (let k = 0; k <= iguser.followedBy.length - 1; k++) {
    if (String(user._id) === String(iguser.followedBy[k].user)) {
      iguser.followedBy.splice(k, 1);
      break;
    }
  }
  user.followingCount--;
  await iguser.save();
  await user.save();
  return res.send("OK");
});
export { router };
