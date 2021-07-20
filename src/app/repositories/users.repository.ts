import { IUser } from "../interfaces";
import userModel from "../models/userModel";

const create = (user: IUser) => userModel.create(user);

export default { create };
