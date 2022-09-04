import { Router, Request, Response } from "express";
import { deleteUserMedia } from "../../main";
import { instagramUser } from "../../models/ig/instagramUser";
import { User } from "../../models/user/User";
const router = Router();
router.put("/user/delete", async (req: Request, res: Response) => {
  let iguser;
  let owner = await res.locals.owner;

  if (req.body.username === owner.userInfo.username) {
    return res.status(400).send("You cannot delete current logged in User");
  }
  const user = await User.findOneAndDelete({ username: req.body.username });
  if (!user) {
    return res.status(404).send("User Not Found");
  }
  user.following.forEach(async (item: any) => {
    iguser = await instagramUser.findById(item.instagramUser);
    if (!iguser) {
      return;
    }
    for (let k = 0; k <= iguser.followedBy.length - 1; k++) {
      if (String(user._id) === String(iguser.followedBy[k].user)) {
        iguser.followedBy.splice(k, 1);
        break;
      }
    }
    await iguser.save();
  });
  if (req.body.deleteMedia) {
    const isMediaDeleted = await deleteUserMedia(req.body.username);
    if (!isMediaDeleted) {
      return res.send(`MEDIA DELETION FAILED`);
    }
  }
  return res.send("OK");
});

export { router };
