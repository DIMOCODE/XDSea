import dotenv from 'dotenv'
dotenv.config({path:`./env/.env.${process.env.NODE_ENV}`})
console.log("process.env.NODE_ENV",process.env.NODE_ENV)

var EnvName             =    process.env.NODE_ENV;
console.log('EnvName : api : ', EnvName);
const Key   =   {
    PORT        :   process.env.PORT,
    MONGOURI    :   process.env.MONGOURI,
    SECRET_KEY   :   process.env.SECRET_KEY,
    ADMIN_ADDRESS :  process.env.ADMIN_ADDRESS,
    IPFS_IMG       :    'https://ipfs.io/ipfs/',
    EndPoint        :   'https://ipfs.infura.io:5001',
    keyEnvBased    : {},
    IPFSPASS        :   process.env.IPFSPASS,
    IPFSKEY        :   process.env.IPFSKEY,
    CLIENT_ID        :   process.env.CLIENT_ID,
    CLEINT_SECRET        :   process.env.CLEINT_SECRET,
    REDIRECT_URI        :   process.env.REDIRECT_URI,
    REFRESH_TOKEN        :   process.env.REFRESH_TOKEN,
    SITE_URL            :   process.env.SITE_URL,
    MoralisserverUrl    :   "",
    MoralisappId    :   "",
    provider    :   process.env.provider,
    // Chain       :   EvmChain.BSC


    // -----> aws s3 bucket credentials
    accesskeyid    :    process.env.accesskeyid,
    secretkey   :    process.env.secretkey,
    bucketName    :    process.env.bucketName,

    //----->xdsea ipfs credentials

    REACT_APP_PROJECT_ID      :  process.env.REACT_APP_PROJECT_ID,
    REACT_APP_PROJECT_SECRET  :  process.env.REACT_APP_PROJECT_SECRET,
    ipfsurl                   :  'https://xdsea.infura-ipfs.io/ipfs/'  ,
    TradeContract   :   '0xCDcE3724fBa95c29fca1c03F22e0fC77Da3C15c1',   // Bulk Mint Added
    ERC721          :   'xdc51cd989e1163abf8262bfcd7eb782d6ce1c1074a',   
    ERC1155         :  'xdc3e50c80f8a6a173a8059830d0cf0c9e5b04c43c0' ,
    rpcurl                    :"https://rpc.xdcrpc.com/",
    COIN_NAME                 :"XDC",
  
    RewardTypes:{
        NFT: "nft",
        COIN: "coin",
        TOKEN: "token",
      }
    


                         
}

Key.keyEnvBased = {
    emailGateway: {
        
        fromMail: " ",
        nodemailer: {

            
            host: "smtp.zeptomail.com",
            port: "465",
            secure: true,
            auth: {
                user: "",
                pass: ""
            },
        }
    }     
}




export default Key;