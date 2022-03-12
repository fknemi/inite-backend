// Get User Data
import { Router, Request, Response } from "express";
const router = Router();
router.post("/get/", async (req: Request, res: Response, context) => {
  let admin = res.locals.admin;
  const owner = res.locals.owner;
  let permissions;
  let isOwner;
  if (owner) {
    isOwner = owner.isOwner;
    permissions = { ...admin.adminPermissions, ...owner.ownerPermissions };
  } else {
    permissions = admin.adminPermissions;
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
