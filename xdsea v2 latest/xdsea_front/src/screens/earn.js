

 
import React,{useState,useEffect} from 'react'
import { Container,Row,Col } from 'react-bootstrap';
import {Accordion} from 'react-bootstrap';
import TokenCard from "../Components/tokencard.js"
import { toast } from 'react-toastify';
import { useDispatch,useSelector } from 'react-redux'
import { useLocation,useHistory,useNavigate} from 'react-router-dom';
import { Token_List_Func } from "../actions/axioss/nft.axios.js"




toast.configure();


function FilterContent(props) {

  useEffect(() =>{
    window.scrollTo(0,0);
},[])
 
const navigate = useNavigate();

  return (
    <>
   
    <div className='container-fluid custom_container'>
         <div className="earn">   
         <video autoPlay loop>
  <source src={require('../app/assets/images/earn_video.mp4')} type="video/mp4" />
  
</video>
       
          
        
        {/* <div className='mt-3'>
          <center>
        <button className='banner-button' onClick={()=>navigate("/")}>Go To Home</button>
        </center>
        </div> */}
       
        </div>
        </div>
                    
            
        
  
    </>
  )
}

 
export default FilterContent