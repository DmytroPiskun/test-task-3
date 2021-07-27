import { compareSync } from "bcrypt";
import {
  createUser,
  findUser,
  setUserStatusId,
  updateUser,
  userPaginate,
} from "../app/repositories/users.repository";
import { saltPassword } from "../utils/generateSavePassword";
import { generateToken } from "../utils/generateToken";

export const registerUser = async (userPassword: string, userEmail: string) => {
  const hash = saltPassword(userPassword);
  const user = {
    email: userEmail,
    password: hash,
    status: await setUserStatusId("Active"),
  };
  const newUser = await createUser(user);
  await newUser.save();
  return true;
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
  try {
    const authUser = await findUser({ email: userEmail });
    if (authUser) {
      await updateUser(authUser, {
        status: await setUserStatusId("Blocked"),
      });
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const changePassword = async (
  userEmail: string | undefined,
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
