import { Router } from "express";
import { isAuth } from "../middleware/isAuth";
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

// Define your routes here
router.get("/", defaultController);
router.post("/registration", registationController);
router.post("/login", loginController);

router.get("/testpass", isAuth, testController);
