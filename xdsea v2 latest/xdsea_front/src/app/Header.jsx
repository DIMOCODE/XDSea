

import React,{useState,useEffect,useMemo,useCallback,useContext} from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import {Dropdown, Offcanvas} from 'react-bootstrap';
import { Link ,useNavigate,useLocation} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import '@metamask/legacy-web3'
import { useDispatch, useSelector  } from 'react-redux';
import config from "../config/config.js"
import { Scrollbars } from 'react-custom-scrollbars';
import { connectWallet,getServiceFees } from '../hooks/useWallet.js'; 
import { isEmpty } from '../actions/common.js';
import { userRegister} from '../actions/axioss/user.axios.js'
import { Category, Currency, USDPRICE, TOKENPRICE} from '../actions/axioss/cms.axios'
import {SearchAction2,getcartlist} from "../actions/axioss/nft.axios"
import Config from "../config/config.js";
import DataTable from 'react-data-table-component';

toast.configure();



export default function Header({ name, ...props }){

  const columns = [
    {
      name: "Items",
       selector: (vals) => vals.item,
      sortable: true,
    }
] 

const data = [

    {
        item: <div className="ofrrcvd_tbl_img_data offcanva_cart_tbl">
          <img className="offcanva_cart_img_align" src={require('../app/assets/images/drop6.jpg')}/>
          <div>
          <p>Moonbirds-19</p>
          <span>#1867148614</span>
          </div>
          </div>,
        
      
    },
    {
      item: <div className="ofrrcvd_tbl_img_data offcanva_cart_tbl"><img className="offcanva_cart_img_align" src={require('../app/assets/images/drop6.jpg')}/><div><p>Moonbirds-19</p><span>#1867148614</span></div></div>,
      
    
  },
  {
    item: <div className="ofrrcvd_tbl_img_data offcanva_cart_tbl"><img className="offcanva_cart_img_align" src={require('../app/assets/images/drop6.jpg')}/><div><p>Moonbirds-19</p><span>#1867148614</span></div></div>,
    
  
},
{
  item: <div className="ofrrcvd_tbl_img_data offcanva_cart_tbl"><img className="offcanva_cart_img_align" src={require('../app/assets/images/drop6.jpg')}/><div><p>Moonbirds-19</p><span>#1867148614</span></div></div>,
  

},
  ]

const location = useLocation()
  const [hamcanvashow, setHamcanvaShow] = useState(false);
  const [searchbar, setSearchbar] = useState(false);
  const [attention, setAttention] = useState(true);

  const hamcanvahandleClose = () => setHamcanvaShow(false);
  const hamcanvahandleShow = () => setHamcanvaShow(true);
  const [themeval, setthemeval] = useState(false);
  const [changeTheme, setChangeTheme] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wallet = useSelector(state => state.LoginReducer.AccountDetails);
  const { payload } = useSelector(state => state.LoginReducer.User)
  const onClicksearch = () => setShowText(true);
  const [showText, setShowText] = useState(false);
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
      });
      const toggleDrawer =
      (anchor, open) =>
      (event) => {
        if (
          event &&
          event.type === 'keydown' &&
          ((event).key === 'Tab' ||
            (event).key === 'Shift')
        ) {
          return;
        }
        setState({ ...state, [anchor]: open });
      }; 
      if (localStorage.theme) {
        // useChangeTheme(!changeTheme);
        localStorage.setItem("theme", localStorage.theme);
        var themeChange = localStorage.getItem("theme");
        document.body.classList.remove("light_theme");
        document.body.classList.add(themeChange);
      } else {
        // useChangeTheme(!changeTheme);
        localStorage.setItem("theme", "light_theme");
        var themeChange = localStorage.getItem("theme");
        // document.getElementById("root").classList.remove("dark_theme");
        // document.getElementById("root").classList.add(themeChange);
        document.body.classList.remove("dark_theme");
        document.body.classList.add(themeChange);
      }
      function light_theme(){
        localStorage.setItem("theme","light_theme");
      if(localStorage.getItem("theme","light_theme")){
        document.body.classList.add("light_theme");
        document.body.classList.remove("dark_theme");
        localStorage.setItem("theme","light_theme");
      }
      else{
        document.body.classList.add("dark_theme");
      }
      }
      
      function dark_theme(){
        localStorage.setItem("theme","dark_theme");
      if(localStorage.getItem("theme","dark_theme")){
        localStorage.setItem("theme","dark_theme");
        document.body.classList.add("dark_theme");
        document.body.classList.remove("light_theme");
      }
      else{
        document.body.classList.add("light_theme");
      }
      }
      const list = (anchor) => (
        <Box className="side_drawer_align"
          sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          
          <List  className="side_drawyer_list_alignone">
            {['Shop all NFTs', 'New', 'Bestsellers','Drops', 'Upcoming','Categoreis','Create','Earn','Help Center','About XDSea','Blog'].map((text, index) => (
              <ListItem  key={text} disablePadding>
                <ListItemButton>
                  {/* <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon> */}
                  <ListItemText className="side_drawyer_list_align" primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {/* {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))} */}
          </List>
        </Box>
      );   

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s); 

  const [showCart, setShowCart] = useState(false);

  const handleCloseCart = () => setShowCart(false);
  const toggleShowCart = () => setShowCart((s) => !s); 




  // Wallet connect 

  useEffect(() => {
    if (localStorage.getItem("walletConnectType") && wallet.accountAddress == '') {
            // initialConnectWallet(localStorage.getItem("walletConnectType"))
            RefreshConnectWallet(localStorage.getItem("walletConnectType"))

    }
    getInitialSeviceFee();
     Categorys1();
     CurrencyList();
            
}, []);

const Categorys1 = async () => {
        
  let Resp = await Category();
  
  if (Resp?.data) {
    var sendda = [];
    var categorylist = (Resp?.data)?(Resp?.data).filter((item=>item.hideShow != "hidden")):[]
 
    // var data = (Resp.data || []).map((item) => {
    var data = (categorylist).map((item) => {

      sendda.push({
        label: item.name,
        value: item.name,
        description: item.description,
        image:item.image
      });
    });
  //   setCategory(sendda)
    dispatch({
      type: "Register_Section",
      Register_Section: {
        Categorys: sendda,
      },
    });
  }
};
const toggleSearchmenu = async (event) => {
  var useclass = document.getElementsByClassName("searchmneu_dd");
  if (event.target.value.length == 1) {
    for (var c = 0; c < useclass.length; c++) {
      useclass[c].classList.remove('d-none');

    }
  }
  if (event.target.value.length == 0) {
    for (var c = 0; c < useclass.length; c++) {
      useclass[c].classList.add('d-none');

    }
  }
}

const EnterSearchPage = async(e)=>{
if(e.key == "Enter"){
  navigate(`/search/${searchkeyword}`)
}
}
const CurrencyList = async () => {
  let Resp = await Currency();

  if (Resp?.msg) {
    var currencylist = (Resp?.msg[0]?.CurrencyDetails)?(Resp?.msg[0]?.CurrencyDetails).filter((item)=>(item.deleted != true || item.deleted != 1)):[]
    var sen = [];
    var datas = await Promise.all(
        (currencylist)?.map(async (data) => {
          var USD = await USDPRICE(data.label);
          sen.push({
            value: data.value,
            label: data.label,
            address: data.address,
            usd: USD ? USD : 0,
            decimal: data.decimal,
          });
        })
    );
    dispatch({
      type: "Register_Section",
      Register_Section: {
        // currency: datas.length > 0 ? datas : sen,
        currency: datas.length > 0 ? sen : [],

      },
    });
  }
};


const getInitialSeviceFee = async () => {
  var fees = await getServiceFees();
  if (fees) {
    dispatch({
      type: 'ServiceFees',
      ServiceFees_Section: {
        ServiceFees: fees,
      },
    });
  }
};


  useEffect(()=>{
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', async function () {
            handleAccountChange();
      })
  
  }
  },[])



