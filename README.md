# XDSea | Opensource NFT Marketplace for XDC Network

Run the webpage on localhost using:

```shell
npm i 
npm start
```
To run the most recent version of the webpage, switch to the UI-Integration branch.

# Dev mode and live mode

To run the webpage on XDC Mainnet, no changes are required.

To run the webpage on XDC Testnet, in src/constant.js, change:

```shell
export const DEFAULT_PROVIDER = HTTP_PROVIDER[50]
export const NETWORK_NAME = NETWORK_DICT[50]
```

to

```shell
export const DEFAULT_PROVIDER = HTTP_PROVIDER[51]
export const NETWORK_NAME = NETWORK_DICT[51]
```

Also, in src/config.js, change:

```shell
export const nftmarketaddress = "0xb3C8209b6b24F1185c9b358c2aCb6446d3530ccc"
export const nftaddress = "0x85d216d87C993c250A7725aF8f6C161d0504c32B"
export const nftmarketlayeraddress = "0xFC8fd5C4CfE35b0AD7f1b02C851968E42F85e45A"
```

to

```shell
export const nftmarketaddress = "0x5F22351A7434D07E491467a7d540E02aaEE51428"
export const nftaddress = "0xf7808A8253A7e893d0851723E3d6CF59D6Cc2519"
export const nftmarketlayeraddress = "0xC42023c4595786E1a3D8Ba2ae5945e991223Ff99"
```

To switch back to the Mainnet, the changes will need to be rolled back.

For simplicity and testing, the Mainnet version will be available by building the project, and the Testnet version will be available on https://dev.xdsea.com for UX testing.