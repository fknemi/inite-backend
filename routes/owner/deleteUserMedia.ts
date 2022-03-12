import { Router, Request, Response } from "express";
import { deleteUserMedia } from "../../main";
import { User } from "../../models/user/User";
const router = Router();
router.post("/user/media/delete", async (req: Request, res: Response) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(404).send("User Not Found");
  }
  const deletedMedia = await deleteUserMedia(req.body.username, true);
  if (!deletedMedia) {
    return res
      .status(202)
      .send(`Failed Media Deletion of ${req.body.username}`);
  }
  return res.send(`Deleted Media of ${user.username}`);
});

export { router };
