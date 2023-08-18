 
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import Xdc3 from "xdc3"
import Config from "../config/config"; 
import erc20Abi from '../Abi/erc20.json'
import marketAbi from '../Abi/market.json'
import { toast } from "react-toastify";
// import { ethers } from "ethers";

export const connectWallet = async (type) => {
  var accountDetails = {}
  var web3Obj = {}
  
  if (type == "MetaMask" || type == 'BinanceWallet' || type == 'Coinbase') {
    web3Obj = await MetamaskWallet(type)
    
  }
  if( type == 'WalletConnect'){
     web3Obj = await WalletConnect(type)
  }
  if (web3Obj) {
    try {
      var web3p = new Xdc3(Config.RPC_URL)
      const accounts = await web3Obj?.eth?.getAccounts();
      accountDetails.accountAddress = accounts[0]?.toString()?.toLowerCase();
 
       accountDetails.coinBalance = await web3Obj.eth.getBalance(accountDetails.accountAddress)
       
      accountDetails.web3p = web3p;
    
      // var conObj = new web3Obj.eth.Contract(
      //   erc20Abi, Config.erc20Address
      // )
      accountDetails.web3 = web3Obj;
      accountDetails.tokenBalance =0
      //  await conObj.methods.balanceOf(accountDetails.accountAddress).call()
      return accountDetails;
    }
    catch (e) {
      // console.log("find ee",e)
      return accountDetails;
    }
  }
}

export const MetamaskWallet = async (type) => {
  //var accountDetails = {}
  var web3 
  try {
    if (window.ethereum && type == 'MetaMask') {
      web3 = new Web3(window.ethereum);

      if(window.ethereum.isDcentWallet == true){
        const chainId = await web3.eth.getChainId();
        if (parseInt(chainId) != parseInt(Config.CHAIN_ID)) {
          // await chainIdCheck()
            // return true
            return toast.error(`connect to ${Config.CHAIN_NAME} Network`)
         }
        await window.ethereum.enable().then(async () => {
          // User has allowed account access to DApp...
          const accounts = await web3.eth.getAccounts();
          const account = accounts[0].toString().toLowerCase();
          localStorage.setItem("accountInfo", account)
          localStorage.setItem('walletConnectType', type)
        });
      }
     else if(window.ethereum.isMetaMask == true){
       
        const chainId = await web3.eth.getChainId();

        if (parseInt(chainId) != parseInt(Config.CHAIN_ID)) {
            await chainIdCheck()
              // return true
        }
          await window.ethereum.enable().then(async () => {
            // User has allowed account access to DApp...
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0].toString().toLowerCase();
            // console.log("account",account)
            localStorage.setItem("accountInfo", account)
            localStorage.setItem('walletConnectType', type)
          });
          
      }
      else{
        // alert("Please Uninstall CoinbaseWallet or Connect to Coinbase")
        // alert("fialed")
        return false;
      }
      // return web3;
     
    }
    else if(window.BinanceChain && type == 'BinanceWallet'){
      web3 = new Web3(window.BinanceChain);
      const chainId = await web3.eth.getChainId();
      ////console("accountDetails type id",chainId,web3)
      if (parseInt(chainId) != parseInt(Config.CHAIN_ID)) {
        chainIdCheck()
        return true
      }
        await window.BinanceChain.enable().then(async () => {
          // User has allowed account access to DApp...
          const accounts = await web3.eth.getAccounts();
          const account = accounts[0].toString().toLowerCase();
          localStorage.setItem("accountInfo", account)
          localStorage.setItem('walletConnectType', type)
        });
    }
    else if(window.ethereum && type == 'Coinbase'){
      web3 = new Web3(window.ethereum);
        const chainId = await web3.eth.getChainId();
        ////console("accountDetails type id",chainId,web3)
        if (parseInt(chainId) != parseInt(Config.CHAIN_ID)) {
          chainIdCheck()
          return true
        }
          await window.ethereum.enable().then(async () => {
            // User has allowed account access to DApp...
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0].toString().toLowerCase();
            localStorage.setItem("accountInfo", account)
            localStorage.setItem('walletConnectType', type)
          });
      
    }
    // Legacy DApp Browsers
    else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
      const chainId = await web3.eth.getChainId();
      if (parseInt(chainId) != parseInt(Config.CHAIN_ID)) {
        chainIdCheck()
        return true
      }
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0].toString().toLowerCase();
      localStorage.setItem("accountInfo", account)
      localStorage.setItem('walletConnectType', type)
    }
    // Non-DApp Browsers
    else {
      //alert('No Dapp Supported Wallet Found');
      ////console("No Dapp Supported Wallet Found")
    }
    
  } catch (e) {
    console.log("accountDetails type id1 last",e)
  }
  // console.log("return web3;",web3);
  return web3;

}

export const WalletConnect = async (type) => {

  var web3
  //Create WalletConnect Provider
  ////console("Wallet connect");
  const provider = new WalletConnectProvider({
    rpc: {
      50: "https://rpc.xdcrpc.com/",
    },
    network: 'xdc',
    chainId: 50,
  }
  );

  await provider.enable().then(function (error, result) {
   // //console('error: ' + error);
   // //console("accountInfo", result);
    
  })
    .catch(e => {
      //try again
    });
  web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  //console("Account : ", accounts[0]);
  const account = accounts[0].toString().toLowerCase();
  localStorage.setItem("accountInfo", account)
  localStorage.setItem('walletConnectType', type)
  ////console("accountInfo", account);
  // localStorage.setItem("provider",JSON.stringify(provider))
  return web3;
}

const chainIdCheck = async (e) => {
  // Check if MetaMask is installed
  // MetaMask injects the global API into window.ethereum
  const hexString = Config.CHAIN_ID.toString(16);
  if (window.ethereum) {
    try {
      // check if the chain to connect to is installed

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: "0x" + hexString }], // chainId must be in hexadecimal numbers
      });
      return true;
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: "0x" + hexString,
                rpcUrl: Config.RPC_URL,
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error(error);
    }
  } else {
    // if no window.ethereum then MetaMask is not installed
    //console('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    return false;

  }
}

export const getServiceFees = async () => {
  var rpcObj = new Web3(Config.RPC_URL)   
  var fees = {}
  if(rpcObj){
    try{
      var marketObj = new rpcObj.eth.Contract(
        marketAbi,
        Config.TradeContract
      );
      var servicefees = await marketObj.methods.getServiceFee().call()
      fees.buyerFees = servicefees[0]
      fees.sellerFees = servicefees[1]
      
      return fees;
    }
    catch(e){
      //console("service fees catch blok running",e)
    }
  }
}
 