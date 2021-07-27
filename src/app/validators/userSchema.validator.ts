import * as yup from "yup";

export const userSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  status: yup.string().matches(/^[a-fA-F0-9]{24}$/),
});
