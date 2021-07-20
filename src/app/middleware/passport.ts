import { Strategy } from "passport-jwt";
import { env } from "../../utils/env/env";
import userModel from "../models/userModel";
const tokenExtractor = function (req: any) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    return token;
  } catch {
    const token = "ivalid";
    return token;
  }
};
const opts = {
  secretOrKey: env.tokenSecret,
  jwtFromRequest: tokenExtractor,
};

export const myPassort = (passport: { use: (arg0: Strategy) => void }) => {
  passport.use(
    new Strategy(opts, async (payload, done) => {
      try {
        const user = await userModel.findOne({ email: payload.email });
        return done(null, user || false);
      } catch (e) {
        console.log(e);
      }
    })
  );
};
