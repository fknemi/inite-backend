// Update User
import { Router, Request, Response } from "express";
import { User } from "../../models/user/User";
import { generateTokens } from "../../auth";
const router = Router();
router.post("/login/", async (req: Request, res: Response) => {
  let admin = res.locals.admin;
  const user = res.locals.user;
  const owner = res.locals.owner;
  let permissions;
  let isOwner;
  if (owner) {
    isOwner = owner.isOwner;
    permissions = { ...admin.adminPermissions, ...owner.ownerPermissions };
  } else {
    permissions = admin.adminPermissions;
  }
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).send("Invalid Login");
  }

  const checkPassword = await user.validatePassword(password);
  if (!checkPassword) {
    return res.status(404).send("Invalid Login");
  }

if(username !== user.username){
  return res.status(400).send("Invalid User")
}

  const adminData = {
    name: admin.userInfo.name,
    username: admin.userInfo.username,
    avatar: admin.userInfo.avatar,
    isBanned: admin.userInfo.isBanned,
    isAdmin: admin.isAdmin,
    isOwner: isOwner,
    emailVerified: admin.userInfo.emailVerified,
    permissions: permissions,
  };
  return res.send(adminData);
});
export { router };
