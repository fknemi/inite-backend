// Add New Admins
import { Router, Request, Response } from "express";
import { User } from "../../models/user/User";
import { Admin } from "../../models/admin/Admin";
import { checkOwner } from "../../permissions"
import { logEvent } from '../../main';
const router = Router();
router.post("/admin/promote/", async (req: Request, res: Response) => {
  const owner: any = res.locals.owner;
  const user = await User.findOne({ email: req.body.email }); 
  if (!user) {
    return res.status(404).send("User Not Found");
  }
  const admin: any = new Admin({
    userInfo: user._id,
    isAdmin: true,
  });
  user.followLimit = 10
  await admin.save();
  await user.save()
  await logEvent(`${user.name} has been promoted to Admin`)
  return res.send(`${user.name} has been promoted to Admin`);
});
export { router };
