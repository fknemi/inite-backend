// Remove Admins
import { Router, Request, Response } from "express";
import { User } from "../../models/user/User";
import { Admin } from "../../models/admin/Admin";
import { logEvent } from "../../main";
const router = Router();
router.post("/admin/remove/", async (req: Request, res: Response) => {
  const owner: any = res.locals.owner;
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(404).send("User Not Found");
  }
  const admin = await Admin.findOneAndDelete({ userInfo: user._id });
  if (!admin) {
    return res.send("Invalid User");
  }
  user.followLimit = 3;
  await user.save();
  await logEvent(
    `${user.name} has been removed from Admin by ${owner.userInfo.username}`
  );
  return res.send(
    `${user.name} has been removed from Admin by ${owner.userInfo.username}`
  );
});
export { router };
