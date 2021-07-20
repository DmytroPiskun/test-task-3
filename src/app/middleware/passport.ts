import { Strategy } from "passport-jwt";
import userModel from "../models/userModel";
const tokenExtractor = function (req: any) {
  if (req && req.cookies) {
    const token = req.cookies["accessToken"];
    return token;
  }
  return null;
};
const opts = {
  secretOrKey: `${process.env.TOKEN_SECRET}`,
  jwtFromRequest: tokenExtractor,
};

module.exports = (passport: { use: (arg0: Strategy) => void }) => {
  passport.use(
    new Strategy(opts, async (payload, done) => {
      try {
        const user = await userModel.findOne({ email: payload.email });
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (e) {
        console.log(e);
      }
    })
  );
};
