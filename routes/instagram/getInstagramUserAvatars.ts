// Checking for any changes of User on Instagram when a user visits their profile
import { instagramUser } from "../../models/ig/instagramUser";
import { Router, Request, Response } from "express";
import { is_same, uploadMedia } from "../../main";
const { getUserByUsername } = require("instagram-stories");
const router = Router();
router.post("/get/avatars", async (req: Request, res: Response) => {
  let user: any = await instagramUser.findOne({ username: req.body.username });
  if (!user) {
    return res.status(404).send({ error: "User Not Found" });
  }
  const avatars: string[] = []
  user.avatars.forEach((avatar: {url: string}) => {
    avatars.push(avatar.url)
  })
  return res.send(avatars);
});

export { router };
