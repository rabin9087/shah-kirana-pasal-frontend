import { ProductSchema } from "@/pages/product/formValidation";
import { axiosProcessor, rootApi } from "..";
const productApi = rootApi + "/api/v1/product";

export const createProduct= (data: ProductSchema) => {
  return axiosProcessor({
    method: "post",
    url: `${productApi}`,
    isPrivate: false,
    obj: data,
  });
};

export const updateProduct= (data: ProductSchema) => {
  return axiosProcessor({
    method: "put",
    url: `${productApi}/${data._id}`,
    isPrivate: false,
    obj: data,
  });
};

export const getAllProducts= () => {
  return axiosProcessor({
    method: "get",
    url: `${productApi}`,
    isPrivate: false,
  });
};

export const getAProduct= ({...data}: { [key: string]: any }) => {
  return axiosProcessor({
    method: "get",
    url: `${productApi}` + '/q',
    isPrivate: false,
    obj: data,
    params: {...data}
  });
};

getAProduct({qrCodeNumber: "84752058442"})
