import React, { Component,useEffect,useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';


import {addSocial} from '../../axioscalls/user.js'
import {useServiceFee,useSetServiceFee,useSetRoyaltyFee} from '../../useHooks/useContractMethods.js'

toast.configure();


export function AddSocial()  {

  const history = useHistory();
  const Wallet_Details = useSelector((state)=>state.wallet_detail)


useEffect(()=>{
    bsCustomFileInput.init()

},[])


useEffect(()=>{
    GetServiceFee();
    
},[Wallet_Details.UserAccountAddr,Wallet_Details.providers])

const GetServiceFee = async()=>{
    
    var serviceFee = await useServiceFee(Wallet_Details.providers);
    if(serviceFee){
        setFormData(serviceFee)
        setRoyalty(serviceFee.royaltyFee)
    }
       

}





const initData = {
  "buyerFee":"",
  "sellerFee":"",
  "royaltyFee":""
}

const [formData,setFormData] = useState(initData) 
const [royalty,setRoyalty] = useState("")

const {
    buyerFee,
    sellerFee,
    royaltyFee
 
} = formData





const handlechange = async(e)=>{
  e.preventDefault();
  const{id,value} = e.target;
  let formdata = { ...formData, ...{ [id]: value } }
  setFormData(formdata)
}

const handleSubmit = async()=>{

if(!Wallet_Details.UserAccountAddr)
    return toast.warning("please connect wallet")
else if(Wallet_Details.UserAccountAddr != Wallet_Details.Admin_Address)
    return toast.warning("only Admin can edit service fee")

  var errors = {};

  if(!formData.buyerFee){
    errors.buyerFee = "Buyer Fee cannot be empty"
    return toast.error("Buyer Fee cannot be empty")}

  if(!formData.sellerFee){
        errors.sellerFee = "Seller Fee cannot be empty"
        return toast.error("Seller Fee cannot be empty")}

  if(Object.keys(errors).length == 0){


     var payload = {
      buyerFee:formData.buyerFee,
      sellerFee:formData.sellerFee,
     
     }

     if(payload){
        SetServiceFee(payload);
     }
 

  }
}

const SetServiceFee = async(data)=>{
    var resp  = await useSetServiceFee(data,Wallet_Details.providers,Wallet_Details.Admin_Address)
    if(resp){
        toast.success("service fee updated successfully!")
        setTimeout(() => {
          window.location.reload();  
        },1000);
    }

}



const setRoyaltyCall = async()=>{



if(!Wallet_Details.UserAccountAddr)
    return toast.warning("please connect wallet")
else if(Wallet_Details.UserAccountAddr != Wallet_Details.Admin_Address)
    return toast.warning("only Admin can edit Royalty fee")
    
if(royalty)
   var resp = await SetRoyaltyFee(royalty,Wallet_Details.providers,Wallet_Details.Admin_Address)


}


const SetRoyaltyFee = async(royal,provider,address)=>{
  var resp = await useSetRoyaltyFee(royal,provider,address)
  if(resp){
     toast.success("Royalty fee updated successfully !")
     setTimeout(() => {
      window.location.reload();
     },1000);

  }
}





    return (
      <div>
   
        <div className="row">
         
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Service Fee Management</h4>
                <form className="forms-sample">
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Buyer Fee</label>
                    <Form.Control type="text" className="form-control" id="buyerFee" placeholder="buyer fee" value={formData.buyerFee} onChange={(e)=>handlechange(e)}/>
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Seller Fee</label>
                    <Form.Control type="text" className="form-control" id="sellerFee" placeholder="seller fee" value={formData.sellerFee} onChange={(e)=>handlechange(e)}/>

                </Form.Group>
                </form>
                <div>
                <button onClick={()=>handleSubmit()}>Change Service Fee</button>
                </div>
               
          </div>
         
        </div>
        </div>
        </div>
      </div>
    )
  
}

export default AddSocial
