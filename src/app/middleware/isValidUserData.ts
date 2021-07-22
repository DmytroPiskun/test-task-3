import { dataValidator } from "./dataValidator";
import { userSchema } from "../validators/userSchema.validator";
export const isValidData = dataValidator(userSchema);
