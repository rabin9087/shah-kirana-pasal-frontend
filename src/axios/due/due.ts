import { axiosProcessor, rootApi } from "..";
import { IDue } from "./types";
const dueApi = rootApi + "/api/v1/due";

export const createDue = async(data: IDue) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${dueApi}`,
    isPrivate: true,
    obj: data,
    });
    
    return response.due
  } catch (error) {
    throw new Error("Failed to create dues");
  }
};

export const getDuesByUser = async(userId: string) => {
  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${dueApi}/${userId}`,
    isPrivate: true,
    });
    
    return response.dues ?? []
  } catch (error) {
    throw new Error("Failed to get dues");
  }
};

export const updateUsersDuesById = async(_id: string, data: object) => {
   try {
    const response = await axiosProcessor({
    method: "patch",
    url: `${dueApi}/${_id}`,
      isPrivate: true,
    obj: data
    });
    
    return response.due ?? {}
  } catch (error) {
    throw new Error("Failed to get dues");
  }
};