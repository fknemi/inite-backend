import { Router, Request, Response } from "express";
import { logEvent } from "../../main";
import { instagramUser } from "../../models/ig/instagramUser";
import { Report } from "../../models/report/Report";
const router = Router();
// Report User
router.put("/report/", async (req: Request, res: Response) => {
  const user = res.locals.user;
  if (!user) {
    return res.status(200).send("Invalid User");
  }
  const reportedUser = await instagramUser.findOne({
    username: req.body.accountReported.username,
  });

  const report = new Report({
    userInfo: user._id,
    reason: req.body.reason,
    description: req.body.description,
    accountReported: reportedUser ? reportedUser._id : null,
    accountReportedUsername: reportedUser
      ? null
      : req.body.accountReported.username,
  });
  await report.save();
  await logEvent(
    `${req.body.accountReported.username} has been reported by ${user.username}`
  );
  return res.send("OK");
});
export { router };
