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
import { createTransport } from "nodemailer";
import { IUserEmail } from "../app/interfaces";
import { randomBytes } from "crypto";
import { env } from "../utils/env/env";

export const registerUser = async (userPassword: string, userEmail: string) => {
  const hash = saltPassword(userPassword);
  const status = await getUserStatusIdByStatus(statuses.Unverifyed);
  const verificationCode = randomBytes(8).toString("hex");
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
  if (
    authingUser.status === "Active" &&
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

export const sendVerifyEmail = async (
  verificationCode: string,
  userEmail: string
) => {
  try {
    const trasporter = createTransport({
      service: "gmail",
      auth: {
        user: "testnodejstaskacc@gmail.com",
        pass: "Dima14022002",
      },
    });

    const result = trasporter.sendMail({
      from: "testnodejstaskacc@gmail.com",
      to: userEmail,
      subject: "verify your email",
      text: "verify email",
      html: `click  <a href = ${env.baseUrl}/verify/${verificationCode}> <strong> here </strong> </a> to verify this email `,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const verifyAccount = async (userData: string) => {
  try {
    const statusActive = await getUserStatusIdByStatus(statuses.Active);
    await updateUser(
      { verificationToken: userData },
      {
        status: statusActive,
      }
    );
    return true;
  } catch {
    return false;
  }
};
