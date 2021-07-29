import { ParsedQs } from "qs";

export interface IUser {
  email: string;
  password: string;
}
export interface IUserEmail {
  email: string | undefined | ParsedQs;
}

export interface IAggregatedUser {
  email: string;
  currentStatus: Object[];
}
