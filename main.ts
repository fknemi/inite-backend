const lsp = require("looks-same-plus");
import cloudinary from "cloudinary";
import { Log } from "./models/log/Log";
const shortUniqueId = require("short-unique-id");
const { getUserByUsername } = require("instagram-stories");
const uid = new shortUniqueId();
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
let Datastore = require("nedb");
export let db = new Datastore({
  filename: "users.db",
  autoload: true,
  unique: true,
});
// ---------------------- Image Comparison -----------------------------------
export const is_same = async (img1: string, img2: string) => {
  return new Promise((resolve, reject) => {
    return lsp(img1, img2, (error: string, { equal }: any) => {
      if (error) {
        return reject(error);
      }
      return resolve(equal);
    });
  });
};

// ---------------------- Cloudinary Upload -----------------------------------

export const uploadMedia = (url: string, username: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      url,
      { public_id: uid.stamp(32), folder: `${username}` },
      (err: any, res: any) => {
        if (err) return reject(err);
        return resolve(res.secure_url);
      }
    );
  });
};

export const deleteInstagramUserMedia = async (username: string) => {
  await cloudinary.v2.api
    .delete_resources_by_prefix(`InstagramUsers/${username}`)
    .catch((err: any) => {
      return false;
    });
  const deletedFolder = await cloudinary.v2.api
    .delete_folder(`InstagramUsers/${username}`)
    .catch((err: any) => {
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
  await cloudinary.v2.api
    .delete_resources_by_prefix(folderPath)
    .catch((err: any) => {
      return false;
    });
  const deletedFolder = await cloudinary.v2.api
    .delete_folder(folderPath)
    .catch((err: any) => {
      return false;
    });
  if (deletedFolder) {
    return true;
  }
  return false;
};

export const logEvent = async (text: string) => {
  const log: any = new Log({
    text: text,
  });
  await log.save();
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
    console.log(`http://localhost:3000/account/verify/password/${token}`);
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
  let avatar;
  if (!user.recentlyAdded) {
    for (let i = 0; i <= user.biography.length - 1; i++) {
      if (user.biography[i].recent) {
        biography = user.biography[i].text;
        break;
      }
    }
    for (let i = 0; i <= user.avatars.length - 1; i++) {
      if (user.avatars[i].recent) {
        avatar = user.avatars[i].url;
        break;
      }
    }
  } else {
    biography = user.biography[0].text;
    avatar = user.avatars[0].url;
  }

  let changedUser = {
    username: user.username,
    name: {
      didChange: false,
      newValue: "",
      oldValue: "",
    },
    biography: {
      didChange: false,
      newValue: "",
      oldValue: "",
    },
    avatar: {
      didChange: false,
      newValue: "",
      oldValue: "",
    },
    isPrivate: {
      didChange: false,
      newValue: "",
      oldValue: "",
    },
    followedByCount: {
      didChange: false,
      newValue: "",
      oldValue: "",
    },
    followingCount: {
      didChange: false,
      newValue: "",
      oldValue: "",
    },
    postsCount: {
      didChange: false,
      newValue: "",
      oldValue: "",
    },
  };
  let is_diff;
  if (avatar && currentUser.avatar) {
    is_diff = await is_same(currentUser.avatar, avatar).catch((err: any) => {
      return false;
    });
  } else {
    is_diff = false;
  }
  if (!is_diff) {
    changedUser.avatar = {
      didChange: true,
      oldValue: currentUser.avatar,
      newValue: user.avatar,
    };
  }
  if (user.username === currentUser.username) {
    if (user.name !== currentUser.name) {
      changedUser.name = {
        didChange: true,
        oldValue: currentUser.name,
        newValue: user.name,
      };
    }
    if (biography !== currentUser.biography) {
      changedUser.biography = {
        didChange: true,
        oldValue: currentUser.biography,
        newValue: user.biography,
      };
    }
    if (user.isPrivate !== currentUser.isPrivate) {
      changedUser.isPrivate = {
        didChange: true,
        oldValue: currentUser.isPrivate,
        newValue: user.isPrivate,
      };
    }
    if (user.followedByCount !== currentUser.followedByCount) {
      changedUser.followedByCount = {
        didChange: true,
        oldValue: currentUser.followedByCount,
        newValue: user.followedByCount,
      };
    }
    if (user.followingCount !== currentUser.followingCount) {
      changedUser.followingCount = {
        didChange: true,
        oldValue: currentUser.followingCount,
        newValue: user.followingCount,
      };
    }
    if (user.postsCount !== currentUser.postsCount) {
      changedUser.postsCount = {
        didChange: true,
        oldValue: currentUser.postsCount,
        newValue: user.postsCount,
      };
    }
  }
  return changedUser;
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

    currentUsersData.push({
      name: data.user.full_name ? data.user.full_name : "",
      username: username,
      biography: data.user.biography ? data.user.biography : "",
      avatar: data.user.profile_pic_url_hd,
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
  return new Promise((resolve, reject) => {
    db.find({}, (err: string, docs: Object[]) => {
      if (err) {
        return reject(err);
      }
      return resolve(docs);
    });
  });
};

export const findUserInDB = async (username: string) => {
  return new Promise((resolve, reject) => {
    db.findOne({ username: username }, (err: string, docs: Object[]) => {
      if (err) {
        return reject(false);
      }
      return resolve(docs);
    });
  });
};
