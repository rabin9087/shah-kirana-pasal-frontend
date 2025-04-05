import { axiosProcessor, rootApi } from "..";
import { IJobPayment } from "./types";
const contractManagementApi = rootApi + "/api/v1/contractManagement";

export const createDue = async(data: IJobPayment) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${contractManagementApi}`,
    isPrivate: false,
    obj: data,
    });
    
    return response.due
  } catch (error) {
    throw new Error("Failed to create dues");
  }
};