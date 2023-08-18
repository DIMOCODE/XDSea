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
import { CreateOrder } from "../actions/axioss/nft.axios";
toast.configure();


export function Cancel({ OpenPopup, closePop, owner, types, file, type, thumb, item }) {
    const push = useNavigate()
    const [Btn, SetBtn] = useState('start')
    const [show9, setShow9] = useState(true);
    const handleClose9 = () => setShow9(false);
    const ContractCall = useContractProviderHook()
    const { web3, accountAddress } = useSelector(state => state.LoginReducer.AccountDetails);
    const { payload } = useSelector(state => state.LoginReducer.User)

    const FormSubmit = async () => {
        SetBtn('process')
        const id = toast.loading('Removing Listing')
        var error = await ContractCall.Contract_Base_Validation()
        if (error) {
            toast.update(id, { render: error, type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
            SetBtn('error')
        }
        else {
            if (types == "Cancel") {
                let cont = await ContractCall.cancel_order_721_1155(owner.NFTId)
                if (cont) {
                    await Back_end(id, cont.HashValue)
                    handleClose9()
                }
                else {
                    toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
                    SetBtn('try')
                }
            }
            else {
                await Back_end(id, '')
            }

        }
    }

    const Back_end = async (id, HashValue) => {
        owner.HashValue = HashValue
        owner.NFTPrice = 0
        owner.CoinName = ''
        owner.NFTId = owner.NFTId
        owner.PutOnSale = 'true'
        owner.PutOnSaleType = 'UnlimitedAuction'
        owner.activity = types == "Cancel" ? "CancelOrder" : "CancelAuction";
        owner.NFTOwner = accountAddress
        owner.Category = item.Category
        owner.EmailId = payload.EmailId
        owner.ContractType = item.ContractType
        owner.ContractAddress = item.ContractAddress
        owner.CollectionNetwork = item.CollectionNetwork
        owner.CollectionName = owner.CollectionName


        let Resp = await CreateOrder(owner)
        if (Resp.success == 'success') {
            toast.update(id, { render: "Cancelled Your Order Successfully", type: "success", isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
            SetBtn('done')
            //  push(`/my-item/${payload.CustomUrl?payload.CustomUrl:payload.CustomUrl}`)
            closePop();
            window.location.reload();
        }
        else {
            toast.update(id, { render: 'Transaction Failed', type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
            SetBtn('try')
        }
    }


    return (

        <Modal
            show={show9}

            // onHide={handleCloseBurnToken}
            backdrop="static"
            keyboard={false}
            scrollable={false}
            centered
            className='whole_modal_text_align'

        >
            <Modal.Header className="modal_theme_align" >
                

 
                <Modal.Title>Remove Listing</Modal.Title>
                <button type="button" class="btn-close" aria-label="Close" onClick={closePop}></button>
 
            </Modal.Header>
            <Modal.Body className='modal_theme_align'>
                <div className="burn_tokem_img_align d-flex justify-content-center w-100">
                    {/* <img className=" burn_token_img" src={require('../app/assets/images/collection.png')} alt="" /> */}
                </div>
                <p className="proceed_modal_text_align  mt-3">You are about to

                    <span className="placebid_span_text"> remove listing for </span>{" "}
                    <b className="placebid_span_text"> {item?.TokenName} </b>
                </p>



                <div className="place_bid_modalbtn ">
                    <button type="button" 
                        disabled={Btn == 'error' || Btn === "process" || Btn === "done" ? true : false}
                        onClick={Btn == 'start' || Btn === "try" ? FormSubmit : null} 
                        className="btn cancel_modal_btn_align w-100 ">  
                         {Btn == 'start' && 'Proceed'
                            || Btn == 'try' && 'Try-Again'
                            || Btn == 'error' && 'Error'
                            || Btn == 'done' && 'Done'
                            || Btn == 'process' && 'In-Progress'
                        }</button>
                    
                </div>
            </Modal.Body>

        </Modal>
    )
}