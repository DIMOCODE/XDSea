import { createRequest, createSignedRequest } from "./index";
import { HTTP_METHODS } from "../constant";

/**
 * Send an HTTP request to get a list of collections
 *
 * @param {string} searchBy search word to filter Collections
 * @param {number} page page number
 * @param {string} userId user ID to get owned Collections of a given user
 * @param {string} categoryId category ID to filter collections by category (not yet implemented)
 * @param {string} sortBy sorting criteria for Collections - "relevance", "publication", "volumeTrade", "owners", "floorPrice", "nfts", "alphabetical"
 * @param {number} sortDirection sorting direction i.e., 1 for least to greatest, -1 for greatest to least
 * @param {boolean} verified flag to filter only verified Collections
 * @returns HTTP GET request response with the filtered list of collections
 */
export const getCollections = ({
  searchBy,
  page,
  userId,
  categoryId,
  sortBy,
  sortDirection,
  verified,
  stakeable,
}) => {
  const params = {
    searchBy,
    page,
    userId,
    categoryId,
    sortBy,
    sortDirection,
    verified,
    stakeable,
  };
  return createSignedRequest(HTTP_METHODS.get, `collection/`, params, null);
};

/**
 * Send an HTTP request to get a specific collection
 *
 * @param {string} nickName nickname for the collection (safe name for collection links)
 * @returns HTTP GET request response with the requested collection
 */
export const getCollection = (nickName) => {
  return createSignedRequest(
    HTTP_METHODS.get,
    `collection/byNickName/${nickName}`,
    null,
    null
  
  );
};

/**
 * Send an HTTP request to get a list of NFTs of a specific collection
 *
 * @param {string} collectionId the DB object ID of the collection
 * @param {number} page page number
 * @param {string} searchBy search word to filter NFTs of the collection
 * @param {boolean} verified flag to filter only NFTs owned by verified owners
 * @param {string} saleType1 sale type to be filtered, corresponds to "SALE"
 * @param {string} saleType2 sale type to be filtered, corresponds to "RELIST"
 * @param {string} saleType3 sale type to be filtered, corresponds to "SOLD"
 * @param {string} saleType4 sale type to be filtered, corresponds to "NOT_SALE"
 * @param {number} priceRangeStart minimum value of the range of prices to be filtered
 * @param {number} priceRangeEnd maximum value of the range of prices to be filtered
 * @param {string} sortBy sorting criteria for NFTs of the collection - "relevance", "publication", "price", "offersAmount", "alphabetical"
 * @param {number} sortDirection sorting direction i.e., 1 for least to greatest, -1 for greatest to least
 * @returns HTTP GET request response with the filtered list of NFTs of the collection
 */
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

/**
 * Send a User-authorized HTTP request to create a new collection
 *
 * @param {string} name name of the collection
 * @param {string} address contract address of the collection
 * @param {string} addressCreator wallet address of the creator
 * @param {string} description description of the collection
 * @param {string} logo url of the collection logo
 * @param {string} banner url of the collection banner
 * @param {string} twitterUrl url of the Twitter account linked to the collection
 * @param {string} instagramUrl url of the Instagram account linked to the collection
 * @param {string} discordUrl url of the Discord account linked to the collection
 * @param {string} websiteUrl url of the website linked to the collection
 * @returns HTTP POST request response with the newly created DB Collecion object
 */
export const createCollection = (
  name,
  address,
  addressCreator,
  description,
  logo,
  banner,
  twitterUrl,
  instagramUrl,
  discordUrl,
  websiteUrl,
  isHidden
) => {
  const body = {
    address,
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

/**
 * Send an HTTP request to check if a specific collection name is already taken
 *
 * @param {string} name name of the collection
 * @returns HTTP GET request response with a boolean to indicate if the collection exists and the DB Collection object if it does
 */
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

export const getStakingPool = (collectionId) => {
  return createRequest(
    HTTP_METHODS.get,
    `stake/pool/${collectionId}`,
    null,
    null
  );
};

export const getStakes = (collectionId) => {
  return createRequest(
    HTTP_METHODS.get,
    `stake`,
    {collectionId},
    null
  );
};