import Web3 from 'web3';
import Trade from '../ABI/trade.json';
import { useSelector } from 'react-redux';
import config from "../lib/config.js"





export const useInstance = async(provider)=>{


  const web3 = new Web3(provider)

  
  if(web3){
    var contract_instance = await new web3.eth.Contract(
        Trade, config.tradeAddress
    );

    return contract_instance;
  }else{
  }


}


