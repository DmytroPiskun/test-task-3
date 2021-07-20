import { Request, Response } from "express";
import userModel from "../models/userModel";

export const defaultController = async (_req: Request, res: Response) => {
  const users = await userModel.find({});
  res.status(200).send({
    registeredUsers: { users },
  });
};

export const testController = async (req: Request, res: Response) => {
  res.status(200).send({ test: "test" });
};
