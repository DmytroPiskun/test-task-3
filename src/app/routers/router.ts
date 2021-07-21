import { Router } from "express";
import { isValidData } from "../middleware/isValidUserData";
import { isAuth } from "../middleware/isAuth";
import {
  defaultController,
  testController,
  testValidController,
} from "../controllets/baseControllers";
import {
  changePasswordController,
  deleteAccountContoller,
  getUsersList,
  loginController,
  registationController,
} from "../controllets/userControllers";
// Export module for registering router in express app
export const router: Router = Router();

// Define your routes here
router.get("/", defaultController);
router.post("/registration", isValidData, registationController);
router.post("/login", isValidData, loginController);

router.get("/allusers", getUsersList);
router.post("/delete-account", isAuth, deleteAccountContoller);
router.post("/changepassword", isAuth, changePasswordController);

router.get("/testpass", isAuth, testController);
router.get("/testvalid", isValidData, testValidController);
