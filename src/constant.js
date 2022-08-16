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

{/* HTTP Provider for connecting to the blockchain */}
export const DEFAULT_PROVIDER = HTTP_PROVIDER[50];
export const NETWORK_NAME = NETWORK_DICT[50];

{/* Local Storage Encrypted Cookie Storage */}
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

export const AWS_CONFIG = {
  bucketName: process.env.REACT_APP_BUCKET_NAME,
  region: process.env.REACT_APP_REGION,
  accessKeyId: process.env.REACT_APP_ACCESS_ID,
  secretAccessKey: process.env.REACT_APP_ACCESS_KEY
};