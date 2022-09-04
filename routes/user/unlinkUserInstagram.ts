// unlink Instagram User
import { Router, Request, Response } from "express";
const { getUserByUsername } = require("instagram-stories");
const router = Router();
router.put("/instagram/update", async (req: Request, res: Response) => {
  const user = res.locals.user;
  if (!user) {
    return res.status(400).send("Invalid User");
  }
  if (!user.instagramVerified) {
    return res.status(405).send("Instagram Not Verified Yet");
  }

  user.instagramVerified = false;
  user.instagramProfile = undefined;
  await user.save();
  return res.send("OK");
});
export { router };
