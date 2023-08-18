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
import { BurnNFT } from "../actions/axioss/nft.axios";

toast.configure();



export function Burn({item,closePop,OpenPopup,owner}){


    const ContractCall = useContractProviderHook()
    const navigate = useNavigate();



    // const [item,setItem] = useState();
    // const [owner, SetOwner] = useState("");
    const [burnQunatity, setBurnQuantity] = useState(0);
    const [onChangeBurnQty,setOnchangeBurnQty] = useState(0);

    const [Btn, SetBtn] = useState('start')
    const [Error, SetError] = useState('')

    const { web3, accountAddress } = useSelector(state => state.LoginReducer.AccountDetails);
    const { payload } = useSelector(state => state.LoginReducer.User)
    const [disablestate,setdisablestate] = useState(false)

    useEffect(()=>{
        if(item?.ContractType == "721") {
            setBurnQuantity(1)
            setOnchangeBurnQty(1)   
        } 
    },[item])

    const Validation    =   async()  =>   {
        // if(isEmpty(burnQunatity) || burnQunatity == 0 ||  burnQunatity == "0") return "Quantity  Required"
        // if(Number(burnQunatity)>Number(owner.NFTBalance)) return "Token Quantity Must be less than " + owner.NFTBalance

        if(isEmpty(onChangeBurnQty) || onChangeBurnQty == 0 ||  onChangeBurnQty == "0") return "Quantity  Required"
        if(Number(onChangeBurnQty)>Number(owner.NFTBalance)) return "Token Quantity Must be less than " + owner.NFTBalance
        if(await ContractCall.Contract_Base_Validation()) return await ContractCall.Contract_Base_Validation()
    }


    const BurnFunc = async()=>{
        const id = toast.loading('Transferring Your Price')
        SetError('')
        SetBtn('process')
        var error = await Validation()
        if (error) {
            toast.update(id, { render: error, type: 'error', isLoading: false, autoClose: 1000 })
            // SetBtn('error')
            SetBtn('try')

            SetError(error)
        }
        else {
             let cont = await ContractCall.Burn(item.ContractAddress,item.ContractType,onChangeBurnQty,owner.NFTId)
            if (cont) {
                let newOwner = {
                    HashValue : cont?.HashValue,
                    // NFTBalance    :  owner.NFTBalance - burnQunatity,
                    // burnQunatity    : burnQunatity,
                    NFTBalance    :  owner.NFTBalance - onChangeBurnQty,
                    burnQunatity    : onChangeBurnQty,
                    NFTId : owner.NFTId,
                    NFTOwner : owner.NFTOwner,
                    activity : "Burn",
                    CollectionName:owner.CollectionName,
                    TP:0,
                    CN:'',
                   
                }
                let Resp = await BurnNFT({newOwner:newOwner,item:item})
                if (Resp.success == 'success') {
                    toast.update(id, { render: "Burn Successfully", type: "success", isLoading: false, autoClose: 1000 })
                    SetBtn('done')
                   navigate(`/my-item/${payload.CustomUrl}`)
                }
                else {
                    toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000 })
                    SetBtn('try')
                }
            }
            else {
                toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000 })
                SetBtn('try')
            }
          }
    }



    return(
        <Modal
        show={OpenPopup}
        // onHide={handleCloseBurnToken}
        backdrop="static"
        scrollable={false}
        keyboard={false}
        centered
        className='whole_modal_text_align'

      >
        <Modal.Header className='align-items-center modal_theme_align' >
          <Modal.Title className='w-100'>Burn Token</Modal.Title>
      {/* <button type="button" class="btn-close" aria-label="Close" onClick={closePop}></button> */}

        </Modal.Header>
        <Modal.Body className=' common_modal_body modal_theme_align'>
          {/* <div className="burn_tokem_img_align d-flex justify-content-center w-100">
            <img className=" burn_token_img" src={require('../app/assets/images/collection.png')} alt="" />
          </div> */}
          {/* <h5 className='text-center mt-2'>2 Token Available</h5> */}
          <p className="placebid_hint_text text-center mt-3">Are you sure about burning this NFT ?
            <span className="placebid_span_text"> This action cannot be undone. Token will be transfered to zero address</span>
          </p>
          {!(item?.ContractType == 721 || item?.ContractType ==  "721")&&
          <input type="text" className='common_modal_input mt-3'   id = "burn" 
                        name="burn" 
                        disabled={burnQunatity == 1 || burnQunatity == "1" || Btn == "process"}
                        onChange={(e)=>{
                            // setBurnQuantity(e.target.value)
                            setOnchangeBurnQty(e.target.value)
                        }} />}
          <div className="place_bid_modalbtn mt-5 load_more_btn_align">
            <button type="button" class="btn confirm_btn me-2   modal_btn_align"
               disabled={Btn == 'error' || Btn === "process" || Btn === "done" ? true : false}
               onClick={Btn == 'start' || Btn === "try" ? BurnFunc : null}>
                    {Btn == 'start' && 'Proceed'
                                            || Btn == 'try' && 'Try-Again'
                                            || Btn == 'error' && 'Error'
                                            || Btn == 'done' && 'Done'
                                            || Btn == 'process' && 'In-Progress'
                                        }
             

               </button>
            <button type="button" class="btn  loadMore_btn me-2  modal_btn_align" disabled={Btn == 'process'} onClick={()=>closePop()}>Cancel</button>
          </div>


        </Modal.Body>

      </Modal>
    )
}