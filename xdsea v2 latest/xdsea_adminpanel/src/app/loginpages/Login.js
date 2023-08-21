import React, { Component ,useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useLocation,useHistory} from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import {isEmpty} from '../../lib/common';
import * as adminFunctions from '../../axioscalls/admin.js';
import { Account_Connect, Account_disConnect, Initial_Connect ,Admin_Login} from "../../redux/action.js";


toast.configure();


export default function Login(props){

 // var location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const Wallet_Details = useSelector((state)=>state.wallet_detail)




const initialValue = {
  "email":"",
  "password":""
}


const [formValue,setFormValue] = useState(initialValue);
const [validErrors,setValidErrors] = useState("");
const [loc,setLoc] = useState("")


const formvalidation = async(data)=>{

  var validationErr = {};
  let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([A-Za-zA-Z\-0-9]+\.)+[A-Za-zA-Z]{2,}))$/;

  if (data.email == "") {validationErr.email = "Email cannot be empty"}
  else if (data.email != ""){
    if(!emailRegex.test(data.email)) {validationErr.email = "Enter valid email"}
  }

  if(!data.password){validationErr.password = "password cannot be empty"}

  return validationErr;
  
}




const handleSubmit = async()=>{

  var resp = await formvalidation(formValue);

  if(resp)setValidErrors(resp)
  if(!isEmpty(resp)){
    
  }
  else{
     formValue.path = "login";
    var resp = await adminFunctions.loginAdmin(formValue);
    if(resp.data){
    
      localStorage.setItem("adminlogin","yes")

      toast.success(resp.msg)
      history.push("/dashboard");
    }
    else(toast.error(resp.msg))

  }


}


const handlechange = (e)=>{
 
  const {id,value} = e.target;
  setFormValue({...formValue,[id]:value})
  
}

// to check jwt is working
const chektoken = async()=>{
  var resp = await adminFunctions.check();
}







  
  
    return (
      <div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="card text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <img src={require("../../assets/images/logo.png")} alt="logo" />
                </div>
                <h4>Hello! let's get started</h4>
                <h6 className="font-weight-light">Sign in to continue.</h6>
                <Form className="pt-3">
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="email" placeholder="Enter email" size="lg" className="h-auto" id="email" value={formValue.email} onChange={(e)=>handlechange(e)}/>
                  </Form.Group>
                 <p>{validErrors.email}</p>
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="password" placeholder="Password" size="lg" className="h-auto" id="password" value={formValue.password} onChange={(e)=>handlechange(e)} />
                  </Form.Group>
                  <p>{validErrors.password}</p>
                  <div className="mt-3">
                    <p className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" onClick={()=>handleSubmit()}>SIGN IN</p>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>  
      </div>
    )
  
}

