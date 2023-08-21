import React, { Component,useEffect,useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";

 import {editNftTags} from '../../axioscalls/user.js'

toast.configure();


export function EditNftTag(props)  {

  const history = useHistory();

  const {nfttagdata} = props;

useEffect(()=>{
    bsCustomFileInput.init()

},[])


useEffect(()=>{
 setFormData(nfttagdata)
},[props])



const initData = {
  "details":"",
  "nfttag":""
}

const [formData,setFormData] = useState(initData) 

const {
  details,
  nfttag
 
} = formData





const handlechange = async(e)=>{
  e.preventDefault();
  const{id,value} = e.target;
  let formdata = { ...formData, ...{ [id]: value } }
  setFormData(formdata)
}

const handleSubmit = async()=>{
  var errors = {};
 
  if(!formData.nfttag){
    errors.nfttag = "nfttag cannot be empty"
    return toast.error("nfttag cannot be empty")}

  if(Object.keys(errors).length == 0){


     var payload = {
        id:formData._id,
        nfttag:formData.nfttag
     }

 
    var resp = await editNftTags(payload);
    if(resp?.status){
      toast.success(resp.msg)
      setTimeout(() => {
        history.push("/nfttaglist")
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
                <h4 className="card-title">EDIT Nft Tags</h4>
                <form className="forms-sample">
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Details</label>
                    <Form.Control type="text" className="form-control" id="details"  value={formData.details} />
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">nfttag</label>
                    <Form.Control type="text" className="form-control" id="nfttag" placeholder="Enter Answer" value={formData.nfttag} onChange={(e)=>handlechange(e)}/>

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

export default EditNftTag;
