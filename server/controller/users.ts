import express from "express";
import { UserModel } from "../models/User";

export const getUserByUid = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { uid } = req.params;
    const user = await UserModel.findOne({ uid });
    if (user) {
      return res.status(201).json({
        displayPicture: user.displayPicture,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        coverPicture: user.coverPicture,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateUserByUid = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { uid } = req.params;

    const { name, email, phoneNumber, displayPicture, coverPicture } = req.body;

    const existUser = await UserModel.findOne({ uid: uid });

    if (!existUser) {
      return res.sendStatus(400);
    }

    existUser.name = !name ? existUser.name : name;
    existUser.email = !email ? existUser.email : email;
    existUser.phoneNumber = !phoneNumber ? existUser.phoneNumber : phoneNumber;
    existUser.displayPicture = !displayPicture
      ? existUser.displayPicture
      : displayPicture;
    existUser.coverPicture = !coverPicture
      ? existUser.coverPicture
      : coverPicture;

    await existUser.save();

    return res.json(existUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUserByUid = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { uid } = req.params;

    const user = await UserModel.deleteOne({ uid: uid });

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
