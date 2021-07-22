import { Request, Response } from "express";
import userModel from "../models/userModel";
import { usersRepository } from "../repositories";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { env } from "../../utils/env/env";
import { IUser } from "../interfaces";
export const registationController = async (req: Request, res: Response) => {
  if (
    typeof req.body.password === "string" &&
    typeof req.body.email === "string"
  ) {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    if (typeof userPassword != "undefined") {
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

export const loginController = async (req: Request, res: Response) => {
  if (
    typeof req.body.password === "string" &&
    typeof req.body.email === "string"
  ) {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const authingUser = await userModel.findOne({ email: userEmail });

    if (compareSync(userPassword, authingUser.password)) {
      const token = sign({ email: userEmail }, env.tokenSecret, {
        expiresIn: 60 * 60,
        algorithm: "HS384",
      });
      res.status(200).json({ accessToken: token });
    } else {
      res.status(401).send("Unauthorized");
    }
  } else {
    res.status(400).json({ message: "error" });
  }
};

export const deleteAccountContoller = async (req: Request, res: Response) => {
  const user = req.user;
  const userEmail = user?.email;
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
  if (typeof req.query.page === "string") {
    const page: number = parseInt(req.query.page, 10);
    const perPage = 3; // the amount of users on one page
    userModel
      .find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .then((userList: any) => {
        res.status(200).json({ users: userList });
      });
  } else {
    res.status(400).json({ message: "error" });
  }
};
