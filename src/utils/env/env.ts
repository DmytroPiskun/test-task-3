import { IEnv } from "./env.interface";
import { config } from "dotenv";
const mapEnv = (envData: NodeJS.ProcessEnv) => {
  const resultEnv = config();

  if (resultEnv.error) {
    console.log(resultEnv.error);
    throw resultEnv.error;
  }

  const { TOKEN_SECRET = "", DB_LINK_CONNECTION = "" } = envData;
  const parsed: IEnv = {
    tokenSecret: TOKEN_SECRET,
    dbLink: DB_LINK_CONNECTION,
  };
  return Object.freeze(parsed);
};

export const env = mapEnv(process.env);
