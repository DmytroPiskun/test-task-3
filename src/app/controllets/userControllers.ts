import { Request, Response } from "express";
import userModel from "../models/userModel";
import { usersRepository } from "../repositories";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { env } from "../../utils/env/env";
import { userSchema } from "../validators/userSchema.validator";
import { generateToken } from "../../utils/generateToken";
export const registationController = async (req: Request, res: Response) => {
  userSchema
    .isValid({
      email: req.body.email,
      password: req.body.password,
    })
    .then(async (valid) => {
      if (valid) {
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
      } else {
        res.status(400).json({ message: "invalid data" });
      }
    })
    .catch(() => {
      res.status(400).send("bad request");
    });
};

export const loginController = async (req: Request, res: Response) => {
  userSchema
    .isValid({
      email: req.body.email,
      password: req.body.password,
    })
    .then(async (valid) => {
      if (valid) {
        const userEmail = req.body.email;
        const userPassword = req.body.password;
        const authingUser = await userModel.findOne({ email: userEmail });
        if (compareSync(userPassword, authingUser.password)) {
          const token = generateToken(userEmail);
          res.status(200).json({ accessToken: token });
        } else {
          res.status(401).send("Unauthorized");
        }
      } else {
        res.status(400).json({ message: "invalid data" });
      }
    })
    .catch(() => {
      res.status(400).send("bad request");
    });
};
