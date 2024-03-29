// Report User
import { Router, Request, Response } from "express";
import { Report } from "../../models/report/Report";
const router = Router();
router.put("/read/reports/", async (req: Request, res: Response) => {
  req.body.readReports.forEach(async (reportId: any) => {
    let report: any = await Report.findOne({ _id: reportId });
    if (report && !report.readStatus) {
      report.readStatus = true;
      await report.save();
    }
  });

  return res.send("OK");
});
export { router };
