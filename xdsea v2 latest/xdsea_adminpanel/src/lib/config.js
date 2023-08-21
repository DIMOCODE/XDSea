let key = {};
let IPFS_IMG = "https://xdsea.infura-ipfs.io/ipfs/";
var networkVersion = "";
var BNBProvider = "";
let Back_Url = "";
let decimalValues = 1000000000000000000;
var FRONT_URL = "";
var ImG = "";
var EnvName = "production";
var Front_market_Url = ''

if (EnvName === "local") {
  
}

if (EnvName === "stage") {

}

if (EnvName === "demo") {

}

if (EnvName === "production") {
  FRONT_URL = "https://www.xdsea.com";
  Front_market_Url = "https://www.xdsea.com";
  Back_Url = "https://api.xdsea.com/v1/admin";
  var image_url = "https://api.xdsea.com/v1/token";
  ImG = "https://api.xdsea.com/v1";
  var tradeAddress = "0xCDcE3724fBa95c29fca1c03F22e0fC77Da3C15c1";
  var singleAddress = "0x51cd989e1163abf8262bfcd7eb782d6ce1c1074a";
  var multipeAddress = "0x3e50c80f8a6a173a8059830d0cf0c9e5b04c43c0";
  var networkVersion = "50";
  var chainId = "0x50";
  BNBProvider = "https://xdc.blocksscan.io/";
  var Back_Url_Token = "https://api.xdsea.com/v1";
}

key = {
  AdminAPI: `${Back_Url}`,
  Back_Url: `${Back_Url_Token}`,
  chainId: chainId,
  BNBProvider: BNBProvider,
  tradeAddress: tradeAddress,
  singleAddress: singleAddress,
  multipeAddress: multipeAddress,
  ImG: ImG,
  IPFS_IMG: IPFS_IMG,
  AdminAddress: "0x60cB41875e410a3186c26e5802B2f6d08Bf16b4B",
  noimg: require("../assets/images/No_image.webp"),
  FRONT_URL: FRONT_URL,
  Front_market_Url:Front_market_Url,
  networkVersion:networkVersion
};

export default key;
