import { Request, Response } from "express";
import { AnySchema } from "yup";
export const dataValidator =
  <TSchema extends AnySchema>(schema: TSchema) =>
  async (req: Request, res: Response, next: Function) => {
    try {
      await schema.validate(req.body);
      return next();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
