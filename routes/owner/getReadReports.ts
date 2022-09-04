// Report User
import { Router, Request, Response } from "express";
import { Report } from "../../models/report/Report";
const router = Router();
router.get("/get/read/reports", async (req: Request, res: Response) => {
  const allReports = await Report.find().populate("userInfo accountReported");
  const reports: Object[] = [];

  allReports.forEach((report) => {
    if (report.readStatus) {
      try {
        reports.push({
          _id: report._id,
          name: report.userInfo.name,
          reportedBy: report.userInfo.username,
          reason: report.reason,
          description: report.description,
          accountReported: {
            username: report.accountReported
              ? report.accountReported.username
              : report.accountReportedUsername,
          },
          readStatus: report.readStatus,
          timestamp: report.timestamp,
        });
      } catch {
        console.log(
          `Error Getting Report - ID: ${report._id || "No Report ID"}`
        );
      }
    }
  });
  return res.send(reports);
});
export { router };
