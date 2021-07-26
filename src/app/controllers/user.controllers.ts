import { Request, Response } from "express";
import { findUsersCount } from "../repositories/users.repository";
import {
  loginUser,
  registerUser,
  removeMe,
  changePassword,
  paginate,
} from "../../services/user.service";
export const registationController = async (req: Request, res: Response) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  if (registerUser(userPassword, userEmail)) {
    res.status(200).json({ message: "registrated" });
  } else {
    res.status(400).json({ message: "error" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const token = await loginUser(userPassword, userEmail);
  if (token) {
    return res.status(200).json({ accessToken: token });
  }
  res.status(401).json({ message: "unauthorized" });
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
  const userEmail = req.user?.email;
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
};

export const getUsersList = async (req: Request, res: Response) => {
  const dbUsersCount: number = await findUsersCount();
  const page: number = req.body?.page;
  const perPage: number = req.body?.perPage;
  const maxPage = Math.ceil(dbUsersCount / perPage);
  if (page <= maxPage) {
    const userList = await paginate(perPage, page);
    res
      .status(200)
      .json({ users: userList, currentPage: page, itemsPerPage: perPage });
  } else {
    const userList = await paginate(perPage, maxPage);
    res
      .status(200)
      .json({ users: userList, currentPage: page, itemsPerPage: perPage });
  }
};
