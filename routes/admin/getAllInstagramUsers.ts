// Get All Instagram Users
import { Router, Request, Response } from "express";
import { instagramUser } from "../../models/ig/instagramUser";
const router = Router();
router.get("/instagram/get/users", async (req: Request, res: Response) => {
  const users = await instagramUser.find();
  const usersData: {
    username: string;
    name: string;
    avatar: string;
    timestamp: string;
    isBanned: boolean;
  }[] = [];
  if (!users) {
    return res.status(404).send("Users Not Found");
  }
  users.forEach((user: any) => {
    let avatar: string = "";

    if (!user.recentlyAdded) {
      for (let i = 0; i <= user.avatars.length - 1; i++) {
        if (user.avatars[i].recent) {
          avatar = user.avatars[i].url;
          break;
        }
      }
    } else {
      avatar = user.avatars[0].url;
    }

    usersData.push({
      username: user.username,
      name: user.name,
      avatar: avatar,
      timestamp: user.timestamp,
      isBanned: user.isBanned,
    });
  });

  return res.send(usersData);
});

export { router };
