import { axiosProcessor, rootApi } from "..";
import { createProductParams } from "./types";
const productApi = rootApi + "/api/v1/product";

export const createProduct= (data: createProductParams) => {
  return axiosProcessor({
    method: "post",
    url: `${productApi}`,
    isPrivate: false,
    obj: data,
  });
};