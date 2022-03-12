import { Admin } from "./models/admin/Admin";
import { Owner } from './models/owner/Owner';


export const checkAdmin = async (user: any) => {
  const data = await Admin.findOne({ userInfo: { _id: user._id } }).populate({
    path: "userInfo",
    select: "_id",
  });
  if (!data) {
    return false;
  }
  if (!data.isAdmin) {
    return false;
  }
  return true;
};


export const checkOwner = async (user: any) => {
    const data = await Owner.findOne({ userInfo: { _id: user._id } }).populate({
      path: "userInfo",
      select: "_id",
    });
    if (!data) {
      return false;
    }
    if (!data.isOwner) {
      return false;
    }
    return true;
  };
  