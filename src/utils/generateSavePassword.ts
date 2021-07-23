import { genSaltSync, hashSync } from "bcrypt";
import crypto from "crypto";
export const saltPassword = (password: string) => {
  const randomNumber = crypto.randomInt(9, 12);
  const salt = genSaltSync(randomNumber);
  const newHash = hashSync(password, salt);
  return newHash;
};
