import * as yup from "yup";

export const pageSchema = yup.object().shape({
  page: yup.string().matches(/^\d+$/).required(),
  perPage: yup.string().matches(/^\d+$/),
});
