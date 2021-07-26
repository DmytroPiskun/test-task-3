import app from "./server";
import configuration from "../config.json";
import { connect } from "mongoose";
import passport from "passport";
import { env } from "./utils/env/env";
import { myPassort } from "./app/middleware/passport.middleware";
connect(env.dbLink)
  .then(() => {
    app.use(passport.initialize());
    require("./app/middleware/passport")(passport);

    // Start the application by listening to specific port
    const port = Number(env.port || configuration.PORT || 8080);
    app.listen(port, () => {
      console.info("Express application started on port: " + port);
    });
  })
  .catch((error) => console.log("DATABASE FALL", error));
