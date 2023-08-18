 
import React,{useState,useEffect,useMemo,useCallback,useContext} from "react";
import { useSelector } from 'react-redux';
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
import { GetTopCollections ,Getpromotedtoken, GetPromotedcollection } from "../actions/axioss/nft.axios";
// import { Link } from "@mui/material";
import { Link } from "react-router-dom";
import {  getCmsContent } from "../actions/axioss/cms.axios";
import config from "../config/config"
import { useLocation,useParams } from 'react-router-dom';
import footerlogo from "../app/assets/images/footer-logo.png";

export default function Header(){


const [state,setState] = useState({
    topcollections:([
        {
        collectionName:"Super Man NFT",
        Creator_DisplayName:"Collection Creatore Name",
        profileImage:require("../app/assets/images/collection.png")
        },
        {
            title:"Super Man NFT",
            description:"Collection Creatore Name",
            img:require("../app/assets/images/collection.png")
        },
        {
            title:"Super Man NFT",
            description:"Collection Creatore Name",
            img:require("../app/assets/images/collection.png")
        },
        {
            title:"Super Man NFT",
            description:"Collection Creatore Name",
            img:require("../app/assets/images/collection.png")
        },
        {
            title:"Super Man NFT",
            description:"Collection Creatore Name",
            img:require("../app/assets/images/collection.png")
            },
            {
                title:"Super Man NFT",
                description:"Collection Creatore Name",
                img:require("../app/assets/images/collection.png")
                },

    ]),
    comfortable:([
        {
            title:"What is NFT?",
            img:require("../app/assets/images/collection.png")
        },
        {
            title:"What is CryptoWallet?",
            img:require("../app/assets/images/collection.png")
        },
        {
            title:"What are blockchain gas fees?",
            img:require("../app/assets/images/collection.png")
        },
        {
            title:"How to Buy NFT?",
            img:require("../app/assets/images/collection.png")
        },
    ])
   })


  const { accountAddress, web3,web3p, coinBalance } = useSelector(state => state.LoginReducer.AccountDetails);

  const [topCollectionsList,setTopCollectionsList] = useState([]);
  const [newCollectionsList,setNewCollectionsList] = useState([])
  var [promotedToken,setPromotedtoken] = useState([]);
  const [homecontent,setHomecontent]=useState({});
  const[homecontentmidd,setHomecontentmidd]=useState({})
  var [promotedCollection,setPromotedcollection] = useState([]);
  var [currentPromotion,setCurrentPromotion] = useState({collection:[],token:[]})


  useEffect(()=>{
      TopCollections();
      GetPromtion();
      Cmstop();
      Cmsmiddle();
  },[])

  const location = useLocation();
  const params = useParams();

  useEffect(()=>{

    if(location && location?.pathname.includes("home")) {
  
    goToSection(location?.pathname?.split("/").pop())
    }
  },[location])

  const goToSection = (sectionid)=>{

    if(sectionid == "topcollections") window.scrollTo(0, document.getElementById("topcollections").offsetTop);
   
    else if(sectionid == "newcollections") 
    {
         setTimeout(() => {
         window.scrollTo(0, document.getElementById("newcollections").offsetTop);
      },300);
       

    }

  }


  const TopCollections = async()=>{
    var data = await GetTopCollections({filter:"topcollections"})
    if(data?.data) setTopCollectionsList(data?.data)

    var data = await GetTopCollections({filter:"latest"})
    if(data?.data) setNewCollectionsList(data?.data)
     
  }

    const GetPromtion =async()=>{
        // var resp = await Getpromotedtoken()
        var protoken = await Getpromotedtoken();
        if(protoken.success == 'success'){
            setPromotedtoken(protoken.data)
        };
        var procollection = await GetPromotedcollection();
        if(procollection.success == 'success'){
            setPromotedcollection(procollection.data);
        }
    }

    useEffect(()=>{
        var arr=[1,2,3,4,5,6,7,8];
        var tokarr = [1,2];
        var fullprotoken = [];
        var fullprocollection = []
        arr.map((val,ind)=>{
            if(ind < promotedCollection.length){
                fullprocollection.push(promotedCollection[ind])
            }
            else{
                fullprocollection.push(state.topcollections[0])
            }
        })
        tokarr.map((val,ind)=>{
            if(ind < promotedToken.length){
                fullprotoken.push(promotedCollection[ind])
            }
            else{
                fullprotoken.push(tokarr[ind]);
            }
        })
        setCurrentPromotion({...currentPromotion,...{collection:fullprocollection,token:fullprotoken}})
    },[promotedToken,promotedCollection])

    const Cmstop =async()=>{
   
        var resp = await getCmsContent("homepage_top");
        if(resp?.status)
        setHomecontent(resp.data);
    }
    const Cmsmiddle =async()=>{
      
       var resp = await getCmsContent("homepage_middle");

       if(resp?.status)
       setHomecontentmidd(resp.data);
   }

    return(
        <>
        <Box sx={{ flexGrow: 1 }} className="container">
            <Box className='container'>
            <Grid container rowSpacing={1} columnSpacing={{ xs:1, sm:2, md:3}} className="box-banner">
                
                {currentPromotion && currentPromotion?.token?.map((val,ind)=>
                    
                    <Grid item xs={12} xl={ 4} lg={  4} md={  4} sm={6}>
                    
                        <Link to={!(promotedToken[ind]?.CollectionNetwork)?"#":`/info/${promotedToken[ind].CollectionNetwork}/${promotedToken[ind].ContractAddress}/${promotedToken[ind].Creator_WalletAddress}/${promotedToken[ind].NFTId}`}>
                       
                        <img  src={(promotedToken[ind]?.fileType.includes("video") || promotedToken[ind]?.fileType.includes("audio") )?
                        promotedToken[ind]?.NFTThumpImage ? promotedToken[ind]?.NFTThumpImage : (ind === 0 ? require("../app/assets/images/banner-1.png") : require("../app/assets/images/banner-2.png"))
                        :promotedToken[ind]?.NFTOrginalImage ? promotedToken[ind]?.NFTOrginalImage : (ind === 0 ?  require("../app/assets/images/banner-1.png") : require("../app/assets/images/banner-2.png")) } className="mui-img-fluid banner_dbl_img_align" />
                        </Link>
                     {/* <img src={require("../app/assets/images/banner-1.png")} className="mui-img-fluid" /> */}
                    
                </Grid>
                )}
                {/* <Grid item xs={12} xl={3.5} lg={3.5} md={3.5} sm={6}>
                    {
                        promotedToken.length >= 1 ?
                        <Link to="/info">
                        <img src={promotedToken[0]?.CompressedFile} className="mui-img-fluid" />
                        </Link>
                    :
                    <img src={require("../app/assets/images/banner-1.png")} className="mui-img-fluid" />
                    }
                </Grid> */}
                {/* {
                <Grid item xs={12} xl={4.5} lg={4.5} md={4.5} sm={6}>
                {
                        promotedToken.length >= 2 ?
                        <Link to="/info">
                        <img src={promotedToken[1]?.CompressedFile} className="mui-img-fluid" />
                        </Link>
                    :
                    <img src={require("../app/assets/images/banner-2.png")} className="mui-img-fluid" />
                    }
                
                </Grid>
                } */}
                {/* <Grid item xs={12} xl={4.5} lg={4.5} md={4.5} sm={6}>
                {
                        promotedToken.length >= 2 ?
                        <Link to="/info">
                        <img src={promotedToken[1]?.CompressedFile} className="mui-img-fluid" />
                        </Link>
                    :
                    <img src={require("../app/assets/images/banner-2.png")} className="mui-img-fluid" />
                    }
                </Grid> */}
                <Grid item xs={12} xl={4} lg={4} md={4} sm={6}>
                    {homecontent?.answer ?
                <div dangerouslySetInnerHTML={{__html:homecontent?.answer}}></div> :
                <>
                 <p className="home_banner_text_align">World of</p>
                  <p className="home_banner_text_align">NFTs</p>
                  <span className="home_banner_hinttext_align">A fully decentralized Community to Create, Buy, Sell and stake NFTs</span></> }
                  <Box>
                    <Link to="/explore/All">
                  <button className="banner-button">Discover</button>
                  </Link>
                  </Box>
                </Grid>          
            </Grid>
            </Box>
            </Box>
            <Box className="container topCollectionsBlock">
                <Box className="d-flex justify-content-between">
                <p className="topcollections" id="topcollections">Top Collections</p>
                <Link className="explore" to="/collectionList">
                Explore All <i class="fa fa-angle-right" aria-hidden="true"></i>
                
                </Link>

                </Box>
                <Box>
                <Grid container rowSpacing={1} columnSpacing={{ xs:1, sm:2, md:3}} className="top-collections-box-banner">
                    {topCollectionsList.map((data,index) => {
                        return(
                    <Grid item xl={2.4} lg={2.4} md={4} sm={6} xs={12}>
                        <Box className="card">
                            <img src={(data?.profileImage)?(data?.profileImage):require("../app/assets/images/collection.png")} className="mui-img-fluid" />
                            <Box className="collection-info">
                            <p className="collections-title">{data?.collectionName}</p>
                            <p className="collections-description">@{data?.customUrl}</p>
                            </Box>
                        </Box>
                        <Box className="collection-button">
                            <Link to={`/collection/${data.Creator}/${data.customUrl}`}>
                            <button className="banner-button">View Collections</button>
                            </Link>
                            </Box>
                            
                    </Grid>
                        )
                    })
                    } 
                </Grid>
                </Box>
            </Box>
            <Box className="platform">
                <Box className="container">
                    {homecontentmidd && homecontentmidd?.answer ?
                    <div dangerouslySetInnerHTML={{__html:homecontentmidd?.answer}}></div>
                    :
                   <><h2>A Platform Inspired By Community</h2>
                    <p className="bannerfont">XDsea is a new approach to the world of NFTs. It's about freedom and having fun, we strive to make NFTs intuitive and unccomplicated</p> </>}
                    </Box>
                </Box>
            <Box className="container">
                <Box className="community">
                <h2>Community First</h2>
                <p>Unique collections created by the XDsea Community.</p>
                </Box>
                <Box>
                <Grid container rowSpacing={1} columnSpacing={{ xs:1, sm:2, md:3}} className="top-collections-box-banner">
                {currentPromotion.collection.slice(0,1).map((data,index) => {
                        return(
                <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                    <Box className="card single-card ">
                            <img src={data.profileImage} className="mui-img-fluid"/>
                            <Box className="collection-info">
                            <p className="collections-title">{data.collectionName}</p>
                            <p className="collections-description">{data.Creator_DisplayName}</p>
                            </Box>
                        </Box>
                        <Box className="collection-button">
                        <Link to={`/collection/${data.Creator}/${data.customUrl}`}>

                            <button className="banner-button ">View Collections</button>
                            </Link>
                            </Box>
                </Grid>
                    )
                })
                } 
                <Grid item xl={8} lg={8} md={6} sm={12} xs={12}>
                <Grid container rowSpacing={1} columnSpacing={{ xs:1, sm:2, md:3}} className="top-collections-box-banner">
                {currentPromotion.collection.slice(1,7).map((data,index) => {
                        return(
                <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <Box className="card sub-card">
                            <img src={data.profileImage} className="mui-img-fluid" />
                            <Box className="collection-info">
                            <p className="collections-title">{data.collectionName}</p>
                            <p className="collections-description">{data.Creator_DisplayName}</p>
                            </Box>
                        </Box>
                        <Box className="collection-button">
                        <Link to={`/collection/${data.Creator}/${data.customUrl}`}>

                            <button className="banner-button banner_button_align">View Collections</button>
                            </Link>
                        </Box>
                    </Grid>
                     )
                    })
                    } 
                </Grid>
                </Grid> 
                </Grid>   
                </Box>
            </Box> 
            <Box className="container-fluid mt-3">
                <Box className="stragight ">
                <h2 id="newcollections">Straight From The Sea</h2>
                <p >Newly Created Collections</p>
                </Box>
                <Box>
                <Grid container rowSpacing={1} columnSpacing={{ xs:1, sm:2, md:3}} className="top-collections-box-banner">
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <Grid container rowSpacing={1} columnSpacing={{ xs:1, sm:2, md:3}} className="top-collections-box-banner">
                {newCollectionsList.map((data,index) => {
                        return(
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                <Box className="card sub-card">
                            <img src={ (data?.profileImage)?(data?.profileImage):require("../app/assets/images/collection.png")} className="mui-img-fluid" />
                            <Box className="collection-info">
                            <p className="collections-title">{data?.collectionName}</p>
                            <p className="collections-description">{data?.customUrl}</p>
                            </Box>
                        </Box>
                        <Box className="collection-button">
                        <Link to={`/collection/${data.Creator}/${data.customUrl}`}>


                            <button className="banner-button">View Collections</button>
                        </Link>
                        </Box>
                    </Grid>
                     )
                    })
                    } 
                </Grid>
                </Grid> 
                </Grid>   
                </Box>
            </Box> 

            <Box className='container-fluid'>
                <Grid container>
                    <Grid  Item className="p-3" xxl={4} xl={4} lg={4} md={4} sm={12} xs={12}>
                    <div className="text-center ">
                            <img  src={require('../app/assets/images/server-icon.png')}/>
                            </div>
                            <p className="client_text_align">A fully decentralized NFT marketplace that is community-powered ecosystem. Create, buy and sell NFT</p>
                       
                    </Grid>

                    <Grid Item className="p-3" xxl={4} xl={4} lg={4} md={4} sm={12} xs={12}>
                    <div className="text-center">
                            <img  src={require('../app/assets/images/people-icon.png')}/>
                            </div>
                            <p className="client_text_align" >We pride ourselves in being community-driven, the core of XDSea is it's community of creators, buyers, and sellers.</p>
                        
                    </Grid>

                    <Grid Item className="p-3" xxl={4} xl={4} lg={4} md={4} sm={12} xs={12}>
                        <div className="text-center">
                            <img  src={require('../app/assets/images/smile-face-icon.png')}/>
                            </div>
                            <p className="client_text_align">We strive to uncomplicate NFTs for everyone giving a highly simplistic and easy to use experience.</p>
                       
                    </Grid>
                </Grid>
            </Box>
            <Box className="nft_01 platform">
                <Box className="container">
                <Box className="stragight ">
                <h2>NFT 101</h2>
                <p>Get comfortable with the basics</p>
                <Grid container rowSpacing={1} columnSpacing={{ xs:1, sm:2, md:3}} className="box-banner box_hone_size">
                {state.comfortable.slice(0,4).map((data,index) => {
                        return(
                <Grid className="home_card_height" item xl={3} lg={3} md={3} sm={3} xs={12}>
                <Box className="card sub-card">
                            <img src={footerlogo} className="mui-img-fluid" />
                            <Box className="collection-info">
                            <p className="collections-title mt-2">{data.title}</p>
                            <p className="collections-description">{data.description}</p>
                            </Box>
                        </Box>
                    </Grid>
                     )
                    })
                    }
                    </Grid> 
                </Box>
                    </Box>
                </Box>     
        </>
    )
 
}