const handleAccountChange = () => {
  if (localStorage.getItem("walletConnectType") ) {
    initialConnectWallet(localStorage.walletConnectType,"");
    setTimeout(() => {
    window.location.reload()
      
    }, 300);
  }
  }


  const initialConnectWallet = async (type,walletName)=>{
  
    setShow(false)
   const id=toast.loading(`${walletName?walletName:""} Wallet Connecting...`)

    var accountDetails = await connectWallet(type)
    
    if(!isEmpty(accountDetails)){
         var resp = await setWalletAddress('InitialConnect',accountDetails.accountAddress,type)
        if(resp?.success == 'success'){
            toast.update(id,{render : resp.msg , type:resp.success,autoClose:1000, isLoading: false,})
            dispatch({
                type: "Account_Section",
                Account_Section: {AccountDetails:accountDetails}
            })
        }
        else{
            toast.update(id,{render : "Connect Wallet" , type:'error',autoClose:1000, isLoading: false,})
        }
                  
    }
    else{
    toast.update(id,{render : "Try Again" , type:'error',autoClose:1000, isLoading: false,})
    }
}

const RefreshConnectWallet = async (type,walletName)=>{
  
  setShow(false)

  var accountDetails = await connectWallet(type)
 
  
  if(!isEmpty(accountDetails)){
       var resp = await setWalletAddress('InitialConnect',accountDetails.accountAddress,type)
 
      if(resp?.success == 'success'){
          dispatch({
              type: "Account_Section",
              Account_Section: {AccountDetails:accountDetails}
          })
      }
      else{
          // toast.update(id,{render : "Connect Wallet" , type:'error',autoClose:1000, isLoading: false,})
          toast.error("connect wallet")
      }
                
  }
  else{
  // toast.update(id,{render : "Try Again" , type:'error',autoClose:1000, isLoading: false,})
  toast.error("connect wallet")

  }
}

