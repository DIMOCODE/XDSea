import { createRequest } from "./index"
import { HTTP_METHODS } from "../constant";

export const getNFTs = ({searchBy, page, pageSize, userId, sortBy, sortDirection, verified, saleType, }) => {
  var params = `?${searchTerm !== undefined ? `searchBy=${searchTerm}&` : ""}` + 
    `${page !== undefined ? `page=${page}&` : ""}${userId !== undefined ? `userId=${userId}&` : ""}` + 
    `${categoryId !== undefined ? `categoryId=${categoryId}&` : ""}${sortBy !== undefined ? `sortBy=${sortBy}&` : ""}` + 
    `${sortDirection !== undefined ? `sortDirection=${sortDirection}&` : ""}${verified !== undefined ? `verified=${verified}&` : ""}`;
  params = params.substring(0, params.length - 1);
  console.log(params)
  return createRequest(HTTP_METHODS.get, `collection/${params}`, null, null);
};