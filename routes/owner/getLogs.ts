// get Logs
import { Router, Request, Response } from "express";
import { Log } from "../../models/log/Log";
const router = Router();
router.post("/get/logs", async (req: Request, res: Response) => {
  const allLogs = await Log.find()
  const logs: Object[] = [];
  allLogs.forEach((log) => {
    logs.push({
      _id: log._id,
      text: log.text,
      timestamp: log.timestamp,
    });
  });
  return res.send(logs);
});
export { router };
