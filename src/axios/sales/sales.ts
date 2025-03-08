import { axiosProcessor, rootApi } from "..";

const salesApi = rootApi + "/api/v1/sales";

export const getTotalSales = async() => {
    try {
        const resp = await axiosProcessor({
    method: "get",
    url: `${salesApi}`,
    isPrivate: true,
    refreshToken: true
        });
        return resp.amount
    } catch (error) {
        console.log(error)
    }
};

export const getAllSales = async() => {
    try {
        const resp = await axiosProcessor({
    method: "get",
    url: `${salesApi}/allSales`,
    isPrivate: true,
    refreshToken: true
        });
        return resp.sales
    } catch (error) {
        console.log(error)
    }
};