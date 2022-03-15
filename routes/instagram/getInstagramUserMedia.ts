// Checking for any changes of User on Instagram when a user visits their profile
import { instagramUser } from "../../models/ig/instagramUser";
import { Router, Request, Response } from "express";
import { is_same, uploadMedia } from "../../main";
const { getUserByUsername } = require("instagram-stories");
const router = Router();
router.post("/user/get/media", async (req: Request, res: Response) => {
  let user: any = await instagramUser.findOne({ username: req.body.username });
  if (!user) {
    return res.status(404).send({ error: "User Not Found" });
  }
  const media: Object[] = [];
  user.avatars.forEach((avatar: { url: string }) => {
    media.push({ type: "image", url: avatar.url });
  });
  if (user.media.length) {
    user.media.forEach(({ type, url }: any) => {
      media.push({ type: type, url: url });
    });
  }
  return res.send(media);
});

export { router };
