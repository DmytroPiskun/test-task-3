import { pageSchema } from "../validators/pageSchema.validator";
import { dataValidator } from "./dataValidator";

export const isValidPages = dataValidator(pageSchema);
