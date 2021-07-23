import { compareSync } from "bcrypt";
import userModel from "../app/models/userModel";
import {
  createUser,
  findUser,
  removeUser,
  updateUser,
  userPaginate,
} from "../app/repositories/users.repository";
import { saltPassword } from "../utils/generateSavePassword";
import { generateToken } from "../utils/generateToken";

export const registerUser = async (userPassword: string, userEmail: string) => {
  const hash = saltPassword(userPassword);
  const user = new userModel({
    email: userEmail,
    password: hash,
  });
  const newUser = await createUser(user);
  await newUser.save();
};

export const loginUser = async (userPassword: string, userEmail: string) => {
  const authingUser = await findUser({ email: userEmail });
  if (compareSync(userPassword, authingUser.password)) {
    const token = generateToken(userEmail);
    return token;
  }
  return null;
};

export const removeMe = async (userEmail: string | undefined) => {
  const isDeleted = await removeUser({ email: userEmail });
  if (isDeleted.deletedCount >= 1) {
    return true;
  }
  return false;
};

export const changePassword = async (
  userEmail: string,
  oldPassword: string,
  newPassword: string
) => {
  const authUser = await findUser({ email: userEmail });
  if (compareSync(oldPassword, authUser.password)) {
    const newHash = saltPassword(newPassword);
    await updateUser(authUser, { password: newHash });
    return true;
  }
  return false;
};

export const paginate = async (perPage: number, page: number) => {
  const userList = await userPaginate(perPage, page);
  return userList;
};
