import { Socket } from "socket.io";
import { User } from "../models/user/User";
import { db, findUserInDB } from "../main";
import * as jwt from "jsonwebtoken";
import { socket_checkOwner } from "./auth";
import { Report } from "../models/report/Report";
import { Log } from "../models/log/Log";

export const socketEvent_ownerAuth = (
  event: string,
  func: Function,
  id: string,
  socket: Socket
) => {
  socket
    .on(event, (id: string) => func(socket, id))
    .use(async (packet: string[], next: any) => {
      const isOwner = await socket_checkOwner(socket, id);
      if (!isOwner) {
        return;
      }
      next();
    });
};

export const onConnect = async (socket: Socket) => {
  let userId = (socket as Socket & { userId: string }).userId;

  const user: any = await User.findById(userId).populate(
    "following.instagramUser"
  );
  let getUser: any;
  try {
    getUser = await findUserInDB(user.username);
  } catch (err) {
    console.log(err);
  }
  if (getUser) {
    socket.emit("notifications", getUser.data);
    socket.on("status", (status: string) => {
      if (parseInt(status) === 200) {
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
      }
    });
  }
  console.log("User Connected");
  socketEvent_ownerAuth("DELETE_REPORT", onDeleteReport, user._id, socket);
  socketEvent_ownerAuth("DELETE_LOG", onDeleteLog, user._id, socket);
  socket.on("disconnect", () => console.log("user disconnected"));
};

export const onDeleteReport = async (socket: Socket, id: string) => {
  let isOwner = (socket as Socket & { isOwner: boolean }).isOwner;
  if (!isOwner) {
    return socket.emit("error", "Unauthorized User");
  }
  let readStatus;
  try {
    await Report.findOneAndDelete({ _id: id });
  } catch {
    return socket.emit("REPORT_DELETED", 400);
  }

  socket.emit("REPORT_DELETED", 200, id);
};

export const onDeleteLog = async (socket: Socket, id: string) => {
  let isOwner = (socket as Socket & { isOwner: boolean }).isOwner;
  if (!isOwner) {
    return socket.emit("error", "Unauthorized User");
  }
  try {
    await Log.findOneAndDelete({ _id: id });
  } catch {
    return socket.emit("LOG_DELETED", 400);
  }

  socket.emit("LOG_DELETED", 200, id);
};
