import { Router, Request, Response } from "express";
const router = Router()
// Update User
router.post("/user/update/", (req: Request, res: Response) => {    
    return res.send("update")
})
export {router}