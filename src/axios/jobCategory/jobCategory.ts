import { axiosProcessor, rootApi } from "..";

export interface IJobCategory {
    _id?: string,
  name: string,
  user: string,
    createdAt?: Date
}

const jobCategoryApi = rootApi + "/api/v1/jobCategory";

export const createJobCategory = async(data: IJobCategory) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${jobCategoryApi}`,
    isPrivate: false,
    obj: data,
    });
    
    return response.jobCategory
  } catch (error) {
    throw new Error("Failed to create jobs");
  }
};

export const getAllJobCategories = async(_id: string) => {
  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${jobCategoryApi}/${_id}`,
    isPrivate: false,
    });
    
    return response.jobCategories
  } catch (error) {
    throw new Error("Failed to get jobs");
  }
};