import { Request, Response } from "express";
import { findUsersCount, userPaginate } from "../repositories/users.repository";
import { JwtPayload, verify } from "jsonwebtoken";
import { env } from "../../utils/env/env";
import {
  loginUser,
  registerUser,
  removeMe,
  changePassword,
  paginate,
} from "../../services/userService";

export const registationController = async (req: Request, res: Response) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  registerUser(userPassword, userEmail);
  res.status(200).redirect("/");
};

export const loginController = async (req: Request, res: Response) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const token = await loginUser(userPassword, userEmail);
  if (token) {
    res.status(200).json({ accessToken: token });
  } else {
    res.status(403).json({ message: "unauthorized" });
  }
};

export const deleteAccountContoller = async (req: Request, res: Response) => {
  const user = req.user;
  const userEmail = user?.email;
  const result = await removeMe(userEmail);
  if (result) {
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
    const isUpdated = await changePassword(userEmail, oldPassword, newPassword);
    if (isUpdated) {
      res.status(200).json({ message: "password changed" });
    } else {
      res
        .status(400)
        .json({ message: "smth went wrong and password wanst changed" });
    }
  } else {
    res.status(400).json({ message: "invalid token" });
  }
};

export const getUsersList = async (req: Request, res: Response) => {
  const NUMERAL_SYSTEM = 10;
  const dbUsersCount = findUsersCount();
  const page: number = parseInt(req.body?.page, NUMERAL_SYSTEM);
  const perPage: number = parseInt(req.body?.perPage, NUMERAL_SYSTEM);
  const maxPage = Math.ceil((await dbUsersCount) / perPage);
  if (page <= maxPage) {
    const userList = await paginate(perPage, page);
    res.status(200).json({ users: userList });
  } else {
    res.status(400).json({ message: "this page doesnt exist" });
  }
};
