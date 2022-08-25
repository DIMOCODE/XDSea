import { createRequest } from "..";
import { HTTP_METHODS, LS } from "../../constant";
import speakeasy from "speakeasy";
/**
 * This function consumes the web servies for anonymous login and return the user information and tokens
 * @param  {String} wallet the wallet user
 * @return {[Promise<Any>]}      Axios Promise Response
 */
export const anonymousLogin = (wallet) => {
  const code = speakeasy.totp({
    secret: process.env.REACT_APP_TOTP_SECRET,
    step: 14,
  });

  const body = {
    XDCWallet: wallet,
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
export const logout = () => {
  LS.removeAll();
};
