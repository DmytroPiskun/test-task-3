import { pageSchema } from "../validators/pageSchema.validator";
import { dataValidator } from "./dataValidator.middleware";

export const isValidPages = dataValidator(pageSchema);
