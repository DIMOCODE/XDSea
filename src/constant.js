
export const HTTP_PROVIDER = {
    50: "https://xdsearpc.blocksscan.io",
    51: "https://apothemrpc.blocksscan.io",
};

const NETWORK_DICT = {
    50: "XDC Mainnet",
    51: "Apothem Network"
}

export const DEFAULT_PROVIDER = HTTP_PROVIDER[50]
export const NETWORK_NAME = NETWORK_DICT[50]