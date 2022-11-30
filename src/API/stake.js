import { createRequest, createSignedRequest } from "./index";
import { HTTP_METHODS } from "../constant";

/**
 * Send an HTTP request to create a staking pool
 *
 * @param {string} collectionId the DB object ID of the collection
 * @param {number} lockPeriod the lock period
 * @param {Array} rewards array of objects that could have one of the following structures:
 * {
        "amount":number,
        "rewardFrecuency":number,
        "addressContract":string,
        "type":string (coin, nft, token), 
        "name":string,
        "color":string
    },
    {
        "amount":number,
        "rewardFrecuency":number,
        "rewardTypeId": string (ID of an existing reward type)
    }
 * @param {Array} nftsStakeables Array of nft DB ids
 * @param {Array} nftsBackedValues array of objects with the following structure:
 *  {
        "nftId":string, 
        "value":number 
    }
 * @param {boolean} isBackedValue 
 * @returns HTTP GET request response 
 */
export const createStakingPool = (
  collectionId,
  lockPeriod,
  rewards,
  nftsStakeables,
  nftsBackedValues,
  isBackedValue
) => {
  const body = {
    collectionId,
    rewards,
  };
  if (lockPeriod) {
    body.lockPeriod = lockPeriod;
  }
  if (nftsStakeables) {
    body.nftsStakeables = nftsStakeables;
  }
  if (nftsBackedValues) {
    body.nftsBackedValues = nftsBackedValues;
  }
  if (typeof isBackedValue === "boolean") {
    body.isBackedValue = isBackedValue;
  }
  return createSignedRequest(HTTP_METHODS.post, `stake/pool`, null, body);
};

/**
 * Send an HTTP request to update a staking pool
 *
 * @param {string} stakingPoolId the DB object ID of the staking pool
 * @param {number} lockPeriod the lock period
 * @param {Array} rewardRates This array will overide the existing array in the staking pool. Array of objects that could have one of the following structures:
 * {
        "amount":number,
        "rewardFrecuency":number,
        "addressContract":string,
        "type":string (coin, nft, token), 
        "name":string,
        "color":string
    },
    {
        "amount":number,
        "rewardFrecuency":number,
        "rewardTypeId": string (ID of an existing reward type)
    }

 * @returns HTTP GET request response 
 */
export const updateStakingPool = ({stakingPoolId, lockPeriod, rewardRates, nftsStakeables}) => {
  const body = {
    lockPeriod,
    rewardRates,
    nftsStakeables,
  };
  return createSignedRequest(
    HTTP_METHODS.put,
    `stake/pool/${stakingPoolId}`,
    null,
    body
  );
};

/**
 * Send an HTTP request to update backed value of a given nft
 *
 * @param {string} nftId nft DB id
 * @param {string} stakingPoolId staking pool DB id
 * @param {number} value new backed value
 * @returns HTTP GET request response
 */
export const updateBackedValueByNFT = (nftId, stakingPoolId, value) => {
  const body = {
    value,
  };
  return createSignedRequest(
    HTTP_METHODS.put,
    `stake/pool/backed/${nftId}/${stakingPoolId}`,
    null,
    body
  );
};

/**
 * Send an HTTP request to create a stake
 *
 * @param {string} nftId nft DB id
 * @param {string} stakingPoolId staking pool DB id
 * @returns HTTP GET request response
 */
export const createStake = (nftId, stakingPoolId) => {
  const body = {
    nftId,
    stakingPoolId,
  };
  return createSignedRequest(HTTP_METHODS.post, `stake`, null, body);
};

/**
 * Send an HTTP request to create a stake
 *
 * @param {string} stakeId stake DB id
 * @param {string} rewardTypeId rewardType DB id
 * @returns HTTP GET request response
 */
export const claimStakeReward = (stakeId, rewardTypeId) => {
  return createSignedRequest(
    HTTP_METHODS.post,
    `stake/reward/${stakeId}/${rewardTypeId}`,
    null,
    null
  );
};

/**
 * Send an HTTP request to get staking pools by collection
 *
 * @param {string} collectionId collection DB id
 * @returns HTTP GET request response
 */
export const getStakingPoolsByCollection = (collectionId) => {
  return createRequest(
    HTTP_METHODS.get,
    `stake/pool/${collectionId}`,
    null,
    null
  );
};

/**
 * Send an HTTP request to get stakes
 *
 * @param {number} page  pagination number
 * @param {string} collectionId [optional] collection DB id, use it to filter by collectionId
 * @param {string} userId [optional] user DB id, use it to filter by userId
 * @returns HTTP GET request response
 */
export const getStakes = (page, collectionId, userId) => {
  const params = {};
  if (collectionId) {
    params.collectionId = collectionId;
  }
  if (userId) {
    params.userId = userId;
  }
  return createRequest(HTTP_METHODS.get, `stake/${page}`, params, null);
};

/**
 * Send an HTTP request to withdraw a stake
 *
 * @param {number} stakeId stake DB id
 * @returns HTTP GET request response
 */
export const withdrawStake = (stakeId) => {
  return createSignedRequest(
    HTTP_METHODS.delete,
    `stake/${stakeId}`,
    null,
    null
  );
};

/**
 * Send an HTTP request to Stop a stake
 *
 * @param {number} stakeId stake DB id
 * @returns HTTP GET request response
 */
export const stopStake = (stakeId) => {
  return createSignedRequest(
    HTTP_METHODS.delete,
    `stake/stop/${stakeId}`,
    null,
    null
  );
};
