import { Router } from "express";
import { isValidData } from "../middleware/isValidUserData.middleware";
import { isAuth } from "../middleware/isAuth";
import {
  defaultController,
  testController,
  testValidController,
} from "../controllers/test.controllers";
import {
  changePasswordController,
  deleteAccountContoller,
  getUsersList,
  loginController,
  registationController,
  verifyController,
} from "../controllers/user.controllers";
import { isValidPages } from "../middleware/isValidPages.middleware";
// Export module for registering router in express app
export const router: Router = Router();

// Define your routes here
router.get("/", defaultController);
router.post("/registration", isValidData, registationController);
router.post("/login", isValidData, loginController);

router.get("/users", isValidPages, getUsersList);
router.get("/verify/:verificationCode", verifyController);
router.delete("/me", isAuth, isValidData, deleteAccountContoller);
router.post("/change-password", isAuth, isValidData, changePasswordController);

router.get("/testpass", isAuth, testController);
router.get("/testvalid", isValidData, testValidController);
