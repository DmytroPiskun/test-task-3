import { IUser, IUserEmail } from "../interfaces";
import userModel from "../models/user.model";

export const createUser = (user: IUser) => userModel.create(user);
export const findUser = (key: IUserEmail) => {
  return userModel.findOne(key);
};
export const removeUser = (key: IUserEmail) => userModel.remove(key);
export const updateUser = (user: IUser, newData: object) =>
  userModel.updateOne(user, newData);
export const userPaginate = (perPage: number, page: number) =>
  userModel
    .find({})
    .skip(perPage * (page - 1))
    .limit(perPage);

export const findUsersCount = async () => {
  const count = await userModel.countDocuments();
  return count;
};
