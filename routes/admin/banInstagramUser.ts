// Ban Instagram User
import { Router, Request, Response } from "express";
import { instagramUser } from "../../models/ig/instagramUser";
import { logEvent } from "../../main";
const router = Router();
router.put("/instagram/user/ban", async (req: Request, res: Response) => {
  const admin = res.locals.admin;
  const user = await instagramUser.findOne({ username: req.body.username }); // nosonar
  if (!user) {
    return res.status(404).send("User Not Found");
  }
  if (user.isBanned) {
    return res.send("User has already been banned");
  }
  user.isBanned = true;
  await user.save();
  if (!user.isBanned) {
    return res.send("Was Unable to Ban User");
  }
  await logEvent(
    `${req.body.username} has been banned by ${admin.userInfo.username}`
  );
  return res.send("OK");
});
export { router };
