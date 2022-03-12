import { Router, Request, Response } from "express";
import { getAllInstagramUsers, is_same, updateInstagramUser } from "../../main";
import { instagramUser } from "../../models/ig/instagramUser";
const router = Router();
router.post("/users/update", async (req: Request, res: Response) => {
  const users = await instagramUser.find();
  const usersCurrentData = await getAllInstagramUsers(users);
  for (let i = 0; i <= users.length - 1; i++) {
  let user = users[i];
    let currentUser: any = usersCurrentData[i];
    if (user.username === currentUser.username) {
      await updateInstagramUser(currentUser,user)
    }
  }
console.log('====================================');
console.log(users);
console.log('====================================');


  return res.send("OK");
});
export { router };
