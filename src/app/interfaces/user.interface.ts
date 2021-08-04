export interface IUser {
  email: string;
  password: string;
}
export interface IUserEmail {
  email: string | undefined;
}

export interface IAggregatedUser {
  email: string;
  currentStatus: ICurrentStatus[];
  verificationToken: string;
}

export interface IVerificationCode {
  verificationCode: string;
}
interface ICurrentStatus {
  status: string;
}
