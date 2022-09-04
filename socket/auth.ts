import { NextFunction } from "express";
import { Socket } from "socket.io";
import * as jwt from "jsonwebtoken";
import { Owner } from "../models/owner/Owner";
import { User } from "../models/user/User";

export const socket_checkUser = (socket: Socket, next: any) => {
  let userId;
  let user;
  try {
    userId = jwt.verify(
      socket.handshake.auth["x-token"],
      process.env.SECRET as string
    );
    user = User.findById(userId);
  } catch (err) {
    socket.emit("error", "Authentication Error");
    return socket.disconnect();
  }
  if (!userId) {
    socket.emit("error", "Authentication Error");
    return socket.disconnect();
  }
  (socket as Socket & { userId: string | jwt.JwtPayload }).userId = userId;
  next();
};

export const socket_checkOwner = async (socket: Socket, userId: string) => {
  try {
    const isOwner = await Owner.findOne({ userInfo: userId });

    if (!isOwner) {
      socket.emit("error", "Unauthorized User");
      return ((socket as Socket & { isOwner: boolean }).isOwner = false);
    }
  } catch {
    socket.emit("error", "Unauthorized User");
    return ((socket as Socket & { isOwner: boolean }).isOwner = false);
  }
  (socket as Socket & { isOwner: boolean }).isOwner = true;
  return true;
};
