// Reset User Password
import { Router, Request, Response } from "express";
import { sendEmail, generatePassword, logEvent } from "../../main";
import { User } from "../../models/user/User";
const router = Router();
router.post(
  "/user/account/reset/password",
  async (req: Request, res: Response) => {
    const owner = res.locals.owner;
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User Not Found");
    }
    const password = generatePassword();
    user.password = password;
    await user.save();
    if (!(await user.validatePassword(password))) {
      return res.status(304).send("Failed User Password Change");
    }
    sendEmail("PASSWORD_RESET_OWNER", user.email, undefined, password);
    await logEvent(
      `Reset ${user.username} Password By ${owner.userInfo.username}`
    );
    return res.send("OK");
  }
);

export { router };
