import {
  createAdmin,
  createUser,
  forgetPassword,
  getUser,
  loginUser,
  otp_PasswordVerify,
  update_Forget_Password,
} from "@/axios/user.axios";
import { setLoading } from "@/redux/Loading.slice";
import { setEmail_Phone, setUser } from "@/redux/user.slice";
import { AppDispatch } from "@/store";
import {
  IUser,
  createUserParams,
  forgetPasswordParams,
  newPasswordParams,
  otp_PasswordParams,
} from "@/types";
import { NavigateFunction } from "react-router";
import { toast } from "sonner";

export const createNewUser =
  (user: createUserParams) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    const pending = createUser(user);
    const { status, message } = await pending;
    dispatch(setLoading(false));
    toast[status](message);
    if (status === "success") {
      return true;
    }
  };
export const createNewAdmin =
  (user: createUserParams) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    const pending = createAdmin(user);
    const { status, message } = await pending;
    dispatch(setLoading(false));
    toast[status](message);
    if (status === "success") {
      return true;
    }
  };

export const forgetPasswordOTPRequest =
  (data: forgetPasswordParams) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    const pending = forgetPassword(data);
    const { status, message, userEmail_Phone } = await pending;
    dispatch(setLoading(false));
    toast[status](message);
    if (status === "success") {
      dispatch(setEmail_Phone(userEmail_Phone as string));
      return true;
    }
  };

export const OTPVerificationRequest =
  (data: otp_PasswordParams) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    const pending = otp_PasswordVerify(data);
    const { status, message } = await pending;
    dispatch(setLoading(false));
    toast[status](message);
    if (status === "success") {
      return true;
    }
  };

export const updateForgetPassword =
  (data: newPasswordParams) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    const pending = update_Forget_Password(data);
    const { status, message } = await pending;
    dispatch(setLoading(false));
    toast[status](message);
    if (status === "success") {
      dispatch(setEmail_Phone(""))
      return true;
    }
  };

export const loginUserAction =
  (
    credentials: { email_phone: string; password: string },
    navigate: NavigateFunction
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    const pending = loginUser(credentials);
    const { status, message, tokens } = await pending;
    dispatch(setLoading(false));

    if (status === "success") {
      localStorage.setItem("refreshJWT", tokens?.refreshJWT as string);
      sessionStorage.setItem("accessJWT", tokens?.accessJWT as string);
      toast[status](message);

      await dispatch(getUserAction(navigate));
      return;
    }
    toast[status](message);
  };

export const getUserAction =
  (navigate: NavigateFunction, pathname?: string) =>
  async (dispatch: AppDispatch) => {
    const { user } = await getUser();
    dispatch(setUser(user as IUser));
    if (user?._id) navigate(pathname ? pathname : "/");
  };
