
export const HTTP_PROVIDER = {
    50: "https://xdsearpc.blocksscan.io",
    51: "https://rpc.apothem.network",
};

const NETWORK_DICT = {
    50: "XDC Mainnet",
    51: "Apothem Network"
}

export const HEADER = {
    headers: [{
        name: 'Access-Control-Allow-Origin',
        value: '*'
    }]
}

export const DEFAULT_PROVIDER = HTTP_PROVIDER[51]
export const NETWORK_NAME = NETWORK_DICT[51]