import { createRequest } from "./index"
import { HTTP_METHODS } from "../constant";

export const getNFTs = ({searchBy, page, pageSize, userId, sortBy, sortDirection, verified, saleType, priceRangeStart, priceRangeEnd}) => {
  var params = `?${searchBy !== undefined ? `searchBy=${searchBy}&` : ""}` + 
    `${pageSize !== undefined ? `pageSize=${pageSize}&` : ""}${userId !== undefined ? `userId=${userId}&` : ""}` + 
    `${priceRangeStart !== undefined ? `priceRangeStart=${priceRangeStart}&` : ""}` + 
    `${priceRangeEnd !== undefined ? `priceRangeEnd=${priceRangeEnd}&` : ""}${sortBy !== undefined ? `sortBy=${sortBy}&` : ""}` + 
    `${sortDirection !== undefined ? `sortDirection=${sortDirection}&` : ""}${verified !== undefined ? `verified=${verified}&` : ""}`;
  if(saleType !== undefined) {
    for(var i = 0; i < saleType.length; i++) {
      params += `saleType=${saleType[i]}&`
    }
  }
  params = params.substring(0, params.length - 1);
  console.log(params)
  return createRequest(HTTP_METHODS.get, `nft/${page}${params}`, null, null);
};

export const getNFT = (tokenId) => {
  return createRequest(HTTP_METHODS.get, `nft/byToken/${tokenId}`, null, null);
};

export const getNFTOffers = (id) => {
  return createRequest(HTTP_METHODS.get, `offer?nftId=${id}`, null, null);
};

export const getNFTEvents = (id) => {
  return createRequest(HTTP_METHODS.get, `event/?nftId=${id}`, null, null);
};