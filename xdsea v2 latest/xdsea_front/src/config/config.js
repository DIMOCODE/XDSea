  
 
// import ERC721 from '../../src/Abi/erc721.json'
// import ERC1155 from '../../src/Abi/erc1155.json'
// import TRADE from '../../src/Abi/market.json'

var EnvName = 'production';

var key = {};
key.KEY = 'CardBo@rD1290%6Fine3'
key.ONEDAYINSECONDS = 0
key.BLOCKS_PER_YEAR = 0
key.RPAD_ADDRESS = ''
key.ROUTER = ''
key.EMAIL           =   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
key.MOBILE          =   /^\d{10}$/
key.NumOnly         =   /^\d+$/
key.PASSWORD        =   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
key.OnlyAlbhabets   =   /^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/
key.notSpecil       =   /^[a-zA-Z0-9]+$/
key.OnlyAlphSpecial =   /^[A-Za-z_@.#&+-]*$/
key.IPFS            =   ' '
key.limit = 50
key.NumDigitOnly = /[^0-9\.]/g
key.NumberOnly = /[^0-9]/g
if(EnvName === "demo") {
   
}
else if(EnvName === "stage") {
    
}
else if(EnvName === "production") {
    key.FRONT_URL       =   'https://www.xdsea.com'
    key.BACK_URL        =   'https://api.xdsea.com/v1/front'
    key.ADMIN_URL        =   'https://api.xdsea.com/v1/admin'
    key.IMG_URL         =   'https://api.xdsea.com'
    key.RPC_URL         =   "https://rpc.xdcrpc.com/"
    key.CHAIN_ID        =    50
    key.COIN_NAME        =   "XDC"
    key.DEADADDRESS     =   '0x000000000000000000000000000000000000dEaD'
    key.erc20Address    =   '0x8a3cc832bb6b255622e92dc9d4611f2a94d200da'
    key.TradeContract   =   '0xCDcE3724fBa95c29fca1c03F22e0fC77Da3C15c1'   
    key.ERC721          =   '0x51cd989e1163abf8262bfcd7eb782d6ce1c1074a'   
    key.ERC1155         =   '0x3e50c80f8a6a173a8059830d0cf0c9e5b04c43c0'
    key.CHAIN_NAME        =   "XDC" 
    key.RETROSTAKE_ADDRESS        =   "0x4101e8Ad5A9977dd23421F6404c6D0449be0e813"

}
else{

    



}
export default key;
 