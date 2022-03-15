import { Router, Request, Response } from "express";
import { User } from "../../models/user/User";
import { Owner } from "../../models/owner/Owner";
import { Admin } from "../../models/admin/Admin";
const router = Router();
// Add New Admins
router.post("/promote", async (req: Request, res: Response) => {
  const owner: any = res.locals.owner;
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send("User Not Found");
  }
  let admin = await Admin.findOne({ userInfo: user._id });
  const isOwner = await Owner.findOne({ userInfo: user._id });
  if (isOwner) {
    return res.status(400).send("Invalid User");
  }
  if (!admin) {
    admin = new Admin({
      userInfo: user._id,
      isAdmin: true,
    });
    await admin.save();
  }
  const newOwner: any = new Owner({
    userInfo: user._id,
    isAdmin: true,
  });
  user.followLimit = 20;
  await newOwner.save();
  await user.save();
  return res.send(
    `${user.name} has been promoted to Owner by ${owner.userInfo.username}`
  );
});
export { router };
