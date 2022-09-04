import { Router, Request, Response } from "express";
import { NotificationSettings } from "../../common/types";
const router = Router();
// Update User Settings
router.put(
  "/update/settings/notifications",
  async (req: Request, res: Response) => {
    const user = res.locals.user;
    if (!user) {
      res.status(400).send("Invalid User");
    }
    const notifications: NotificationSettings = req.body.notifications;
    if (!notifications) {
      res.status(206).send("Invalid Notification Settings");
    }
    
    user.notifications = notifications;
    await user.save();

    return res.send("OK");
  }
);

export { router };
