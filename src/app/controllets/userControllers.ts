import { Request, Response } from "express";
import userModel from "../models/userModel";
import { usersRepository } from "../repositories";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { env } from "../../utils/env/env";

export const registationController = async (req: Request, res: Response) => {
  if (
    typeof req.body.password === "string" &&
    typeof req.body.email === "string"
  ) {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    if (typeof userPassword != "undefined") {
      const salt = genSaltSync(10);
      const newHash = hashSync(newPassword, salt);
      await userModel.updateOne(authUser, { password: newHash });
      res.status(200).json(authUser);
    } else {
      res.status(404).json({ message: "bad password" });
    }
  } else {
    res.status(400).json("bad");
  }
};

export const loginController = async (req: Request, res: Response) => {
  if (
    typeof req.body.password === "string" &&
    typeof req.body.email === "string"
  ) {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const authingUser = await userModel.findOne({ email: userEmail });

    if (compareSync(userPassword, authingUser.password)) {
      const token = sign({ email: userEmail }, env.tokenSecret, {
        expiresIn: 60 * 60,
        algorithm: "HS384",
      });
      res.status(200).json({ accessToken: token });
    } else {
      res.status(401).send("Unauthorized");
    }
  } else {
    res.status(400).json({ message: "error" });
  }
};

export const deleteAccountContoller = async (req: Request, res: Response) => {
  if (typeof req.headers["authorization"] !== "undefined") {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    const verifiedToken = verify(token, env.tokenSecret) as JwtPayload;
    const userEmail = verifiedToken.email;
    await userModel.deleteOne(await userModel.findOne({ email: userEmail }));
    res.status(200).json(token);
  }
};
