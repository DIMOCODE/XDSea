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
import wallet_details from '../../redux/action';
import config from '../../lib/config.js';

toast.configure();


export default function CategoryList (props) {



  var location = useLocation();
  const{pathname,state}=location;
  const path = pathname.split("/")[1]

 
  const Wallet_Details = useSelector((state)=>state.wallet_detail)
  const [tokenList,setTokenList] = useState([])

const columns = [

  {
    key: "label",
    text: "TOKEN NAME",
    className: "NFT NAME",
    align: "left",
    sortable: true,
   

  },
  {
    key: "address",
    text: "Token Address",
    className: "NFT IDT",
    align: "left",
    sortable: true,

  },
  // {
  //   key: "delete",
  //   text: "Show / Hide Token",
  //   className: "NFT IDT",
  //   align: "left",
  //   sortable: true,
  //   cell: record=>
  //     <div><button onClick={()=>deletetoken(record)}>{(record.deleted == 1)?"SHOW":"HIDE"}</button></div>

  // },

 
  
]

  useEffect(()=>{
    getTokenList();
  },[])


  const getTokenList = async()=>{
    var resp = await tokenFunctions.getCurrencyList();
    if(resp?.success){
      setTokenList(resp.msg[0].CurrencyDetails)
    }
  }


  const deletetoken = async(data)=>{
    data.action = "delete"

     var resp = await tokenFunctions.addTokenCall(data);
     if(resp?.status){
        toast.success(resp.msg);
        getTokenList();
     }else{
      toast.error(resp.msg);

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
                <h4 className="card-title">TOKEN LIST</h4>
                {/* <Link to="/addtoken">
                <button>Add Token</button>
                </Link> */}
                <div className="table-responsive">
                <ReactDatatable

records={tokenList}
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


