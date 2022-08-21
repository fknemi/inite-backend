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
    return res.status(400).send("Invalid Password");
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).send("Passwords do not match");
  }
  user.password = newPassword;
  await user.save();
  return res.status(200).send("Password Updated");
});

export { router };
