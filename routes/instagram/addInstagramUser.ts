// Add Instagram User If Not Present
import { Router, Request, Response } from "express";
import { instagramUser } from "../../models/ig/instagramUser";
import { uploadMedia, logEvent } from "../../main";
const router = Router();
router.post("/user/add", async (req: Request, res: Response) => {
  const user = res.locals.user;
  if (!user) {
    return res.status(400).send("Invalid User");
  }
  let iguser;
  iguser = await instagramUser.findOne({ username: req.body.username });
  if (iguser) {
    return res.status(400).send("Invalid User");
  }
  iguser = new instagramUser({
    name: req.body.name,
    username: req.body.username,
    biography: [{ text: req.body.biography, recent: false }],
    avatars: [
      {
        url: await uploadMedia(
          req.body.avatar,
          `InstagramUsers/${req.body.username}/avatars`
        ),
        recent: false,
      },
    ],
    isPrivate: req.body.isPrivate,
    postsCount: req.body.postsCount,
    followingCount: req.body.followingCount,
    followedByCount: req.body.followedByCount,
  });
  await iguser.save();
  await logEvent(`Added New Instagram of ${req.body.username}`);
  return res.send("Added User");
});

export { router };
