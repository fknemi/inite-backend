import { Router, Request, Response } from "express";
import { deleteInstagramUserMedia } from "../../main";
import { instagramUser } from "../../models/ig/instagramUser";
const router = Router();
router.post(
  "/instagram/user/media/delete",
  async (req: Request, res: Response) => {
    const owner = res.locals.owner;
    const isMediaDeleted = await deleteInstagramUserMedia(
      req.body.username
    ).catch((err: any) => console.log(err));
    if (!isMediaDeleted) {
      return res.status(202).send(
        `Media Deletion of ${req.body.username} was Unsuccessful`
      );
    }
    return res.send("OK");
  }
);
  
export { router };
