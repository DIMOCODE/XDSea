import React, { Component,useState,useEffect} from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useLocation,useHistory} from 'react-router-dom';

import {addTokenCall} from '../../axioscalls/token.js'

toast.configure();


export function AddToken()  {

  var location = useLocation();
  var pathname = location.pathname;
  var path = pathname.split("/")[1]
 
useEffect(()=>{
  bsCustomFileInput.init()

},[])

const initData = {
  "name":"",
  "address":"",
  "decimal":""
}

const [formData,setFormData] = useState(initData) 

const {
  name,
  address,
  decimal
 
} = formData

const handleChange = (e)=>{

  e.preventDefault();
  const { id, value } = e.target;
  let formdata = { ...formData, ...{ [id]: value } }
  setFormData(formdata)
}

const handleSubmit = async()=>{
  var errors = {};

  if(!formData.name){
    errors.name = "Token name empty"
    return toast.error("Token name cannot be empty")}

  if(!formData.address){
    errors.description = "Token address empty"
    return toast.error("Token address cannot be empty")}

  if(Object.keys(errors).length == 0){

     formData.action = "add"
     var resp = await addTokenCall(formData);
    if(resp?.status){
      toast.success(resp.msg)
      setTimeout(function(){ 
        window.location.reload();
      }, 2000);
      
    } 
    else return toast.error(resp.msg)

  }
}


    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> ADD TOKEN </h3>
         
        </div>
        <div className="row">
         
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
            
                <form className="forms-sample">
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Token Name</label>
                    <Form.Control type="text" className="form-control" id="name" value={formData.name} placeholder="Name" onChange={(e)=>handleChange(e)} />
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Token Address</label>
                    <Form.Control type="text" className="form-control" id="address" value={formData.address} placeholder="address" onChange={(e)=>handleChange(e)}/>
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Token Decimal</label>
                    <Form.Control type="text" className="form-control" id="decimal" value={formData.decimal} placeholder="address" onChange={(e)=>handleChange(e)}/>
                  </Form.Group>
                
                  
                 
                  {/* <button type="submit" className="btn btn-primary mr-2" onClick={()=>handleSubmit()}>Submit</button> */}
                </form>
              <button onClick={()=>handleSubmit()}>Submit</button>

              </div>
            </div>
          </div>
         
        </div>
      </div>
    )
  
}

export default AddToken
