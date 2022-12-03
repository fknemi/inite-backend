// Checking for any changes of User on Instagram when a user visits their profile
import { instagramUser } from "../../models/ig/instagramUser";
import { Router, Request, Response } from "express";
import { uploadMedia } from "../../main";
const { getUserByUsername } = require("instagram-stories");
const router = Router();
router.post("/user/get/media", async (req: Request, res: Response) => {
  let user: any;
  try {
    user = await instagramUser.findOne({ username: req.body.username });
  } catch {}
  if (!user) {
    return res.status(404).send({ error: "User Not Found" });
  }
  const media: { type: string; url: string }[] = [];
  user.avatars.forEach((avatar: { url: string }) => {
    if (avatar && avatar?.url) {
      media.push({ type: "image", url: avatar.url });
    }
  });
  if (user.media.length) {
    user.media.forEach(({ type, url }: any) => {
      media.push({ type: type, url: url });
    });
  }
  return res.send(media);
});

export { router };
