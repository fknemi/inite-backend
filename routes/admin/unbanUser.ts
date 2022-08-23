// unban User
import { Router, Request, Response } from "express";
import { User } from "../../models/user/User";
import { Admin } from "../../models/admin/Admin";
import { logEvent } from "../../main";
const router = Router();
router.post("/user/unban/", async (req: Request, res: Response) => {
  const admin = res.locals.admin;
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(404).send("Invalid User");
  }
  const isUserAdmin = await Admin.findOne({ userInfo: user._id });
  if (!user.isBanned) {
    return res.send("User is not currently banned");
  }
  if (isUserAdmin) {
    return res.status(400).send("Unauthorized User");
  }
  user.isBanned = false;
  user.isCollect = false;
  await user.save();
  if (user.isBanned) {
    return res.status(404).send("Was Unable To unban User");
  }
  await logEvent(
    `${user.username} has been unbanned by ${admin.userInfo.username}`
  );
  return res.send("OK");
});
export { router };
