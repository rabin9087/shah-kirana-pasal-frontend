import { ICategoryTypes } from "@/types";
import { axiosProcessor, rootApi } from "..";
import { IGetACategoryParams } from "./types";
import { UpdateCategorySchema } from "@/pages/category/categoryFormValidation";
const categoryApi = rootApi + "/api/v1/category";

export const createCategory = async(data: ICategoryTypes) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${categoryApi}`,
    isPrivate: false,
    obj: data,
    });
    return response.status
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};

export const getAllCategories = async() => {
  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${categoryApi}`,
    isPrivate: false,
    });
    
    return response.categoryList as ICategoryTypes[]
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
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