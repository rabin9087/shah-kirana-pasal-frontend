import { createUser } from "@/axios/user.axios";
import { setLoading } from "@/redux/Loading.slice";
import { AppDispatch } from "@/store";
import { createUserParams } from "@/types";
import { toast } from "sonner";

export const createNewUser =
  (user: createUserParams) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    const pending = createUser(user);
    const { status, message } = await pending;
    console.log(status);
    dispatch(setLoading(false));
    toast(message);
  };
