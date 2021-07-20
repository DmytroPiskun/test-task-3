import app from "./server";
import config from "../config.json";
import { connect } from "mongoose";
import passport from "passport";
connect(
  "mongodb+srv://admin:12345@cluster0.4f7pf.mongodb.net/myusers?retryWrites=true&w=majority"
)
  .then(() => console.log("DATABASE CONNECTED"))
  .catch((error) => console.log("DATABASE FALL", error));

app.use(passport.initialize());
require("./app/middleware/passport")(passport);

// Start the application by listening to specific port
const port = Number(process.env.PORT || config.PORT || 8080);
app.listen(port, () => {
  console.info("Express application started on port: " + port);
});
