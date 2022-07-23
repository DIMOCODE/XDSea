import SecureLS from "secure-ls";

export const HTTP_PROVIDER = {
  50: "https://xdsearpc.blocksscan.io",
  51: "https://rpc.apothem.network",
};

const NETWORK_DICT = {
  50: "XDC Mainnet",
  51: "Apothem Network",
};

export const HEADER = {
  headers: [
    {
      name: "Access-Control-Allow-Origin",
      value: "*",
    },
  ],
};

export const DEFAULT_PROVIDER = HTTP_PROVIDER[50];
export const NETWORK_NAME = NETWORK_DICT[50];

export const LS = new SecureLS({
  encodingType: "rabbit",
  isCompression: true,
  encryptionSecret: process.env.REACT_APP_LS_SECRET_KEY,
});
export const LS_ROOT_KEY = "xdsea_metadata";
export const HTTP_METHODS = {
  post: "POST",
  get: "GET",
  put: "PUT",
  delete: "DELETE",
};
