import React, { Component,useEffect,useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";

import {addSocial} from '../../axioscalls/user.js'

toast.configure();


export function AddSocial()  {

  const history = useHistory();

useEffect(()=>{
    bsCustomFileInput.init()

},[])



const initData = {
  "website":"",
  "link":""
}

const [formData,setFormData] = useState(initData) 

const {
    website,
    link
 
} = formData





const handlechange = async(e)=>{
  e.preventDefault();
  const{id,value} = e.target;
  let formdata = { ...formData, ...{ [id]: value } }
  setFormData(formdata)
}

const handleSubmit = async()=>{
  var errors = {};

  if(!formData.website){
    errors.answer = "website name cannot be empty"
    return toast.error("website name cannot be empty")}

  if(!formData.link){
        errors.answer = "website link cannot be empty"
        return toast.error("website link cannot be empty")}

  if(Object.keys(errors).length == 0){


     var payload = {
      website:formData.website,
      link:formData.link,
      action:"add"
     }

 
     var resp = await addSocial(payload);
    if(resp?.status){
      toast.success(resp.msg)
      setTimeout(function(){ 
        history.push("/sociallist")
      }, 1000);
      
    } 
    else return toast.error(resp.msg)

  }
}






    return (
      <div>
   
        <div className="row">
         
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Add Social Links</h4>
                <form className="forms-sample">
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Website Name</label>
                    <Form.Control type="text" className="form-control" id="website" placeholder="topic" value={formData.website} onChange={(e)=>handlechange(e)}/>
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Website Link</label>
                    <Form.Control type="text" className="form-control" id="link" placeholder="content" value={formData.link} onChange={(e)=>handlechange(e)}/>

                </Form.Group>
               
                  
                 
                </form>
              <button onClick={()=>handleSubmit()}>SUBMIT</button>

              </div>
            </div>
          </div>
         
        </div>
      </div>
    )
  
}

export default AddSocial
