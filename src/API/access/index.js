import { createRequest } from "..";
import { HTTP_METHODS, LS } from "../../constant";

/**
 * This function consumes the web service for anonymous login and return the user information and tokens
 * @param {String} address the wallet address
 * @return {[Promise<Any>]} Axios Promise Response
 */
export const anonymousLogin = (address) => {
  const body = {
    XDCWallet: address,
  };
  return createRequest(HTTP_METHODS.post, "anonymous/access", null, body);
};

/**
 * This function cleans the user data from the local storage and logs the user out
 * @return {void} none
 */
export const logout = () => {
  LS.removeAll();
};
