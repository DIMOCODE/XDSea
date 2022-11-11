import { createRequest } from "..";
import { HTTP_METHODS, LS } from "../../constant";
import speakeasy from "speakeasy";

/**
 * This function consumes the web servies for anonymous login and return the user information and tokens
 * @param  {String} wallet the wallet user
 * @return {[Promise<Any>]}      Axios Promise Response
 */

/**
 * This function consumes the web service for anonymous login and return the user information and tokens
 * 
 * @param {String} address the wallet address
 * @return {[Promise<Any>]} Axios Promise Response
 */
export const anonymousLogin = (address) => {
  const code = speakeasy.totp({
    secret: process.env.REACT_APP_TOTP_SECRET,
    step: 14,
  });
  const body = {
    XDCWallet: address,
  };
  const headers = { "x-auth-code": code };
  return createRequest(
    HTTP_METHODS.post,
    "anonymous/access",
    null,
    body,
    headers
  );
};

/**
 * This function cleans the user data from the local storage and logs the user out
 * 
 * @return {void} none
 */
export const logout = () => {
  LS.removeAll();
};
