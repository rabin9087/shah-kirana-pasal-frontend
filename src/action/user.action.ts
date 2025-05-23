
import { ICartHistoryInUser } from "@/axios/user/types";
import { createAdmin, createUser, forgetPassword, getNewAccessJWT, getUser, loginUser, logoutUser, otp_PasswordVerify, updateCartHistoryInUser, updateCartInUser, update_Forget_Password } from "@/axios/user/user.axios";
import { IAddToCartTypes, IUpdateCartToUserTypes } from "@/pages/addToCart";
import { setLoading } from "@/redux/Loading.slice";
import { setAddToCart } from "@/redux/addToCart.slice";
import { logOut, setEmail_Phone, setUser } from "@/redux/user.slice";
import { AppDispatch } from "@/store";
import {
  IUser,
  createUserParams,
  forgetPasswordParams,
  newPasswordParams,
  otp_PasswordParams,
} from "@/types/index";
import { toast } from "react-toastify";

export const createNewUser =
  (user: createUserParams) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    const pending = createUser(user);
    const { status, message } = await pending;
    dispatch(setLoading(false));
    toast(message);
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
        toast(message);
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
        toast(message);
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
    toast(message);
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
    toast(message);
    if (status === "success") {
      dispatch(setEmail_Phone(""))
      return true;
    }
  };

export const updateCartInUserAxios = (phone: string, cart: IUpdateCartToUserTypes[] | []) => async (dispatch: AppDispatch) => {
  const pending =  updateCartInUser(phone, cart);
  const { status } = await pending;
  if (status === "success") {
    dispatch(getUserAction())
    return true;
  }
}


export const updateCartHistoryInUserAxios = ({ phone, items, cartAmount, deliveryStatus, orderNumber, paymentStatus}: ICartHistoryInUser ) => async (dispatch: AppDispatch) => {
  const pending =  updateCartHistoryInUser({phone, items, cartAmount, orderNumber, deliveryStatus, paymentStatus});
  const { status } = await pending;
  if (status === "success") {
    dispatch(getUserAction())
    return true;
  }
}

// cartHistory

export const loginUserAction = (
    credentials: { email_phone: string; password: string },
     ) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    const pending = loginUser(credentials);
    const { status, message, tokens } = await pending;
    dispatch(setLoading(false));

    if (status === "success") {
      localStorage.setItem("refreshJWT", tokens?.refreshJWT as string);
      sessionStorage.setItem("accessJWT", tokens?.accessJWT as string);
      toast(message);
      await dispatch(getUserAction())
      return true;
    }
    toast(message);
    return false;
    };

export const updateProfileAction = () => async (dispatch: AppDispatch) => { 
   const { user } = await getUser();
    dispatch(setUser(user as IUser));
}

export const logOutUserAction = () => async (dispatch: AppDispatch) => { 
  const {status} = await logoutUser();
  if (status === "success") {
    dispatch(logOut())
    return true;
  }
  return false
}


export const getUserAction = () => async (dispatch: AppDispatch) => {
  const { status, user } = await getUser();

  if (status === "success") {
    dispatch(setUser(user as IUser));

    if (user?.cart) {
      const cartItems = user.cart.filter((item: any) => item.productId?._id && item.productId?._id !== "" && item.orderQuantity > 0)
        .map(({ productId, orderQuantity, note }: any) => ({
        _id: productId?._id,
        status: productId?.status,
        name: productId?.name,
        alternateName: productId?.alternateName,
        parentCategoryID: productId?.parentCategoryID,
        sku: productId?.sku,
        slug: productId?.slug,
        description: productId?.description,
        images: productId?.images,
        brand: productId?.brand,
        price: productId?.price,
        quantity: productId?.quantity,
        imageToDelete: productId?.imageToDelete,
        productWeight: productId?.productWeight,
        storedAt: productId?.storedAt,
        aggrateRating: productId?.aggrateRating,
        thumbnail: productId?.thumbnail,
        qrCode: productId?.qrCodeNumber, 
        salesPrice: productId?.salesPrice,
        salesStartDate: productId?.salesStartDate,
        salesEndDate: productId?.salesEndDate,
        productReviews: productId?.productReviews,
        productLocation: productId?.productLocation,
        orderQuantity,
        note,
      }));

      cartItems.forEach((item: any) => dispatch(setAddToCart(item as IAddToCartTypes))); 
      return true; // Return true after dispatching all cart items
    }

    return true; 
  }

  return false;
}; 
  
export const autoLoginUserAction = () => async (dispatch: AppDispatch) => {
  const { user, status, accessJWT } = await getNewAccessJWT();
  if (status === "success") { 
    sessionStorage.setItem("accessJWT", accessJWT as string)
    dispatch(setUser(user as IUser));
  }
  return false
}
  