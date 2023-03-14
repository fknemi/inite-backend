import cloudinary, {
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import { Log } from "./models/log/Log";
const shortUniqueId = require("short-unique-id");
const { getUserByUsername } = require("instagram-stories");
import { NOTIFICATION_CHANGED_USER } from "./@types/types";
import { User } from "./models/user/User";
import { Owner } from "./models/owner/Owner";
import { Admin } from "./models/admin/Admin";
import pixelMatch from "pixelmatch";
import pixels from "image-pixels";
import winston, { createLogger } from "winston";
import { instagramUser } from "./models/ig/instagramUser";
import loki from "lokijs";

let colorRegex = /\\u001b\[\d+m/g,
  doubleQuotesRegex = /"/g;

const combine = winston.format.combine(
  winston.format.timestamp(),
  winston.format.colorize({
    level: true,
    colors: {
      error: "red",
      warn: "yellow",
      info: "green",
      debug: "blue",
      silly: "magenta",
    },
  }),
  winston.format.printf((info) => {
    let level = JSON.stringify(info.level)
      .replace(colorRegex, "")
      .replace(doubleQuotesRegex, "");
    level = info.level
      .replace(level, "text")
      .replace("text", level.toUpperCase());
    return `${info.timestamp} [${level}]: ${info.message}`;
  })
);

export const logger = createLogger({
  format: combine,
  transports: [new winston.transports.Console()],
});

const uid = new shortUniqueId();
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
export let db = new loki("users.db", {
  autoload: true,
  autosave: true,
  autosaveInterval: 4000,
  persistenceMethod: "fs",
});
db.addCollection("users");
export let usersDB = db.getCollection("users");

// ---------------------- Image Comparison -----------------------------------
export const isImageSame = async (img1: string, img2: string) => {
  let image_1 = await pixels(img1);
  let image_2 = await pixels(img2);
  return (
    pixelMatch(
      image_1.data,
      image_2.data,
      null,
      image_1.width,
      image_1.height,
      {
        threshold: 0.1,
      }
    ) < 5000
  );
};

// ---------------------- Cloudinary Upload -----------------------------------

export const uploadMedia = (url: string, username: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      url,
      {
        public_id: uid.stamp(32) as string | undefined,
        folder: `${username}` as string | undefined,
      },
      (
        err: UploadApiErrorResponse | undefined,
        res: UploadApiResponse | undefined
      ) => {
        if (err) return reject(err);
        if (!res) return reject(new Error("No Valid Response"));
        return resolve(res.secure_url);
      }
    );
  });
};

export const deleteInstagramUserMedia = async (username: string) => {
  await cloudinary.v2.api
    .delete_resources_by_prefix(`InstagramUsers/${username}`)
    .catch(() => {
      return false;
    });
  const deletedFolder = await cloudinary.v2.api
    .delete_folder(`InstagramUsers/${username}`)
    .catch(() => {
      return false;
    });
  if (deletedFolder) {
    return true;
  }
  return false;
};

export const deleteUserMedia = async (
  username: string,
  onlyMedia: boolean = false
) => {
  const folderPath = onlyMedia
    ? `Users/${username}/media`
    : `Users/${username}`;
  await cloudinary.v2.api.delete_resources_by_prefix(folderPath).catch(() => {
    return false;
  });
  const deletedFolder = await cloudinary.v2.api
    .delete_folder(folderPath)
    .catch(() => {
      return false;
    });
  if (deletedFolder) {
    return true;
  }
  return false;
};

export const logEvent = async (text: string) => {
  // const log = new Log({
  //   text: text,
  // });
  // await log.save();
};

export const sendEmail = async (
  type: string,
  email: string,
  token?: string,
  password?: string
) => {
  if (type === "PASSWORD_RESET_OWNER") {
    console.log(password);
  } else if (type === "PASSWORD_RESET") {
    console.log(`http://localhost:3000/account/update/password/${token}`);
  } else {
    console.log(`http://localhost:3000/account/verify/email/${token}`);
  }
  return true;
};

export const generatePassword = () => {
  let length = Math.floor(Math.random() * (32 - 7 + 1) + 10);
  let characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0, n = characters.length; i < length; ++i) {
    password += characters.charAt(Math.floor(Math.random() * n));
  }
  return password;
};

