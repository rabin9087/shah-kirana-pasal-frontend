import { axiosProcessor, rootApi } from "..";

export interface IJobs {
    name: string,
    jobTypes: string,
    advanceAmount?: Number
    contractAmount: Number
}

const jobApi = rootApi + "/api/v1/jobs";

export const createJob = async(data: IJobs) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${jobApi}`,
    isPrivate: false,
    obj: data,
    });
    
    return response.job
  } catch (error) {
    throw new Error("Failed to create jobs");
  }
};