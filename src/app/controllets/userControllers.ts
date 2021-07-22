import { Request, Response } from "express";
import userModel from "../models/userModel";
import { usersRepository } from "../repositories";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { generateToken } from "../../utils/generateToken";
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
