import moment from "moment";
import { HOURS_BY_TIME, KEYS_TIME } from "../constant";
/**
 * Check if a wallet address has an "xdc" prefix
 *
 * @param {string} address wallet address to check
 * @returns true if the wallet address has an "xdc" prefix and false if it has a "0x" prefix
 */
export const isXdc = (address) => {
  if (address?.substring(0, 3) === "xdc") return true;
  else return false;
};

/**
 * Convert an "xdc" prefix wallet address to a "0x" prefix wallet address
 *
 * @param {string} address wallet address to be converted
 * @returns wallet address with a "Ox" prefix
 */
export const fromXdc = (address) => "0x" + address?.substring(3);

/**
 * Convert a "0x" prefix wallet address to an "xdc" prefix wallet address
 *
 * @param {string} address wallet address to be converted
 * @returns wallet address with an "xdc" prefix
 */
export const toXdc = (address) => "xdc" + address?.substring(2);

/**
 * Get a truncated string for displaying wallet address
 *
 * @param {string} address wallet address that is to be truncated
 * @returns wallet address truncated for display
 */
export const truncateAddress = (address) => {
  return address
    ? address.substring(0, 5) + "..." + address.substring(38)
    : "undefined";
};

export const calculatePeriod = (timeInHours) => {
  if (timeInHours % HOURS_BY_TIME.YEAR === 0) {
    return `${timeInHours / HOURS_BY_TIME.YEAR} years`;
  }
  if (timeInHours % HOURS_BY_TIME.MONTH === 0) {
    return `${timeInHours / HOURS_BY_TIME.MONTH} months`;
  }
  if (timeInHours % HOURS_BY_TIME.WEEK === 0) {
    return `${timeInHours / HOURS_BY_TIME.WEEK} weeks`;
  }
  if (timeInHours % HOURS_BY_TIME.DAY === 0) {
    return `${timeInHours / HOURS_BY_TIME.DAY} days`;
  }
  return `${timeInHours} hours`;
};
