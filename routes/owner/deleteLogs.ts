// Report User
import { Router, Request, Response } from "express";
import { Report } from "../../models/report/Report";
import { Log } from "../../models/log/Log";
const router = Router();
router.put("/delete/logs/", async (req: Request, res: Response) => {
  req.body.deleteLogs.forEach(async (logId: string) => {
    if (!logId) {
      return;
    }
    await Log.findOneAndDelete({ _id: logId });
    console.log("Deleted Log - ID: " + logId);
  });

  return res.send("OK");
});
export { router };
