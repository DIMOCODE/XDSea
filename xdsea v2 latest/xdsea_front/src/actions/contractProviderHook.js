 
import { useSelector } from 'react-redux';
import ERC721 from '../Abi/erc721.json'
import ERC1155 from '../Abi/erc1155.json'
import STAKING from '../Abi/staking.json'
import RETROSTAKING from '../Abi/retrostaking.json'
import ImportedCollAbi from '../Abi/importedContract.json'  // to check total supply of the imported collection
 
import Marketlayer from '../Abi/marketlayer.json'
 

import DETH from '../Abi/erc20.json'
import Market from '../Abi/market.json'
import config from '../config/config'
import Web3 from 'web3';
import Xdc3 from 'xdc3';
import Web3Utils from 'web3-utils'
import { NftbalanceUpdate } from './axioss/nft.axios';
import sing from "../Abi/erc721.json"
import { SendTransaction } from "xdc-connect";

export default function useContractProviderHook() {
    const { accountAddress, web3,web3p, coinBalance } = useSelector(state => state.LoginReducer.AccountDetails);
    const { sellerFees, buyerFees } = useSelector(state => state.LoginReducer.ServiceFees);
    
    const Contract_Base_Validation = () => {
        if (!web3) return 'Connect Your Wallet'
        if (!accountAddress) return 'Connect Your Wallet'
        if (!coinBalance) return "You Don't have Enough Balance"
        else return ''
    }

    const contrat_connection = async (...data) => {
        try{
            // var xdc3 = new Web3("https://erpc.xinfin.network/")
            if (web3) {
                var contract_value = await new web3.eth.Contract(
                    ...data
                );
                return contract_value;
            }
        }
        catch(e){
            console.log("contrat_connection catch error",e);
        }
       
    }

    const GetApproveStatus = async (data,Addr) => {
        try {

            var ConnectContract = await contrat_connection(data == 'Single' ? ERC721 : ERC1155,Addr)
            var contract_Method_Hash = await
                ConnectContract
                    .methods
                    .isApprovedForAll(accountAddress, config.TradeContract)
                    .call()


            return contract_Method_Hash

        }
        catch (e) {
            return 'error'
        }
    }
    const SetApproveStatus = async (data,Addr) => {
        try {
            
            var ConnectContract = await contrat_connection(data == 'Single' ? ERC721 : ERC1155,Addr)
            var encoded  =await
                ConnectContract
                    .methods
                    .setApprovalForAll(config.TradeContract, true)
                    .encodeABI();

            const tx = {
                        from: accountAddress,
                        to: Addr,
                        data: encoded,
                      };

            var gasLimit = await web3.eth.estimateGas(tx);
            tx["gas"] = gasLimit;
            
          var contract_Method_Hash = await SendTransaction(tx);

            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash,
            }
            return need_data;
        }
        catch (e) {
            return false
        }
    }
    const get_receipt = async (HashValue) => {
        try{
            var web3r = new Xdc3(config.RPC_URL)
        var receipt = await web3r.eth.getTransactionReceipt(HashValue);
        if (receipt) {
            return receipt
        }
        else {
            get_receipt(HashValue)
        }
        }
        catch(e){
            console.log("get_receipt catch error",e);
        }
        
    }
    const minting_721_1155 = async (...data) => {
        try {
             var _transactionHash;
            const ConnectContract = await contrat_connection(Market, config.TradeContract)
            let encoded  = await
                ConnectContract
                    .methods
                    .minting(...data)
                    .encodeABI();

            const tx = {
                        from: accountAddress,
                        to: config.TradeContract,
                        data: encoded,
                      };
            var gasLimit = await web3.eth.estimateGas(tx);
            tx["gas"] = gasLimit;
 

            var _transactionHash = await SendTransaction(tx);
            const receipt = await get_receipt(_transactionHash.transactionHash);

            
            var TokenCOunts = Web3Utils.hexToNumber(receipt.logs[2].topics[2])
 
            if (TokenCOunts) {
                var need_data = {
                    status: receipt.status,
                    HashValue: receipt.transactionHash,
                    tokenCounts: TokenCOunts
                }
                return need_data
            }
        }
        catch (e) {
            return false
        }


    }
    const approve_721_1155 = async (token_address, ...data) => {
        try {
               const ConnectContract = await contrat_connection(DETH, token_address)
                             let encoded = await ConnectContract
                                                  .methods
                                                  .approve(...data)
                                                  .encodeABI();

               const tx = {
                                                    from: accountAddress,
                                                    to: token_address,
                                                    data: encoded,
                                                  };

               var gasLimit = await web3.eth.estimateGas(tx);
               tx["gas"] = gasLimit;
               var contract_Method_Hash = await SendTransaction(tx);

                     
 
                                             
                    const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
                    var need_data = {
                        status: receipt.status,
                        HashValue: receipt.transactionHash,
                    }
                    return need_data
        }
        catch (e) {
 
            return false
        }
    }
    const Token_Balance_Calculation = async ( token_Address,data) => {

        try {
            const ConnectContract = await contrat_connection(DETH, token_Address)
            var bidAMt = await ConnectContract.methods.balanceOf(data).call();
            return Number(web3.utils.fromWei(String(bidAMt)))
        }
        catch (e) {

            return 0
        }
    }
    var buy_bid_price_calculation =  (val, decimal) => {
 
        var toMid   =   val     *    1000000
        var serfee = (toMid / 100000000) * (web3p.utils.fromWei(String(buyerFees?buyerFees:1)) * 1000000)
        var totfee = serfee + toMid
        var tot2cont = web3.utils.toWei(
            Number(String(Number(totfee / 1000000)).length) > 18
            ? String(Number(totfee / 1000000).toFixed(18))
            : String(Number(totfee / 1000000)))
        
        var dec =decimal == 18? 18: 18 - (decimal);
        if(dec == 18){
            var aprrove = web3.utils.fromWei(String(tot2cont))
          }
        else{
           var aprrove = tot2cont / 10 ** dec;
         }
         return  (aprrove)
    }
    const cancel_order_721_1155 = async (data) => {
        try {
            var ConnectContract = await contrat_connection(Market, config.TradeContract)
            var encoded = await
                ConnectContract
                    .methods
                    .cancelOrder(data)
                    .encodeABI();

            const tx = {
                        from: accountAddress,
                        to: config.TradeContract,
                        data: encoded,
                      };

            var gasLimit = await web3.eth.estimateGas(tx);
            tx["gas"] = gasLimit;
            var contract_Method_Hash = await SendTransaction(tx);
            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash,
            }
            return need_data;
        }
        catch (e) {
            return false
        }

    }
    var price_calculation = (data, roy) => {
        try {
            var price = web3 && web3.utils.toWei(data);
            var service_from_val = ((price * (sellerFees)) / 1e20)
            var royal_from_val = ((price * (roy * 1e18)) / 1e20)
            var my_val = 0, my_val_royal = 0, getVal = 0;
            if (String(service_from_val).includes('.') && String(service_from_val).split('.').pop().length > 18)
                my_val = service_from_val.toFixed(18)
            else
                my_val = service_from_val

            if (String(royal_from_val).includes('.') && String(royal_from_val).split('.').pop().length > 18)
                my_val_royal = royal_from_val.toFixed(18)
            else
                my_val_royal = royal_from_val
            var whole_val = (((price)) - my_val) / 1e18
            if (String(whole_val).includes('.') && String(whole_val).split('.').pop().length > 18)
                getVal = whole_val.toFixed(18)
            else
                getVal = whole_val
            //console(data, getVal, sellerFees, my_val, my_val_royal)
            return getVal

        }
        catch (e) {
           
            return false
        }
    }
    const place_order_721_1155 = async (...data) => {
        try {

            var ConnectContract = await contrat_connection(Market, config.TradeContract)
             let encoded= await
                ConnectContract.methods
                    .orderPlace(...data)
                    .encodeABI();

             const tx = {
                        from: accountAddress,
                        to: config.TradeContract,
                        data: encoded,
                      };

             var gasLimit = await web3.eth.estimateGas(tx);
             tx["gas"] = gasLimit;
             var contract_Method_Hash = await SendTransaction(tx);

            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
            var need_data = {
                status: receipt.status,
                HashValue: receipt.transactionHash,
            }
            return need_data
        }
        catch (e) {
            
            return false
        }

    }
    const buy_721_1155 = async (Send,CoinName,...data) => {
        try {
            
               const ConnectContract = await contrat_connection(Market,config.TradeContract)
               if (CoinName == config.COIN_NAME) {
                    var encoded = await
                        ConnectContract
                            .methods
                            .saleToken(...data)
                            .encodeABI();

                        const tx = {
                                from: accountAddress,
                                to: config.TradeContract,
                                data: encoded,
                                value: Send
                              };
                        var gasLimit = await web3.eth.estimateGas(tx);
                        tx["gas"] = gasLimit;
                        var contract_Method_Hash = await SendTransaction(tx);
                }
                else {
                    var encoded = await
                        ConnectContract
                            .methods
                            .saleWithToken(CoinName,...data)
                            .encodeABI();

                    const tx = {
                                from: accountAddress,
                                to: config.TradeContract,
                                data: encoded,
                              };
 

                var gasLimit = await web3.eth.estimateGas(tx);
                tx["gas"] = gasLimit;
                var contract_Method_Hash = await SendTransaction(tx);
                }
                const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
                var need_data = {
                    status: receipt.status,
                    HashValue: receipt.transactionHash,
                }
                return need_data
            }
        catch (e) {
            return false
        }

    }
    const allowance_721_1155 = async (token_Address,data) => {

        try {
            const ConnectContract = await contrat_connection(DETH, token_Address)
            var contract_Method_Hash = await
                                        ConnectContract
                                        .methods
                                        .allowance(data,config.TradeContract)
                                        .call()
                    return contract_Method_Hash

        }

        catch (e) {
            return false
        }

    }
