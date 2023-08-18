 
import React,{useState,useEffect,useMemo,useCallback,useContext} from "react";
import useContractProviderHook from "../actions/contractProviderHook";
import Web3 from "web3"

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
import { GetTopCollections ,Getpromotedtoken, GetPromotedcollection ,newlycreatednfts} from "../actions/axioss/nft.axios";
// import { Link } from "@mui/material";
import { Link } from "react-router-dom";
import {  getCmsContent } from "../actions/axioss/cms.axios";
import config from "../config/config"
import { useLocation,useParams } from 'react-router-dom';
import footerlogo from "../app/assets/images/footer-logo.png";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import $ from 'jquery';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard,Scrollbar } from "swiper";
import STAKING from "../Abi/staking.json"





// import Swiper from 'react-slider-swiper';



// import OwlCarousel from 'react-owl-carousel';
// import 'owl.carousel/dist/assets/owl.carousel.css';
// import 'owl.carousel/dist/assets/owl.theme.default.css';

export default function Header(){
var ContractCall = useContractProviderHook()
// const scrollingfun = () =>{
//     alert(1)
//     var k = document.getElementsByClassName('scrolling_nav');
//     k.className += "transformNone";

// }

// useEffect(() => {
//     Update the document title using the browser API
//     document.querySelector(".overflow_carousal .owl-next").onclick = function()
//     {
//         var k = document.getElementsByClassName('scrolling_nav')[0];
//         k.classList.remove("transformHide");
//     k.className -= " transformHide";
//     }

//     document.querySelector(".overflow_carousal .owl-prev").onclick = function()
//     {
//         var k = document.getElementsByClassName('scrolling_nav')[0];
//         k.classList.remove("transformHide");
//     k.className -= " transformHide";
//     }
//   });






    const options = {
        loop: false,
        margin: 10,
        dots: false,
        mouseDrag:true,
        touchDrag:true,
        responsive: {
            0: {
                items: 1,
            },
            400: {
                items: 2,
            },
            768: {
                items: 3,
            },
            992: {
                items: 4,
            },
            1200: {
                items: 5,
            },
            1500: {
                items: 6,
            },
        }
    }

    const options1 = {
        loop: false,
        margin: 10,
        dots: false,
        responsive: {
            0: {
                items: 1,
            },
            576: {
                items: 2,
            },
            768: {
                items: 2,
            },
            992: {
                items: 3,
            },
            1200: {
                items: 4,
            },
            1500: {
                items: 5,
            },
        }
    }

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
  const { currency, Categorys } = useSelector((state) => state.LoginReducer);

  const [topCollectionsList,setTopCollectionsList] = useState([]);
  const [newCollectionsList,setNewCollectionsList] = useState([])
  var [promotedToken,setPromotedtoken] = useState([]);
  const [homecontent,setHomecontent]=useState({});
  const[homecontentmidd,setHomecontentmidd]=useState({})
  var [promotedCollection,setPromotedcollection] = useState([]);
  var [currentPromotion,setCurrentPromotion] = useState({collection:[],token:[]})
  var [newnfts,getnewnfts] = useState([])

  useEffect(() =>{
    window.scrollTo(0,0);
},[])



  useEffect(()=>{
      TopCollections();
      GetPromtion();
      Cmstop();
      Cmsmiddle();
      getNewNfts();
      
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

  const GetPromtion = async () => {
    // var resp = await Getpromotedtoken()
    var protoken = await GetPromotedcollection({ from: "stackpromotion" });
 
    if (protoken.success == "success") {
      //   setPromotedtoken(protoken.data);
      setCurrentPromotion({
        ...currentPromotion,
        ...{ token: protoken.data },
      });
    }
    var procollection = await GetPromotedcollection({
      from: "bannerpromotion",
    });
    if (procollection.success == "success") {
      setPromotedcollection(procollection.data);
    }
  };

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
        setCurrentPromotion({...currentPromotion,...{collection:fullprocollection}}) 
    },[promotedCollection])

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



   const getNewNfts = async()=>{

      let Resp = await newlycreatednfts();
      getnewnfts(Resp.data)
   }


 

    return(


        <div className="overflow-hidden">

        <Box sx={{ flexGrow: 1 }} className="container home_container ">
            <Box className='container home_container_banner'>
            <Grid container rowSpacing={1} columnSpacing={{ xs:1, sm:1, md:0.5,xl:0.5,xxl:0.5}} className="box-banner home_container_banner">
                
                {currentPromotion && currentPromotion?.token.length != 0 ? (
              currentPromotion?.token?.map((data, ind) => (
                <Grid item xs={6} xl={4} lg={4} md={4} sm={6}>
                  <div className="banner_nametype_pos_align">
                    <Link
                      className="drop_view_btn"
                      to={
                        data.Creator
                          ? //     (String(data?.contractAddress).toLowerCase() != config.ERC721
                            //   || String(data?.contractAddress).toLowerCase() != config.ERC1155
                            //   || String(data?.contractAddress).toLowerCase() != config.TradeContract
                            //   )
                            data?.isImported
                            ? `/importcollection/${data?.Creator}/${data?.customUrl}`
                            : `/collection/${data?.Creator}/${data?.customUrl}`
                          : "/"
                      }
                    >
                      {/* <img
                        src={
                          promotedToken[ind]?.fileType.includes("video") ||
                          promotedToken[ind]?.fileType.includes("audio")
                            ? promotedToken[ind]?.NFTThumpImage
                              ? (promotedToken[ind]?.NFTThumpImage).includes(
                                  "xdsea.infura-"
                                )
                                ? (promotedToken[ind]?.NFTThumpImage).replace(
                                    "xdsea.infura-",
                                    ""
                                  )
                                : promotedToken[ind]?.NFTThumpImage
                              : ind === 0
                              ? require("../app/assets/images/banner-1.png")
                              : require("../app/assets/images/banner-2.png")
                            : promotedToken[ind]?.NFTOrginalImage
                            ? (promotedToken[ind]?.NFTOrginalImage).includes(
                                "xdsea.infura-"
                              )
                              ? (promotedToken[ind]?.NFTOrginalImage).replace(
                                  "xdsea.infura-",
                                  ""
                                )
                              : promotedToken[ind]?.NFTOrginalImage
                            : ind === 0
                            ? require("../app/assets/images/dianaduck.jpg")
                            : require("../app/assets/images/deathpool.jpg")
                        }
                        className="mui-img-fluid banner_dbl_img_align"
                      /> */}

                      <img
                        className="mui-img-fluid banner_dbl_img_align"
                        //  src={require('../app/assets/images/drop3.jpg')}
                        src={data.profileImage}
                      />

                      <div className="banner_pos_dtls_align">
                        <h5 className="banner_collection_hover_align">
                          {data?.collectionName
                            ? data?.collectionName
                            : "XDSEA NFT"}{" "}
                        </h5>
                      </div>
                    </Link>
                  </div>
                </Grid>
              ))
            ) : (
              <>
                {[1, 2].map(() => (
                  <Grid item xs={6} xl={4} lg={4} md={4} sm={6}>
                    <div className="banner_nametype_pos_align">
                      <img
                        className="mui-img-fluid banner_dbl_img_align"
                        //  src={require('../app/assets/images/drop3.jpg')}
                        src={require("../app/assets/images/deathpool.jpg")}
                      />

                      <div className="banner_pos_dtls_align">
                        <h5 className="banner_collection_hover_align">
                          XDSEA NFT
                        </h5>
                      </div>
                    </div>
                  </Grid>
                ))}
              </>
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
                <Grid item xs={12} xl={4} lg={4} md={4} sm={12}>
                    {homecontent?.answer ?
                <div dangerouslySetInnerHTML={{__html:homecontent?.answer}}></div> :
                <>
                <div className="home_banner_right_cntnt_align text-md-left text-center">
                 <span className="home_banner_text_align">NFT Staking is here.</span>
                 <br />
                  <span className="home_banner_text_align">Explore now</span>
                  <br/>
                  <span className="home_banner_hinttext_align">Earn steady rewards</span>
                  <Box >
                    <Link to="">
                  {/* <button className="banner_earn_btn_align">Earn</button> */}
                  <a data-ignore-split="true" class="Button banner_earn_btn_align"  id="earn_btnOne"   tabindex="0" aria-label="">
    Earn
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Earn</span>
    <span class="Button-hover-content" aria-hidden="true">Earn</span>
    <span class="Button-hover-content" aria-hidden="true">Earn</span>
    <span class="Button-hover-content" aria-hidden="true">Earn</span>
  </a>
                  </Link>
                  </Box>
                  </div>
                  </> }
                  
                </Grid>          
            </Grid>
            </Box>
            </Box>
            <Box className="container home_container topCollectionsBlock">
                <Box className="d-flex justify-content-between">
                <p className="topcollections home_page_headings_align" id="topcollections">Shop Our Top Collections</p>
                <Link className="explore" to="/collectionList">
                Explore All <i class="fa fa-angle-right" aria-hidden="true"></i>
                
                </Link>

                </Box>
                <Box>
                <div className="px-3">
            <Swiper
            mousewheel={true}
                // slidesPerView={4}
                spaceBetween={15}
                centeredSlides={false}
                navigation={true}
                modules={[Keyboard, Scrollbar,Mousewheel, Navigation, Pagination]}
                // slidesPerGroupSkip={1}
                grabCursor={true}
                keyboard={{
                enabled: true,
                }}
                scrollbar={{ draggable: true, dragSize: 200}}
                // pagination={{
                // clickable: true,
                // }}
                breakpoints={{
                    320: {
                      slidesPerView: 2,
                    },
                    768: {
                      slidesPerView:3 ,
                    },
                    992: {
                        slidesPerView:5 ,
                      }
                    
                  }}
            >

            { topCollectionsList && topCollectionsList.length > 0 && topCollectionsList?.map((data,index) => {
                        return(
                            
                            <SwiperSlide>   
                        <Box className="card">
                            {data?.isStakeable &&
                        <div className='stack_star_btn'>
        <p className='stack_badge'>Stake <i class="fa-solid fa-star stack_badge_star"></i></p> 
      </div>}
                            <img src={
                                (data?.profileImage)?
                                (data?.profileImage)
                                :require("../app/assets/images/collection.png")} className="mui-img-fluid" />
                            <Box className="collection-info">
                            <p className="collections-title">{data?.collectionName?.length > 15 ? data?.collectionName.slice(0,15).concat('...') : data?.collectionName}</p>
                            <p className="collections-description">@{data?.customUrl.length > 15 ? data?.customUrl.slice(0,15).concat('...'): data?.customUrl }</p>
                            </Box>
                        </Box>
                        <Box className="collection-button">
 
                            {/* <button className="banner-button" id="white_btn_anim"><span>View Collections</span></button> */}
                            <Link to={
                        //   (String(data?.contractAddress).toLowerCase() != config.ERC721
                        //   || String(data?.contractAddress).toLowerCase() != config.ERC1155
                        //   || String(data?.contractAddress).toLowerCase() != config.TradeContract
                        //   )
                          (data?.isImported)
                          ?`/importcollection/${data.Creator}/${data.customUrl}`:`/collection/${data.Creator}/${data.customUrl}`}>
 
                            
                            <a data-ignore-split="true" class="Button"  id="" onClick="" tabindex="0" aria-label="">
    View Collections
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
  </a>
                            
                            </Link>
                            </Box>
                            
                 </SwiperSlide>
                        )
                    })
                    }
      </Swiper>
      </div>
                </Box>
            </Box>
            
            <Box className="container home_container">
                <Box className="community community_one_align">
                <h2 className="home_page_headings_align">Community favorites.</h2>
                <p>At XDsea we always put our community first, check out some of the community favorite NFTs</p>
                </Box>
                <Box>
                <div  className="top-collections-box-banner mt-3 newlymint">
           

                {currentPromotion.collection.map((data,index) => {
                        return(
                <div >
                    <Box className="card " id={'something' + index}>
                    {data?.isStakeable &&

                    <div className='stack_star_btn'>
        <p className='stack_badge'>Stake <i class="fa-solid fa-star stack_badge_star"></i></p> 
      </div>}
                            <img src={
                                (data.profileImage)
                                } className="mui-img-fluid"/>
                            <Box className="collection-info">
                            <p className="collections-title">{data.collectionName}</p>
                            <p className="collections-description">{data.Creator_DisplayName}</p>
                            </Box>
                        </Box>
                        <Box className="collection-button">
                        {/* <Link to={(data.Creator)?`/collection/${data.Creator}/${data.customUrl}`:"/"}> */}
                        <Link to={
                            (data.Creator)?
                        //     (String(data?.contractAddress).toLowerCase() != config.ERC721
                        //   || String(data?.contractAddress).toLowerCase() != config.ERC1155
                        //   || String(data?.contractAddress).toLowerCase() != config.TradeContract
                        //   )
                          (data?.isImported)
                          ?`/importcollection/${data.Creator}/${data.customUrl}`:`/collection/${data.Creator}/${data.customUrl}`
                        :"/"}>

                        {/* <button className="banner-button" id="white_btn_anim"><span>View Collections</span></button> */}


                        <a data-ignore-split="true" class="Button"  id=""   tabindex="0" aria-label="">
    View Collections
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
  </a>
                            </Link>




                            </Box>
                </div>
                    )
                })
                } 
                
                

                </div>  
                </Box>
            </Box> 
            
                <Box className="container home_container fluid_full_width ">
                    <div className="platform">
                    {homecontentmidd && homecontentmidd?.answer ?
                    <div dangerouslySetInnerHTML={{__html:homecontentmidd?.answer}}></div>
                    :
                   <><h2 className="home_page_headings_align platform_inspired">A platform inspired by the community.</h2>
                    <p className="bannerfont">XDsea is a new approach to the world of NFTs. It's about freedom and having fun, we strive to make NFTs intuitive and uncomplicated</p> </>}
                    </div>
                    </Box>
                
           
            {/* <Box className="container-fluid mt-5">
                <Box className="stragight ">
                <h2 id="newcollections">Newly Minted NFTs</h2>
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
            </Box>  */}

            {/* <Box className='container-fluid'>
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
            </Box> */}

<Box className="container home_container">
                <Box className="community">
                <h2 id="newcollections" className="home_page_headings_align newly_top_align">Newly Minted NFTs</h2>
                {/* <p>At XDsea we always put our community first, check out some of the community favorite NFTs</p> */}
                </Box>
                <Box>

                <div  className="top-collections-box-banner mt-4 newlymintone">
           

           {newCollectionsList.map((data,index) => {
                   return(
           <div >
               <Box className="card " id={'something' + index}>
               {data?.isStakeable &&

               <div className='stack_star_btn'>
        <p className='stack_badge'>Stake <i class="fa-solid fa-star stack_badge_star"></i></p> 
      </div>}
                       <img src={
                          (data.profileImage)

                    } className="mui-img-fluid"/>
                       <Box className="collection-info">
                       <p className="collections-title">{data.collectionName}</p>
                       <p className="collections-description">{data.Creator_DisplayName}</p>
                       </Box>
                   </Box>
                   <Box className="collection-button">
                   {/* <Link to={`/collection/${data.Creator}/${data.customUrl}`}> */}
                   <Link to={
                    // (String(data?.contractAddress).toLowerCase() != config.ERC721
                    //       || String(data?.contractAddress).toLowerCase() != config.ERC1155
                    //       || String(data?.contractAddress).toLowerCase() != config.TradeContract
                    //       )
                          (data?.isImported)
                          ?`/importcollection/${data.Creator}/${data.customUrl}`:`/collection/${data.Creator}/${data.customUrl}`}>

                   {/* <button className="banner-button banner_button_align"><span>View Collections</span></button> */}

                   <a data-ignore-split="true" class="Button"  id=""   tabindex="0" aria-label="">
    View Collections
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
  </a>
                       </Link>
                       </Box>
           </div>
               )
           })
           } 
           
           

           </div>  
                
                </Box>
            </Box> 
            {/* <Box className="nft_01 platform">
                <Box className="container">
                <Box className="stragight ">
                <h2>Browse by Category</h2>
                
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
                </Box>     */}
                <div className="container  home_container browse_top_align">
                <div className="row" >
                    <h2 className="browse_head_text_align text-center home_page_headings_align">Browse by Category</h2>

 
                    <Box>
                <div className="px-3">
            <Swiper
            mousewheel={true}
                // slidesPerView={4}
                spaceBetween={15}
                centeredSlides={false}
                navigation={true}
                modules={[Keyboard, Scrollbar,Mousewheel, Navigation, Pagination]}
                // slidesPerGroupSkip={1}
                grabCursor={true}
                keyboard={{
                enabled: true,
                }}
                scrollbar={{ draggable: true, dragSize: 200 }}
                // pagination={{
                // clickable: true,
                // }}
                breakpoints={{
                    320: {
                      slidesPerView: 2,
                    },
                    768: {
                      slidesPerView:3 ,
                    },
                    992: {
                        slidesPerView:4 ,
                      }
                    
                  }}
            >

{Categorys && Categorys.map((data,index) => {

return(
<SwiperSlide className="mt-3">
<Box className="card">
{/* <div className='stack_star_btn'>
        <p className='stack_badge'>Stake <i class="fa-solid fa-star stack_badge_star"></i></p> 
 
 
      </div> */}
 
     
    <img src={
    (data?.image)?(`${config.IMG_URL}/categoryimage/${data?.image}`):
    (data?.label == 'Art')? require("../app/assets/images/artImage.png"):
    (data?.label == 'Staking')? require("../app/assets/images/stakingImage.png"):
    (data?.label == 'Utility')? require("../app/assets/images/utilityImage.png"):
    (data?.label == 'Collectibles')? require("../app/assets/images/collectibleImage.png"):
    (data?.label == 'Gaming')? require("../app/assets/images/gamingImage.png"):
    (data?.label == 'PFP')? require("../app/assets/images/pfpImage.png"):
    (data?.label == 'Photography')? require("../app/assets/images/photoImage.png"):

    require("../app/assets/images/collection.png")} className="mui-img-fluid" />
 
    <Box className="collection-info">
    <p className="collections-title">{data?.label}</p>
    {/* {/ <p className="collections-description">@{data?.customUrl}</p> /} */}
    </Box>
</Box>
<Box className="collection-button">
    <Link to={`/explore/${data?.label.replace(/\s/g, '')}`}>
    {/* {/ <button className="banner-button banner_button_align"><span>Browse</span></button> /} */}

    <a data-ignore-split="true" class="Button browse_btn_align"  id=""  tabindex="0" aria-label="">
Browse
<span class="Button-hover-helper"></span>
<span class="Button-hover-helper"></span>
<span class="Button-hover-helper"></span>
<span class="Button-hover-helper"></span>
<span class="Button-hover-content" aria-hidden="true">Browse</span>
<span class="Button-hover-content" aria-hidden="true">Browse</span>
<span class="Button-hover-content" aria-hidden="true">Browse</span>
<span class="Button-hover-content" aria-hidden="true">Browse</span>
</a>
    </Link>
    </Box>
    
</SwiperSlide>
)
})
} 
      </Swiper>
      </div>
                </Box>
 



                </div>
                </div>
                
                <div className="mt-5 container home_container">
                        <div className="video_bg_cntnt_align">
                            <h1 className="water_head_text_align">Take the Plunge INTO <br/> THE SEA,where Web3 <br/> Meets Community! </h1>
                            <p className="water_hint_text_align">Share Your Thoughts, Ask <br/> Questions and Be Part of the XDSea<br/>Community!</p>
                            {/* <button className="water_enter_btn_align banner-button"><span>Enter</span></button> */}

                            <a data-ignore-split="true" class="Button water_enter_btn_align"  id=""  tabindex="0" aria-label=""
                            href="https://www.intothesea.info/"
                            >
    Enter
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Enter</span>
    <span class="Button-hover-content" aria-hidden="true">Enter</span>
    <span class="Button-hover-content" aria-hidden="true">Enter</span>
    <span class="Button-hover-content" aria-hidden="true">Enter</span>
  </a>
                      </div>
                    
                </div>


            



        </div>
    )
 
}