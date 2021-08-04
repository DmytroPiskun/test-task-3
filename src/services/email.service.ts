import { createTransport } from "nodemailer";
import { env } from "../utils/env/env";
export const sendVerifyEmail = async (
  verificationCode: string,
  userEmail: string
) => {
  try {
    const trasporter = createTransport({
      service: "gmail",
      auth: {
        user: "testnodejstaskacc@gmail.com",
        pass: env.googlePassword,
      },
    });

    const result = trasporter.sendMail({
      from: "testnodejstaskacc@gmail.com",
      to: userEmail,
      subject: "verify your email",
      text: "verify email",
      html: `click  <a href = ${env.baseUrl}/verification-page/${verificationCode}> <strong> here </strong> </a> to verify this email `,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};
