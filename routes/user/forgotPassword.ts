// Forgot Password
import { Router, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../../models/user/User";
import { generatePasswordResetToken } from "../../auth";
import { sendEmail } from "../../main";
const router = Router();

router.post("/account/forgot/password", async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.send("OK");
  }
  const passwordResetToken = await generatePasswordResetToken(user);
  sendEmail("PASSWORD_RESET", user.email, passwordResetToken);

  return res.send("OK");
});
export { router };
