import app from "./server";
import configuration from "../config.json";
import { connect } from "mongoose";
import passport from "passport";
import { config } from "dotenv";
import { env } from "./utils/env/env";
const resultEnv = config();

if (resultEnv.error) {
  console.log(resultEnv.error);
  throw resultEnv.error;
}

connect(`${env.dbLink}`)
  .then(() => console.log("DATABASE CONNECTED"))
  .catch((error) => console.log("DATABASE FALL", error));

app.use(passport.initialize());
require("./app/middleware/passport")(passport);

// Start the application by listening to specific port
const port = Number(process.env.PORT || configuration.PORT || 8080);
app.listen(port, () => {
  console.info("Express application started on port: " + port);
});
