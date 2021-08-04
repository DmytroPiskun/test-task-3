import * as yup from "yup";

export const pageSchema = yup.object().shape({
  page: yup.number().positive().min(1).required(),
  perPage: yup.number().positive().min(1).required(),
});
