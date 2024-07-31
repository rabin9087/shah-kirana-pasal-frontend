import { ICategoryTypes } from "@/types";
import { axiosProcessor, rootApi } from "..";
const categoryApi = rootApi + "/api/v1/category";

export const createCategory= (data: ICategoryTypes) => {
  return axiosProcessor({
    method: "post",
    url: `${categoryApi}`,
    isPrivate: false,
    obj: data,
  });
};

export const getAllCategories= () => {
  return axiosProcessor({
    method: "get",
    url: `${categoryApi}`,
    isPrivate: false,
  });
};