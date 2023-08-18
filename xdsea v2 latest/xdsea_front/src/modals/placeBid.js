import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { isEmpty, NumANdDotOnly, NumberOnly } from "../actions/common";
import useContractProviderHook from "../actions/contractProviderHook.js";
import { useNavigate } from "react-router-dom";
import { Container,Dropdown,DropdownButton,Modal,Button,Row,Col,Form,InputGroup } from 'react-bootstrap'

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../config/config.js"
import moment from "moment"
import { BidApprove } from "../actions/axioss/nft.axios";
toast.configure();


export function Bid({ OpenPopup, bidder, closePop, bid, owner, item }) {


    const { currency } = useSelector(state => state.LoginReducer)
    const { web3, accountAddress, coinBalance } = useSelector(state => state.LoginReducer.AccountDetails);
    const { buyerFees } = useSelector(state => state.LoginReducer.ServiceFees);
    const ContractCall = useContractProviderHook()
    const push = useNavigate()
    const { payload } = useSelector(state => state.LoginReducer.User)
    const [Btn, SetBtn] = useState('start')
    const [Error, SetError] = useState({})
    const [TokenQuantity, SetTokenQuantity] = useState('1')
    const [TokenBal, SetTokenBal] = useState(0)
    const [show7, setShow7] = useState(true);
  
    const handleClose7 = () => setShow7(false);
    // console.log('hgdfhdshh',bidder,bid,owner,item)
    const [selectedOption, setSelectedOption] = useState(null);
    const [FormValue, SetFormValue] = useState({
      TokenBidderAddress: accountAddress,
      // TokenOwner_Name   : owner.ProfileUrl,
      Category: item.Category,
      NFTQuantity: isEmpty(bidder) ? 1 : bidder.NFTQuantity,
      TokenBidAmt: isEmpty(bidder) ? 0 : bidder.TokenBidAmt,
      NFTId: item.NFTId,
      ContractAddress: item.ContractAddress,
      ContractType: item.ContractType,
      CollectionNetwork: item.CollectionNetwork,
      CoinName: isEmpty(bidder) ? currency?.filter(item => item.label !== config.COIN_NAME)?.length > 0 ? currency.filter(item => item.label !== config.COIN_NAME)[0].label : 'WETH' : bidder.CoinName
   
    })
    
  
    useEffect(() => {
      BalCal(FormValue.CoinName)
    }, [])
  
    const BalCal = async (data) => {
      let TokenBal = await ContractCall.Token_Balance_Calculation(Token_details.token_address, accountAddress)
      SetTokenBal(TokenBal)
    }
  
    const Token_details = useMemo(() => {
      var data = currency?.filter(item=>item.label === FormValue.CoinName)?.pop() ?? currency?.filter(item=>item.label !== config.COIN_NAME)?.pop()
      return {
        decimal: data?.decimal ?? 18,
        token_address: data?.address ?? config.DEADADDRESS
      }
    }, [FormValue.CoinName])
  
    const YouWillGet = useMemo(() => { return ContractCall.buy_bid_price_calculation((FormValue.TokenBidAmt * FormValue.NFTQuantity).toString(), Token_details.decimal.toString()) }, [FormValue.TokenBidAmt, FormValue.NFTQuantity])
  
    const Validation = async () => {
      // console.log('validddddd',(Number(FormValue.NFTQuantity) % 1 !== 0),FormValue,FormValue.TokenBidAmt <= Number(owner.NFTPrice))
      var Error = {}
      if (isEmpty(FormValue.TokenBidAmt)) Error.TokenBidAmt = "Must Enter Bid Amount"
      if (isEmpty(FormValue.NFTQuantity)) Error.NFTQuantity = "Must Select Atleast One Token"
      else if(Number(owner.NFTBalance)<Number(FormValue.NFTQuantity)) Error.NFTQuantity = "Token Quantity Must be less than token Available"
      else if(Number(FormValue.NFTQuantity) % 1 !== 0) Error.NFTQuantity = "Token Quantity Must be a Valid Count"
      if (ContractCall.Contract_Base_Validation()) Error.Wal = await ContractCall.Contract_Base_Validation()
      if (!isEmpty(bid)) {
        if (FormValue.TokenBidAmt <= bid.TokenBidAmt) Error.TokenBidAmt = "Must Be greater Than " + bid.TokenBidAmt
      }
      else if(owner?.PutOnSaleType === "TimedAuction"){
        if (FormValue.TokenBidAmt < Number(owner.NFTPrice)) Error.TokenBidAmt = "Minimum Bid is " + owner.NFTPrice
      }
      return Error
    }
  
    const FormSubmit = async () => {
      const id = toast.loading('Bidding in progress')
      SetError({})
      SetBtn('process')
      var error = await Validation()
      // console.log('RFGSFGRG',error)
      if (!isEmpty(error)) {
        toast.update(id, { render: Object.values(error)[0], type: 'error', isLoading: false, autoClose: 1000,closeButton:true,closeOnClick:true })
        SetBtn('error')
        SetError(error)
      }
      else {
        let allow = web3.utils.fromWei((await ContractCall.allowance_721_1155(Token_details.token_address, accountAddress)) ?String(await ContractCall.allowance_721_1155(Token_details.token_address, accountAddress)): '0')
        // console.log('fhfhfa',Token_details,accountAddress,Number(allow))
        let cont = await ContractCall.approve_721_1155(Token_details.token_address, config.TradeContract, web3.utils.toWei(String(Number(YouWillGet) + Number(allow))))
        if (cont) {
          var _data = FormValue
          _data.HashValue = cont.HashValue
          // _data.TokenOwner = owner.TokenOwner
          _data.from = isEmpty(bidder) ? 'Bid' : 'Edit'
          _data.activity = isEmpty(bidder) ? 'Bid' : 'Edit'
          _data.EmailId = payload.EmailId
          _data.click = `${config.FRONT_URL}/info/${item.CollectionNetwork}/${item.ContractAddress}/${owner.NFTOwner}/${owner.NFTId}`
          _data.CollectionName = item.CollectionName
  
          let Resp = await BidApprove(_data)
          if (Resp.success == 'success') {
            toast.update(id, { render: 'Make offer for token Successfully', type: 'success', isLoading: false, autoClose: 1000,closeButton:true,closeOnClick:true })
            SetBtn('done')
            closePop();
            setTimeout(() => {
              window.location.reload();
            }, 1500);
            // push(`/my-item/${payload?.CustomUrl}`)
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
  
    const onChange = async (e, data) => {
      let oii = (data === "price") ? e : e.target
      SetBtn('start')
      const { value, id, name } = oii
      let val = (data === "price") ? "CoinName" : id
      SetFormValue({ ...FormValue, ...{ [val]: data === "inp" ? (name == "NumDotOnly" ? NumANdDotOnly(value) : NumberOnly(value)) : value } })
      if (data === "price") {
        BalCal(value)
      }
    }


     
  const styles = {
    option: (styles, {isFocused, isSelected,siHovered}) => ({
      ...styles,
      color: "white",
      background: isFocused
          ? 'rgba(60,88,203,1)'
          : isSelected
              ? '#262626 '
              : "#262626 ",
      zIndex: 1,
      cursor:"pointer"
  }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: '66px',
      padding: '0 6px',
      backgroundColor: "rgba(60,88,203,1)",
    borderRadius: 30,
    padding:10
    
    }),
    control: (provided, state) => ({
      ...provided,
      height: '66px',
      borderRadius:30,
      backgroundColor: "#fff",
      border:'none'
     
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '66px',
      position: 'absolute',
      right: 0,
      top: 0,
      color:'#fff' 
    }),    
    singleValue: (provided, state) => ({
      ...provided,
      color: "#fff"
    }),
    menuList: base => ({
      ...base,
      // kill the white space on first and last option
      padding: 0
    })
  };




    return (
        <Modal
        show={show7}
        // onHide={handleClosePlaceaBid}
        backdrop="static"
        keyboard={false}
        scrollable={false}
        centered
        className='whole_modal_text_align'

      >
        <Modal.Header className="modal_theme_align" >
      

          <Modal.Title>Place Bid</Modal.Title>
          <button type="button" class="btn-close" aria-label="Close" onClick={closePop}></button>
        </Modal.Header>
        <Modal.Body className='burn_token_body common_modal_body modal_theme_align'>
       

                <p className="text-center">You are about to place Bid for {item.NFTName} from {owner.NFTOwner}</p>

                <div>
                    <h4>Enter Bid</h4>
                 
                 <InputGroup className="mb-3">
        <Form.Control
          placeholder="e.g.10"
          aria-label="Recipient's username"
          className='baseName_inputgroup'
          aria-describedby="basic-addon3"
                              maxLength=""                
                              autoComplete="off"
                             id="TokenBidAmt"
                  value={FormValue.TokenBidAmt}
                  name="NumDotOnly"
                  onChange={(e) => onChange(e, 'inp')}
                              // value={NFTFormValue.NFTPrice}
        />
      
          
       
        <InputGroup.Text id="basic-addon2" className="input_group_text_align">
          <Select
                                                // defaultValue={selectedOption}
                                                value={{label:FormValue.CoinName}}
                                                onChange={(e) => { onChange(e, 'price') }}
                                                options={currency?.filter(item => item.label != config.COIN_NAME  )}
                                                id='CoinName'
                                                isSearchable={false}
                               
                                                styles={styles} className="border_blue_selectOne"
                                            /></InputGroup.Text>
      </InputGroup>
                </div>
            <p className="pt-3 text-center">Bids below this amount won't be allowed. If you not enter any amount we will consider as 0</p>

            <p className="text-left pb-2">Enter Quantity <span>({owner.NFTBalance} available)</span></p>
            <input
          type="text"
          id="NFTQuantity"
          value={FormValue.NFTQuantity}
          onChange={(e) => onChange(e, 'inp')}
          name="NumOnly"
          className="common_modal_input mt-1"
          disabled={owner.NFTBalance == '1' || owner.NFTBalance == 1 ? true : false}
          placeholder="Enter your bid quantity"
        />


                <div className="common_modal_table_dtls w-100 mt-3">
                    <p className="placebid_dtls_txt">Your balance</p>
                    <p className="placebid_dtls_txt">{web3.utils.fromWei(coinBalance)} {config.COIN_NAME}</p>
                </div>
                <div className="common_modal_table_dtls w-100 ">
                    <p className="placebid_dtls_txt">Your Bidding balance</p>
                    <p className="placebid_dtls_txt">{TokenBal} {FormValue.CoinName}</p>
                </div>
                <div className="common_modal_table_dtls w-100 ">
                    <p className="placebid_dtls_txt">Service fee</p>
                    <p className="placebid_dtls_txt">{web3.utils.fromWei(String(buyerFees))}% {FormValue.CoinName}</p>
                </div>
                <div className="common_modal_table_dtls w-100 ">
                    <p className="placebid_dtls_txt">You Will Pay</p>
                    <p className="placebid_dtls_txt">{YouWillGet} {FormValue.CoinName}</p>
                </div>
                

               
                <div className="place_bid_modalbtn">
                <button type="button" class=" btn w-100 cancel_modal_btn_align" data-toggle="modal"
                 data-target="#hideBuyNowModal"
                //  onClick={hideBuyNowModal}
                disabled    =   {Btn == 'error' || Btn === "process"  ||  Btn ==="done" ? true : false} 
                onClick     =   {Btn == 'start' || Btn === "try" ? FormSubmit : null}
                 > {Btn == 'start' && (isEmpty(bidder) ?'Place a bid' :'Edit Bid')
                 ||Btn == 'try' && 'Try-Again'
                 ||Btn == 'error' && 'Error' 
                 ||Btn == 'done' && 'Done' 
                 ||Btn == 'process' && 'In-Progress' 
                  }</button>
                {/* <button className="modal_btn_align w-100 cmn_cancel_btn">Cancel</button> */}
              </div>
        </Modal.Body>
       
      </Modal>
    )
}