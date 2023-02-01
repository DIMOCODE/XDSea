import SecureLS from "secure-ls";
import domainjs from "xdcdomainjs";

export const HTTP_PROVIDER = {
  50: "https://xdsearpc.blocksscan.io",
  51: "https://apothem.xdcrpc.com",
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

{
  /* HTTP Provider for connecting to the blockchain */
}
export const DEFAULT_PROVIDER = HTTP_PROVIDER[51];
export const NETWORK_NAME = NETWORK_DICT[51];

{
  /* Local Storage Encrypted Cookie Storage */
}
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

const xdcDomainConfig = {
  testnet: {
    rpcUrl: "",
    contractAddress: "",
  },
  mainnet: {
    rpcUrl: "https://xdsearpc.blocksscan.io/",
    contractAddress: "xdc295a7ab79368187a6cd03c464cfaab04d799784e",
  },
  defaultNetwork: "mainnnet",
};

const xdcSdk = domainjs.SDK(xdcDomainConfig);

export const getXdcDomain = async (address) => {
  const xdcDomain = await xdcSdk.getDomain(address);
  return xdcDomain;
};

export const getXdcOwner = async (domain) => {
  const xdcAddress = await xdcSdk.getOwner(domain, false);
  return xdcAddress;
};

export const WIZARD_STEPS = {
  step1: "step1",
  step2: "step2",
  step3: "step3",
  step4: "step4",
  step5: "step5",
};
export const WIZARD_STATUS = {
  published: "published",
  error: "error",
  review: "review",
  creating: "creating",
  admin: "admin",
};
