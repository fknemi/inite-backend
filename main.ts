const data = require("./config.json")
const lsp = require("looks-same-plus");
import cloudinary from "cloudinary";
import { Log } from "./models/log/Log";
const shortUniqueId = require("short-unique-id");
const { getUserByUsername } = require("instagram-stories");
const uid = new shortUniqueId();
cloudinary.v2.config({
  cloud_name: data.cloud_name,
  api_key: data.api_key,
  api_secret: data.api_secret,
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
  } else if(type === "PASSWORD_RESET"){
    console.log(`http://localhost:3000/account/verify/password/${token}`);
  }
  else {
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
  console.log(currentUser.followingCount);
  let biography: any;
  let avatar: any;
  let updateBiography = Boolean(user.biography.length);
  let updateAvatars = Boolean(user.avatars.length);
  if (updateBiography) {
    for (let i = 0; i <= user.biography.length - 1; i++) {
      if (user.biography[i].recent || user.recentlyAdded) {
        biography = user.biography[i].text;
        break;
      }
    }
  }
  if (updateAvatars) {
    for (let i = 0; i <= user.avatars.length - 1; i++) {
      if (user.avatars[i].recent || user.recentlyAdded) {
        avatar = user.avatars[i].url;
        break;
      }
    }
  }

  if (biography !== currentUser.biography) {
    if (updateBiography) {
      for (let s = 0; s <= user.biography.length - 1; s++) {
        let item = user.biography[s];
        item["recent"] = false;
      }
    }
    user.biography.push({ text: currentUser.biography });
  }

  const is_diff: any = updateAvatars
    ? await is_same(avatar, currentUser.avatar).catch((err: string) =>
        console.log(err)
      )
    : false;
  if (!is_diff) {
    avatar = await uploadMedia(
      currentUser.avatar,
      `InstagramUsers/${user.username}/avatars`
    );

    if (updateAvatars) {
      for (let i = 0; i <= user.avatars.length - 1; i++) {
        let item = user.avatars[i];
        item["recent"] = false;
      }
    }
    user.avatars.push({ url: avatar });
  }
  if (user.name !== currentUser.name) {
    user.name = currentUser.name;
  }
  if (user.isPrivate !== currentUser.isPrivate) {
    user.isPrivate = currentUser.isPrivate;
  }
  if (user.followedByCount !== currentUser.followedByCount) {
    user.followedByCount = currentUser.followedByCount;
  }
  if (user.followingCount !== currentUser.followingCount) {
    user.followingCount = currentUser.followingCount;
  }
  if (user.postsCount !== currentUser.postsCount) {
    user.postsCount = currentUser.postsCount;
  }
  if (user.recentlyAdded) {
    user.recentlyAdded = false;
  }
};

export const getAllInstagramUsers = async (users: any) => {
  const currentUsersData: Object[] = [];
  users.forEach(async (user: any) => {
    let data = await getUserByUsername({
      username: user.username,
      userid: process.env.USER_ID,
      sessionid: process.env.SESSION_ID,
    });
    currentUsersData.push({
      name: data.user.full_name,
      username: data.user.username,
      biography: data.user.biography,
      avatar: data.user.profile_pic_url_hd,
      isPrivate: data.user.is_private,
      followedByCount: data.user.edge_followed_by.count,
      followingCount: data.user.edge_follow.count,
      postsCount: data.user.edge_owner_to_timeline_media.count,
    });
  });
  return currentUsersData;
};
