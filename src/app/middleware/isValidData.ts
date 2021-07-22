import { userSchema } from "../validators/userSchema.validator";
import { Request, Response } from "express";
import { IUser } from "../interfaces";
const dataValidator =
  () => async (req: Request<{}, IUser>, res: Response, next: Function) => {
    try {
      await userSchema.validate({
        email: req.body.email,
        password: req.body.password,
      });
      return next();
    } catch (error) {
      return res.status(400).json({ invalidData: error.message });
    }
  };

export const isValidData = dataValidator();
