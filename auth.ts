import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { models, HydratedDocument } from "mongoose";
import { User } from "./models/user/User";
import { Owner } from "./models/owner/Owner";
import { Admin } from "./models/admin/Admin";

export const generateTokens = async (user: any, refreshSecret: string) => {
  const token = jwt.sign({ _id: user._id }, process.env.SECRET as any, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ _id: user._id }, refreshSecret, {
    expiresIn: "7d",
  });
  return { token, refreshToken };
};

export const refreshTokens = async (token: string, refreshToken: string) => {
  let userId;
  try {
    userId = jwt.decode(refreshToken);
  } catch (err) {
    return err;
  }
  if (!userId) {
    return {};
  }
  const user: any = await models.User.findById(userId);
  if (!user) {
    return {};
  }
  const refreshSecret = process.env.SECRET_2 + user.password;
  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  const newTokens: any = await generateTokens(user, refreshSecret);
  return {
    token: newTokens.token,
    refreshtoken: newTokens.refreshToken,
    user: user,
  };
};

export const generatePasswordResetToken = async (user: any) => {
  const passwordResetSecret = process.env.SECRET_3 + user.password;
  return jwt.sign({ _id: user._id }, passwordResetSecret, {
    expiresIn: "2h",
  });
};
export const generateEmailVerificationToken = async (user: any) => {
  return jwt.sign({ _id: user._id }, process.env.SECRET_4 as string, {
    expiresIn: "24h",
  });
};

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: any = req.headers["x-token"];
  if (token) {
    try {
      const userId: string | jwt.JwtPayload = jwt.verify(
        token,
        process.env.SECRET as string
      );
      const user = await User.findById(userId);
      res.locals.user = user;
    } catch (err: any) {
      const refreshToken: any = req.headers["x-refresh-token"];
      const newTokens: any = await refreshTokens(token, refreshToken);
      if (newTokens.token && newTokens.refreshtoken) {
        res.set({
          "x-token": newTokens.token,
          "x-refresh-token": newTokens.refreshtoken,
          "Access-Control-Expose-Headers": "*",
        });
      }
      res.locals.user = newTokens.user;
    }
  }
  next();
};
export const checkAdmin = async (req: any, res: any, next: NextFunction) => {
  const user = res.locals.user;
  if (!user) {
    return res.status(404).send("Invalid User");
  }
  const admin = await Admin.findOne({ userInfo: user._id }).populate(
    "userInfo"
  );
  if (!admin) {
    return res.status(401).send("Unauthorized User");
  }
  const owner = await Owner.findOne({ userInfo: user._id });
  if (owner && owner.isOwner && owner.isAdmin) {
    res.locals.owner = owner;
  }
  res.locals.admin = admin;
  next();
};
export const checkOwner = async (req: any, res: any, next: NextFunction) => {
  const user = res.locals.user;
  if (!user) {
    return res.status(404).send("Invalid User");
  }
  const owner = await Owner.findOne({ userInfo: user._id }).populate(
    "userInfo"
  );
  // if (!owner) {
  //   return res.status(401).send("Unauthorized User");
  // }
  res.locals.owner = owner;
  next();
};
