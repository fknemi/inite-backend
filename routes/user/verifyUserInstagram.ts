// verify Instagram User
import { Router, Request, Response } from "express";
const router = Router();
router.post("/user/verify/instagram", async (req: Request, res: Response) => {
  return res.send("monkey");
});
export { router };
