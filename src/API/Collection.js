import { createRequest, createSignedRequest } from "./index";
import { HTTP_METHODS } from "../constant";
import { nftaddress } from "../config";

export const getCollections = ({
  searchTerm,
  page,
  userId,
  categoryId,
  sortBy,
  sortDirection,
  verified,
}) => {
  var params =
    `?${searchTerm !== undefined ? `searchBy=${searchTerm}&` : ""}` +
    `${page !== undefined ? `page=${page}&` : ""}${
      userId !== undefined ? `userId=${userId}&` : ""
    }` +
    `${categoryId !== undefined ? `categoryId=${categoryId}&` : ""}${
      sortBy !== undefined ? `sortBy=${sortBy}&` : ""
    }` +
    `${sortDirection !== undefined ? `sortDirection=${sortDirection}&` : ""}${
      verified !== undefined ? `verified=${verified}&` : ""
    }`;
  params = params.substring(0, params.length - 1);
  return createSignedRequest(
    HTTP_METHODS.get,
    `collection/${params}`,
    null,
    null
  );
};

export const getCollection = (nickName) => {
  return createSignedRequest(
    HTTP_METHODS.get,
    `collection/byNickName/${nickName}`,
    null,
    null
  );
};

export const getCollectionNFTs = ({
  collectionId,
  page,
  searchBy,
  verified,
  saleType1,
  saleType2,
  saleType3,
  saleType4,
  priceRangeStart,
  priceRangeEnd,
  sortBy,
  sortDirection,
}) => {
  var params =
    `?${searchBy !== undefined ? `searchBy=${searchBy}&` : ""}` +
    `${
      priceRangeStart !== undefined ? `priceRangeStart=${priceRangeStart}&` : ""
    }` +
    `${priceRangeEnd !== undefined ? `priceRangeEnd=${priceRangeEnd}&` : ""}${
      sortBy !== undefined ? `sortBy=${sortBy}&` : ""
    }` +
    `${sortDirection !== undefined ? `sortDirection=${sortDirection}&` : ""}${
      verified !== undefined ? `verified=${verified}&` : ""
    }` +
    `${saleType1 !== undefined ? `saleType=${saleType1}&` : ""}${
      saleType2 !== undefined ? `saleType=${saleType2}&` : ""
    }` +
    `${saleType3 !== undefined ? `saleType=${saleType3}&` : ""}${
      saleType4 !== undefined ? `saleType=${saleType4}&` : ""
    }`;
  params = params.substring(0, params.length - 1);
  return createSignedRequest(
    HTTP_METHODS.get,
    `collection/nft/${collectionId}/${page}${params}`,
    null,
    null
  );
};

export const createCollection = (
  name,
  addressCreator,
  description,
  logo,
  banner,
  twitterUrl,
  instagramUrl,
  discordUrl,
  websiteUrl
) => {
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
    isHidden: false,
  };
  return createSignedRequest(HTTP_METHODS.post, "collection", null, body);
};

export const checkCollectionExistsRequest = (name) => {
  const params = {
    name,
  };
  return createRequest(HTTP_METHODS.get, "collection/exist", params, null);
};

export const updateCollection = (collectionId, body) => {
  return createSignedRequest(
    HTTP_METHODS.put,
    `collection/${collectionId}`,
    null,
    body
  );
};
