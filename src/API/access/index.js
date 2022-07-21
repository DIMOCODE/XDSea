import { createRequest } from "..";
import { HTTP_METHODS, LS } from "../../constant";

export const anonymousLogin = (wallet) => {
  const body = {
    XDCWallet: wallet,
  };
  return createRequest(HTTP_METHODS.post, "anonymous/access", null, body);
};
export const logout = () => {
  LS.removeAll();
};
