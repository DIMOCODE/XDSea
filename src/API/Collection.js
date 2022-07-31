import { createRequest, createSignedRequest } from "./index"
import { HTTP_METHODS } from "../constant";
import { nftaddress } from "../config";

export const getCollections = ({searchTerm, page, userId, categoryId, sortBy, sortDirection, verified}) => {
  var params = `?${searchTerm !== undefined ? `searchBy=${searchTerm}&` : ""}` + 
    `${page !== undefined ? `page=${page}&` : ""}${userId !== undefined ? `userId=${userId}&` : ""}` + 
    `${categoryId !== undefined ? `categoryId=${categoryId}&` : ""}${sortBy !== undefined ? `sortBy=${sortBy}&` : ""}` + 
    `${sortDirection !== undefined ? `sortDirection=${sortDirection}&` : ""}${verified !== undefined ? `verified=${verified}&` : ""}`;
  params = params.substring(0, params.length - 1);
  console.log(params)
  return createRequest(HTTP_METHODS.get, `collection/${params}`, null, null);
};

export const getCollection = (nickName) => {
  return createRequest(HTTP_METHODS.get, `collection/byNickName/${nickName}`, null, null);
};

export const getCollectionNFTs = (collectionId, page) => {
  return createRequest(HTTP_METHODS.get, `collection/nft/${collectionId}/${page}`, null, null);
};

export const createCollection = (name, addressCreator, description, logo, banner, 
  twitterUrl, instagramUrl, discordUrl, websiteUrl) => {
    const body = {
      address: nftaddress,
      name,
      addressCreator,
      description,
      logo,
      banner,
      twitterUrl,
      instagramUrl,
      discordUrl,
      websiteUrl,
      isHidden: false
    };
    return createSignedRequest(HTTP_METHODS.post, "collection", null, body);
}