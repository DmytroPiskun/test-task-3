import { compareSync } from "bcrypt";
import {
  createUser,
  findUser,
  getUserStatusIdByStatus,
  updateUser,
  userPaginate,
} from "../app/repositories/users.repository";
import { statuses } from "../enums/statuses.enum";
import { saltPassword } from "../utils/generateSavePassword";
import { generateToken } from "../utils/generateToken";
import { v4 as randomUUID } from "uuid";
import userModel from "../app/models/user.model";
export const registerUser = async (userPassword: string, userEmail: string) => {
  const hash = saltPassword(userPassword);
  const status = await getUserStatusIdByStatus(statuses.Unverifyed);
  const verificationCode = randomUUID();
  const user = {
    email: userEmail,
    password: hash,
    status: status,
    verificationToken: verificationCode,
  };
  const newUser = await createUser(user);
  await newUser.save();
  return user.verificationToken;
};

export const loginUser = async (userPassword: string, userEmail: string) => {
  const authingUser = await findUser({ email: userEmail });
  const statusActive = await getUserStatusIdByStatus(statuses.Active);
  const authingStatus = authingUser.status.toString();

  if (
    authingStatus === statusActive.toString() &&
    compareSync(userPassword, authingUser.password)
  ) {
    const token = generateToken(userEmail);
    return token;
  }
  return null;
};

export const removeMe = async (userEmail: string | undefined) => {
  try {
    const statusBlocked = await getUserStatusIdByStatus(statuses.Blocked);
    await updateUser(
      { email: userEmail },
      {
        status: statusBlocked,
      }
    );
    return true;
  } catch {
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

export const verifyAccount = async (userData: string) => {
  try {
    const statusActive = await getUserStatusIdByStatus(statuses.Active);
    const test = await userModel.find({ verificationToken: userData });
    const modifiedCount = await updateUser(
      { verificationToken: userData },
      {
        status: statusActive,
      }
    );
    if (modifiedCount.nModified >= 1) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
