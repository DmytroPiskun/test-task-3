import { IEnv } from "./env.interface";
const mapEnv = (envData: NodeJS.ProcessEnv) => {
  const {
    TOKEN_SECRET = "",
    DB_LINK_CONNECTION = "",
    DEFAULT_PORT = "",
    BASE_URL = "",
    SENDINBLUE_API_KEY = "",
    GOOGLE_SENDER_PASSWORD = "",
    GOOGLE_SENDER_EMAIL = "",
  } = envData;
  const parsed: IEnv = {
    tokenSecret: TOKEN_SECRET,
    dbLink: DB_LINK_CONNECTION,
    port: DEFAULT_PORT,
    baseUrl: BASE_URL,
    sendinblueApiKey: SENDINBLUE_API_KEY,
    googlePassword: GOOGLE_SENDER_PASSWORD,
    googleEmail: GOOGLE_SENDER_EMAIL,
  };
  return Object.freeze(parsed);
};

export const env = mapEnv(process.env);
