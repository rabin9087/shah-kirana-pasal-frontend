import { axiosProcessor, rootApi } from "..";
const paymentApi = rootApi + "/api/v1/payment";

export const createPaymentIntent = async(data: object) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${paymentApi}` + "/create-payment-intent",
    isPrivate: false,
    obj: data,
    });
    
    return response
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const createZipPaymentIntent = async(data: object) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${paymentApi}` + "/create-checkout",
    isPrivate: false,
    obj: data,
    });
    
    return response.checkoutUrl
  } catch (error) {
    throw new Error("Failed to update product");
  }
};