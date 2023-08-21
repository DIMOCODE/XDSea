import React, { Component,useState, useEffect  } from 'react';
import { useLocation,useHistory,useParams} from 'react-router-dom';

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
  const [catList,setCatList] = useState([])

const columns = [

  {
    key: "name",
    text: "Category NAME",
    className: "NFT NAME",
    align: "left",
    sortable: true,
   

  },
  // {
  //   key: "description",
  //   text: "Category Description",
  //   className: "NFT IDT",
  //   align: "left",
  //   sortable: true,
  
 

  // },
  {
    key: "Delete",
    text: "Hide/Show category",
    className: "NFT IDT",
    align: "left",
    sortable: true,
    cell: record =>
      <div><button onClick={()=>hideShowCategory(record.hideShow == "visible"?"hidden":"visible",record.name)}>{record.hideShow == "hidden"?"SHOW":"HIDE"}</button></div>
 

  },
  {
    key: "image",
    text: "Category Image",
    className: "NFT IDT",
    align: "left",
    sortable: true,
    cell: record =>
      <div> <img src={`${config.ImG}/categoryimage/${record.image}`}></img></div>
 

  },

  {
    key: "edit",
    text: "Edit",
    className: "NFT IDT",
    align: "left",
    sortable: true,
    cell: record =>
    <>
    <Link to={{pathname:"/editcategory",state:record}}>
      <div><button >Edit Image</button></div>
      </Link>
      </>
    
  }
 
  
]

  useEffect(()=>{
    getCateoryList();
  },[])


  const getCateoryList = async()=>{
    var resp = await tokenFunctions.getCatList();
    if(resp?.status){
        setCatList(resp.data)
    }
  }
 
  const hideShowCategory = async(data,name)=>{
    var payload = {hideShow:data,catName:name}
    var resp = await tokenFunctions.hideShowCat(payload);
    if(resp?.status){
      toast.success(resp.msg)
      setTimeout(() => {
        getCateoryList()
      },2000);
    }
    else toast.error(resp.msg)

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
                <h4 className="card-title">CATEGORIES</h4>
                <Link to="/addcategory">
                <button>Add Category</button>
                </Link>
                <div className="table-responsive">
                <ReactDatatable

records={catList}
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


