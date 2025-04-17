import { axiosProcessor, rootApi } from "..";

export interface IJobs {
    _id?: string,
    name: string,
    jobCatergory: string
  jobTypes: string,
  advancePaymenyBy?: string,
    advanceAmount?: Number
    contractAmount: Number,
    newPayment?: [{
                subject: string, // this will be the value from input like "Site material"
        amount: Number,
                createdAt?: Date
            }],
    createdAt?: Date
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

export const getAllJobsByID = async(_id: string) => {
  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${jobApi}/${_id}`,
    isPrivate: false,
    });
    
    return response.jobs
  } catch (error) {
    throw new Error("Failed to get jobs");
  }
};

export const updateAJobPayment = async(_id: string, data: {
                subject: string,
                amount: Number,
            }) => {
  try {
    const response = await axiosProcessor({
    method: "patch",
    url: `${jobApi}/${_id}`,
    isPrivate: false,
    obj: data,
    });
    
    return response.job
  } catch (error) {
    throw new Error("Failed to update a job");
  }
};

export const updateAJob = async(_id: string, data: object) => {
  try {
    const response = await axiosProcessor({
    method: "put",
    url: `${jobApi}/${_id}`,
    isPrivate: false,
    obj: data,
    });
    
    return response.job
  } catch (error) {
    throw new Error("Failed to update a job");
  }
};