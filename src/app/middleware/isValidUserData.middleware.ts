import { dataValidator } from "./dataValidator.middleware";
import { userSchema } from "../validators/userSchema.validator";
export const isValidData = dataValidator(userSchema);