const setWalletAddress    =   async   (type,walletAddress,walletType)  =>  {

  if(walletAddress){
    var NewMethod = {
          Type: type,
          WalletAddress: walletAddress,
          WalletType: walletType,
    }; 

    
    let Resp = await userRegister(NewMethod);
    if(Resp?.success == 'success'){
        dispatch({
            type:'Register_Section',
            Register_Section : {
                User: {
                    payload	: 	Resp.data
                }
            }
        })
        return Resp
    }
    else return Resp
}  
else return {success:'error',msg:'No Address Detected.. Check Your Wallet'}

}


const walletDisconnect = async () => {
  localStorage.removeItem("accountInfo")
  localStorage.removeItem("walletConnectType")
  dispatch({
      type: 'Account_Section',
      Account_Section: {
          AccountDetails: {
              accountAddress: "",
              tokenBalance: 0,
              coinBalance: 0
          }
      }
  })
  toast.success("Wallet Disconnected")
}


useEffect(()=>{
  findDeviceType()
},[])

const [deviceType,setDeviceType] = useState()

const findDeviceType = async()=>{
  let details = navigator.userAgent;
  let regexp = /android|iphone|kindle|ipad/i;
  let isMobileDevice = regexp.test(details);

  if (isMobileDevice) {
 
    setDeviceType("mobile")

} else {
 
    setDeviceType("desktop")

}
}


const [Searchdata, SetSearch] = React.useState(null);
const [val, setval] = useState("");
const [searchkeyword, setsearchkeyword] = useState("");

useEffect(()=>{

setTimeout(() => {
  searchFunc(searchkeyword)
  
}, 1000);

},[searchkeyword])


const searchFunc = async (value) => {
  console.log("to search value",value)
  if (value) {
    setval(value);
 
    var Resp = await SearchAction2({
      keyword: value,
      limit: 3,
      page: 1,
      from: "search",
    });
    if (Resp) {
      SetSearch(Resp);
    }
  }
};




////---->cart popup

useEffect(()=>{
  if(wallet?.accountAddress)
    getcarttokens()

},[wallet?.accountAddress])

const [cartliststate,setcartliststate] = useState([])

