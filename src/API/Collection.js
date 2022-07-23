import { createRequest } from "./index"
import { HTTP_METHODS } from "../constant";

export const getCollections = ({searchTerm, page, userId, categoryId}) => {
  var params = `?${searchTerm !== undefined ? `searchBy=${searchTerm}&` : ""}${page !== undefined ? `page=${page}&` : ""}${userId !== undefined ? `userId=${userId}&` : ""}${categoryId !== undefined ? `categoryId=${categoryId}&` : ""}`;
  params = params.substring(0, params.length - 1);
  return createRequest(HTTP_METHODS.get, `collection/${params}`, null, null);
};

export const getCollection = (nickName) => {
  return createRequest(HTTP_METHODS.get, `collection/byNickName/${nickName}`, null, null);
};

export const getCollectionNFTs = (collectionId, page) => {
  return createRequest(HTTP_METHODS.get, `collection/nft/${collectionId}/${page}`, null, null);
};