export const updateInstagramUser = async (currentUser: any, user: any) => {
  let biography;
  let avatar: any;
  if (!user.recentlyAdded) {
    for (let i = 0; i <= user.biography.length - 1; i++) {
      if (user.biography[i] && user.biography[i].recent) {
        biography = user.biography[i].text;
        break;
      }
    }
    for (let i = 0; i <= user.avatars.length - 1; i++) {
      if (user.avatars[i] && user.avatars[i].recent) {
        avatar = user.avatars[i].url;
        break;
      }
    }
  } else {
    biography = user.biography[0].text;
    avatar = user.avatars[0].url;
  }

  let changedUser: NOTIFICATION_CHANGED_USER = {
    type: "CHANGED_USER",
    username: user.username,
    name: undefined,
    biography: undefined,
    avatar: undefined,
    isPrivate: undefined,
    followedByCount: undefined,
    followingCount: undefined,
    postsCount: undefined,
    timestamp: new Date().getTime(),
    id: uid.stamp(32),
  };
  let isDiff: boolean = true;
  if (avatar && currentUser.avatar) {
    try {
      isDiff = await isImageSame(currentUser.avatar, avatar);
    } catch (e) {
      logger.error(e);
      isDiff = false;
    }
  }

  if (!isDiff) {
    avatar = await uploadMedia(
      currentUser.avatar,
      `InstagramUsers/${user.username}/avatars`
    );

    changedUser.avatar = {
      didChange: true,
      oldValue: user.avatar,
      newValue: avatar,
    };

    for (let i = 0; i <= user.avatars.length - 1; i++) {
      if (user.avatars[i].recent) {
        user.avatars[i].recent = false;
      }
    }
    user.avatars.push({
      url: avatar,
    });
  }
  if (user.username === currentUser.username) {
    if (user.name !== currentUser.name) {
      changedUser.name = {
        didChange: true,
        oldValue: currentUser.name,
        newValue: user.name,
      };
      user.name = currentUser.name;
    }
    if (biography !== currentUser.biography) {
      changedUser.biography = {
        didChange: true,
        oldValue: currentUser.biography,
        newValue: user.biography,
      };

      for (let i = 0; i <= user.biography.length - 1; i++) {
        if (user.biography[i].recent) {
          user.biography[i].recent = false;
        }
      }
      user.biography.push({
        text: currentUser.biography,
      });
    }
    if (user.isPrivate !== currentUser.isPrivate) {
      changedUser.isPrivate = {
        didChange: true,
        oldValue: currentUser.isPrivate,
        newValue: user.isPrivate,
      };
      user.isPrivate = currentUser.isPrivate;
    }
    if (user.followedByCount !== currentUser.followedByCount) {
      changedUser.followedByCount = {
        didChange: true,
        oldValue: currentUser.followedByCount,
        newValue: user.followedByCount,
      };
      user.followedByCount = currentUser.followedByCount;
    }
    if (user.followingCount !== currentUser.followingCount) {
      changedUser.followingCount = {
        didChange: true,
        oldValue: currentUser.followingCount,
        newValue: user.followingCount,
      };
      user.followingCount = currentUser.followingCount;
    }
    if (user.postsCount !== currentUser.postsCount) {
      changedUser.postsCount = {
        didChange: true,
        oldValue: currentUser.postsCount,
        newValue: user.postsCount,
      };
      user.postsCount = currentUser.postsCount;
    }
  }
  if (
    changedUser.name?.didChange ||
    changedUser.biography?.didChange ||
    changedUser.avatar?.didChange ||
    changedUser.isPrivate?.didChange ||
    changedUser.followedByCount?.didChange ||
    changedUser.followingCount?.didChange ||
    changedUser.postsCount?.didChange
  ) {
    try {
      if (user.recentlyAdded) {
        user.recentlyAdded = false;
      }
      await instagramUser.updateOne({ _id: user._id }, user);
    } catch (e) {
      logger.error(e);
    }
    return changedUser;
  }
  return {};
};

export const getAllInstagramUsers = async (users: any) => {
  const currentUsersData: any = [];
  for (let i = 0; i <= users.length - 1; i++) {
    let username = users[i].username;
    let data = await getUserByUsername({
      username: username,
      userid: process.env.USER_ID,
      sessionid: process.env.SESSION_ID,
    });

    let avatar = await uploadMedia(
      data.user.profile_pic_url_hd,
      `temp/${username}`
    );
    currentUsersData.push({
      name: data.user.full_name ? data.user.full_name : "",
      username: username,
      biography: data.user.biography ? data.user.biography : "",
      avatar: avatar,
      isPrivate: data.user.is_private,
      followedByCount: data.user.edge_followed_by.count,
      followingCount: data.user.edge_follow.count,
      postsCount: data.user.edge_owner_to_timeline_media.count,
    });
  }
  return currentUsersData;
};

export const sendBulkEmails = async (
  userEmails: Object[],
  allUsersChanges: Object[]
) => {
  console.log(userEmails);
  console.log(allUsersChanges);
};

export const getAllUsersInDB = async () => {
  return usersDB.data;
};

export const findUserInDB = async (username: string) => {
  try {
    return usersDB.findOne({
      username: username,
    });
  } catch {
    return null;
  }
};

export const createDefaultUser = async () => {
  const DEFAULT_USER = new User({
    name: "Owner",
    username: "owner",
    password: "1234",
    email: process.env.DEFAULT_USER_OWNER_EMAIL,
    gender: "_",
    avatar: process.env.DEFAULT_AVATAR_1,
    emailVerified: false,
    roles: {
      isAdmin: true,
      isOwner: true,
    },
  });
  const DEFAULT_ADMIN = new Admin({
    userInfo: DEFAULT_USER._id,
    isAdmin: true,
  });
  const DEFAULT_OWNER = new Owner({
    userInfo: DEFAULT_USER._id,
    isAdmin: true,
  });

  try {
    await DEFAULT_USER.save();
    await DEFAULT_ADMIN.save();
    await DEFAULT_OWNER.save();

    logger.info("Default user created");
  } catch (err) {
    if ((err as { code: number }).code === 11000) {
      logger.warn("Default user already exists");
    }
  }
};
