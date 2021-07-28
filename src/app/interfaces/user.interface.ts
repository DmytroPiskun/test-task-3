export interface IUser {
  email: string;
  password: string;
}
export interface IUserEmail {
  email: string | undefined;
}

export interface IAggregatedUser {
  email: string;
  currentStatus: Object[];
}
