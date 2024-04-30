import {
  createAdmin,
  createUser,
  getUser,
  loginUser,
} from "@/axios/user.axios";
import { setLoading } from "@/redux/Loading.slice";
import { setUser } from "@/redux/user.slice";
import { AppDispatch } from "@/store";
import { IUser, createUserParams } from "@/types";
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
export const loginUserAction =
  (
    credentials: { email: string; password: string },
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
      await dispatch(getUserAction(navigate));
      return;
    }
    toast[status](message);
  };

export const getUserAction =
  (navigate: NavigateFunction) => async (dispatch: AppDispatch) => {
    const { status, message, user } = await getUser();
    toast[status](message);
    dispatch(setUser(user as IUser));
    if (user?._id) navigate("/");
  };
