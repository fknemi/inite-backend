import { io } from "../index";
import {
  db,
  getAllInstagramUsers,
  sendBulkEmails,
  updateInstagramUser,
} from "../main";
import { instagramUser } from "../models/ig/instagramUser";
import { User } from "../models/user/User";
import * as jwt from "jsonwebtoken";
import { findUserInDB, getAllUsersInDB } from "../main";
import cloudinary from "cloudinary";

const cron = require("node-cron");

export const updateInstagramUsers = cron.schedule("30 * * * *", async () => {
  const users: any = await instagramUser.find().populate("followedBy.user");
  const usersCurrentData: any = await getAllInstagramUsers(users);
  const allUsersChanges: Object[] = [];
  for (let i = 0; i <= users.length - 1; i++) {
    if (users[i].username === usersCurrentData[i].username) {
      let changedUser = await updateInstagramUser(
        usersCurrentData[i],
        users[i]
      );

      if (changedUser) {
        allUsersChanges.push(changedUser);
      }
    }
  }
  const userEmails: { following: string; email: string }[] = [];
  users.forEach(
    (user: {
      notifyEmail: boolean;
      followedBy: Object[];
      username: string;
    }) => {
      if (user.notifyEmail) {
        return user.followedBy.forEach((followedBy: any) => {
          userEmails.push({
            following: user.username,
            email: followedBy.user.email,
          });
        });
      }
    }
  );

  const allUsers = await User.find().populate("following.instagramUser");

  allUsers.forEach(async (user: any) => {
    let usersNotNotified: Object[] = [];
    let isUserPresent = false;
    const findUser: any = await findUserInDB(user.username);

    let data: Object[] = [];
    let following: string[] = [];
    user.following.forEach((followedUser: any) => {
      following.push(followedUser.instagramUser.username);
    });

    allUsersChanges.forEach((followedUserChanges: any) => {
      if (following.includes(followedUserChanges.username)) {
        data.push(followedUserChanges);
      }
    });

    usersNotNotified.push({
      username: user.username,
      following: following,
      data: data,
    });

    if (!findUser) {
      db.insert(usersNotNotified, (err: any, newDoc: any) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Inserted");
        }
      });
    } else {
      db.update(
        { username: user.username },
        { $set: { data: [...data, ...findUser.data] } }
      );
    }
  });

  const sockets: any[] = await io.fetchSockets();
  sockets.forEach(async (socket: any) => {
    try {
      const token = socket.handshake.auth["x-token"];
      const following: string[] = [];
      let data: Object[] = [];
      const userId: any = jwt.verify(token, process.env.SECRET as string);
      const user: any = await User.findById(userId).populate(
        "following.instagramUser"
      );
      const getUser: any = await findUserInDB(user.username);
      db.remove(
        { username: user.username },
        {},
        (err: any, numRemoved: any) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Removed");
          }
        }
      );
      socket.emit("newChangesAlert", getUser.data);
    } catch (err) {
      console.log(err);

      socket.emit("error", "Authentication Error");
    }
  });
  // To Be Implemented
  sendBulkEmails(userEmails, allUsersChanges);
  console.log("Done");
});

export const deleteCloudinaryTemp = cron.schedule("* * * * *", async () => {
  await cloudinary.v2.api
    .delete_resources_by_prefix("temp")
    .catch((err: any) => {
      console.log(err);
    });
  const deletedFolder = await cloudinary.v2.api
    .delete_folder("temp")
    .catch((err: any) => {
      return false;
    });
  const today = new Date();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  if (deletedFolder) {
    console.log(`[INFO] ${time} - Cloudinary Temp Files Deleted Successfully`);
  }
});
