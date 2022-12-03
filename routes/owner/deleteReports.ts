// Report User
import { Router, Request, Response } from "express";
import { Report } from "../../models/report/Report";
const router = Router();
router.put("/delete/reports/", async (req: Request, res: Response) => {
  req.body.deleteReports.forEach(async (reportId: string) => {
    let report: any = await Report.findOne({ _id: reportId });
    if (report.readStatus) {
      await Report.deleteOne({ _id: reportId });
      console.log("Deleted Report - ID: " + reportId);
    }
    console.log("Not Read Report - ID: " + reportId);
  });

  return res.send("OK");
});
export { router };
