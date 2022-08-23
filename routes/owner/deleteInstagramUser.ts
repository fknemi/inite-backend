// Delete Instagram User
import { Router, Request, Response } from "express";
import { instagramUser } from "../../models/ig/instagramUser";
import { deleteInstagramUserMedia } from "../../main";
import { User } from "../../models/user/User";
const router = Router();
router.post("/instagram/user/delete", async (req: Request, res: Response) => {
  const owner = res.locals.owner;
  const user = await instagramUser.findOneAndDelete({
    username: req.body.username,
  });
  if (!user) {
    return res.status(404).send("Invalid User");
  }
  if (req.body.deleteMedia) {
    const isMediaDeleted = await deleteInstagramUserMedia(req.body.username);
    if (!isMediaDeleted) {
      return res.send(
        `Media Deletion of ${req.body.username} was Unsuccessful`
      );
    }
  }
  if (user.followedBy.length) {
    user.followedBy.forEach(async (item: any) => {
      let follower = await User.findById(item.user);
      if (!follower) {
        return;
      }
      let instagramUserId;
      for (let i = 0; i <= follower.following.length - 1; i++) {
        instagramUserId = follower.following[i].instagramUser;
        if (String(user._id) === String(instagramUserId)) {
          follower.following.splice(i, 1);
          break;
        }
      }
      for (let k = 0; k <= follower.followingHistory.length - 1; k++) {
        instagramUserId = follower.followingHistory[k].instagramUser;
        if (String(user._id) === String(instagramUserId)) {
          follower.followingHistory.splice(k, 1);
          break;
        }
      }
      await follower.save();
    });
  }
  return res.send("OK");
});

export { router };