const getcarttokens = async()=>{
  var resp = await getcartlist({buyerAddress:wallet?.accountAddress})
  if(resp?.status){
    var limitresp = resp?.data
    if(limitresp.length>4) limitresp = limitresp.limit(4)

    var cart_notification = await limitresp.map((data)=>{
     let divObj = {item:   <>
      <div className="ofrrcvd_tbl_img_data offcanva_cart_tbl">
       <img className="offcanva_cart_img_align" src={(data?.fileType.includes("image"))?
                                                     (data?.NFTOrginalImage)
                                                     :
                                                     (data?.NFTThumpImage)?
                                                     (data?.NFTThumpImage):
                                                     require('../app/assets/images/drop6.jpg')}/>
       <div>
       <p>{data?.NFTName}</p>
       {/* <span>#1867148614</span> */}
       </div>
       </div>
     </>}
      return divObj
    
  })

  setcartliststate(cart_notification)

  }
 


}


    return(
        <>
        {/* {!searchbar? */}
        <Box sx={{ flexGrow: 1 }} className="container home_container header_position_align header_div_common_align">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xxl={6} xl={6} lg={6} md={6} sm={4} xs={3}>
                <Box className="search_hambur_align">
                <Box>
                <img className="header_hamburger_logo" src={require('./assets/images/moreham.png')} onClick={hamcanvahandleShow} aria-hidden="true"/>
                        {/* <i class="fa fa-bars hamburger_align" ></i> */}


                        <Offcanvas className='header_offcanvasone' show={hamcanvashow} onHide={hamcanvahandleClose}>
        <Offcanvas.Header className="header_offcanvaone_header_align" closeButton>
          {/* <Offcanvas.Title>Offcanvas</Offcanvas.Title> */}
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="offcan_header_list_align">
            <li  onClick={()=>navigate("/explore/All")}>Shop All NFTs</li>
            <li onClick={()=>navigate("/home/newcollections")}>New</li>
            <li onClick={()=>navigate("/home/topcollections")}>Bestsellers</li>
            <li onClick={()=>navigate("/drops")}>Drops</li>
            <li  onClick={()=>navigate("/category")}>Categories</li>
            <li  onClick={()=>navigate("/collectionList")}>Collections</li>
            <li onClick={()=>navigate("/create")}>Create</li>
            <li onClick={()=>navigate("/earn")}>Earn</li>
            

          </ul>
          
        </Offcanvas.Body>
      </Offcanvas>
                    {/* {anchor} */}
                   
                    
                </Box>
                {
                  searchbar == false &&
                  <i class="fa fa-search static_header_search_align" aria-hidden="true"
                   onClick={()=>setSearchbar(true)}
                   />
                }
                {
                  searchbar == true &&
                <div className="header_scroll_search_align container home_container">
                  <div className="header_null_search_align">
                  {
                  searchbar == true &&
                   <>
                   <i class="fa-solid fa-xmark search_close_icon_align" onClick={()=>setSearchbar(false)}/>


<input type='text' className="scoll_search_bar_align" onClick={onClicksearch} placeholder="Search for NFT's Collections and profiles" onChange={(e)=>{
setsearchkeyword(e.target.value)
// searchFunc(e.target.value)
 
toggleSearchmenu(e);}}
onKeyDown={(e)=>EnterSearchPage(e)}
/>
 
 {/* <Link to={`/search/${val}`}><button className=" header_scroll_search_btn_align ">search</button></Link> */}
 </>
                  }

          </div>
                
                <div className="searchmneu_dd d-none">
            {/* {Searchdata?.token?.data?.length > 0 ||
                                    Searchdata?.user?.msg?.length > 0 ||
                                    Searchdata?.drop?.msg?.length > 0 ||
                                    Searchdata?.artist?.msg?.length > 0 ?( */}
                        {Searchdata?.token?.length > 0 ||
                                    Searchdata?.users?.length > 0 ||
                                    Searchdata?.collections?.length > 0 
                                    ?(
            <Scrollbars style={{ height: 350 }} className="nto_scrol_div">
{/* {Searchdata.token?.data?.length > 0 && ( */}
{Searchdata.token?.length > 0 && (

              <div>
                <p className="listcategory">NFT</p>
              <ul>
              {/* {Searchdata?.token?.data.map( */}
              {Searchdata?.token?.map(

               (product) => (
        <>
         <li onClick={() => {
                    setval("");
                    SetSearch();
                    navigate(
                      `/info/${product?.CollectionNetwork}/${product?.ContractAddress}/${product?.NFTOwner}/${product?.NFTId}`
                    );
                  }}>
                  <div className="listitems">
                    <div >
         {/* image */}

       {product?.fileType.includes("image") && 
       <>
         {product?.NFTOrginalImage.includes("ipfs") ?
        <img src={
          (product?.NFTOrginalImage)
        } className="searchbar_img_align" />
         : 
     <img src={product?.CompressedFile} className="searchbar_img_align" />  
        } 
  


       </>}

       {/* video / Audio */}

       {(product?.fileType.includes("video") || product?.fileType.includes("audio") )&& 
       <>
       {/* {(product?.NFTOrginalImage.includes("ipfs")?
        <img src={require('./assets/images/logo.png')} className="searchbar_img_align" />:
        <img src={product?.NFTThumpImage} className="searchbar_img_align" />

       )} */}
        <img src={
          (product?.NFTThumpImage)?
          (product?.NFTThumpImage)
           :
           require('./assets/images/logo.png')
        } className="searchbar_img_align" />
     
    

       
       </>}
                    {/* <img className="header_wallet_logo" src={require('./assets/images/white_wallet.png')}/> */}
                    </div>
                    <div>
                      <p className="search_menu_dd_text">{((product?.NFTName).length > 8)?(product?.NFTName).slice(0,8).concat("..."):product?.NFTName}</p>
                    </div>
                    
                    </div>
                    </li></>
        )
        )}
               
               

              </ul>
              </div>)}
              {/* {Searchdata.user?.msg?.length > 0 && ( */}
              {Searchdata?.users?.length > 0 && (


              <div>
              <p className="listcategory" >Users</p>
              <ul>
              {/* {Searchdata.user?.msg.map( */}
              {Searchdata?.users.map(

    (product) => (
        <>
            <li onClick={() => {
                  setval("");
                 navigate(
                    `/my-item/${product?.CustomUrl}`
                  );
                }}>
                  <div className="listitems">
                    <div >
                    {(product?.Profile)?
                  <img src={product?.Profile}  
                  className="searchbar_img_align"
                  />
                  :
                    <img className="searchbar_img_align" src={require('./assets/images/logo.png')}/>}
                    </div>
                    <div>
                    {(product?.DisplayName)?
                      <p style={{color:"white"}}> 
                          {String(product?.DisplayName).length >32?(product?.DisplayName).slice(0,32).concat("..."):product?.DisplayName}

                      </p>:
                      <p style={{color:"white"}}>{String(product?.WalletAddress).slice(0,32).concat("...")}</p>}
                    </div>
                    
                    </div></li></>
        )
        )}
          
             
                

              </ul>
              </div>)}
              {/* {Searchdata.user?.msg?.length > 0 && ( */}
              {Searchdata?.collections.length > 0 && (


<div>
<p className="listcategory" >Collections</p>
<ul>
{/* {Searchdata?.collection?.msg.map( */}
{Searchdata?.collections.map(

(product) => (
<>
<li onClick={() => {
    setval("");
    navigate(
    (product?.isImported)
    ?`/importcollection/${product.Creator}/${product.customUrl}`:`/collection/${product.Creator}/${product.customUrl}`
    );
  }}>
    <div className="listitems">
      <div >
    {(product?.profileImage)?
    <img src={product?.profileImage}  
    className="searchbar_img_align"
    />:
      <img className="searchbar_img_align" src={require('./assets/images/logo.png')}/>}
      </div>
      <div>
      {(product?.collectionName)?
        <p style={{color:"white"}}> 
 
            {String(product?.collectionName).length >32?(product?.collectionName).slice(0,32).concat("..."):product?.collectionName}

        </p>
        :<></>}
        {/* <p style={{color:"white"}}>{String(product?.WalletAddress).slice(0,32).concat("...")}</p>} */}
 
      </div>
      
      </div></li></>
)
)}


  

</ul>
</div>)}
              </Scrollbars>):<p >No Items Found</p>}
              <div>
              {/* <Link to={`/search/${val}`}><button className="searchbar_search_btn_align">Search</button></Link> */}
              </div>
            </div>
                </div>
}



                {/* mobile view search bar */}
                {
                  searchbar == true &&
                   <>
                <div className="header_scroll_search_align  header_scroll_search_align_mob container home_container">
                  <div className="header_null_search_align">
                  {
                  searchbar == true &&
                   <>
                   <i class="fa-solid fa-xmark search_close_icon_align" onClick={()=>setSearchbar(false)}/>


<input type='text' className="scoll_search_bar_align"onClick={onClicksearch} placeholder="Search for NFT's Collections and profiles" onChange={(e)=>{
// searchFunc(e.target.value)
setsearchkeyword(e.target.value)
toggleSearchmenu(e);



}}/>
 
 </>
                  }

          </div>
                
                <div className="searchmneu_dd d-none">
            {/* {Searchdata?.token?.data?.length > 0 ||
                                    Searchdata?.user?.msg?.length > 0 ||
                                    Searchdata?.drop?.msg?.length > 0 ||
                                    Searchdata?.artist?.msg?.length > 0 ?( */}
                                    {/* {Searchdata?.token?.data?.length > 0 ||
                                    Searchdata?.user?.msg?.length > 0 ||
                                    Searchdata?.drop?.msg?.length > 0 ||
                                    Searchdata?.artist?.msg?.length > 0 ?( */}
                        {Searchdata?.token?.length > 0 ||
                                    Searchdata?.users?.length > 0 ||
                                    Searchdata?.collections?.length > 0 
                                    ?(
            <Scrollbars style={{ height: 350 }} className="nto_scrol_div">
{/* {Searchdata.token?.data?.length > 0 && ( */}
{Searchdata?.token?.length > 0 && (
              <div>
                <p className="listcategory">NFT</p>
              <ul>
              {Searchdata?.token?.map(
               (product) => (
        <>
         <li onClick={() => {
                    setval("");
                    SetSearch();
                    navigate(
                      `/info/${product?.CollectionNetwork}/${product?.ContractAddress}/${product?.NFTOwner}/${product?.NFTId}`
                    );
                  }}>
                  <div className="listitems">
                    <div >
         {/* image */}

       {product?.fileType.includes("image") && 
       <>

         {product?.NFTOrginalImage.includes("ipfs") ?
        <img src={
          (product?.NFTOrginalImage)
        } className="searchbar_img_align" />:
        <img src={product?.CompressedFile} className="searchbar_img_align" />
         }
  


       </>}

       {/* video / Audio */}

       {(product?.fileType.includes("video") || product?.fileType.includes("audio") )&& 
       <>

       {(product?.NFTOrginalImage.includes("ipfs")?
        <img src={require('./assets/images/logo.png')} className="searchbar_img_align" />:
        <img src={product?.NFTThumpImage} className="searchbar_img_align" />

       )}
       </>}
                    {/* <img className="header_wallet_logo" src={require('./assets/images/white_wallet.png')}/> */}
                    </div>
                    <div>
                      <p className="search_menu_dd_text">{((product?.NFTName).length > 8)?(product?.NFTName).slice(0,8).concat("..."):product?.NFTName}</p>
                    </div>
                    
                    </div>
                    </li></>
        )
        )}
               
               

              </ul>
              </div>)}
             {/* {Searchdata.user?.msg?.length > 0 && ( */}
             {Searchdata?.users?.length > 0 && (

              <div>
              <p className="listcategory" >Users</p>
              <ul>
              {Searchdata?.users?.map(
    (product) => (
        <>
            <li onClick={() => {
                  setval("");
                 navigate(
                    `/my-item/${product?.CustomUrl}`
                  );
                }}>
                  <div className="listitems">
                    <div >
                    {(product?.Profile)?
                  <img src={product?.Profile}  
                  className="searchbar_img_align"
                  />:
                    <img className="searchbar_img_align" src={require('./assets/images/logo.png')}/>}
                    </div>
                    <div>
                    {(product?.DisplayName)?
                      <p style={{color:"white"}}> 
                          {String(product?.DisplayName).length >32?(product?.DisplayName).slice(0,32).concat("..."):product?.DisplayName}

                      </p>:
                      <p style={{color:"white"}}>{String(product?.WalletAddress).slice(0,32).concat("...")}</p>}
                    </div>
                    
                    </div></li></>
        )
        )}
          
             
                

              </ul>
              </div>)}
                {/* {Searchdata.user?.msg?.length > 0 && ( */}
                {Searchdata?.collections.length > 0 && (

<div>
<p className="listcategory" >Collections</p>
<ul>
{/* {Searchdata?.collection?.msg.map( */}
{Searchdata?.collections.map(
(product) => (
<>
<li onClick={() => {
    setval("");
    navigate(
      (product?.isImported)
      ?`/importcollection/${product.Creator}/${product.customUrl}`:`/collection/${product.Creator}/${product.customUrl}`
      );
  }}>
    <div className="listitems">
      <div >
      {(product?.profileImage)?
    <img src={product?.profileImage}  
    className="searchbar_img_align"
    />:
      <img className="searchbar_img_align" src={require('./assets/images/logo.png')}/>}
      </div>
      <div>
      {(product?.collectionName)?
        <p style={{color:"white"}}> 
 
            {String(product?.collectionName).length >32?(product?.collectionName).slice(0,32).concat("..."):product?.collectionName}

        </p>:
        <p style={{color:"white"}}>{String(product?.WalletAddress).slice(0,32).concat("...")}</p>}
 
      </div>
      
      </div></li></>
)
)}


  

</ul>
</div>)}
              </Scrollbars>):<p >No Items Found</p>}
              <div>
              <Link to={`/search/${val}`}><button className=" header_scroll_search_btn_align ">search</button></Link>
              </div>
            </div>
                </div>
                </>
}
                

                {/* end of mobile view search bar */}

                 
                
               
                
                {/* <Box className="search searchsec header_searchbar_aligning">
                
                <input type="text" className="mui-input" onClick={onClicksearch} placeholder="Search for NFT's Collections and profiles" onChange={(e)=>{
               
                 searchFunc(e.target.value)
                 toggleSearchmenu(e);

            }} />    
                
            
            
                </Box> */}
                
                </Box>
            </Grid>
            <Grid item xxl={3} xl={3} lg={3} md={3} sm={4} xs={3}>
              <Link to="/">
                <Box className="header_main_logo_align" >
                <img src={require("../app/assets/images/logo.png")} className="mui-img-fluid" />
                {/* <img src={require("../app/assets/images/newlogo.png")} className="mui-img-fluid" /> */}

                </Box>
                </Link>
            </Grid>
            <Grid item xxl={3} xl={3} lg={3} md={3} sm={4} xs={6}>
                <Box className="my-profile header_end_logos_align">
                    <ul>
                    
          
                        {/* <li className="cart"><img className="header_wallet_logo header_cart_align" onClick={toggleShowCart} src={require('./assets/images/bag.png')}/></li>  */}
                        
       {/* {(wallet && wallet?.accountAddress )? */}
       <> 
       {wallet.accountAddress ?
                            <>                       
         <Dropdown className="header_dropdown ">
                    <Dropdown.Toggle className="header_usericon_dropdown" variant="" id="dropdown-basic">
                    <li className="wallet" >
                          <img className="header_wallet_logo" src={require('./assets/images/wallet.png')}/>
                          </li>
                        </Dropdown.Toggle>
        <Dropdown.Menu className="user_dropdown_menu user_dropdown_menu_align">
        <Dropdown.Item className="user_dropdown_item user_dropdown_item_align" href="#">
          {/* <div className="header_balance_dtls_align">
            <div className="profile_dtls_header_align">
          <i class="fa-solid fa-user me-1 header_wallet_img_align"/>
 
          <span>{(wallet && wallet?.accountAddress).slice(0,8).concat("...")}</span>
 

          </div>
          <div className="header_balance_dtls">
            <h6>Total Balance:</h6>
            
            <p>{(wallet && wallet?.coinBalance ) && String(Number(wallet?.coinBalance) / 10**18).slice(0,6)} {config?.COIN_NAME}</p>
            </div>
           
          </div>
          {wallet.accountAddress ?
                            <button className="banner-button header_cnct_padding_align" onClick={()=>{walletDisconnect()}} ><span>Disconnect</span></button>:
                            <button className="banner-button header_cnct_padding_align" onClick={toggleShow}><span>Connect</span></button>} */}

                            <div className="wal_drp_align">
                          
                              <div className="xd_logo_div_align ">
                                <img src={require('../app/assets/images/logo.png')}/>
                              </div>
                              <div className="cnct_id_dtls_align">
                            
                                <p className="cnctd_txt_align">Connected <span><i class="fa-solid fa-circle wal_crcl_align"/></span></p>
                                <span className="wal_adrs_align">{(wallet && wallet?.accountAddress).slice(0,8).concat("...")}</span>
                              </div>
                           
                              <div className="logout_dtls_align"  onClick={()=>{walletDisconnect()}}>
                              <i class="fa-solid fa-power-off power_icon_align"/>
                              <p className="font_10" >LOGOUT</p>
                              </div>
                              
                             
                               
                            </div>
        </Dropdown.Item>
      </Dropdown.Menu>
                        </Dropdown>
                        </>
                        :                    <>                       
                        <Dropdown className="header_dropdown ">
                                   <Dropdown.Toggle className="header_usericon_dropdown" variant="" id="dropdown-basic">
                                   <li className="wallet" onClick={()=>toggleShow()}>
                                         <img className="header_wallet_logo" src={require('./assets/images/wallet.png')}/>
                                         </li>
                                       </Dropdown.Toggle>
                       
                                       </Dropdown>
                                       </>
                        }

                        <Dropdown className="header_dropdown ">
                    <Dropdown.Toggle className="header_usericon_dropdown" variant="" id="dropdown-basic">
                        <li className="user"><img className="header_user_img_align" src={require('./assets/images/user.png')}/>
                        
                        </li>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="user_dropdown_menu">
         
        <Dropdown.Item className="user_dropdown_item" onClick={()=>(wallet?.accountAddress)&&navigate(`/my-item/${payload?.CustomUrl}`)}>Profile</Dropdown.Item> 
        <Dropdown.Item className="user_dropdown_item" onClick={()=>(wallet?.accountAddress)&&navigate(`/create`)}>Create</Dropdown.Item>
        <Dropdown.Item className="user_dropdown_item" onClick={()=>(wallet?.accountAddress)&&navigate(`/mycollections/${wallet?.accountAddress}`)}>My Collections</Dropdown.Item>
        {/* <Dropdown.Item className="user_dropdown_item" href="#">Favourites</Dropdown.Item> */}
        <Dropdown.Item className="user_dropdown_item" href="#" style={{flexDirection:"row",
        alignItems:"center",justifyContent:"center"}}>
        <i class="fa fa-sun-o" aria-hidden="true" onClick={() => light_theme()}></i>&nbsp;/ 
         &nbsp;<i class="fa fa-moon-o" aria-hidden="true" onClick={() => dark_theme()}></i>
        </Dropdown.Item>
        
      </Dropdown.Menu>

                        </Dropdown>
<li className="cart"><img className="header_wallet_logo header_cart_align" onClick={toggleShowCart} src={require('./assets/images/bag.png')}/></li>

                        </>
                 
                      
                          
                           
                            
{/*        
                        <li className="cart"><img className="header_wallet_logo header_cart_align" onClick={toggleShowCart} src={require('./assets/images/bag.png')}/></li> */}
                        <li>

                          {/* Card Canvas */}


                          {/* <Offcanvas show={showCart} onHide={handleCloseCart} {...props} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Some text as placeholder. In real life you can have the elements you
          have chosen. Like, text, images, lists, etc.
        </Offcanvas.Body>
      </Offcanvas>
 */}















                          <Offcanvas className='header_offcanvas' show={showCart} onHide={handleCloseCart} {...props} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="mx-auto text-dark">Your Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
{(cartliststate && cartliststate.length >0)?
<>
                    <DataTable   responsive={true} search={true} 
                        data={cartliststate}
                        columns={columns}
                        // customStyles={tableCustomStyles}
                    />
   <div className="d-flex justify-content-center w-100">
         
          <Link to="/cartpage">
          <a data-ignore-split="true" class="Button"   tabindex="0" aria-label="">
    Check Out
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Check Out</span>
    <span class="Button-hover-content" aria-hidden="true">Check Out</span>
    <span class="Button-hover-content" aria-hidden="true">Check Out</span>
    <span class="Button-hover-content" aria-hidden="true">Check Out</span>
  </a>
  </Link>
          </div>
                    </>:
          <p className="text-center cart_txt_align">Your Cart is Empty.</p>}

{/* <p className="text-center cart_txt_align">Your Cart is Empty.</p> */}

        </Offcanvas.Body>
      </Offcanvas>


                          {/* End Cart Canvas */}



                          


             

                          </li> 
                          <Offcanvas className='header_offcanvas' show={show} onHide={handleClose} {...props} placement='end'>
        {/* <Offcanvas.Header >
          <Offcanvas.Title className="mx-auto text-dark">My Wallet</Offcanvas.Title>
        </Offcanvas.Header> */}
        <Offcanvas.Body>
          <div className="canva_mywal_align">
            <div className="border_only">
            <div className="rounded_gray">
            <i class="fa-solid fa-user round_gray_user"/>
            
            </div>
            </div>
            <p className="mywal_txt">My Wallet</p>
          </div>
          <p className="wal_hint_txt">Select a Wallet from the below options.<span> If you don't have wallet , </span> select one to get started</p>

          <div className="xdc_pay_content mt-3 d-flex justify-content-start align-items-center" 
          id="MetaMask" onClick={() => initialConnectWallet("MetaMask","XDC")}>
            <img src={require('../app/assets/images/xdcpzy.png')}></img>
            <h6 className="ms-1 text-dark meta_hal">XDC Pay</h6>
          </div>
          <div className="xdc_pay_content mt-3 d-flex justify-content-start align-items-center"
           id="MetaMask" onClick={() => initialConnectWallet("MetaMask","MetaMask")} >
            <img src={require('../app/assets/images/meta.png')}></img>
            <h6 className="ms-1 text-dark meta_hal">Metamask</h6>
          </div>
          {/* {deviceType && deviceType=="mobile"&& */}
          <div className="xdc_pay_content mt-3 d-flex justify-content-start align-items-center"
                id="MetaMask" onClick={() => initialConnectWallet("MetaMask","D'Cent")} >

            <img src={require('../app/assets/images/dcent.png')}></img>
            <h6 className="ms-1 text-dark meta_hal">D'Cent</h6>
          </div>
          {/* } */}
          {/* {deviceType && deviceType=="desktop"&&

          <div className="xdc_pay_content mt-3 d-flex justify-content-start align-items-center"
                id="MetaMask" onClick={() => initialConnectWallet("WalletConnect","D'Cent")} >

            <img src={require('../app/assets/images/dcent.png')}></img>
            <h6 className="ms-1 text-dark meta_hal">D'Cent</h6>
          </div>} */}
        </Offcanvas.Body>
      </Offcanvas>
                    </ul>
                </Box>
            </Grid>

            <Grid item xs={12} lg={12} xxl={12} md={12} sm={12} className="header_navs ">
              <ul >
                <Link className="header_nav_links" to='/explore/All'><li>Shop all NFTs</li></Link>
                <Link className="header_nav_links" to='/home/newcollections'><li>New</li></Link>
                <Link className="header_nav_links" to='/home/topcollections'><li>Bestsellers</li></Link>
                <Link className="header_nav_links" to='/drops'><li>Drops</li></Link>
                <Link className="header_nav_links" to='/category'><li>Categories</li></Link>

                {/* <Link className="header_nav_links" to='/'><li>Upcoming </li></Link> */}
                <Link className="header_nav_links" to='/collectionList'><li>Collections</li></Link>
                <Link className="header_nav_links" to='/create'><li>Create</li></Link>
                <Link className="header_nav_links" to='/earn'><li>Earn</li></Link>
                
              </ul>
            </Grid>

            </Grid>
            </Box>
            <Grid item xs={12} lg={12} xxl={12} md={12} sm={12} className={attention ? "header_attension_msg" : "d-none"}>
              <div className="header_attension_dtls">
                <p><b className="attention_bold">Attention:</b> XDSea users! We are migrating to a new smart contract system to enhance our platform's functionality. As part of this transition, you will notice a "Withdraw" button next to your listed NFTs. We kindly request you to click on this button to ensure a seamless transition to the new contract. Thank you for your cooperation as we strive to improve your experience on XDSea.</p>
                <i class="fa-solid fa-xmark attention_x" onClick={() => setAttention(false)}></i>
              </div>
            </Grid>
            


        </>
    )
 
 
}