import { Request, Response } from "express";
import userModel from "../models/user.model";

export const defaultController = async (_req: Request, res: Response) => {
  const users = await userModel.find({});
  res.status(200).send({
    registeredUsers: { users },
  });
};

export const testController = async (req: Request, res: Response) => {
  res.status(200).json({ test: "test" });
};

export const testValidController = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ testValid: "valid" });
  } catch (e) {
    res.status(400).send(e);
  }
};
