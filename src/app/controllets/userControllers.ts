import { Request, Response } from "express";
import userModel from "../models/userModel";
import { usersRepository } from "../repositories";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { generateToken } from "../../utils/generateToken";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { env } from "../../utils/env/env";
import { IUser } from "../interfaces";
export const registationController = async (req: Request, res: Response) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const salt = genSaltSync(10);
  const hash = hashSync(userPassword, salt);
  const user = new userModel({
    email: userEmail,
    password: hash,
  });
  const newUser = await usersRepository.create(user);
  await newUser.save();
  res.status(200).redirect("/");
};

export const loginController = async (req: Request, res: Response) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const authingUser = await userModel.findOne({ email: userEmail });
  if (compareSync(userPassword, authingUser.password)) {
    const token = generateToken(userEmail);
    res.status(200).json({ accessToken: token });
  } else {
    res.status(401).json({ message: "unauthorized" });
  }
};

export const deleteAccountContoller = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const userEmail = user.email;
  const isDeleted = await userModel.remove({ email: userEmail });
  if (isDeleted.deletedCount >= 1) {
    res.status(200).json({ message: "successfully deleted" });
  } else {
    res.status(400).json({ message: "smth went wrong and data wasnt deleted" });
  }
};

export const changePasswordController = async (req: Request, res: Response) => {
  if (typeof req.headers["authorization"] !== "undefined") {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    const verifiedToken = verify(token, env.tokenSecret) as JwtPayload;
    const userEmail = verifiedToken.email;
    const oldPassword = req.body.password;
    const newPassword = req.body.newPassword;
    const authUser = await userModel.findOne({ email: userEmail });
    if (compareSync(oldPassword, authUser.password)) {
      const salt = genSaltSync(10);
      const newHash = hashSync(newPassword, salt);
      await userModel.updateOne(authUser, { password: newHash });
      res.status(200).json(authUser);
    } else {
      res.status(404).json({ message: "bad password" });
    }
  } else {
    res.status(400).json("bad");
  }
};

export const getUsersList = async (req: Request, res: Response) => {
  const users = await userModel.find({});
  res.status(200).send(users);
};
