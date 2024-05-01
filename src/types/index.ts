export interface IAxiosProcessParams {
  method: string;
  url: string;
  obj?: object;
  isPrivate?: boolean;
  refreshToken?: boolean;
}
export type createUserParams = {
  fName: string;
  lName: string;
  phone: string;
  email: string;
  password: string;
};

export type forgetPasswordParams = {
 email_phone: string;
};

export type otp_PasswordParams = {
  email_phone: string;
  otp: string;
  password: string;
 }

export interface IUser {
  _id: string;
  status: string;
  fName: string;
  lName: string;
  phone: string;
  role: "ADMIN" | "USER";
  email: string;
  isVerified: boolean;
  verificationCode: string | null;
  address: string;
  profile: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export type serverReturnDataType = {
  status: "success" | "error";
  message: string;
  result?: [];
  user?: IUser;
  userEmail_Phone?: string;
  tokens?: { accessJWT: string; refreshJWT: string };
};
export type TAxiosProcessor = Promise<serverReturnDataType>;
