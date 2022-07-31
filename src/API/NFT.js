import { createRequest, createSignedRequest } from "./index"
import { HTTP_METHODS } from "../constant";
import { nftmarketlayeraddress } from "../config";

export const getNFTs = ({searchBy, page, pageSize, userId, sortBy, sortDirection, verified, saleType1, saleType2, saleType3, saleType4, priceRangeStart, priceRangeEnd}) => {
  var params = `?${searchBy !== undefined ? `searchBy=${searchBy}&` : ""}` + 
    `${pageSize !== undefined ? `pageSize=${pageSize}&` : ""}${userId !== undefined ? `userId=${userId}&` : ""}` + 
    `${priceRangeStart !== undefined ? `priceRangeStart=${priceRangeStart}&` : ""}` + 
    `${priceRangeEnd !== undefined ? `priceRangeEnd=${priceRangeEnd}&` : ""}${sortBy !== undefined ? `sortBy=${sortBy}&` : ""}` + 
    `${sortDirection !== undefined ? `sortDirection=${sortDirection}&` : ""}${verified !== undefined ? `verified=${verified}&` : ""}` +
    `${saleType1 !== undefined ? `saleType=${saleType1}&` : ""}${saleType2 !== undefined ? `saleType=${saleType2}&` : ""}` + 
    `${saleType3 !== undefined ? `saleType=${saleType3}&` : ""}${saleType4 !== undefined ? `saleType=${saleType4}&` : ""}`;
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

export const createNFT = (collectionId, tokenId, addressCreator, price, royalty, name, description, urlFile, fileType,
  preview, properties) => {
  const body = {
    collectionId,
    tokenId,
    addressCreator,
    marketAddress: nftmarketlayeraddress,
    price,
    isListed: false,
    royalty,
    name,
    description,
    urlFile,
    fileType,
    preview,
    properties,
    blockchainOrigin: "XDC",
    isHidden:false
  };
  return createSignedRequest(HTTP_METHODS.post, "nft", null, body);
};

export const listNFTRequest = (price, nftId) => {
  const body = {
    price
  };
  return createSignedRequest(HTTP_METHODS.post, `nft/list/${nftId}`, null, body);
};

export const transferNFTRequest = (myAddress, toAddress, nftId) => {
  const body = {
    myAddress,
    toAddress
  };
  return createSignedRequest(HTTP_METHODS.post, `nft/transfer/${nftId}`, null, body);
};

export const withdrawListingNFTRequest = (nftId) => {
  return createSignedRequest(HTTP_METHODS.delete, `nft/list/${nftId}`, null, null);
};

export const editListingNFTRequest = (price, nftId) => {
  const body = {
    price
  };
  return createSignedRequest(HTTP_METHODS.put, `nft/list/${nftId}`, null, body);
};

export const buyNFTRequest = (myAddress, fee, nftId) => {
  const body = {
    myAddress,
    fee
  };
  return createSignedRequest(HTTP_METHODS.post, `nft/buy/${nftId}`, null, body);
};

export const placeOfferRequest = (price, fromAddress, tokenId) => {
  const body = {
    price,
    fromAddress,
    tokenId
  };
  return createSignedRequest(HTTP_METHODS.post, `offer`, null, body);
};

export const withdrawOfferRequest = (offerId) => {
  return createSignedRequest(HTTP_METHODS.put, `offer/${offerId}/withdraw`, null, null);
};

export const acceptOfferRequest = (offerId) => {
  return createSignedRequest(HTTP_METHODS.post, `offer/${offerId}/accept`, null, null);
}