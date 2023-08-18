import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { isEmpty, NumANdDotOnly, NumberOnly } from "../actions/common";
import useContractProviderHook from "../actions/contractProviderHook.js";
import { useNavigate ,useLocation} from "react-router-dom";
import { Container, Dropdown, DropdownButton, Modal, Button } from 'react-bootstrap'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../config/config.js"
import moment from "moment"
import { BidApprove } from "../actions/axioss/nft.axios";
toast.configure();


export function Accept({ OpenPopup, bidder,closePop,bid, owner,  item,file,type,thumb,approvestatus }) {
      //  console.log("bidder accept",bidder,item,owner,bid?.isStakeable,bid?.backedValue)
    const { currency } = useSelector(state => state.LoginReducer)
    const { web3, accountAddress ,coinBalance } = useSelector(state => state.LoginReducer.AccountDetails);
    const { sellerFees } = useSelector(state => state.LoginReducer.ServiceFees);
    const ContractCall = useContractProviderHook()
    const  navigate  = useNavigate()
 const location = useLocation()

    // console.log('accepppttt',item)
    const { payload } = useSelector(state => state.LoginReducer.User)
    const [Btn, SetBtn] = useState('start')
    const [Error, SetError] = useState({})
    const [TokenQuantity, SetTokenQuantity] = useState('1')
    const [TokenBal, SetTokenBal] = useState(0)
    const[show6,setShow6]=useState(true);
    const [TokenBtn, SetTokenBtn] = useState("start");
 
    const [usdVal,setUsdVal] = useState(0)


    const handleClose6 = () => setShow6(false);
    const token_address  = (currency)?.filter(item=>item.label == bidder?.CoinName)?.pop()?.address ?? '0x7CAB80ce0E55F46378E493B584eE61aD68878f11'
    

    useEffect(()=>{
      var val = currency?.find(data => data.label == bidder?.CoinName)?.usd
      setUsdVal(val)
    },[bidder])

 
      // console.log('rshfrstdhtd',owner)
      useEffect(()=>{
        BalCal(token_address)
      },[])

 
      useEffect(()=>{
       if(bidder.Pending) SetTokenQuantity(String(bidder.Pending))
      },[bidder])

 
      const BalCal  = async (data)  =>  {
       let  TokenBal =  await ContractCall.Token_Balance_Calculation(data??token_address,bidder?.TokenBidderAddress)
       SetTokenBal(TokenBal)
      }
  
 
     const YouWillGet = useMemo(() => { 
      return ContractCall.price_calculation((bidder?.TokenBidAmt*TokenQuantity).toString()) 
      
    
    }, [bidder?.TokenBidAmt,TokenQuantity])

    // const YouWillGet = 0
 
    const Validation    =   async()  =>   {
      var Error = {}
      if(isEmpty(TokenQuantity)) Error.TokenQuantity  = "Must Select Atleast One Token"
      else if(Number(TokenQuantity) % 1 !== 0) Error.TokenQuantity  = "Token Quantity Must Be Valid"
      if(await ContractCall.Contract_Base_Validation())  Error.Wal  = await ContractCall.Contract_Base_Validation()
      if(!isEmpty(TokenQuantity)) {
      if((TokenQuantity * bidder?.TokenBidAmt) > web3.utils.fromWei(String(await ContractCall.allowance_721_1155(token_address,bidder?.TokenBidderAddress)?await ContractCall.allowance_721_1155(token_address,bidder?.TokenBidderAddress):0))) Error.Wal  = "Bidder Doesn't have enough Allowance"
      if((TokenQuantity * bidder?.TokenBidAmt) > TokenBal ) Error.Wal  = "Bidder Doesn't have enough Balance"
      if((TokenQuantity > bidder?.Pending)) Error.Wal  = `Token Quantity Must Be less Than ${bidder?.Pending}`
      }
      return Error
    }
    const TokenApproveCall = async () => {
      SetTokenBtn("process");
      const id = toast.loading("Approve Processing");
      const cont = await ContractCall.SetApproveStatus((item.ContractType == 721 || item.ContractType == "721") ? 'Single' : 'Multiple', item.ContractAddress);
      toast.update(id, {
          render: cont ? "Approved Successfully" : "Approved Failed",
          type: cont ? "success" : "error",
          isLoading: false,
          autoClose: 1000,
          closeButton:true,
          closeOnClick:true
      });
      if (cont.status) {
          SetTokenBtn("done");
          SetBtn('start')
      } else SetTokenBtn("try");
  };

    const FormSubmit = async () => {
        const id = toast.loading('Accepting Token on processing')
        SetError({})
        SetBtn('process')
       var error = await Validation()
        if (!isEmpty(error)) {
            toast.update(id, { render: Object.values(error)[0], type: 'error', isLoading: false, autoClose: 1000,closeButton:true,closeOnClick:true})
            SetBtn('error')
            SetError(error)
        }
        else {
        toast.update(id, { render: 'In Progress', type: 'success', isLoading: false,autoClose:1000,closeButton:true,closeOnClick:true}) 
          let cont = await ContractCall.accept_721_1155(bidder?.CoinName,
            bidder?.TokenBidderAddress,
            [item.NFTId,web3.utils.toWei(String(bidder?.TokenBidAmt*TokenQuantity)),TokenQuantity,bidder?.ContractType],
              bidder?.ContractAddress)

            if(cont){
              var FormValue = {
                TokenBidderAddress   : bidder?.TokenBidderAddress,
                NFTQuantity        : TokenQuantity,
                NFTId              : item.NFTId ,
                ContractAddress      : item.ContractAddress ,
                CollectionNetwork      : item.CollectionNetwork ,
                ContractType         : item.ContractType ,
                from                  : 'accept',
                item                 :  item,
                newOwner             :  {
                  HashValue : cont.HashValue,
                  NewTokenOwner : bidder?.TokenBidderAddress,
                  NFTQuantity    :   TokenQuantity,
                  NFTId : item.NFTId,
                  NFTOwner : owner?.NFTOwner,
                  PutOnSale   :   owner?.PutOnSale,
                  PutOnSaleType   : owner?.PutOnSaleType,
                  TP: owner.PutOnSaleType == "FixedPrice" ? owner?.NFTPrice : bidder?.NFTPrice,
                  CN: owner.PutOnSaleType == "FixedPrice" ? owner?.CoinName : bidder?.CoinName,
                  activity                  : 'Accept',
				          Category	:	item.Category,
                  New_EmailId : bidder?.EmailId,
                  Old_EmailId : payload?.EmailId,
                  isStakeable:bid.isStakeable,
                  backedValue:bid.backedValue,
                  CollectionName:item.CollectionName,
                  // usdprice:Number(bidder.TokenBidAmt)*Number(usdVal),
                  // usdvolume:Number(bidder.Pending)*Number(usdVal)*Number(bidder.TokenBidAmt),
                  usdprice:Number(bidder.TokenBidAmt),
                  usdvolume:Number(bidder.Pending)*Number(bidder.TokenBidAmt),
 

                click : `${config.FRONT_URL}/info/${item.CollectionNetwork}/${item.ContractAddress}/${bidder?.TokenBidderAddress}/${owner?.NFTId}`
                }
              }
 

              let Resp = await BidApprove(FormValue)
                if (Resp.success == 'success') {
                toast.update(id, { render: 'Accepting Token Successfully', type: 'success', isLoading: false, autoClose: 1000,closeButton:true,closeOnClick:true })
                SetBtn('done')
                setShow6(false)
                if(location?.pathname?.includes("my-item")) window.location.reload()
                else navigate(`/my-item/${payload?.CustomUrl}`)
              }
              else {
                toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000,closeButton:true,closeOnClick:true })
                SetBtn('try')
              }
            }
            else { 
              toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000,closeButton:true,closeOnClick:true })
              SetBtn('try')
         }
        
       
        }
    }

 
   const onChange = async(e,data)  => {
    SetError({})
    SetBtn('start')
    SetTokenQuantity(e.target.value)
   }

