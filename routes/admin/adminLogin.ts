// Admin Login
import { Router, Request, Response } from "express";
import { ADMIN, OWNER } from "../../@types/types";
const router = Router();
router.post("/login/", async (req: Request, res: Response) => {
  let admin: ADMIN = res.locals.admin;
  const user = res.locals.user;
  const owner: OWNER = res.locals.owner;
  let permissions;
  let isOwner;
  if (owner) {
    isOwner = owner.isOwner;
    permissions = { ...admin.adminPermissions, ...owner.ownerPermissions };
  } else {
    permissions = admin.adminPermissions;
  }
  const username: string = req.body.username;
  const password: string = req.body.password;

  if (!username || !password) {
    return res.status(404).send("Invalid Login");
  }

  const checkPassword: boolean = await user.validatePassword(password);
  if (!checkPassword) {
    return res.status(404).send("Invalid Login");
  }
  if (username !== user.username) {
    return res.status(400).send("Invalid User");
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
