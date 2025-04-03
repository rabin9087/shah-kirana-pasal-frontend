import { axiosProcessor, rootApi } from "..";
import { IDue } from "./types";
const dueApi = rootApi + "/api/v1/due";

export const createDue = async(data: IDue) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${dueApi}`,
    isPrivate: false,
    obj: data,
    });
    
    return response.due
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const getDuesByUser = async(userId: string) => {
  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${dueApi}/${userId}`,
    isPrivate: false,
    });
    
    return response.dues
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

getDuesByUser('67ee6565ec137c574376aff7')