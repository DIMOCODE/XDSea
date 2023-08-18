import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useContractProviderHook from "../actions/contractProviderHook.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../config/config.js"
 
toast.configure();


export default function CartList(){

return(
 <>
    <div className='whole_cart_dtls'>
        <div className="ofrrcvd_tbl_all_data"><img className="table_nft_img_align" src={require('../app/assets/images/drop6.jpg')}/><div><p>Moonbirds-19</p><span>#1867148614</span></div></div>
        <div className='inc_dec_btn_dtls'> <b className='usdprice_value'>$ 0.002ETH</b></div>

        <div className='inc_dec_btn_dtls'><button className='cart_chnge_btn'>-</button> <span className='tbl_qnttty_value'> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> <button className='cart_chnge_btn'>+</button></div>
        <div className='inc_dec_btn_dtls'><b className='tbl_bnb_value'>1BNB</b></div>
        <div className='inc_dec_btn_dtls'><i class="fa-solid fa-trash-can cart_trash_ic"/></div>


        </div></>
)


}



