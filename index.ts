require("dotenv").config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { admin, instagram, owner, router } from "./routes/index";
import { checkUser, checkAdmin, checkOwner } from './auth';

const app = express();

app.use(express.json());
app.use(cors());
app.use(checkUser)
app.use("/user", router);
app.use("/admin", checkAdmin);
app.use("/admin", admin);
app.use("/owner", checkOwner);
app.use("/owner", owner);
app.use("/instagram", instagram);
app.use(router);

const startServer = async () => {
  const PORT = 5000;
  await mongoose
    .connect(process.env.DATABASE_URI as string)
    .then(() => console.log("DATABASE Connected Successfully..."))
    .catch((err: string) => console.log(err));
  app.listen(PORT, () => {
    console.log(`Server is Listening on http://localhost:${PORT}...`);
  });
};

startServer();
