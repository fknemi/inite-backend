// Get All Registered Users
import { Router, Request, Response } from "express";
import { User } from "../../models/user/User";
const { getUserByUsername } = require("instagram-stories");
const router = Router();
router.post("/get/users", async (req: Request, res: Response) => {
  const users = await User.find();
  const usersData: { username: string; name: string; avatar: string, timestamp: string }[] = [];
  if (!users) {
    return res.status(404).send("Users Not Found");
  }
  users.forEach((user: any) => {
    usersData.push({
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      timestamp: user.timestamp
    });
  });

  return res.send(usersData);
});

export { router };
