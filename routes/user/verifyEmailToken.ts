import { Router, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../../models/user/User";
const router = Router();

router.post(
  "/account/email/verify/token",
  async (req: Request, res: Response) => {
    try {
      const UserId = jwt.verify(req.body.token, process.env.SECRET_4 as string);
      const user: any = await User.findById(UserId);
      if (user.emailVerified) {
        return res.status(400).send();
      }
      user.emailVerified = true;
      await user.save();
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return res.status(404).send({ name: err.name });
      }
      return res.status(404).send({ name: "Invalid Token" });
    }
    return res.send("OK");
  }
);
export { router };
