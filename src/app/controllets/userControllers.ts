import { Request, Response } from "express";
import userModel from "../models/userModel";
import { usersRepository } from "../repositories";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { env } from "../../utils/env/env";
import { userSchema } from "../validators/yup";
export const registationController = async (req: Request, res: Response) => {
  userSchema
    .isValid({
      email: req.body.email,
      password: req.body.password,
    })
    .then(async () => {
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
    .then(async () => {
      const userEmail = req.body.email;
      const userPassword = req.body.password;
      const authingUser = await userModel.findOne({ email: userEmail });
      if (compareSync(userPassword, authingUser.password)) {
        const token = sign({ email: userEmail }, `${env.tokenSecret}`, {
          expiresIn: 60 * 60,
          algorithm: "HS384",
        });
        res.status(200).json({ accessToken: token });
      } else {
        res.status(401).send("Unauthorized");
      }
    })
    .catch(() => {
      res.status(400).send("bad request");
    });
};
