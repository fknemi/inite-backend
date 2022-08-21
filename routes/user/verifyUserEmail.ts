import { Router, Request, Response } from "express";
import {
  generateEmailVerificationToken,
} from "../../auth";
import { sendEmail } from "../../main";
const router = Router();
router.post("/account/email/verify", async (req: Request, res: Response) => {
  const user = res.locals.user
  if (!user) {
    return res.status(404).send("Invalid User");
  }
  const token = await generateEmailVerificationToken(user);
  sendEmail("EMAIL_VERIFY", user.email,token);
  return res.send("Email Sent Successfully");
});
export { router };