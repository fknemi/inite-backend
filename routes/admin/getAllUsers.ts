// Get All Registered Users
import { Router, Request, Response } from "express";
import { Admin } from "../../models/admin/Admin";
import { Owner } from "../../models/owner/Owner";
import { User } from "../../models/user/User";
const { getUserByUsername } = require("instagram-stories");
const router = Router();
router.get("/get/users", async (req: Request, res: Response) => {
  const users = await User.find();
  const usersData: {
    username: string;
    name: string;
    avatar: string;
    timestamp: string;
    isBanned: boolean;
    isAdmin: boolean;
    isOwner: boolean;
  }[] = [];
  if (!users) {
    return res.status(404).send("Users Not Found");
  }
  users.forEach(async (user: any) => {
    usersData.push({
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      timestamp: user.timestamp,
      isBanned: user.isBanned,
      isAdmin: user.roles.isAdmin,
      isOwner: user.roles.isOwner,
    });
  });
  return res.send(usersData);
});

export { router };