const accept_721_1155 = async (...data) => {
        try {
            if (web3 != null) {
                const ConnectContract = await contrat_connection(Market,config.TradeContract)
                var encoded = await
                        ConnectContract
                            .methods
                            .acceptBId(...data)
                            .encodeABI();

                const tx = {
                                from: accountAddress,
                                to: config.TradeContract,
                                data: encoded,
                              };
                var gasLimit = await web3.eth.estimateGas(tx);
                tx["gas"] = gasLimit;
                var contract_Method_Hash = await SendTransaction(tx);



                     
                   const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
                    var need_data = {
                        status: receipt.status,
                        HashValue: receipt.transactionHash,
                          }
                    return need_data
                }}
                catch (e) {

                    return false
                }

            }


            const Trsanfer = async (ContractAddress,ContractType,Quantity,Add,Id) => {
                try {
                        const ConnectContract = await contrat_connection((ContractType === "721" || ContractType === 721 )?  ERC721 : ERC1155,ContractAddress)
                       if(ContractType == "721"|| ContractType == 721)
                        {
                            var encoded = await

                                ConnectContract
                                    .methods
                                    .safeTransferFrom(accountAddress,Add,Id)
                                    .encodeABI();

                                    const tx = {
                                        from: accountAddress,
                                        to: ContractAddress,
                                        data: encoded,
                                      };

      var gasLimit = await web3.eth.estimateGas(tx);
      tx["gas"] = gasLimit;

      var contract_Method_Hash = await SendTransaction(tx);
                                }
                                else{ var contract_Method_Hash = await
                                    ConnectContract
                                        .methods
                                        .safeTransferFrom(accountAddress,Add,Id,Quantity,[])
                                        .encodeABI();

                                        const tx = {
                                            from: accountAddress,
                                            to: ContractAddress,
                                            data: encoded,
                                          };

                                          var gasLimit = await web3.eth.estimateGas(tx);
                                          tx["gas"] = gasLimit;
                                    
                                          var contract_Method_Hash = await SendTransaction(tx);
 
                            const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
                            var need_data = {
                                status: receipt.status,
                                HashValue: receipt.transactionHash,
                                  }
                            return need_data
                        }
                    }
                        catch (e) {
    
                            return false
                        }
    
                    }

            const Burn = async (ContractAddress,ContractType,Quantity,Id) => {
                        try {
                                const ConnectContract = await contrat_connection((ContractType === "721" || ContractType === 721 )?  ERC721 : ERC1155,ContractAddress)
                               if(ContractType == "721"|| ContractType == 721)
                                {

                                    let encoded = await
                                        ConnectContract
                                            .methods
                                            .burnNFT(Id)
                                            .encodeABI();
                                            const tx = {
                                                from: accountAddress,
                                                to: ContractAddress,
                                                data: encoded,
                                              };

      var gasLimit = await web3.eth.estimateGas(tx);
      tx["gas"] = gasLimit;
      var contract_Method_Hash = await SendTransaction(tx);
                                        }
                                        else{

                                            let encoded = await
                                            ConnectContract
                                                .methods
                                                .burnNFT(Id,Quantity)
                                                .encodeABI();
                                            const tx = {
                                                from: accountAddress,
                                                to: ContractAddress,
                                                data: encoded,
                                              };

                                              var gasLimit = await web3.eth.estimateGas(tx);
                                              tx["gas"] = gasLimit;
                                              var contract_Method_Hash = await SendTransaction(tx);
 
                                    const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
                                    var need_data = {
                                        status: receipt.status,
                                        HashValue: receipt.transactionHash,
                                          }
                                    return need_data
                                }
                            }
                                catch (e) {
            
                                    return false
                                }
            
                            }

    
    /// ---<Bulk Mint

    const BulkMint_721_1155 = async (type,contract_address, ...data) => {
         var TokenIdArr = []
        
        try {
               const ConnectContract = await contrat_connection(
                (type == 721 | type =="721")?ERC721:ERC1155
                , contract_address)
                             var encoded = await
                                                        ConnectContract
                                                            .methods
                                                            .bulkMint(...data)
                                                            .encodeABI();
                            const tx = {
                            from: accountAddress,
                            to: contract_address,
                            data: encoded,
                            };

                                                              var gasLimit = await web3.eth.estimateGas(tx);
                                                              tx["gas"] = gasLimit;
                                                              var contract_Method_Hash = await SendTransaction(tx);
                const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
                var logs = receipt.logs

                for(let i = 0;i<logs.length;i++){
                if(i%2 != 0){
                    var TokenCOunts = Web3Utils.hexToNumber(logs[i].topics[2])
                    TokenIdArr.push(String(TokenCOunts))
                }
                }

           
                return {NftIdArray:TokenIdArr,HashValue:contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash};
                
        }
        catch (e) {
            return false
        }
    }


    const Current_NFT_Balance = async ( ownerdet,data) => {
        try {
            var currbalance;
            if((data.ContractType === "721" || data.ContractType === 721 )){
                const ConnectContract = await contrat_connection(ERC721 ,data.ContractAddress)
                currbalance = await ConnectContract.methods.ownerOf(ownerdet?.NFTId).call();
                if ((String(currbalance).toLowerCase()) === (String(ownerdet?.NFTOwner).toLowerCase())) { return 1; }
                else {
                    let payload = {
                        NFTId: ownerdet?.NFTId,
                        NFTOwner: ownerdet?.NFTOwner,
                        NFTBalance: "0",
                      }
                      
                    var balupd = await NftbalanceUpdate(payload);
                }
            }
            else{
                const ConnectContract = await contrat_connection(ERC1155,data.ContractAddress)
                currbalance = await ConnectContract.methods.balanceOf(ownerdet.NFTOwner,ownerdet.NFTId).call();
                if (currbalance !== null && currbalance !== undefined) {
                    let payload = {
                        NFTId: ownerdet.NFTId,
                        NFTOwner: ownerdet.NFTOwner,
                        NFTBalance: currbalance,
                    }
                    var balupd = await NftbalanceUpdate(payload);
              
                  }
            }
            return String(currbalance);
        }
        catch (e) {
            return 0
        }
    }

 
    const cartbuy_721_1155 = async (coinAmount,...data) => {
        try {
               const ConnectContract = await contrat_connection(Market,config.TradeContract)
                     var encoded = await
 

                        ConnectContract
                            .methods
                            .bulkBuy(...data)
                            .encodeABI();

                            const tx = {
                                from: accountAddress,
                                to: config.TradeContract,
 
                                data:encoded,
                                value:coinAmount
                                
                              };
 

                              var gasLimit = await web3.eth.estimateGas(tx);
                              tx["gas"] = gasLimit;
                              var contract_Method_Hash = await SendTransaction(tx);
                const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
                var need_data = {
                    status: receipt.status,
                    HashValue: receipt.transactionHash,
                }
                return need_data
            }
        catch (e) {
            return false
        }

    }


    ///deploy staking contract


    ///---->  Approval function for staking contract
    const StakeNftInContract = async (stakingContract, tokenId, wallet,type,contract_address) => {
        try {


          
           var nftcontract  = await contrat_connection((type == 721 | type =="721")?ERC721:ERC1155, contract_address)

           var contract_Method_Hash = await
                  nftcontract
                   .methods
                   .isApprovedForAll(accountAddress, stakingContract)
                   .call()
      
    if(contract_Method_Hash) return true
    else{
        var encoded = await

        nftcontract
            .methods
            .setApprovalForAll(stakingContract, true)
            .encodeABI();

            const tx = {
                from: accountAddress,
                to: contract_address,
                data: encoded,
              };

              var gasLimit = await web3.eth.estimateGas(tx);
              tx["gas"] = gasLimit;
             var contract_Method_Hash = await SendTransaction(tx);
    }

  
      const receipt = await get_receipt(contract_Method_Hash.transactionHash ? contract_Method_Hash.transactionHash : contract_Method_Hash);
       var need_data = {
           status: receipt.status,
           HashValue: receipt.transactionHash,
       }
               return need_data;




        }
        catch (e) {
            return false
        }
    }

    /// stake call

 
    const NftStake = async(stakingContractAdd, ...data)=>{
 
        try{
            var stakingContract = await contrat_connection(
                (String(stakingContractAdd).toLowerCase == String(config.RETROSTAKE_ADDRESS).toLowerCase()?RETROSTAKING:STAKING),stakingContractAdd)

            var encoded = await

            stakingContract
                    .methods
                    .stake(...data)
                    .encodeABI();

                    const tx = {
                        from: accountAddress,
                        to: stakingContractAdd,
                        data: encoded,
                      };

                      var gasLimit = await web3.eth.estimateGas(tx);
      tx["gas"] = gasLimit;
 
      var response = await SendTransaction(tx);
            const receipt2 = await get_receipt(response.transactionHash ? response.transactionHash : response);
            var need_data2 = {
                status: receipt2.status,
                HashValue: receipt2.transactionHash,
            }
            return need_data2;
        }
        catch(err){
            return false
        }
    }

    // claim call

    const claimedRewards = async (stakingContractAdd,wallet,...data) => {

        try {


            var stakingContract = await contrat_connection(
                (String(stakingContractAdd).toLowerCase == String(config.RETROSTAKE_ADDRESS).toLowerCase()?RETROSTAKING:STAKING),
                stakingContractAdd)
            var encoded = await stakingContract
                    .methods
                    .claimRewards(...data)
                    .encodeABI();
 

                    const tx = {
                        from: accountAddress,
                        to: stakingContractAdd,
                        data: encoded,
                      };
 
                    //   var web3j = new Web3(config.RPC_URL);
                      var gasLimit = await web3.eth.estimateGas(tx);
                      tx["gas"] = gasLimit;
 

                      var response = await SendTransaction(tx);

            const receipt2 = await get_receipt(response.transactionHash ? response.transactionHash : response);
            var need_data2 = {
                status: receipt2.status,
                HashValue: receipt2.transactionHash,
            }
            return need_data2;

        }
        catch (e) {
            return false
        }
    }

    // update eligiblity

    const UpdateEligibility = async(stakingContractAdd, wallet, tokenId, isEligible)=>{
 
      
        try{
            var stakingContract = await contrat_connection(
                (String(stakingContractAdd).toLowerCase == String(config.RETROSTAKE_ADDRESS).toLowerCase()?RETROSTAKING:STAKING),
                stakingContractAdd)
            // var response = await
            var encoded = await

            stakingContract
                    .methods
                    .updateEligibility(tokenId,isEligible)
                    .encodeABI();
                    const tx = {
                        from: accountAddress,
                        to:stakingContractAdd,
                        data: encoded,
                      };

                      var gasLimit = await web3.eth.estimateGas(tx);
                      tx["gas"] = gasLimit;
                      var response = await SendTransaction(tx);
   return response
        }
        catch(err){
            return false
        }
    }


        // update eligiblity

        const UpdateBackedValue = async(stakingContractAdd, wallet, tokenId, backedValue)=>{
 

            try{
                var stakingContract = await contrat_connection(
                    (String(stakingContractAdd).toLowerCase == String(config.RETROSTAKE_ADDRESS).toLowerCase()?RETROSTAKING:STAKING),
                    stakingContractAdd)

                // var response = await
                var encoded = await

                stakingContract
                        .methods
                        .updateBackedValues(tokenId,backedValue)
                        .encodeABI();
                        const tx = {
                            from: accountAddress,
                            to:stakingContractAdd,
                            data: encoded,
                          };
                          var gasLimit = await web3.eth.estimateGas(tx);
                          tx["gas"] = gasLimit;
      var response = await SendTransaction(tx);
       return response
            }
            catch(err){
                return false
            }
        }


    // withdraw
    const withdraw = async (stakingContractAdd, rewardContract, wallet,tokencontract,...data) => {
 
        try {


            var stakingContract = await contrat_connection(
                (String(stakingContractAdd).toLowerCase == String(config.RETROSTAKE_ADDRESS).toLowerCase()?RETROSTAKING:STAKING),
                stakingContractAdd)
        
            // var response = await
            var encoded = await

            stakingContract
                    .methods
                    .withdraw(...data)
                    .encodeABI();
                    const tx = {
                        from: accountAddress,
                        to: stakingContractAdd,
                        data: encoded,
                      };
                      var gasLimit = await web3.eth.estimateGas(tx);
                      tx["gas"] = gasLimit;
      var response = await SendTransaction(tx);
            const receipt2 = await get_receipt(response.transactionHash ? response.transactionHash : response);
            var need_data2 = {
                status: receipt2.status,
                HashValue: receipt2.transactionHash,
            }
            return need_data2;

        }
        catch (e) {
            return false
        }
    }
    // monkey colleciton withdraw
    const withdraw_retro = async (stakingContractAdd, rewardContract, wallet,tokencontract,...data) => {
     
            try {
    
    
                var stakingContract = await contrat_connection(
                    (String(stakingContractAdd).toLowerCase == String(config.RETROSTAKE_ADDRESS).toLowerCase()?RETROSTAKING:STAKING),
                    stakingContractAdd)
                var encoded = await
    
                stakingContract
                        .methods
                        .withdraw(...data)
                        .encodeABI();

                        const tx = {
                            from: accountAddress,
                            to: stakingContractAdd,
                            data: encoded,
                          };
                          var gasLimit = await web3.eth.estimateGas(tx);
                          tx["gas"] = gasLimit;
                var response = await SendTransaction(tx);
                const receipt2 = await get_receipt(response.transactionHash ? response.transactionHash : response);
                var need_data2 = {
                    status: receipt2.status,
                    HashValue: receipt2.transactionHash,
                }
                return need_data2;
    
            }
            catch (e) {
                return false
            }
        }
    

    // getLockPeriod

    const getLockPeriod = async(stakingContract,nftid)=>{
        try{


           var Contract =  await new web3.eth.Contract(
            (String(stakingContract).toLowerCase == String(config.RETROSTAKE_ADDRESS).toLowerCase()?RETROSTAKING:STAKING),stakingContract)
        //    var init_time = await Contract.methods.timeOfPoolInitialization().call()

            var lock_time_seconds = await Contract.methods.lockInPeriod().call()
            var stakedata = await Contract.methods.stakedNFTs(nftid).call()
            var timeofstake = stakedata?.timeOfStake
            var lockperiod = new Date( (Number(timeofstake) + Number(lock_time_seconds))*1000) 


            return lockperiod
        }
        catch(err){
            return false
        }
    }
    

    const setrewards= async()=>{
   try{
 
    var Contract =  await new web3.eth.Contract(STAKING,"0x7514121C6818378797D34bE97e38e75aF033820A")
     var resp = Contract.methods.setRewards(
        ["0xe831eaD7180DAD1c3995002dd2fc366428D68D03"],
        [1],
        [3600],
        [1],
        [1682432850458]
        ).send({
            from: "0x025c1667471685c323808647299e5DbF9d6AdcC9"
        }).on('transactionHash', (transactionHash) => {
            return transactionHash
        })
   }
   catch(err){
    console.log("err",err);
   }
    }


    const GetSupply = async (importedAddress) => {
 
        try {
            if(web3){
                //---> If Wallet Connected
                const ConnectContract = await contrat_connection(ImportedCollAbi,importedAddress)
 
                var contract_Method_Hash = await
                                            ConnectContract
                                            .methods
                                            .totalSupply()
                                            .call()
    
 
                        return contract_Method_Hash
            }else{
                //----> If Wallet not Connected

                var AccessConnection  = new Web3(config.RPC_URL)
                const ConnectContract = await new AccessConnection.eth.Contract(ImportedCollAbi,importedAddress)
 
                var contract_Method_Hash = await
                                            ConnectContract
                                            .methods
                                            .totalSupply()
                                            .call()
    
 
                        return contract_Method_Hash
            }
       

        }

        catch (e) {
 
            return false
        }

    }
 

    
    const WithdrawListing = async (markeraddress,...data) => {
        try {

            var ConnectContract = await contrat_connection(Marketlayer,markeraddress)
              var encoded  = await
                ConnectContract
                    .methods
                    .withdrawListing(...data)
                    .encodeABI();

               const tx = {
                        from: accountAddress,
                        to: markeraddress,
                        data: encoded,
                      };

     var gasLimit = await web3.eth.estimateGas(tx);
     tx["gas"] = gasLimit;
     var response = await SendTransaction(tx);
     return response
        }
        catch (e) {
            return false
        }
    }

    const CancelMarketBidCall = async (markeraddress,...data) => {
        try {

            var ConnectContract = await contrat_connection(Marketlayer,markeraddress)
              var encoded  = await
                ConnectContract
                    .methods
                    .cancelAuction(...data)
                    .send({
                        from: accountAddress,
                        value:0
                    }).on('transactionHash', (transactionHash) => {
                        return transactionHash
                    })

                    return encoded


          
        }
        catch (e) {
            return false
        }
    }
 
    

    return {
        Contract_Base_Validation,
        GetApproveStatus,
        SetApproveStatus,
        minting_721_1155,
        approve_721_1155,
        Token_Balance_Calculation,
        buy_bid_price_calculation,
        cancel_order_721_1155,
        price_calculation,
        place_order_721_1155,
        buy_721_1155,
        allowance_721_1155,
        accept_721_1155,
        Trsanfer,
        Burn,
        BulkMint_721_1155,
        Current_NFT_Balance,
        cartbuy_721_1155,
        StakeNftInContract,
        UpdateEligibility,
        claimedRewards,
        withdraw,
        NftStake,
        getLockPeriod,
        setrewards,
        UpdateBackedValue,
        get_receipt,
        GetSupply,
        WithdrawListing,
        CancelMarketBidCall,
        withdraw_retro
 
    };
    
    

    
}
 