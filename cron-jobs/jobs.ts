import { io } from "../index";
import {
  findUserInDB,
  getAllInstagramUsers,
  logger,
  updateInstagramUser,
  usersDB,
} from "../main";
import { instagramUser } from "../models/ig/instagramUser";
import { User } from "../models/user/User";
import * as jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import cron from "node-cron";
const shortUniqueId = require("short-unique-id");


export const updateInstagramUsers = cron.schedule("*/30 * * * *", async () => {
  logger.info("Updating Instagram Users");
  let users: any;
  try {
    users = await instagramUser.find().populate("followedBy.user");
  } catch (e) {
    logger.error(e);
  }
  let usersCurrentData: any;
  try {
    usersCurrentData = await getAllInstagramUsers(users);
  } catch (e) {
    logger.error(e);
  }

  const allUsersChanges: Object[] = [];

  for (let i = 0; i <= users.length - 1; i++) {
    if (users[i].username === usersCurrentData[i].username) {
      let changedUser = await updateInstagramUser(
        usersCurrentData[i],
        users[i]
      );
      if (Object.keys(changedUser).length > 0) {
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
    let usersNotNotified: {
      username: string;
      following: string[];
      data: Object[];
      timestamp: number;
    }[] = [];
    const findUser: any = await findUserInDB(user.username);

    let data: {
      username: string;
      following: string[];
      data: Object[];
      timestamp: number;
    }[] = [];
    let following: string[] = [];
    user.following.forEach((followedUser: any) => {
      following.push(followedUser.instagramUser.username);
    });

    allUsersChanges.forEach((followedUserChanges: any) => {
      if (following.includes(followedUserChanges.username)) {
        data.push(followedUserChanges);
      }
    });
    if (!data.length) {
      return;
    }

    usersNotNotified.push({
      username: user.username,
      following: following,
      data: data,
      timestamp: new Date().getTime(),
    });

    if (!findUser) {
      usersDB.insertOne({
        usersNotNotified,
      });
    } else {
      usersDB.updateWhere(
        (data) => {
          return data.username === user.username;
        },
        (data) => {
          data.data = [...data, ...findUser.data];
        }
      );
    }
  });

  const sockets: any[] = await io.fetchSockets();
  sockets.forEach(async (socket: any) => {
    try {
      const token = socket.handshake.auth["x-token"];
      const userId: string | jwt.JwtPayload = jwt.verify(
        token,
        process.env.SECRET as string
      );
      const user: any = await User.findById(userId).populate(
        "following.instagramUser"
      );
      const getUser = await findUserInDB(user.username);

      socket.emit("notifications", getUser);
      socket.on("status", (status: string) => {
        if (parseInt(status) === 200) {
          usersDB.findAndRemove({
            username: user.username,
          });
        } else {
          socket.emit("notifications", getUser);
        }
      });
    } catch (err) {
      socket.emit("error", "Authentication Error");
    }
  });
  // To Be Implemented
  // sendBulkEmails(userEmails, allUsersChanges);
  console.log("Done");
});

export const deleteCloudinaryTemp = cron.schedule("0 0 * * 0", async () => {
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
