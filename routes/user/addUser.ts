// Add New User

import { Router, Request, Response } from "express";
import { User } from "../../models/user/User";
import { uploadMedia, logEvent } from "../../main";
import { generateTokens } from "../../auth";
import { USER } from "../../common/types";
import { Document } from "mongoose";

const router = Router();
router.post("/register/", async (req: Request, res: Response) => {
  if (!req.body.name) {
    return res.status(206).send("Name is Required");
  }
  if (!req.body.username) {
    return res.status(206).send("Username is Required");
  }
  if (!req.body.email) {
    return res.status(206).send("Email is Required");
  }
  if (
    !/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      req.body.email
    )
  ) {
    return res.status(400).send("Invalid Email Address");
  }
  if (!req.body.password) {
    return res.status(206).send("Password is Required");
  }
  if (!req.body.gender) {
    return res.status(206).send("Gender is Required");
  }
  if (await User.findOne({ email: req.body.email })) {
    return res.status(400).send("Invalid User");
  }
  if (await User.findOne({ username: req.body.username })) {
    return res.status(400).send("Username Not Available");
  }
  const avatar: any = await uploadMedia(
    `https://avatars.dicebear.com/api/initials/${req.body.username}.svg`,
    `Users/${req.body.username}/avatars`
  );
  const user = new User<USER>({
    ...req.body,
    avatar: avatar,
  });
  await user.save();
  const newTokens = await generateTokens(
    user,
    process.env.SECRET_2 + user.password
  );
  res.set({
    "x-token": newTokens.token,
    "x-refresh-token": newTokens.refreshToken,
    "Access-Control-Expose-Headers": "*",
  });
  await logEvent(`${user.username} Signed Up`);
  return res.send({ avatar: user.avatar });
});
export { router };
