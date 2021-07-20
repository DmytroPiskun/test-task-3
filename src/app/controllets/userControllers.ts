import { Request, Response } from "express";
import userModel from "../models/userModel";
import { usersRepository } from "../repositories";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { sign, verify } from "jsonwebtoken";

export const registationController = async (req: Request, res: Response) => {
  if (
    typeof req.query.password === "string" &&
    typeof req.query.email === "string"
  ) {
    const userEmail = req.query.email;
    const userPassword = req.query.password;
    if (typeof userPassword != "undefined") {
      const salt = genSaltSync(10);
      const hash = hashSync(userPassword, salt);
      const user = new userModel({
        email: userEmail,
        password: hash,
      });
      const newUser = await usersRepository.create(user);
      await newUser.save();
      res.status(200).redirect("/");
    } else {
      res.status(400).send("bad password");
    }
  } else {
    res.status(400).send("bad request");
  }
};

export const loginController = async (req: Request, res: Response) => {
  if (
    typeof req.query.password === "string" &&
    typeof req.query.email === "string"
  ) {
    const userEmail = req.query.email;
    const userPassword = req.query.password;
    const authingUser = await userModel.findOne({ email: userEmail });

    if (compareSync(userPassword, authingUser.password)) {
      const token = sign({ email: userEmail }, "key", {
        expiresIn: 60 * 60,
        algorithm: "HS384",
      });
      res.cookie("accessToken", token);
      res.status(200).send("good");
    } else {
      res.status(401).send("Unauthorized");
    }
  } else {
    res.status(400).send("bad request");
  }
};
