import { Router, Request, Response } from "express";
import { deleteInstagramUserMedia } from "../../main";
import { instagramUser } from "../../models/ig/instagramUser";
const router = Router();
router.put(
  "/instagram/user/media/delete",
  async (req: Request, res: Response) => {
    try {
      const isMediaDeleted = await deleteInstagramUserMedia(req.body.username);
      if (!isMediaDeleted) {
        return res.status(202).send(`MEDIA DELETION FAILED`);
      }
    } catch {
      return res.status(400).send();
    }
    return res.send("OK");
  }
);

export { router };
