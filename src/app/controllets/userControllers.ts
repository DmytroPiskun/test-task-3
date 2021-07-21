import { Request, Response } from "express";
import userModel from "../models/userModel";
import { usersRepository } from "../repositories";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { generateToken } from "../../utils/generateToken";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { env } from "../../utils/env/env";
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
  if (typeof req.headers["authorization"] !== "undefined") {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    const verifiedToken = verify(token, env.tokenSecret) as JwtPayload;
    const userEmail = verifiedToken.email;
    await userModel.deleteOne(await userModel.findOne({ email: userEmail }));
    res.status(200).json(token);
  }
};