return( 
  
<Modal
        show={show6}
        // onHide={handleClosePlaceaBid}
        backdrop="static"
        keyboard={false}
        centered
        scrollable={false}
        className='whole_modal_text_align'

      >
        <Modal.Header className="modal_theme_align" >
          <Modal.Title>Accept Bid</Modal.Title>
          <button type="button" class="btn-close" aria-label="Close" onClick={closePop}></button>

        </Modal.Header>
        <Modal.Body className='common_modal_body modal_theme_align'>
     
        <p className="text-center">You are about to accept bid for <b>{item.NFTName}</b> from <b> {bidder?.TokenBidderAddress}</b>
 
        {" "}{bidder?.TokenBidAmt + ' '+ bidder?.CoinName} per token for {Number(TokenQuantity)} Edition(s)</p>
 
        {/* <p >Quantity</p>
          <input
                type="text"
                name="TokenQuantity"
                id="TokenQuantity"
                value={TokenQuantity}
                onChange={(e)=>onChange(e,'inp')}
               
                disabled={owner?.NFTBalance  ==  '1' || owner?.NFTBalance  ==  1? true : false }
                placeholder="Enter your quantity"
              /> */}
    
                <div className="common_modal_table_dtls w-100">
                    <p className="placebid_dtls_txt">Service fee</p>
                    <p className="placebid_dtls_txt">{web3.utils.fromWei(String(sellerFees))}% {bidder?.CoinName}</p>
                </div>
                <div className="common_modal_table_dtls w-100">
                    <p className="placebid_dtls_txt">Royalty </p>
                    <p className="placebid_dtls_txt"> {item.NFTRoyalty}%</p>
                </div>
                <div className="common_modal_table_dtls w-100">
                    <p className="placebid_dtls_txt">You will get : </p>
                    <p className="placebid_dtls_txt"> {YouWillGet}{bidder?.CoinName}</p>
                </div>
                

               
                <div className="place_bid_modalbtn load_more_btn_align">

                {approvestatus === 'open' &&
                <button type="button" class="btn btn-secondary w-100 modal_btn_align" data-toggle="modal"
                            disabled={(TokenBtn == 'process' || TokenBtn == 'done') ? true : false}
                            onClick={(TokenBtn == 'start' || TokenBtn == 'try') ? TokenApproveCall : null}
                            disableRipple
            
                 >   {TokenBtn == 'start' && 'Approve'}
                 {TokenBtn == 'process' && 'In-Progress'}
                 {TokenBtn == 'try' && 'Try-Again'}
                 {TokenBtn == 'done' && 'Done'}</button>}


             
                <button className="btn  w-100 cancel_modal_btn_align"
                 disabled={Btn == 'error' || Btn === "process" || Btn === "done" ? true : false}
                 onClick={(Btn == 'start' || Btn === "try") ? FormSubmit : null}>
                     {Btn == 'start' && 'Accept Bid'
                                   || Btn == 'try' && 'Try-Again'
                                   || Btn == 'error' && 'Error'
                                   || Btn == 'done' && 'Done'
                                   || Btn == 'process' && 'In-Progress'
                                   || Btn == "putonsale" && "List"
                               }
                 </button>
              </div>

        </Modal.Body>
       
      </Modal>

)
}