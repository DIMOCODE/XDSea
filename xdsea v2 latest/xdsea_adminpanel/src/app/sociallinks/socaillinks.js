import React, { Component,useState, useEffect  } from 'react';
import { useLocation,useHistory} from 'react-router-dom';

import { Button, ProgressBar } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import EditSocial from '../sociallinks/editsocial.js'

import * as tokenFunctions from '../../axioscalls/token.js'
import * as userFunctions from '../../axioscalls/user.js'

import wallet_details from '../../redux/action';
import config from '../../lib/config.js';

toast.configure();


export default function SocialList (props) {

  var history = useHistory();  

  var location = useLocation();
  const{pathname,state}=location;
  const path = pathname.split("/")[1]

 
  const Wallet_Details = useSelector((state)=>state.wallet_detail)
  const [socialList,setSocialList] = useState([])


const columns = [

  {
    key: "website",
    text: "Website",
    className: "NFT NAME",
    align: "left",
    sortable: true,
   

  },

  {
    key: "link",
    text: "Website Link",
    className: "NFT NAME",
    align: "left",
    sortable: true,
   
   

  },
  {
    key: "edit",
    text: "Edit",
    className: "NFT NAME",
    align: "left",
    sortable: true,
    cell : record =>
    <div><Link to={{pathname:`/editsociallink`,state:record}}><button >EDIT</button></Link></div>
   

  },
  {
    key: "delete",
    text: "Delete",
    className: "NFT NAME",
    align: "left",
    sortable: true,
    cell : record =>
    <div><button onClick={()=>deleteSocial(record,"delete")} >DELETE</button></div>
   

  },

 

 
  
]

  useEffect(()=>{
    getSocialList();
  },[])


  const getSocialList = async()=>{
    var resp = await userFunctions.getSocialData();
    if(resp?.status){
        setSocialList(resp.data)
    }
  }
const deleteSocial = async(record,filter)=>{
    var payload = {
        website:record.website,
        link:record.link,
        action:filter
    }
   

    var resp = await userFunctions.editDeleteSocial(payload);
    if(resp?.status){
        toast.success(resp.msg)
        setTimeout(function(){ 
          getSocialList()
        }, 2000);
        
      } 
      else return toast.error(resp.msg)
}





  
    return (
 
      <>
      {(path && path == "editsociallink")?
      <EditSocial rec={state?state:{}}/>:
     
      <div>   
      <div className="page-header">
        <nav aria-label="breadcrumb">
        </nav>
      </div>
      <div className="row">
     
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">SOCIAL LINKS</h4>
              {/* <Link to="/addsocial">
             <button >Add</button>
             </Link> */}
              <div className="table-responsive">
              <ReactDatatable

records={socialList}
columns={columns}
/>
            
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>

}
     
      </>
      
    )
  
}


