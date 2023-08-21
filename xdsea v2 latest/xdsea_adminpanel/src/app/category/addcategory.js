import React, { Component,useState,useEffect} from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useLocation,useHistory} from 'react-router-dom';

import {addCategoryCall} from '../../axioscalls/token.js'

toast.configure();


export function AddCategory()  {

  var location = useLocation();
  var pathname = location.pathname;
  var path = pathname.split("/")[1]
 
useEffect(()=>{
  bsCustomFileInput.init()

},[])

const initData = {
  "name":"",
  "description":"",
  "categoryimage":""
}

const [formData,setFormData] = useState(initData) 
const [preview,setPreview] = useState("") 


const {
  name,
  description,
  categoryimage
} = formData


useEffect(()=>{
  if(location && location.state) setdata()
},[location])

const setdata = ()=>{

  var val = {
    "name":location.state.name,
    "description":location.state.description,
    "categoryimage": ""
  }

setFormData(val)
}

const handleChange = (e)=>{

  e.preventDefault();
  const { id, value } = e.target;
  let formdata = { ...formData, ...{ [id]: value } }
  setFormData(formdata)
}

const handleSubmit = async()=>{
  var errors = {};
 
  if(!formData.name){
    errors.name = "category name empty"
    return toast.error("Category name cannot be empty")}

  // if(!formData.description){
  //   errors.description = "category description empty"
  //   return toast.error("Category description cannot be empty")}
  if(!formData.categoryimage){
      errors.categoryimage = "category image empty"
      return toast.error("Category Image cannot be empty")}

  if(Object.keys(errors).length == 0){
    if(path == "addcategory") formData.action = "add"
    else formData.action = "edit"

    var resp = await addCategoryCall(formData);
    if(resp?.status){
      toast.success(resp.msg)
      setTimeout(function(){ 
        window.location.reload();
      }, 2000);
      
    } 
    else return toast.error(resp.msg)

  }
}


const handleFile = (e)=>{
  
   if(!e.target.files[0].type.includes("image")) return toast.error("please select a file that has one of these jpg,jpeg,png,gif extensions.")
   setPreview(URL.createObjectURL(e.target.files[0]))
      setFormData({
          ...formData,
          ...{ ["categoryimage"]:e.target.files[0] },
        });

}


    return (
      <>
      {(path && path != "editcategory")?
      <>
      <div>
        <div className="page-header">
          <h3 className="page-title"> ADD CATEGORY </h3>
         
        </div>
        <div className="row">
         
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
            
                <form className="forms-sample">
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Category Name</label>
                    <Form.Control type="text" className="form-control" id="name" value={formData.name} placeholder="Name" onChange={(e)=>handleChange(e)} />
                  </Form.Group>
                  {/* <Form.Group>
                    <label htmlFor="exampleInputName1">Category Description</label>
                    <Form.Control type="text" className="form-control" id="description" value={formData.description} placeholder="description" onChange={(e)=>handleChange(e)}/>
                  </Form.Group> */}
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Category Image</label>
                    <Form.Control type="file" className="form-control" id="categoryimage"  placeholder="categoryimage" accept="image/*" onChange={(e)=>handleFile(e)}/>
                  </Form.Group>
                  {(preview != "")&&
                  <img src={preview&&preview}></img>

                  }
                  
                 
                  {/* <button type="submit" className="btn btn-primary mr-2" onClick={()=>handleSubmit()}>Submit</button> */}
                </form>
               
              <button onClick={()=>handleSubmit()}>Submit</button>

              </div>
            </div>
          </div>
         
        </div>
      </div>
      </>:
        <div>
        <div className="page-header">
          <h3 className="page-title"> EDIT CATEGORY </h3>
         
        </div>
        <div className="row">
         
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
            
                <form className="forms-sample">
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Category Name</label>
                    <Form.Control type="text" className="form-control" id="name" disabled={true} value={location?.state?.name} placeholder="Name" onChange={(e)=>handleChange(e)} />
                  </Form.Group>
                  {/* <Form.Group>
                    <label htmlFor="exampleInputName1">Category Description</label>
                    <Form.Control type="text" className="form-control" id="description"   value={location?.state?.description} placeholder="description" onChange={(e)=>handleChange(e)}/>
                  </Form.Group> */}
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Category Image</label>
                    <Form.Control type="file" className="form-control" id="categoryimage"  placeholder="categoryimage" accept="image/*" onChange={(e)=>handleFile(e)}/>
                  </Form.Group>
                  {(preview != "")&&
                  <img src={preview&&preview}></img>

                  }
                  
                 
                  {/* <button type="submit" className="btn btn-primary mr-2" onClick={()=>handleSubmit()}>Submit</button> */}
                </form>
               
              <button onClick={()=>handleSubmit()}>Submit</button>

              </div>
            </div>
          </div>
         
        </div>
      </div>}
      </>
    )
  
}

export default AddCategory
