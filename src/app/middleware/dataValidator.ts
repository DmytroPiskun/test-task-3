import { Request, Response } from "express";
import { IUser } from "../interfaces";
import { ObjectSchema } from "yup";
export const dataValidator =
  (schema: ObjectSchema<{}>) =>
  async (req: Request<{}, IUser>, res: Response, next: Function) => {
    try {
      await schema.validate(req.body);
      return next();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
