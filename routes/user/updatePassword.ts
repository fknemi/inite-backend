import { Router, Request, Response } from "express";
const router = Router();
// Update User
router.post("/update/password", async (req: Request, res: Response) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = res.locals.user;
  if (!user) {
    return res.status(400).send("Invalid User");
  }
  const checkOldPassword = await user.validatePassword(oldPassword);
  if (!checkOldPassword) {
    return res.status(400).send("InvalidPassword");
  }
  if (oldPassword === newPassword) {
    return res.status(400).send("SamePassword");
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).send("PasswordsDoNotMatch");
  }
  user.password = newPassword;
  await user.save();
  return res.send("OK");
});

export { router };
