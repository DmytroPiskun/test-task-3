import { Router } from "express";
import { isValidData } from "../middleware/isValidUserData";
import { isAuth } from "../middleware/isAuth";
import {
  defaultController,
  testController,
  testValidController,
} from "../controllets/baseControllers";
import {
  deleteAccountContoller,
  loginController,
  registationController,
} from "../controllets/userControllers";
// Export module for registering router in express app
export const router: Router = Router();

// Define your routes here
router.get("/", defaultController);
router.post("/registration", isValidData, registationController);
router.post("/login", isValidData, loginController);

router.post("/registration", registationController);
router.post("/login", loginController);
router.post("/delete-account", isAuth, deleteAccountContoller);

router.get("/testpass", isAuth, testController);
router.get("/testvalid", isValidData, testValidController);
