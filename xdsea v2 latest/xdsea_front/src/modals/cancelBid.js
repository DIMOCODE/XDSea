import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { isEmpty, NumANdDotOnly, NumberOnly } from "../actions/common";
import useContractProviderHook from "../actions/contractProviderHook.js";
import { useNavigate } from "react-router-dom";
import { Container, Dropdown, DropdownButton, Modal, Button } from 'react-bootstrap'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../config/config.js"
import moment from "moment"
import { BidApprove } from "../actions/axioss/nft.axios";
toast.configure();



export function CancelBids({ OpenPopup, closePop, owner, bidder, item }) {



    const push = useNavigate()
    const [Btn, SetBtn] = useState('start')
    const ContractCall = useContractProviderHook()
    const { web3, accountAddress } = useSelector(state => state.LoginReducer.AccountDetails);
    const { payload } = useSelector(state => state.LoginReducer.User)
    const [show9, setShow9] = useState(true);
    const handleClose9 = () => setShow9(false);

    const FormSubmit = async () => {
        SetBtn('process')
        const id = toast.loading('Cancel Your Bid')
        var error = await ContractCall.Contract_Base_Validation()
        if (error) {
            toast.update(id, { render: error, type: 'error', isLoading: false, autoClose: 1000,closeButton:true,closeOnClick:true })
            SetBtn('error')
        }
        else {
            var FormValue = {
                TokenBidderAddress: accountAddress,
                NFTQuantity: bidder.NFTQuantity,
                NFTId: item.NFTId,
                ContractAddress: item.ContractAddress,
                ContractType: item.ContractType,
                CollectionNetwork: item?.CollectionNetwork,
                CollectionName: item?.CollectionName,
                from: 'Cancel',
                activity: 'CancelBid',
                Category: item?.Category,
                EmailId: payload.EmailId,
                // click: `${config.FRONT_URL}/info/${item.CollectionNetwork}/${item.ContractAddress}/${owner.NFTOwner}/${owner.NFTId}`

            }


         
            let Resp = await BidApprove(FormValue)
            if (Resp.success == 'success') {
                toast.update(id, { render: 'Cancelled Bid Successfully', type: 'success', isLoading: false, autoClose: 1000 ,closeButton:true,closeOnClick:true})
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

    }



return(
    <Modal
    show={show9}
    // onHide={handleClosePlaceaBid}
    backdrop="static"
    keyboard={false}
    scrollable={false}
    centered
    className='whole_modal_text_align modal_theme_align'

  >
    <Modal.Header className="modal_theme_align">

      <Modal.Title>Cancel Bid</Modal.Title>
  <button type="button" class="btn-close" aria-label="Close" onClick={closePop}></button>

    </Modal.Header>
    <Modal.Body className='modal_theme_align'>
   

            <p className="proceed_modal_text_align" > You are about to cancel Bid for {item.NFTName}</p>
          
 
            <div className="place_bid_modalbtn">
            <button type="button" class="btn cancel_modal_btn_align w-100  " data-toggle="modal"
             data-target="#hideBuyNowModal"
            
                        disabled={Btn == 'error' || Btn === "process" || Btn === "done" ? true : false}
                        onClick={Btn == 'start' || Btn === "try" ? FormSubmit : null}
             > 
             
             {Btn == 'start' && 'Proceed'
                            || Btn == 'try' && 'Try-Again'
                            || Btn == 'error' && 'Error'
                            || Btn == 'done' && 'Done'
                            || Btn == 'process' && 'In-Progress'
                        }</button>
            {/* <button className="btn cancel_modal_btn_align "
             disabled    =   {Btn === "process"  ||  Btn ==="done" ? true : false} 
             onClick={closePop}>Cancel</button> */}
          </div>
    </Modal.Body>
   
  </Modal>
)
}