// Update Instagram Specific User Media
import { Router, Request, Response } from "express";
import { uploadMedia } from "../../main";
import { instagramUser } from "../../models/ig/instagramUser";
const router = Router();
router.post("/update/user/media", async (req: Request, res: Response) => {
  let user: any = await instagramUser
    .findOneAndUpdate(
      { username: req.body.username },
      {
        $push: {
          media: {
            type: req.body.media.type,
            url: await uploadMedia(req.body.media.url, `${req.body.username}/media`),
          },
        },
      }
    )
    if(!user){
      return res.status(404).send({error: "Something Weird Happened..."});
    }
  return res.send(user);
});
export { router };






























































































































































// // Update Instagram Specific User Media Ignore For Now
// import { Router, Request, Response } from "express";
// import { uploadMedia } from "../../main";
// import { instagramUser } from "../../models/ig/instagramUser";
// const router = Router();
// router.post("/ig/update/media", async (req: Request, res: Response) => {
//   let user: any = await instagramUser
//     .findOneAndUpdate(
//       { username: req.body.username },
//       {
//         $push: {
//           media: {
//             type: req.body.media.type,
//             url: await uploadMedia(req.body.media.url, `${req.body.username}/media`),
//           },
//         },
//       }
//     )
//     .catch((err: string) => {
//       console.log(err);
//     });
//     if(!user){
//       return res.status(404).send({error: "Something Weird Happened..."});
//     }
//   return res.send(user);
// });
// export { router };
