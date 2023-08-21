import React, { Component,useState, useEffect  } from 'react';
import { useLocation,useHistory} from 'react-router-dom';

import { Button, ProgressBar } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import * as tokenFunctions from '../../axioscalls/token.js'
import * as userFunctions from '../../axioscalls/user.js'

import wallet_details from '../../redux/action';
import config from '../../lib/config.js';

toast.configure();


export default function CmsList (props) {



  var location = useLocation();
  const{pathname,state}=location;
  const path = pathname.split("/")[1]

 
  const Wallet_Details = useSelector((state)=>state.wallet_detail)
  const [subscriberList,setSubscriberList] = useState([])
  const [allcheck,setAllcheck] = useState(false);



const columns = [

  {
    key: "email",
    text: "subscriber mail",
    className: "NFT NAME",
    align: "left",
    sortable: true,
   

  },

  {
    key: "select",
    text: "select subscribers",
    className: "NFT NAME",
    align: "left",
    sortable: true,
    cell : record =>
    <div><input type="checkbox" checked={record.maySent} onClick={()=>setMaySent(record)}/></div>
   

  },

 

 
  
]

  useEffect(()=>{
    getSubscriberList();
  },[])


  const getSubscriberList = async()=>{
    var resp = await userFunctions.getSubscribers();
    if(resp?.status){
        setSubscriberList(resp.data)
    }
  }


  



  const setMaySent = async(data)=>{
    if (data?.target){
    if(subscriberList.length > 0){
   
     var resp = await userFunctions.changeMaySent({all :data.target.checked});
     if(resp?.status){
       setAllcheck(!allcheck)
       toast.success(resp?.msg)
       setTimeout(() => {
         getSubscriberList();
       }, 1000);
     }
     else
       toast.error(resp.msg)
    }else{
     toast.error("Subscribers are not yet")
    }
    }else{
       var payload = {
         email:data.email,
         maySent:!data.maySent
       }
   
       var resp = await userFunctions.changeMaySent(payload);
       if(resp?.status){
         // setAllcheck(false)
         toast.success(resp?.msg)
         setTimeout(() => {
           getSubscriberList();
         }, 1000);
       }
       else
         toast.error(resp.msg)
     }
   
     }







  
    return (
 
      <>
     
      <div>   
      <div className="page-header">
        <nav aria-label="breadcrumb">
        </nav>
      </div>
      <div className="row">
     
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">SUBSCRIBERS LIST</h4>
              <Link to="/sendmail">
             <button >Send Mail</button>
             </Link>
              <div className="table-responsive">
              {/* select All
                <input type="checkbox" className='selectall ml-2'  checked={allcheck} onChange={(e)=>setMaySent(e)}/> */}
              <ReactDatatable

records={subscriberList}
columns={columns}
/>
            
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>

   
     
      </>
      
    )
  
}


