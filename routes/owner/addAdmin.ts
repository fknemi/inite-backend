// Add New Admins
import { Router, Request, Response } from "express";
import { User } from "../../models/user/User";
import { Admin } from "../../models/admin/Admin";
import { checkOwner } from "../../permissions";
import { logEvent } from "../../main";
const router = Router();
router.put("/promote/admin/", async (req: Request, res: Response) => {
  const owner: any = res.locals.owner;
  if (!req.body.email || !req.body.username) {
    return res.status(206).send("Invalid Request");
  }
  const user = await User.findOne({
    username: req.body.username,
    email: req.body.email,
  });
  if (!user) {
    return res.status(404).send("User Not Found");
  }
  if (!user.emailVerified) {
    return res.status(400).send("User Email Not Verified");
  }
  if (user.isAdmin) {
    return res.status(400).send("User Already Admin");
  }
  const admin: any = new Admin({
    userInfo: user._id,
    isAdmin: true,
  });
  user.roles.isAdmin = true;
  user.followLimit = 10;
  await admin.save();
  await user.save();
  await logEvent(`${user.name} has been promoted to Admin`);
  return res.send("OK");
});
export { router };
