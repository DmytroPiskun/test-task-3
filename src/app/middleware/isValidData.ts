import { userSchema } from "../validators/userSchema.validator";
import { Request, Response } from "express";
import { IUser } from "../interfaces";
export const isValidData =
  () => async (req: Request<{}, IUser>, res: Response, next: Function) => {
    console.log(req);
    userSchema
      .validate({
        email: req.body.email,
        password: req.body.password,
      })
      .then(() => {
        return next();
      })
      .catch((error) => {
        return res.status(400).json({ invalidData: error.message });
      });
  };
