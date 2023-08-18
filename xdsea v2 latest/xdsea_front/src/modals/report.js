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
import { report } from "../actions/axioss/user.axios";
toast.configure();


export function Report({item,closePop,OpenPopup}){

    const [Message,SetMessage] = useState('')
    const [Btn,SetBtn] = useState('start')
    const { payload } = useSelector(state => state.LoginReducer.User)
    const [ValidateError, SetValidateError] = useState({});
    
    const FormSubmit =   async()  =>  {
       SetBtn('process')
       const id = toast.loading('Reporting')
       if(Message == ''){
         toast.update(id, { render: "Enter Report Message", type: "success", isLoading: false, autoClose: 1000,closeButton:true,closeOnClick:true })
         SetValidateError({message:"Enter Report Message"})
       }
       else{
         var senddata = {
            ...item ,
           Address  :  payload.WalletAddress,
           CustomUrl  :  payload.CustomUrl,
           Message  :  Message
         }

         let Resp = await report(senddata)
         if(Resp){
           toast.update(id, { render: Resp?.msg, type: Resp?.success, isLoading: false, autoClose: 1000,closeButton:true,closeOnClick:true })
           SetBtn('done')
           closePop()
           }
       }
 
    }



return(
    <Modal
    show={OpenPopup}
    // onHide={handleCloseReport}
    backdrop="static"
    keyboard={false}
    centered
    scrollable={false}
  >
    <Modal.Header className='align-items-center modal_theme_align' >
      <Modal.Title>Report this NFT ?</Modal.Title>
      <button type="button" class="btn-close" aria-label="Close" onClick={closePop}></button>

    </Modal.Header>
    <Modal.Body className='common_modal_body modal_theme_align'>

      {/* <p className="placebid_hint_text text-center mt-3">There are many variations of passages of <span className="placebid_span_text"> qweqw </span> available.
      </p> */}



      <h6 className=''>Reason</h6>


      <textarea className='w-100 mt-3 modal_textarea_dtls' rows="4" placeholder="Tell us some detils" onChange={(e)=>SetMessage(e.target.value)}></textarea>
       {ValidateError.message && (
          <span className="text-danger img-file">
          {ValidateError.message}
          </span>
        )}
      <div className="place_bid_modalbtn mt-3 load_more_btn_align">
        <button type="button" class="btn confirm_btn me-2   modal_btn_align"  onClick={FormSubmit}>Report</button>
        {/* <button type="button" class="btn  loadMore_btn me-2  modal_btn_align">Cancel</button> */}
      </div>


    </Modal.Body>

  </Modal>
)


}



