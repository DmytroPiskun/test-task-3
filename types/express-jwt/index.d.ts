type IUser = import("../../src/app/interfaces").IUser;

declare namespace Express {
  export interface User extends IUser {}
}
