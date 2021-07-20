import { Router } from "express";
import passport from "passport";
import {
  defaultController,
  testController,
} from "../controllets/baseControllers";
import {
  loginController,
  registationController,
} from "../controllets/userControllers";
// Export module for registering router in express app
export const router: Router = Router();

const isAuth = passport.authenticate("jwt", {
  session: false,
  failureRedirect: "/",
});
// Define your routes here
router.get("/", defaultController);
router.post("/registration", registationController);
router.post("/login", loginController);

router.get("/testpass", isAuth, testController);
