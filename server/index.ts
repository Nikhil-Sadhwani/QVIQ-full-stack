import express from "express";
import http from "http";
import router from "./router";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import compression from "compression";

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        ["http://localhost:3000", "http://192.168.68.68:3000", "https://qviq-full-stack-app.vercel.app"].includes(
          origin || ""
        ) ||
        !origin
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/", router());

const MONGO_URL = process.env.MONGODB_URL || "";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

const server = http.createServer(app);

server.listen(port, () => {
  console.log("server is running");
});
