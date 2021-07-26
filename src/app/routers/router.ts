import { Router } from "express";
import { isAuth } from "../middleware/isAuth";
import {
  defaultController,
  testController,
  testValidController,
} from "../controllers/baseControllers";
import {
  changePasswordController,
  deleteAccountContoller,
  getUsersList,
  loginController,
  registationController,
} from "../controllers/userControllers";
import { isValidPages } from "../middleware/isValidPages";
// Export module for registering router in express app
export const router: Router = Router();

// Define your routes here
router.get("/", defaultController);
router.post("/registration", isValidData, registationController);
router.post("/login", isValidData, loginController);

router.get("/users", isValidPages, getUsersList);

router.delete("/me", isAuth, isValidData, deleteAccountContoller);
router.post("/change-password", isAuth, isValidData, changePasswordController);

router.get("/testpass", isAuth, testController);
router.get("/testvalid", isValidData, testValidController);
