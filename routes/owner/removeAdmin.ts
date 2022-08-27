// Remove Admins
import { Router, Request, Response } from "express";
import { User } from "../../models/user/User";
import { Admin } from "../../models/admin/Admin";
import { logEvent } from "../../main";
const router = Router();
router.post("remove/admin/", async (req: Request, res: Response) => {
  const owner: any = res.locals.owner;
  if (!req.body.email || !req.body.username) {
    return res.status(206).send("Invalid Request");
  }
  const user = await User.findOne({
    email: req.body.email,
    username: req.body.username,
  });
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
  return res.send("OK");
});
export { router };
