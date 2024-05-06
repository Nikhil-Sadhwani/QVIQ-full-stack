import express from "express";
import { UserModel } from "../models/User";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, uid, displayPicture, phoneNumber, coverPicture } =
      req.body;

    const userFound = await UserModel.findOne({ uid });
    if (userFound) {
      return res.status(422).json({ error: "User already exists!" });
    } else {
      const newUser = new UserModel({
        name,
        email,
        uid,
        displayPicture,
        phoneNumber,
        coverPicture,
      });
      await newUser.save();

      return res.status(201).json({ message: "User registered successfully." });
    }
  } catch (error) {
    console.log(`Error occured while register : ${error}`);
    return res.sendStatus(400);
  }
};
