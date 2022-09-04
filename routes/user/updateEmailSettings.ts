import { Router, Request, Response } from "express";
const router = Router();

router.put("/update/email/settings", async (req: Request, res: Response) => {
  const user = res.locals.user;
  let notifyEmail = req.body.notifyEmail;
  if (!user) {
    res.status(400).send("Invalid User");
  }

  if (!JSON.stringify(notifyEmail)) {
    res.status(206).send("Invalid Email Settings");
  }

  user.notifyEmail = notifyEmail;
  await user.save();
  return res.send("OK");
});
export { router };
