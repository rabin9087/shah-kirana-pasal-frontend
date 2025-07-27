import { axiosProcessor, rootApi } from "..";
const searchApi = rootApi + "/api/v1/search";

export const searchItem = (searchQuery: string) => {
  return axiosProcessor({
    method: "get",
    url: `${searchApi}/products?searchTerm=${searchQuery}`,
    isPrivate: false,
  });
};

export const searchUser = (searchQuery: string) => {
  return axiosProcessor({
    method: "get",
    url: `${searchApi}/user?searchTerm=${searchQuery}`,
    isPrivate: false,
  });
};