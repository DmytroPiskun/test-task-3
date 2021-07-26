import * as yup from "yup";

export const pageSchema = yup.object().shape({
  page: yup.number().required(),
  perPage: yup.number().required(),
});
