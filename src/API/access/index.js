import { createRequest } from "..";
import { HTTP_METHODS, LS } from "../../constant";
/**
 * This function consumes the web servies for anonymous login and return the user information and tokens
 * @param  {String} wallet the wallet user
 * @return {[Promise<Any>]}      Axios Promise Response
 */
export const anonymousLogin = (wallet) => {
  const body = {
    XDCWallet: wallet,
  };
  return createRequest(HTTP_METHODS.post, "anonymous/access", null, body);
};
/**
 * This function clean the user data from the local storage
 * @return { void }      none
 */
export const logout = () => {
  LS.removeAll();
};
