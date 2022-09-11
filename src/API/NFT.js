import { createRequest, createSignedRequest } from "./index";
import { HTTP_METHODS } from "../constant";
import { nftmarketlayeraddress } from "../config";

/**
 * Send an HTTP request to get a list of NFTs
 *
 * @param {string} searchBy search word to filter NFTs
 * @param {number} page page number
 * @param {number} pageSize number of NFTs per page
 * @param {string} userId user ID to get owned NFTs of a given user
 * @param {string} sortBy sorting criteria for NFTs - "relevance", "publication", "price", "offersAmount", "alphabetical"
 * @param {number} sortDirection sorting direction i.e., 1 for least to greatest, -1 for greatest to least
 * @param {boolean} verified flag to filter only verified NFTs
 * @param {string} saleType1 sale type to be filtered, corresponds to "SALE"
 * @param {string} saleType2 sale type to be filtered, corresponds to "RELIST"
 * @param {string} saleType3 sale type to be filtered, corresponds to "SOLD"
 * @param {string} saleType4 sale type to be filtered, corresponds to "NOT_SALE"
 * @param {number} priceRangeStart minimum value of the range of prices to be filtered
 * @param {number} priceRangeEnd maximum value of the range of prices to be filtered
 * @returns HTTP GET request response with the filtered list of NFTs
 */
export const getNFTs = ({
  searchBy,
  page,
  pageSize,
  userId,
  sortBy,
  sortDirection,
  verified,
  saleType1,
  saleType2,
  saleType3,
  saleType4,
  priceRangeStart,
  priceRangeEnd,
}) => {
  var params =
    `?${searchBy !== undefined ? `searchBy=${searchBy}&` : ""}` +
    `${pageSize !== undefined ? `pageSize=${pageSize}&` : ""}${
      userId !== undefined ? `userId=${userId}&` : ""
    }` +
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
  return createRequest(HTTP_METHODS.get, `nft/${page}${params}`, null, null);
};

/**
 * Send an HTTP request to get a specific NFT
 *
 * @param {string} tokenId token Id of the NFT (soon to be replaced by NFT Contract and tokenId)
 * @returns HTTP GET request response with the requested NFT
 */
export const getNFT = (collectionAddress, tokenId) => {
  return createRequest(
    HTTP_METHODS.get,
    `nft/byToken/${collectionAddress}/${tokenId}`,
    null,
    null
  );
};

/**
 * Send an HTTP request to get the list of offers placed on a specific NFT
 *
 * @param {string} nftId the DB object ID of the NFT
 * @returns HTTP GET request response with the list of offers
 */
export const getNFTOffers = (nftId) => {
  const params = {
    nftId,
  };
  return createRequest(HTTP_METHODS.get, `offer`, params, null);
};

/**
 * Send an HTTP request to get the list of events placed on a specific NFT
 *
 * @param {string} nftId the DB object ID of the NFT
 * @returns HTTP GET request response with the list of events
 */
export const getNFTEvents = (nftId) => {
  const params = {
    nftId,
  };
  return createRequest(HTTP_METHODS.get, `event`, params, null);
};

/**
 * Send a User-authorized HTTP request to add the minted NFT to the DB
 *
 * @param {string} collectionId the DB object ID of the Collection
 * @param {string} tokenId the tokenID of the minted NFT
 * @param {string} addressCreator the wallet address of the creator of the NFT
 * @param {number} price initial price of the NFT (soon to be an optional parameter)
 * @param {number} royalty the royalty percentage decided by the creator
 * @param {string} name the name of the NFT
 * @param {string} description the description of the NFT
 * @param {string} urlFile url of the NFT asset uploaded to IPFS
 * @param {string} fileType MIME type of the NFT asset
 * @param {string} preview url of the preview image attached in case the NFT is an Audio file
 * @param {[{property: string, value: string}]} properties properties/attributes of the NFT
 * @returns HTTP POST request response with the newly added DB NFT object
 */
export const createNFT = (
  collectionId,
  tokenId,
  addressCreator,
  price,
  royalty,
  name,
  description,
  urlFile,
  fileType,
  preview,
  properties
) => {
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
    isHidden: false,
  };
  return createSignedRequest(HTTP_METHODS.post, "nft", null, body);
};

/**
 * Send a User-authorized HTTP request to list a specific NFT
 *
 * @param {number} price listing price of the NFT
 * @param {string} nftId the DB object ID of the NFT
 * @returns HTTP POST request response with the newly listed DB NFT object
 */
