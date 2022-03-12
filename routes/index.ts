import { Router } from "express";
import { router as addInstagramUser } from "./instagram/addInstagramUser";
import { router as banInstagramUser } from "./admin/banInstagramUser";
import { router as getInstagramUserData } from "./instagram/getInstagramUserData";
import { router as getInstagramUserRecent } from "./instagram/getInstagramUserRecent";
import { router as updateAllInstagramUsers } from "./instagram/updateAllInstagramUsers";
import { router as updateInstagramUserMedia } from "./instagram/updateInstagramUserMedia";
import { router as addUser } from "./user/addUser";
import { router as loginUser } from "./user/loginUser";
import { router as addAdmin } from "./owner/addAdmin";
import { router as removeAdmin } from "./owner/removeAdmin";
import { router as deleteUser } from "./owner/deleteUser";
import { router as deleteUserMedia } from "./owner/deleteUserMedia";
import { router as banUser } from "./admin/banUser";
import { router as unbanUser } from "./admin/unbanUser";
import { router as getUserData } from "./user/getUserData";
import { router as updateUser } from "./user/updateUser";
import { router as resetPassword } from "./user/resetPassword";
import { router as resetPasswordToken } from "./user/verifyPasswordToken";
import { router as followInstagramUser } from "./user/followInstagramUser";
import { router as unfollowInstagramUser } from "./user/unfollowInstagramUser";
import { router as forgotUserPassword } from "./user/forgotPassword";
import { router as verifyEmailToken } from "./user/verifyEmailToken";
import { router as verifyUserEmail } from "./user/verifyUserEmail";
import { router as deleteInstagramUserMedia } from "./owner/deleteInstagramUserMedia";
import { router as deleteInstagramUser } from "./owner/deleteInstagramUser";
import { router as reportUser } from "./user/reportUser";
import { router as readReports } from "./admin/readReports";
import { router as getReports } from "./admin/getReports";
import { router as getLogs } from "./owner/getLogs";
import { router as unbanInstagramUser } from "./admin/unbanInstagramUser";
import { router as resetUserPassword } from "./owner/resetUserPassword";
import {router as adminLogin} from "./admin/adminLogin"
import {router as getAdminData} from "./admin/getAdminData"
import {router as getInstagramUserAvatars} from "./instagram/getInstagramUserAvatars"
import {router as getInstagramUserDetails} from "./owner/getInstagramUserDetails"
import {router as getUserDetails} from "./owner/getUserDetails"
// import { router as addOwner } from "./owner/addOwner";
const router = Router();
const admin = Router();
const owner = Router();
const instagram = Router();

// User
router.use(forgotUserPassword);
router.use(addUser);
router.use(loginUser);
router.use(getUserData);
router.use(updateUser);
router.use(followInstagramUser);
router.use(unfollowInstagramUser);
router.use(resetPassword);
router.use(resetPasswordToken);
router.use(verifyEmailToken);
router.use(verifyUserEmail);
router.use(reportUser);

// Instagram
instagram.use(updateInstagramUserMedia);
instagram.use(updateAllInstagramUsers);
instagram.use(addInstagramUser);
instagram.use(getInstagramUserData);
instagram.use(getInstagramUserRecent);
instagram.use(getInstagramUserAvatars);

// Owner
owner.use(addAdmin);
owner.use(removeAdmin);
owner.use(deleteUser);
owner.use(deleteUserMedia);
owner.use(deleteInstagramUserMedia);
owner.use(deleteInstagramUser);
owner.use(resetUserPassword);
owner.use(getLogs);
owner.use(getInstagramUserDetails)
owner.use(getUserDetails)
// owner.use(addOwner);

// Admin
admin.use(banUser);
admin.use(unbanUser);
admin.use(banInstagramUser);
admin.use(getReports);
admin.use(readReports);
admin.use(unbanInstagramUser);
admin.use(adminLogin)
admin.use(getAdminData)
export { router, admin, owner, instagram };
