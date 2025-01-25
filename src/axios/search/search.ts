import { axiosProcessor, rootApi } from "..";
const searchApi = rootApi + "/api/v1/search";

export const searchItem= (searchQuery: string) => {
  return axiosProcessor({
    method: "get",
    url: `${searchApi}/products?searchTerm=${searchQuery}`,
    isPrivate: false,
  });
};