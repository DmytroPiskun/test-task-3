import { IEnv } from "./env.interface";
const mapEnv = (envData: NodeJS.ProcessEnv) => {
  const {
    TOKEN_SECRET = "",
    DB_LINK_CONNECTION = "",
    DEFAULT_PORT = "",
    BASE_URL = "",
  } = envData;
  const parsed: IEnv = {
    tokenSecret: TOKEN_SECRET,
    dbLink: DB_LINK_CONNECTION,
    port: DEFAULT_PORT,
    baseUrl: BASE_URL,
  };
  return Object.freeze(parsed);
};

export const env = mapEnv(process.env);
