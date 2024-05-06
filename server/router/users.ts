import express from "express";
import {
  deleteUserByUid,
  getUserByUid,
  updateUserByUid,
} from "../controller/users";

export default (router: express.Router) => {
  router.get("/user/:uid", getUserByUid);
  router.put("/user/:uid", updateUserByUid);
  router.delete("/user/:uid", deleteUserByUid);
};
