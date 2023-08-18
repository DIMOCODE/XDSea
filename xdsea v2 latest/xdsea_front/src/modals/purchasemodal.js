import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

import useContractProviderHook from "../actions/contractProviderHook.js";
import { useNavigate } from "react-router-dom";
import { Container, Dropdown, DropdownButton, Modal, Button } from 'react-bootstrap'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../config/config.js"
import moment from "moment"
import { isEmpty, NumANdDotOnly } from "../actions/common";
import { BuyAccept } from "../actions/axioss/nft.axios";
toast.configure();


export function BuyNow({ OpenPopup, closePop, owner, item }) {

   const { currency } = useSelector(state => state.LoginReducer)
   const { web3, web3p, accountAddress, coinBalance } = useSelector(state => state.LoginReducer.AccountDetails);
   // console.log('coinnnnballl',coinBalance,web3p.utils.fromWei(coinBalance.toString()))
   const { buyerFees,sellerFees } = useSelector(state => state.LoginReducer.ServiceFees);
   //console.log('getServiceFees',buyerFees,sellerFees)
   const ContractCall = useContractProviderHook()
   const  push = useNavigate()
   // const AxiosFile = useAxiosFile()
   const { payload } = useSelector(state => state.LoginReducer.User)

   const [Btn, SetBtn] = useState('start')
   const [PurchaseStarted, SetPurchaseStarted] = useState(false)
   const [App_Btn, SetApp_Btn] = useState(owner.CoinName != config.COIN_NAME ? 'init' : "start")
   const [Error, SetError] = useState('')
   const [NFTQuantity, SetNFTQuantity] = useState(1)
   const [TokenBalance, SetTokenBalance] = useState('0')
   const[show10,setShow10]=useState(false);
   const [proccedbuy,setproccedbuy] = useState(false)
   const handleClose10 = () => closePop();
   const [proceedtopayment, setProceedtopayment] = useState(false);
   const decimal = currency?.filter(item => item.label === owner.CoinName)?.pop()?.decimal ?? 18
   // console.log('aaaaaaabbbb',currency,currency?.filter(item => item.label === owner.CoinName))
   const token_address = currency?.filter(item => item.label === owner.CoinName)?.pop()?.address ?? config.DEADADDRESS
   const YouWillGet = useMemo(() => { return ContractCall.buy_bid_price_calculation((owner.NFTPrice * NFTQuantity).toString(), decimal.toString()) }, [owner.TokenPrice, NFTQuantity])
   const Validation = async () => {
      var error = {};
      if (isEmpty(NFTQuantity)) return "Token Quantity Required"
      else if(owner.NFTBalance<NFTQuantity) return error.NFTQuantity= "NFT Quantity should be less than "+owner.NFTBalance
      if (owner.CoinName != 'ETH' && ((owner.TokenPrice * NFTQuantity) > TokenBalance)) return "Insufficient Balance"
      else return await ContractCall.Contract_Base_Validation()
   }

   const FormSubmit = async () => {
      SetPurchaseStarted(true)
    const id = toast.loading('In Progress')
    SetError('')
    SetBtn('process')
    var error = await Validation()
    if (error) {
       toast.update(id, { render: error, type: 'error', isLoading: false, autoClose: 1000,closeButton:true,closeOnClick:true })
       SetBtn('error')
       SetError(error)
    }
    else {
       let cont = await ContractCall.approve_721_1155(token_address, config.TradeContract, web3p.utils.toWei(YouWillGet.toString()))
       if (cont) {
          toast.update(id, { render: 'Approved Successfully!', type: 'success', isLoading: false, autoClose: 1000,closeButton:true,closeOnClick:true })
          SetBtn('done')
          SetApp_Btn('start')
       }
       else {
          toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000,closeButton:true,closeOnClick:true })
          SetBtn('try')
       }

    }
 }

 useEffect(() => {
    (async () => {
       const TokenBalance = await ContractCall.Token_Balance_Calculation(token_address, accountAddress)
       SetTokenBalance(TokenBalance ? TokenBalance : 0)
    })()
 }, [token_address])

 
 useEffect(()=>{
   var val = currency?.find(data => data.label == owner?.CoinName)?.usd
   setUsdVal(val)
 },[owner])

 const [usdVal,setUsdVal] = useState(0)
 

 const _Buy = async () => {
    SetPurchaseStarted(true)
 
    SetApp_Btn('process')
    const id = toast.loading('In Progress')
    var error = await Validation();
    SetError(error)
    if(isEmpty(error)){
    let cont = await ContractCall.buy_721_1155(web3p.utils.toWei(YouWillGet.toString()), owner.CoinName, owner.NFTOwner, [owner.NFTId, web3p.utils.toWei(String(owner.NFTPrice * NFTQuantity)), NFTQuantity, item.ContractType], item.ContractAddress)
    if (cont) {
       let newOwner = {
          HashValue: cont.HashValue,
          NewTokenOwner: accountAddress,
          NFTQuantity: NFTQuantity,
          NFTId: owner.NFTId,
          NFTOwner: owner.NFTOwner,
          PutOnSale: owner.PutOnSale,
          PutOnSaleType: owner.PutOnSaleType,
          activity: "Buy",
          TP: owner.NFTPrice,
          CN: owner.CoinName,
          click: `${config.FRONT_URL}/info/${item.CollectionNetwork}/${item.ContractAddress}/${accountAddress}/${owner.NFTId}`,
          isStakeable:owner.isStakeable,
          backedValue:owner.backedValue,
          CollectionName:item.CollectionName,
         //  usdprice:Number(owner.NFTPrice)*Number(usdVal),
         //  usdvolume:Number(NFTQuantity)*Number(usdVal)*Number(owner.NFTPrice)
         usdprice:Number(owner.NFTPrice),
         usdvolume:Number(NFTQuantity)*Number(owner.NFTPrice)

       }
       
 
       let Resp = await BuyAccept({ newOwner: newOwner, item: item })
       if (Resp.success == 'success') {
          toast.update(id, { render: 'Successfully Purchsed', type: 'success', isLoading: false, autoClose: 1000 ,closeButton:true,closeOnClick:true})
          SetApp_Btn('done')
          push('/my-item/'+payload.CustomUrl);
       }
       else {
          toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000,closeButton:true,closeOnClick:true })
          SetApp_Btn('try')
       }
    }
    else {
       toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000,closeButton:true,closeOnClick:true })
       SetApp_Btn('try')
    }
    }
    else{
       toast.update(id, { render: 'Validation failed', type: 'error', isLoading: false, autoClose: 1000,closeButton:true,closeOnClick:true })
    }
 }

 const onChange = (e) =>{
    // console.log('vallll',e.target.value)
    SetNFTQuantity(e.target.value)
 }


 const triggerbuy = ()=>{
    setproccedbuy(true)
 }


    return(
        <> 
        <Modal
        show={OpenPopup}
        // onHide={handleCloseBuyNow}
        backdrop="static"
        keyboard={false}
        scrollable={false}
        centered
        className='whole_modal_text_align'

      >
 
        <Modal.Header className="modal_theme_align" >
          <Modal.Title>Purchase</Modal.Title>
          <button type="button" class="btn-close" aria-label="Close" onClick={closePop}></button>

        </Modal.Header>
        <Modal.Body className=' common_modal_body modal_theme_align'>
        <div className=" common_modal_table_dtls w-100  mt-3">
                    <p className=" purchase_modal_quantitytxt_align ">Seller</p>
                    <p className="purchase_modal_quantitytxt_align ">Buyer</p>
                </div>
                <div className=" common_modal_table_dtls w-100">
                    <p className="placebid_dtls_txt"> {owner.DisplayName ? owner.DisplayName : (owner.NFTOwner).slice(0,7).concat("...")}</p>
                    <p className="placebid_dtls_txt">{payload?.DisplayName ? payload?.DisplayName : (payload.WalletAddress).slice(0,7).concat("..")}</p>
                </div>

                <div className=" common_modal_table_dtls w-100">
                    <p className="placebid_dtls_txt">Price   </p>
                    <p className="placebid_dtls_txt">{owner.NFTPrice} {owner.CoinName}</p>
                </div>
                <div className=" common_modal_table_dtls w-100">
                    <p className="placebid_dtls_txt">Your balance</p>
                    <p className="placebid_dtls_txt">{ owner.CoinName != config.COIN_NAME ? TokenBalance : web3p.utils.fromWei(coinBalance.toString()) } {owner.CoinName}</p>
                </div>
                <div className=" common_modal_table_dtls w-100">
                    <p className="placebid_dtls_txt">Service fee</p>
                    <p className="placebid_dtls_txt">{web3p.utils.fromWei(String(buyerFees))}% {owner.CoinName}</p>
                </div>
                <div className=" common_modal_table_dtls w-100">
                    <p className="placebid_dtls_txt">Royalty fee</p>
                    <p className="placebid_dtls_txt">{(item.NFTRoyalty)}% {owner.CoinName}</p>
                </div>
                <div className=" common_modal_table_dtls w-100">
 
                    <p className="placebid_dtls_txt">You will Pay</p>
                    <p className="placebid_dtls_txt">{YouWillGet} {owner.CoinName}</p>
                </div>
                {(owner.NFTBalance != '1' || owner.NFTBalance != 1)&&
<>
                <p className="purchase_modal_quantitytxt_align">Enter Qunatity</p>

                <input
          type="text"
          id="NFTQuantity"
          value={NFTQuantity}
          onChange={(e) => SetNFTQuantity(Number(e.target.value))}
          name="NumOnly"
          className='common_modal_input mt-1' 
          disabled={owner.NFTBalance == '1' || owner.NFTBalance == 1 || PurchaseStarted? true : false}
          placeholder="Enter your bid quantity"
        />
 
        </>}
 
        {Error && ( <span className="text-danger img-file">{Error}</span>)}


               
                <div className="place_bid_modalbtn mt-3">
                {owner.CoinName == config.COIN_NAME ?null:
                <button type="button" class="btn me-1 cancel_modal_btn_align" data-toggle="modal"
                 data-target="#hideBuyNowModal"
                 disabled    =   {Btn == 'error' || Btn === "process"  ||  Btn ==="done" ? true : false} 
                 onClick     =   {Btn == 'start' || Btn === "try" ? FormSubmit : null}
                 >{Btn == 'start' && 'Approve' 
                 ||Btn == 'try' && 'Try-Again'
                 ||Btn == 'error' && 'Error' 
                 ||Btn == 'done' && 'Done' 
                 ||Btn == 'process' && 'In-Progress' 
                  }</button>}
                <button className="cancel_modal_btn_align me-1"
                 disabled    =   {Btn!='done' && App_Btn=='init'|| App_Btn == 'error' || App_Btn === "process"  ||  App_Btn ==="done" ? true : false} 
                 onClick     =   {App_Btn == 'start' || App_Btn === "try" ? _Buy : null}>
                  {App_Btn == 'start' && 'Proceed to payment' 
         ||App_Btn == 'try' && 'Try-Again'
         ||App_Btn == 'error' && 'Error' 
         ||App_Btn == 'done' && 'Done' 
         ||App_Btn == 'process' && 'In-Progress' 
         ||App_Btn == 'init' && 'Proceed to payment' 
          }</button>
              </div>
        </Modal.Body>
       
      </Modal>
     
      </>
    )

}