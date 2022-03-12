import { Router, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../../models/user/User";
const router = Router();

router.post("/account/reset/password", async (req: Request, res: Response) => {
  const userId = jwt.decode(req.body.token);
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).send("Invalid User");
  }
  const newPassword = req.body.password;
  if (!newPassword) {
    return res
      .status(400)
      .send({ name: "NewPasswordRequired", message: "New password is missing" });
  }

  if (await user.validatePassword(newPassword)) {
    return res.status(400).send({
      name: "SamePassword",
      message: "New password cannot be the same as your old password",
    });
  }
  user.password = req.body.password;
  await user.save();
  return res.send("Password Has Been Reset Successfully");
});
export { router };
