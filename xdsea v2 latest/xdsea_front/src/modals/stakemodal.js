import React,{ useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

import useContractProviderHook from "../actions/contractProviderHook.js";
import {   useNavigate } from "react-router-dom";
 
import { Container,Dropdown,DropdownButton,Modal,Button,Row,Col,Form,InputGroup } from 'react-bootstrap'
 
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {Link} from "react-router-dom";
import { toast } from "react-toastify";
import config from "../config/config.js"
import moment from "moment"
import { isEmpty, NumANdDotOnly } from "../actions/common";
import { CreateOrder,createstake } from "../actions/axioss/nft.axios";

toast.configure();


export function Stake(props) {
if(props?.data) 
  var {stakingContract, tokenId, wallet,type,contract_address,NFTOwner,NFTId,CollectionName}= props.data
  


   const { currency } = useSelector((state) => state.LoginReducer);
  const ContractCall = useContractProviderHook();
  const push = useNavigate();

  const [Mintbtn,SetMintbtn] = useState("start")
  const [TokenBtn,SetTokenBtn] = useState("start")

  
  const [BtnData,SetBtnData] = useState(false)
  const [openpop,SetOpenPop] = useState(true)
  

  const { payload } = useSelector((state) => state.LoginReducer.User);
  const { web3 } = useSelector((state) => state.LoginReducer.AccountDetails);
  const { sellerFees } = useSelector((state) => state.LoginReducer.ServiceFees);
 
  const styles = {
    option: (styles, {isFocused, isSelected}) => ({
      ...styles,
      color: "#ccc",
      background: isFocused
          ? '#1d296a'
          : isSelected
              ? '#113853'
              : "#81c8f6",
      zIndex: 1
  }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: '62px',
      padding: '0 6px',
      backgroundColor: "#343434 ",
      borderColor: '#81c8f6',
    borderRadius: 30,
    padding:10,
    color: "#ccc",
    
    }),
    control: (provided, state) => ({
      ...provided,
      height: '62px',
      borderRadius:30,
      color: "#ccc",
      border:'none'
     
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '62px',
      position: 'absolute',
      right: 0,
      top: 0,
      color:'gray' 
    }),    
    singleValue: (provided, state) => ({
      ...provided,
      color: "gray"
    }),
    menuList: base => ({
      ...base,
      // kill the white space on first and last option
      padding: 0
    })
  };
 


  // get approve status

  const Approvecall = async()=>{
    SetTokenBtn("process")
    var isApproves = await ContractCall.StakeNftInContract(stakingContract, tokenId, wallet,type,contract_address)
    if(isApproves) SetTokenBtn("done")
    else SetTokenBtn("try")
     
  }

  // stakecall

  const stakecall = async()=>{
    SetMintbtn("process")
    var stakecall = await ContractCall.NftStake(stakingContract, tokenId)
    if(stakecall) {
      SetMintbtn("done")
      updateDb()
    }

    else  SetMintbtn("try")

  }

  const updateDb = async()=>{

    let obj = {
      NFTOwner:NFTOwner,
      NFTId:NFTId,
      CollectionName:CollectionName
    }
     var resp = await createstake(obj)
     if(resp?.status){
      toast.success("successfully staked")
      setTimeout(() => {
        window.location.reload()
      }, 200);
      SetOpenPop(false)
     } else toast.error("failed to stake")
   
  }



 

    return(
   <>     


 
<Modal
        show={openpop}
        scrollable={false}

// onHide={handleClose}
backdrop="static"
keyboard={false}
centered
className='whole_modal_text_align'

>
<Modal.Header className="modal_theme_align">

  <Modal.Title >            Let's get started

  
</Modal.Title>
<button
            type="button"
            class="btn-close"
            aria-label="Close"
            onClick={() =>{SetOpenPop(false)}}
          ></button>
</Modal.Header>
<Modal.Body className='burn_token_body  modal_theme_align common_modal_body'>


 
        <div className="procedd_modals_dtls_align mt-3">
            {/* <> */}
        {/* <span className=" proceed_modal_text_align  mt-3">Approve Call</span>
        <span  className=" proceed_modal_text_align  mt-3">This Process Take One Time Gas Fees</span> */}

{/* <span className="mt-1">Approve Call</span> */}
        {/* <a data-ignore-split="true" class="Button mt-3"  id="" disabled={TokenBtn == "process" || TokenBtn == "done"}
        onClick={()=>Approvecall()} tabindex="0" aria-label="">
        Approve
        {TokenBtn == "start" && "Start"}
                {TokenBtn == "process" && "In-Progress"}
                {TokenBtn == "try" && "Try-Again"}
                {TokenBtn == "done" && "Done"}
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Approve
        {TokenBtn == "start" && "Start"}
                {TokenBtn == "process" && "In-Progress"}
                {TokenBtn == "try" && "Try-Again"}
                {TokenBtn == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true">Approve
        {TokenBtn == "start" && "Start"}
                {TokenBtn == "process" && "In-Progress"}
                {TokenBtn == "try" && "Try-Again"}
                {TokenBtn == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true">Approve
        {TokenBtn == "start" && "Start"}
                {TokenBtn == "process" && "In-Progress"}
                {TokenBtn == "try" && "Try-Again"}
                {TokenBtn == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true">Approve
        {TokenBtn == "start" && "Start"}
                {TokenBtn == "process" && "In-Progress"}
                {TokenBtn == "try" && "Try-Again"}
                {TokenBtn == "done" && "Done"}</span>
  </a> */}
  <button type="button" class="btn create_item_single_btn mt-3"

disabled={TokenBtn == "process" || TokenBtn == "done"}
onClick={()=>Approvecall()}
>
 
        {TokenBtn == "start" && "Approve"}
                {TokenBtn == "process" && "In-Progress"}
                {TokenBtn == "try" && "Try-Again"}
                {TokenBtn == "done" && "Done"}
</button>



  <span className="mt-3">Start Earning Rewards</span>
  {/* <a data-ignore-split="true" class="Button mt-3"  id="" disabled={TokenBtn == "process" || TokenBtn == "done"}
        onClick={()=>stakecall()} tabindex="0" aria-label="">
       Stake
       {Mintbtn == "start" && "Start"}
              {Mintbtn == "process" && "In-Progress"}
              {Mintbtn == "try" && "Try-Again"}
              {Mintbtn == "done" && "Done"}
              {Mintbtn == "init" && "Confirm"}
              <span class="Button-hover-helper"></span>
<span class="Button-hover-helper"></span>
<span class="Button-hover-helper"></span>
<span class="Button-hover-helper"></span>
    
    <span class="Button-hover-content" aria-hidden="true">
    Stake
    {Mintbtn == "start" && "Start"}
              {Mintbtn == "process" && "In-Progress"}
              {Mintbtn == "try" && "Try-Again"}
              {Mintbtn == "done" && "Done"}
              {Mintbtn == "init" && "Confirm"}
                </span>
    <span class="Button-hover-content" aria-hidden="true"> 
    Stake
    {Mintbtn == "start" && "Start"}
              {Mintbtn == "process" && "In-Progress"}
              {Mintbtn == "try" && "Try-Again"}
              {Mintbtn == "done" && "Done"}
              {Mintbtn == "init" && "Confirm"}
                </span>
    <span class="Button-hover-content" aria-hidden="true">
    Stake
    {Mintbtn == "start" && "Start"}
              {Mintbtn == "process" && "In-Progress"}
              {Mintbtn == "try" && "Try-Again"}
              {Mintbtn == "done" && "Done"}
              {Mintbtn == "init" && "Confirm"}
                </span>
    <span class="Button-hover-content" aria-hidden="true"> 
    Stake
    {Mintbtn == "start" && "Start"}
              {Mintbtn == "process" && "In-Progress"}
              {Mintbtn == "try" && "Try-Again"}
              {Mintbtn == "done" && "Done"}
              {Mintbtn == "init" && "Confirm"}
                </span>
  </a> */}

  <button type="button" class="btn create_item_single_btn mt-3"

// disabled={TokenBtn == "process" || Mintbtn == "done"}
disabled={TokenBtn != "done" || Mintbtn == "done"}

        onClick={()=>stakecall()}
>
 
       {Mintbtn == "start" && "Stake"}
              {Mintbtn == "process" && "In-Progress"}
              {Mintbtn == "try" && "Try-Again"}
              {Mintbtn == "done" && "Done"}
              {Mintbtn == "init" && "Confirm"}
</button>

 
 {/* <span className="mt-3">Approve</span>
         <button type="button" class="btn stake_approve_btn mt-3"

         disabled={TokenBtn == "process" || TokenBtn == "done"}
        onClick={()=>Approvecall()}
    >

        {TokenBtn == "start" && "Proceed"}

                {TokenBtn == "process" && "In-Progress"}
                {TokenBtn == "try" && "Try-Again"}
                {TokenBtn == "done" && "Done"}
        </button> */}
        
        
       
      </div>
     

      {/* <div className="procedd_modals_dtls_align mt-3">
  
      <span className="mt-3">Stake</span>


        <button type="button" class="btn stake_approve_btn" 
        disabled={Mintbtn == "process" || Mintbtn == "done" || TokenBtn != "done"}
       onClick={()=>stakecall()}
>
{Mintbtn == "" && "stake"}
    
        {Mintbtn == "start" && "Start"}
              {Mintbtn == "process" && "In-Progress"}
              {Mintbtn == "try" && "Try-Again"}
              {Mintbtn == "done" && "Done"}
              {Mintbtn == "init" && "Confirm"}
        </button>
        
      </div> */}
</Modal.Body>

</Modal>
</>
    )
}