export const listNFTRequest = (price, nftId) => {
  const body = {
    price,
  };
  return createSignedRequest(
    HTTP_METHODS.post,
    `nft/list/${nftId}`,
    null,
    body
  );
};

/**
 * Send a User-authorized HTTP request to transfer a specific NFT to another address
 *
 * @param {string} myAddress wallet address of the current owner of the NFT
 * @param {string} toAddress wallet address that the NFT is to be transferred to
 * @param {string} nftId the DB object ID of the NFT
 * @returns HTTP POST request response with the newly transferred DB NFT object
 */
export const transferNFTRequest = (myAddress, toAddress, nftId) => {
  const body = {
    myAddress,
    toAddress,
  };
  return createSignedRequest(
    HTTP_METHODS.post,
    `nft/transfer/${nftId}`,
    null,
    body
  );
};

/**
 * Send a User-authorized HTTP request to withdraw an active NFT listing
 *
 * @param {string} nftId the DB object ID of the NFT
 * @returns HTTP DELETE request response with the newly withdrawn DB NFT object
 */
export const withdrawListingNFTRequest = (nftId) => {
  return createSignedRequest(
    HTTP_METHODS.delete,
    `nft/list/${nftId}`,
    null,
    null
  );
};

/**
 * Send a User-authorized HTTP request to edit an active NFT listing
 *
 * @param {number} price the new price of the listing
 * @param {string} nftId the DB object ID of the NFT
 * @returns HTTP PUT request response with the newly edited DB NFT object
 */
export const editListingNFTRequest = (price, nftId) => {
  const body = {
    price,
  };
  return createSignedRequest(HTTP_METHODS.put, `nft/list/${nftId}`, null, body);
};

/**
 * Send a User-authorized HTTP request to buy an NFT
 *
 * @param {string} myAddress wallet address of the NFT buyer
 * @param {number} price the price of the NFT
 * @param {string} nftId the DB object ID of the NFT
 * @returns HTTP POST request response with the newly bought DB NFT object
 */
export const buyNFTRequest = (myAddress, price, nftId) => {
  const body = {
    myAddress,
    fee: price,
  };
  return createSignedRequest(HTTP_METHODS.post, `nft/buy/${nftId}`, null, body);
};

/**
 * Send a User-authorized HTTP request to place an offer on a specific NFT
 *
 * @param {number} price price offered to purchase the NFT
 * @param {string} myAddress wallet address of the user making the offer
 * @param {string} nftId the DB object ID of the NFT
 * @returns HTTP POST request response with the newly placed DB Offer object
 */
export const placeOfferRequest = (price, myAddress, nftId) => {
  const body = {
    price,
    fromAddress: myAddress,
    tokenId: nftId,
  };
  return createSignedRequest(HTTP_METHODS.post, `offer`, null, body);
};

/**
 * Send a User-authorized HTTP request to withdraw a specific offer
 *
 * @param {string} offerId the DB object ID of the Offer
 * @returns HTTP PUT request response with the newly withdrawn DB Offer object
 */
export const withdrawOfferRequest = (offerId) => {
  return createSignedRequest(
    HTTP_METHODS.put,
    `offer/${offerId}/withdraw`,
    null,
    null
  );
};

/**
 * Send a User-authorized HTTP request to accept a specific offer
 *
 * @param {string} offerId the DB object ID of the offer
 * @returns HTTP POST request response with the newly purchased DB NFT object
 */
export const acceptOfferRequest = (offerId) => {
  return createSignedRequest(
    HTTP_METHODS.post,
    `offer/${offerId}/accept`,
    null,
    null
  );
};

/**
 * Post a User-authorized HTTP request to receive a signed URL for uploading assets to S3
 *
 * @param {string} nftId the DB object ID of the NFT
 * @param {string} ext the filetype extension of the video NFT asset
 * @returns HTTP POST request response with the signed URL and S3 URL
 */
export const getSignedURLNFT = (nftId, ext) => {
  const body = {
    contentType: "video",
    ext,
  };
  return createSignedRequest(
    HTTP_METHODS.post,
    `signedURLProvider/nft/${nftId}/urlFile`,
    null,
    body
  );
};

/**
 * Send a User-authorized HTTP request to update the S3 link for the NFT video asset
 *
 * @param {string} nftId the DB object ID of the NFT
 * @param {string} s3 URL of the uploaded S3 asset
 * @returns HTTP PUT request response with the updated DB NFT object
 */
export const updateNFT = (nftId, body) => {
  return createSignedRequest(HTTP_METHODS.put, `nft/${nftId}`, null, body);
};
