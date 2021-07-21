import { sign } from "jsonwebtoken";
import { env } from "./env/env";

export function generateToken(userEmail: string) {
  const token = sign({ email: userEmail }, env.tokenSecret, {
    expiresIn: 60 * 60,
    algorithm: "HS384",
  });
  return token;
}
