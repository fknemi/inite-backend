import { Router, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../../models/user/User";
const router = Router();

router.post(
  "/account/verify/password/token",
  async (req: Request, res: Response) => {
    try {
      const UserId = jwt.decode(req.body.token);
      const user = await User.findById(UserId);
      const token = jwt.verify(
        req.body.token,
        process.env.SECRET_3 + user.password
      );
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return res.status(404).send({ name: err.name });
      }  
      return res.status(404).send(err);
    }
    return res.send("OK");
  }
);
export { router };
