// Ban User
import { Router, Request, Response } from "express";
import { User } from "../../models/user/User";
import { Admin } from "../../models/admin/Admin";
import { logEvent } from "../../main";
const router = Router();
router.put("/user/ban/", async (req: Request, res: Response) => {
  const admin = res.locals.admin;
  const user = await User.findOne({
    username: req.body.username,
  });
  if (!user) {
    return res.status(404).send("Invalid User");
  }
  if (user.isBanned) {
    return res.send("User has already been banned");
  }
  const isUserAdmin = await Admin.findOne({ userInfo: user._id });
  if (isUserAdmin) {
    return res.status(401).send("Unauthorized User");
  }
  user.isBanned = true;
  user.banReason = req.body.banReason;
  user.isCollect = req.body.isCollect || false;
  await user.save();
  if (!user.isBanned) {
    return res.status(404).send("Was Unable To Ban User");
  }
  await logEvent(
    `${user.username} has been banned by ${admin.userInfo.username} ${
      req.body.banReason
        ? "Reason: " + req.body.banReason
        : "No Reason Provided"
    }`
  );
  return res.send("OK");
});
export { router };
