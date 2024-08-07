import { ICategoryTypes } from "@/types";
import { axiosProcessor, rootApi } from "..";
import { IGetACategoryParams } from "./types";
import { UpdateCategorySchema } from "@/pages/category/categoryFormValidation";
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

export const getACategory= (_id: IGetACategoryParams) => {
  return axiosProcessor({
    method: "get",
    url: `${categoryApi}/${_id}`,
    isPrivate: false,
  });
};

export const updateACategory= (data: UpdateCategorySchema) => {
  return axiosProcessor({
    method: "put",
    url: `${categoryApi}`,
    isPrivate: false,
     obj: data,
  });
};