import { IAggregatedUser, IUser, IUserEmail } from "../interfaces";
import userModel from "../models/user.model";
import statusModel from "../models/status.model";
export const createUser = (user: IUser) => userModel.create(user);
export const findUser = (key: IUserEmail) => {
  return userModel.findOne(key);
};
export const removeUser = (key: IUserEmail) => userModel.remove(key);
export const updateUser = async (user: object, newData: object) =>
  await userModel.updateOne(user, newData);

export const findUsersCount = async () => {
  const count = await userModel.countDocuments();
  return count;
};

export const getUserStatusIdByStatus = async (yourStatus: string) => {
  const status = await statusModel.findOne({ status: yourStatus });
  return status._id;
};

export const userPaginate = async (
  perPage: number,
  page: number
): Promise<IAggregatedUser[]> => {
  const paginatedUsers = await userModel
    .aggregate([
      {
        $lookup: {
          from: "userstatuses",
          localField: "status",
          foreignField: "_id",
          as: "currentStatus",
        },
      },
      {
        $project: {
          __v: 0,
          _id: 0,
          status: 0,
          password: 0,
        },
      },
    ])
    .skip(perPage * (page - 1))
    .limit(perPage);
  return paginatedUsers;
};

export const processingUserList = (userList: Array<IAggregatedUser>) => {
  const processUserList = userList.map((element) => {
    return {
      email: element.email,
      status: element.currentStatus[0].status,
    };
  });
  return processUserList;
};
