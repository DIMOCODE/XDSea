 
import React,{useEffect, useMemo, useState} from 'react'
 
import Header from '../app/Header'
import Footer from '../app/Footer'
import { Link ,useLocation,useParams} from 'react-router-dom'
import { Container,Row,Col,Table } from 'react-bootstrap'
import {CollectionDetail,nftpooldetails,ListImportedNfts,ListNFts} from '../actions/axioss/nft.axios'
import { useDispatch,useSelector } from 'react-redux'
import { Token_List_Func,CollectionStatsData,getstakedetails,PendingClaimedRewards,Token_List_Func_collection } from "../actions/axioss/nft.axios.js"
import {USDPRICE} from "../actions/axioss/cms.axios.js"
import config from "../config/config.js"
import {USDVALUE} from '../actions/common.js'

function StakingDetails() {

 
 

    const location= useLocation();
    const {creator,customurl} = useParams()
    const { payload } = useSelector((state) => state.LoginReducer.User);
 
    useEffect(() =>{
        window.scrollTo(0,0);
    },[])
 

    const [collectionData,setCollectionData] = useState({})
    const [ownersCount,setOwnersCount] = useState(0)
    const [importnfts,setimportnfts] = useState([])
    const [TokenList,setTokenList] = useState([])
    const [claimpend,setclaimpend] = useState([])
    const [pagecount,setpagecount] = useState(1)
    const [Tokens, SetTokens] = useState({
        All: { loader: true, page: 1, list: [] },
      });
      const [TabName, SetTabName] = useState("All");
      const [loadingtext, setloadingtext] = useState(false);
      const [TabArray,setTabArray] = useState([])
    const [xdcusd,setxdcusd] = useState()
    const [pooldetails,setpooldetails] = useState({})
    const [stakes,setstakes] = useState({})



    useEffect(()=>{
        getCollectionDetails()
        getxdc_usdvalue()
   },[])


   useEffect(()=>{

   if(TokenList.length > 0,pooldetails){
    getPendingClaimed();
   }
   

   },[TokenList,pooldetails])

   const getPendingClaimed = async()=>{

 
    if(TokenList?.length >0){
        var searchArr = []
        var data = TokenList.map((nft)=>{
 
            if(nft?.isStake == true) searchArr.push({
                NFTId:nft.NFTId,
                NFTOwner:nft.NFTOwner,
                isStake:nft.isStake,
                isStakeable:true,
                backedValue:nft?.backedValue ? nft.backedValue : 1,
                rewardFrecuency:pooldetails?.rewardRates[0]?.rewardFrecuency,
                rewardamount:pooldetails?.rewardRates[0]?.amount,
                lockPeriod:pooldetails?.lockPeriod
             
            })
        })

        var response = await PendingClaimedRewards({searchArr:searchArr})
 
        if(response?.data){
            setclaimpend(response?.data)
        }
    }
     
   }

   const getxdc_usdvalue = async()=>{
    let val = await USDPRICE("XDC")
    setxdcusd(val)
  }

//   useEffect(()=>{
//     getstakes()
// },[collectionData])

  
//    const getstakes = async()=>{
//     console.log("id data",collectionData._id,collectionData);
//     let resp = await getstakedetails({collectionId:collectionData._id,page:1})
//     console.log("resp after getting stakes",resp?.stakes)
//     setstakes(resp.stakes)
//    }

   useEffect(()=>{
    getPoolNftDetails()

   },[collectionData])

   useEffect(() => {
    if(!location.pathname.includes("importcollection")){
 
    Explore();
    }
  }, [collectionData,location]);

//   useEffect(()=>{
 
//     if(stakes && stakes.length >0 && TokenList &&  TokenList.length >0){
//        AddTokenrewards()
//     }

//   },[stakes,TokenList])


 

  const AddTokenrewards = async()=>{

     var listoftokens = TokenList
     listoftokens.map((nft,i)=>{
         if(pooldetails?.walletAddress == config.RETROSTAKE_ADDRESS) 
            var stakedata = stakes.find((item)=>item.nftId._id == nft.tokenowner_id )
         else
            var stakedata = stakes.find((item)=>item?.stake?.nftId._id == nft.tokenowner_id )

        listoftokens[i].amountOfPendingRewards = (stakedata?.rewardsClaimed[0]?.amountOfPendingRewards)?stakedata?.rewardsClaimed[0]?.amountOfPendingRewards:0
        listoftokens[i].amountOfClaimedRewards = (stakedata?.rewardsClaimed[0]?.amountOfClaimedRewards)?stakedata?.rewardsClaimed[0]?.amountOfClaimedRewards:0

     })
     setTokenList(listoftokens)
     
  }

  const Explore = async (data, tab) => {
    var page = data?data:pagecount;
    var SendDATA = {
    TabName: TabArray.length > 0 ?TabArray:"All",
    limit: data ?data * 12:12,
    ProfileUrl: payload?.ProfileUrl ? payload.ProfileUrl : "",
    page: page ?? 1,
    from: "collection",
    Filter:collectionData?.collectionName,
    isGetStake:true,
    isStakepage:true
    };
 
    let Resp = await Token_List_Func_collection(SendDATA);
 
    if (Resp?.data) {
    setloadingtext(false)
    setTokenList(Resp?.data)
    
    } else{
    setloadingtext(false)

    SetTokens({
        ...Tokens,
        ...{
        [TabName]: {
            list: Tokens[TabName].list,
            loader: false,
            page: Tokens[TabName].page,
        },
        },
    });
    }
};



   const getCollectionDetails = async()=>{

    var findData = {
        Creator:creator,
        customUrl:customurl
    }

    var collData = await CollectionDetail(findData)
    
    if(collData.status){
        setCollectionData(collData.data)
        setOwnersCount(collData.ownerscount)
        setimportnfts(collData.data.importednfts)
    
    }

}




const getPoolNftDetails = async()=>{
 
    var resp = await nftpooldetails({collectionId:collectionData._id})
    setpooldetails(resp.data)
}





// const getStake = (id) => {
//     var stake = {};
//     if (stakes?.length !== 0) {
//       stakes?.map((stakeData) => {
//         if (stakeData.nftId._id === id) {
//           stake = stakeData;
//         }
//       });
//       return stake;
//     }
//   };

const getStake = async(id)=>{
}

const getpendamount  = async(data)=>{
    return data
}


  return (
    <>
    <Header/>
    <Container fluid className='banner_img_dtls'>
        <div className='banner_img_full'>
        <img className="banner_img_full_align" src={
            collectionData?.BannerImage?
            (collectionData?.BannerImage)
            :require('../app/assets/images/bannerbig.jpg')}/>

            <div className='creator_dtls'>
                <div className='creator_img_align'>
                    <img className='creator_img' src={collectionData?.profileImage?
                       (collectionData?.profileImage)
                        :require('../app/assets/images/collection.png')}/>
                </div>
                <div className='creator_txt_dtls'>
                    <b>Collection</b>
                    <small className='creator_xdc_dtls relatie_txt'>{String(collectionData?.collectionName).slice(0,8).concat("...")}</small>
                </div>
            </div>

            <div className='collection_banner_dtls'>
                <div className='collection_banner_dtls_txt  me-2'>
                <b>Creator:</b><br/>
                <span className='collection_banner_hint'>{String(collectionData?.Creator).slice(0,15).concat("...")}</span>
                </div>
                <div className='collection_banner_dtls_icons'>
                  
                {/* {collectionData?.twitter &&
                      <a href={collectionData?.twitter} target="_blank">
                    <div className='iconstwo_banner_align me-2' onClick={()=>{
                        window.location.href(`${collectionData?.twitter}`)
                    }}>
                    <i class="fa-brands fa-twitter two_icons"></i>
                    </div></a>
                     }
                    {collectionData?.website &&
                      <a href={collectionData?.website } target="_blank">

                    <div className='iconstwo_banner_align  me-2'>
                    <i class="fa-solid fa-globe two_icons"></i>
                    </div></a>} */}
                </div>
            </div>
            
            <div className='banner_member_dtls_align'>
                
                    <div className='col_align' >
                    <b>{ownersCount}</b>
                <span className='collection_banner_hint'>Owners</span>

                    </div>
                    <div className='col_align' >
                    <b>{collectionData?.collectionCount}</b>
                <span className='collection_banner_hint'>NFT's</span>

                    </div>
                    <div className='col_align'>
                        <div className='banner_xdcicon_small'>
                            {/* <img  src={require('../app/assets/images/xdc_icon_small.png')}/> */}
                        {/* <p className='lock_xdc_value'>{USDVALUE(String(pooldetails?.backedValuesAmount)) || 0}</p> */}

                        <b>{USDVALUE(String(collectionData?.floorPrice))} XDC</b>
                    {/* <b>{Number(collectionData?.floorPrice).toFixed(3)} XDC</b> */}
                    </div>
                <span className='collection_banner_hint'>Floor Price</span>

                    </div>
                    <div className='col_align' >
                    <div className='banner_xdcicon_small'>
                            {/* <img  src={require('../app/assets/images/xdc_icon_small.png')}/> */}
                            <b>{USDVALUE(String(collectionData?.volume))} XDC</b>
                    </div>
                    
                <span className='collection_banner_hint'>Volume Traded</span>

                    </div>
                
            </div>

            <div className='banner_social_icons_align mt-1'>
            <div className='col_align'>
            {collectionData?.instagram &&
            <i class="fa-brands fa-instagram banner_social_icon_align"/>}
                {collectionData?.facebook &&

            <i class="fa-brands fa-facebook-f banner_social_icon_align"/>}
                {collectionData?.twitter &&

            <i class="fa-brands fa-twitter banner_social_icon_align"/>}
               {collectionData?.discord &&
              <i class="fa-brands fa-discord banner_social_icon_align"></i>
               }
            {/* <div className='p-1 d-flex justify-content-center align-items-center'>
            <img className='youtube_common_align' src={require('../app/assets/images/vaadin_youtube.png')}/>
            </div> */}

                    </div>
            </div>
            

        </div>

    </Container>
    <Container >
    {(collectionData && collectionData?.Bio) &&
        <div className='detailed_text_dtls mt-5 w-100'>
            
            <p>{collectionData?.Bio}</p>
        
        </div>}
    </Container>

    <Container className='mt-5'>
        <Row className='gx-2'>
        <Col className='mb-3' xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
            <div className='locked_dtls_align'>
                
                <Row className='gx-2'>
                <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                    <h6 className='locked_title_align locking_text'>Total Values Locked</h6>
                    <button className='locked_dtls_btn'>
                        <div className='locked_img_txt_dtl'>
                        <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
                        <p className='lock_xdc_value'>{USDVALUE(String(pooldetails?.backedValuesAmount)) || 0}</p>
                        {/* <p className='lock_xdc_value'>{Number(pooldetails?.backedValuesAmount).toFixed(3) || 0}</p> */}
                        </div>
                        {/* <small className='lock_grey_txt'>{(Number(pooldetails?.backedValuesAmount || 0)*xdcusd).toFixed(3)}{" "}usd</small> */}
                    </button>
                    </Col>

                    <Col  xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                    <h6 className='locked_title_align locking_text md_top_al'>Lock Period</h6>
                    <button className='locked_dtls_btn'>
                        
                        <p className='lock_xdc_value'>{(collectionData?.collectionName == "XDSEA MONKEYS ORIGINAL ART")?"---":pooldetails?.lockPeriod} hrs</p>

                        
                    </button>
                    </Col>

                </Row>
            </div>

        </Col>

        <Col className='mb-3' xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
            <div className='reward_dtls_align'>
                <Row className='gx-2'>
                <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
                    <div className='cap_xdc_align'>
                    <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
                    <h5 className='lock_xdc_value'>{(collectionData?.collectionName == "Sacred Gems")?"GEM":"XDC"}</h5>
                    </div>
                    <div className='cap_hr_dtls'>
                    <hr className='cap_hr_align' />
                    </div>

                    </Col>

                   
             {pooldetails && pooldetails?.rewardRates && pooldetails?.rewardRates?.length >0 ?
             

              (pooldetails?.rewardRates?.map((data)=>{
                return(
                <>
                <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                <h6 className='locked_title_align'>Reward Rate</h6>

                <button className='reward_dtls_btn'>
                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
                        <p className='lock_xdc_value'>&nbsp;{data?.amount}</p>
                        </button>
                    </Col>

                    <Col  xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                    <h6 className='locked_title_align'>Reward Frequency</h6>
                <button className='reward_dtls_btn'>
                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
                        <p className='lock_xdc_value'>&nbsp;{data.rewardFrecuency}{" hrs"}</p>
                        </button>
                    </Col>
                    </>)
              })
              )
              :(
                <>
                <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                <h6 className='locked_title_align'>Reward Rate</h6>
                
                <button className='reward_dtls_btn'>
                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
                        <p className='lock_xdc_value'>&nbsp;0</p>
                        </button>
                    </Col>

                    <Col  xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                    <h6 className='locked_title_align'>Reward Frequency</h6>
                <button className='reward_dtls_btn'>
                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
                        <p className='lock_xdc_value'>&nbsp;0{" hrs"}</p>
                        </button>
                    </Col>
                    </>
              )
           }

                
                    
                </Row>
            </div>
        </Col>
        </Row>
    </Container>
    <Container fluid className='mt-3'>
        {/* <Container className='tab_cntnr_bg'>
            <div className='table_cntr_align'>
            <Table responsive >
                <tr className='stack_tbl_tr'>
                    <td>
                        <div className='tab_ftd_aling'>
                            <img className='tab_td_fimg' src={require('../app/assets/images/doreman.jpg')}/>
                            <div className='tab_ftd_txt_align'>
                                <h6 className='tab_td_title'>xdsea monkey #5</h6>
                                <div className='d-flex'>
                                <h6 className='tab_td_title'>15000</h6>

                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
                                <small className='lock_grey_txt'>(6,375 USD)</small>

                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className='td_earningrate_dtls'>
                            <p className='earningrate_title'>earning rate</p>
                            <div className='earning_value_dtls'>
                            <div className='px-2'>
                                <div className='d-flex justify-content-center'>
                                   
                                <h6 className='tab_td_title'>15000</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC/D</p>
                                </div>
                                <div className='px-2'>

                                <div className='d-flex justify-content-center'>
                                <h6 className='tab_td_title'>50</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC/Mo</p>
                                </div>
                                <div className='px-2'>


                                <div className='d-flex justify-content-center'>
                                <h6 className='tab_td_title'>600</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC/Yr</p>
                                </div>
                            </div>
                        </div>
                    </td>

                    <td>
                        <div className='pending_whole_dtls_align'>
                       
                            <div className='pending_dtls_align'>
                            <p className='earningrate_title'>pending</p>
                            <div className='d-flex justify-content-center'>
                                   
                                <h6 className='tab_td_title'>100</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC</p>


                            </div>

                            <div className='pending_dtls_align'>
                            <p className='earningrate_title'>claimed</p>
                            <div className='d-flex justify-content-center'>
                                   
                                <h6 className='tab_td_title'>300</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC</p>


                            </div>
                            </div>
                        
                    </td>
                    <td>
                        <div className=''></div>
                        <Link to=''>
                    <a data-ignore-split="true" class="Button"  id="" onclick="" tabindex="0" aria-label="">
    Purchase
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
  </a>
  </Link>
                    </td>
                </tr>

                <tr className='stack_tbl_tr'>
                    <td>
                        <div className='tab_ftd_aling'>
                            <img className='tab_td_fimg' src={require('../app/assets/images/doreman.jpg')}/>
                            <div className='tab_ftd_txt_align'>
                                <h6 className='tab_td_title'>xdsea monkey #5</h6>
                                <div className='d-flex'>
                                <h6 className='tab_td_title'>15000</h6>

                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
                                <small className='lock_grey_txt'>(6,375 USD)</small>

                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className='td_earningrate_dtls'>
                            <p className='earningrate_title'>earning rate</p>
                            <div className='earning_value_dtls'>
                            <div className='px-2'>
                                <div className='d-flex justify-content-center'>
                                   
                                <h6 className='tab_td_title'>15000</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC/D</p>
                                </div>
                                <div className='px-2'>

                                <div className='d-flex justify-content-center'>
                                <h6 className='tab_td_title'>50</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC/Mo</p>
                                </div>
                                <div className='px-2'>


                                <div className='d-flex justify-content-center'>
                                <h6 className='tab_td_title'>600</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC/Yr</p>
                                </div>
                            </div>
                        </div>
                    </td>

                    <td>
                        <div className='pending_whole_dtls_align'>
                       
                            <div className='pending_dtls_align'>
                            <p className='earningrate_title'>pending</p>
                            <div className='d-flex justify-content-center'>
                                   
                                <h6 className='tab_td_title'>100</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC</p>


                            </div>

                            <div className='pending_dtls_align'>
                            <p className='earningrate_title'>claimed</p>
                            <div className='d-flex justify-content-center'>
                                   
                                <h6 className='tab_td_title'>300</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC</p>


                            </div>
                            </div>
                        
                    </td>
                    <td>
                        <div className=''></div>
                        <Link to=''>
                    <a data-ignore-split="true" class="Button"  id="" onclick="" tabindex="0" aria-label="">
    Purchase
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
  </a>
  </Link>
                    </td>
                </tr>



                <tr className='stack_tbl_tr'>
                    <td>
                        <div className='tab_ftd_aling'>
                            <img className='tab_td_fimg' src={require('../app/assets/images/doreman.jpg')}/>
                            <div className='tab_ftd_txt_align'>
                                <h6 className='tab_td_title'>xdsea monkey #5</h6>
                                <div className='d-flex'>
                                <h6 className='tab_td_title'>15000</h6>

                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
                                <small className='lock_grey_txt'>(6,375 USD)</small>

                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className='td_earningrate_dtls'>
                            <p className='earningrate_title'>earning rate</p>
                            <div className='earning_value_dtls'>
                            <div className='px-2'>
                                <div className='d-flex justify-content-center'>
                                   
                                <h6 className='tab_td_title'>15000</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC/D</p>
                                </div>
                                <div className='px-2'>

                                <div className='d-flex justify-content-center'>
                                <h6 className='tab_td_title'>50</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC/Mo</p>
                                </div>
                                <div className='px-2'>


                                <div className='d-flex justify-content-center'>
                                <h6 className='tab_td_title'>600</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC/Yr</p>
                                </div>
                            </div>
                        </div>
                    </td>

                    <td>
                        <div className='pending_whole_dtls_align'>
                       
                            <div className='pending_dtls_align'>
                            <p className='earningrate_title'>pending</p>
                            <div className='d-flex justify-content-center'>
                                   
                                <h6 className='tab_td_title'>100</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC</p>


                            </div>

                            <div className='pending_dtls_align'>
                            <p className='earningrate_title'>claimed</p>
                            <div className='d-flex justify-content-center'>
                                   
                                <h6 className='tab_td_title'>300</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC</p>


                            </div>
                            </div>
                        
                    </td>
                    <td>
                        <div className=''></div>
                        <Link to=''>
                    <a data-ignore-split="true" class="Button"  id="" onclick="" tabindex="0" aria-label="">
    Purchase
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
  </a>
  </Link>
                    </td>
                </tr>


                <tr className='stack_tbl_tr'>
                    <td>
                        <div className='tab_ftd_aling'>
                            <img className='tab_td_fimg' src={require('../app/assets/images/doreman.jpg')}/>
                            <div className='tab_ftd_txt_align'>
                                <h6 className='tab_td_title'>xdsea monkey #5</h6>
                                <div className='d-flex'>
                                <h6 className='tab_td_title'>15000</h6>

                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
                                <small className='lock_grey_txt'>(6,375 USD)</small>

                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className='td_earningrate_dtls'>
                            <p className='earningrate_title'>earning rate</p>
                            <div className='earning_value_dtls'>
                            <div className='px-2'>
                                <div className='d-flex justify-content-center'>
                                   
                                <h6 className='tab_td_title'>15000</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC/D</p>
                                </div>
                                <div className='px-2'>

                                <div className='d-flex justify-content-center'>
                                <h6 className='tab_td_title'>50</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC/Mo</p>
                                </div>
                                <div className='px-2'>


                                <div className='d-flex justify-content-center'>
                                <h6 className='tab_td_title'>600</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC/Yr</p>
                                </div>
                            </div>
                        </div>
                    </td>

                    <td>
                        <div className='pending_whole_dtls_align'>
                       
                            <div className='pending_dtls_align'>
                            <p className='earningrate_title'>pending</p>
                            <div className='d-flex justify-content-center'>
                                   
                                <h6 className='tab_td_title'>100</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC</p>


                            </div>

                            <div className='pending_dtls_align'>
                            <p className='earningrate_title'>claimed</p>
                            <div className='d-flex justify-content-center'>
                                   
                                <h6 className='tab_td_title'>300</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC</p>


                            </div>
                            </div>
                        
                    </td>
                    <td>
                        <div className=''></div>
                        <Link to=''>
                    <a data-ignore-split="true" class="Button"  id="" onclick="" tabindex="0" aria-label="">
    Purchase
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
  </a>
  </Link>
                    </td>
                </tr>


                <tr className='stack_tbl_tr'>
                    <td>
                        <div className='tab_ftd_aling'>
                            <img className='tab_td_fimg' src={require('../app/assets/images/doreman.jpg')}/>
                            <div className='tab_ftd_txt_align'>
                                <h6 className='tab_td_title'>xdsea monkey #5</h6>
                                <div className='d-flex'>
                                <h6 className='tab_td_title'>15000</h6>

                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
                                <small className='lock_grey_txt'>(6,375 USD)</small>

                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className='td_earningrate_dtls'>
                            <p className='earningrate_title'>earning rate</p>
                            <div className='earning_value_dtls'>
                            <div className='px-2'>
                                <div className='d-flex justify-content-center'>
                                   
                                <h6 className='tab_td_title'>15000</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC/D</p>
                                </div>
                                <div className='px-2'>

                                <div className='d-flex justify-content-center'>
                                <h6 className='tab_td_title'>50</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC/Mo</p>
                                </div>
                                <div className='px-2'>


                                <div className='d-flex justify-content-center'>
                                <h6 className='tab_td_title'>600</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC/Yr</p>
                                </div>
                            </div>
                        </div>
                    </td>

                    <td>
                        <div className='pending_whole_dtls_align'>
                       
                            <div className='pending_dtls_align'>
                            <p className='earningrate_title'>pending</p>
                            <div className='d-flex justify-content-center'>
                                   
                                <h6 className='tab_td_title'>100</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC</p>


                            </div>

                            <div className='pending_dtls_align'>
                            <p className='earningrate_title'>claimed</p>
                            <div className='d-flex justify-content-center'>
                                   
                                <h6 className='tab_td_title'>300</h6>
                                <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>


                                </div>
                                <p className='tab_td_dark_gray'>XDC</p>


                            </div>
                            </div>
                        
                    </td>
                    <td>
                        <div className=''></div>
                        <Link to=''>
                    <a data-ignore-split="true" class="Button"  id="" onclick="" tabindex="0" aria-label="">
    Purchase
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
    <span class="Button-hover-content" aria-hidden="true">Purchase</span>
  </a>
  </Link>
                    </td>
                </tr>
            </Table>
            </div>

        </Container> */}


        <Container>
            <div className='stck_tbl_dtls_align_bg'>


            {TokenList && TokenList.length>0 && TokenList.map((data)=>{
                return(
                    
                    <div className='stck_tbl_dtls_align'>
                    <div className='tab_ftd_aling'>
                    {data?.fileType.includes("image")?

                                    <img className='tab_td_fimg' src={
                                        (data?.NFTOrginalImage)?
                                        (data?.NFTOrginalImage):
                                        (data?.NFTThumpImage)?
                                        (data?.NFTThumpImage)
                                        :require('../app/assets/images/doreman.jpg')}/>
                                        :
                                        <img className='tab_td_fimg' src={
                                            (data?.NFTThumpImage)?
                                            (data?.NFTThumpImage):require('../app/assets/images/doreman.jpg')}/>}

                                    <div className='tab_ftd_txt_align'>
                                        <h6 className='tab_td_title'>{String(data?.NFTName).length >12?String(data?.NFTName).slice(0,12).concat("..."):data?.NFTName}</h6>
                                        <div className='d-flex'>
                                        <h6 className='tab_td_title'>{data?.NFTPrice? USDVALUE(String(data.NFTPrice)):0}</h6>
                                        {data?.CoinName == config.COIN_NAME ?
                                        <>
                                        <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
                                        {/* <small className='lock_grey_txt'>{data?.NFTPrice * xdcusd} USD</small> */}
                                        {/* <small className='lock_grey_txt'>{USDVALUE(String(data?.NFTPrice))} XDC</small> */}
                                        {/* USDVALUE(String(collectionData?.volume)) */}
                                        </>:
                                        <small className='lock_grey_txt left_xdc_al'>{data?.CoinName}</small>
                                        
                                        }
        
                                        </div>
                                    </div>
                                </div>
        
        
        
        
                                <div className='td_earningrate_dtls'>
                                    <p className='earningrate_title'>earning rate</p>
                                    <div className='earning_value_dtls'>
                                    <div className='px-2'>
                                        <div className='d-flex justify-content-center'>
                                           
                                        <h6 className='tab_td_title'>{Number(((pooldetails?.isBackedValue ? data.backedValue : 1)*24*pooldetails?.rewardRates[0].amount )/ pooldetails?.rewardRates[0].rewardFrecuency).toFixed(2)}</h6>
                                        <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
        
        
                                        </div>
                                        <p className='tab_td_dark_gray'>XDC/D</p>
                                        </div>
                                        <div className='px-2'>
        
                                        <div className='d-flex justify-content-center'>
                                        <h6 className='tab_td_title'>{Number(((pooldetails?.isBackedValue ? data.backedValue : 1)*730*pooldetails?.rewardRates[0].amount )/ pooldetails?.rewardRates[0].rewardFrecuency).toFixed(2)}</h6>
                                        <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
        
        
                                        </div>
                                        <p className='tab_td_dark_gray'>XDC/Mo</p>
                                        </div>
                                        <div className='px-2'>
        
        
                                        <div className='d-flex justify-content-center'>
                                        <h6 className='tab_td_title'>{Number(((pooldetails?.isBackedValue ? data.backedValue : 1)*8760*pooldetails?.rewardRates[0].amount )/ pooldetails?.rewardRates[0].rewardFrecuency).toFixed(2)}</h6>
                                        <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
        
        
                                        </div>
                                        <p className='tab_td_dark_gray'>XDC/Yr</p>
                                        </div>
                                    </div>
                                </div>
        
        
        
                                <div className='pending_whole_dtls_align'>
                               
                               <div className='pending_dtls_align'>
                               <p className='earningrate_title'>pending</p>
                               <div className='d-flex justify-content-center'>
                             
                                   {/* <h6 className='tab_td_title'>{data.amountOfPendingRewards??0}</h6> */}
                                   <h6 className='tab_td_title' >{data?.isStake ? (claimpend?.length>0? 
                                         claimpend.map((item)=>{
                                            if(item?.NFTId == data?.NFTId && item?.NFTOwner == data?.NFTOwner && item?.isStake == data?.isStake){
                                                 return item?.pending ? Number(item?.pending).toFixed(2) :0
                                                                    }}) :0):0}</h6>

                                   <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
        
        
                                   </div>
                                   <p className='tab_td_dark_gray'>XDC</p>
        
        
                               </div>
        
                               <div className='pending_dtls_align'>
                               <p className='earningrate_title'>claimed</p>
                               <div className='d-flex justify-content-center'>
                                   {/* <h6 className='tab_td_title'>{data.amountOfClaimedRewards??0}</h6> */}
                                   <h6 className='tab_td_title' >{data?.isStake ? (claimpend?.length>0? 
                                         claimpend.map((item)=>{
                                            if(item?.NFTId == data?.NFTId && item?.NFTOwner == data?.NFTOwner && item?.isStake == data?.isStake){
                                                 return item?.claimed ? Number(item?.claimed).toFixed(4) : 0
                                                                    }}) :0):0}</h6>
                                   <img className='lock_xdc_img' src={(collectionData?.collectionName == "Sacred Gems")?require('../app/assets/images/gemIcon.png'):require('../app/assets/images/xdcpzy.png')}/>
        
        
                                   </div>
                                   <p className='tab_td_dark_gray'>XDC</p>
        
        
                               </div>
                               </div>
        
        
                               <div className='tbl_prchse_btn'>
                               <Link to={`/info/${data?.CollectionNetwork}/${data?.ContractAddress}/${data?.NFTOwner}/${data?.NFTId}`}>

                            <a data-ignore-split="true" class="Button"  id="" tabindex="0" aria-label="">
           {data?.isStake ? "view":"purchase"}
            <span class="Button-hover-helper"></span>
            <span class="Button-hover-helper"></span>
            <span class="Button-hover-helper"></span>
            <span class="Button-hover-helper"></span>
            <span class="Button-hover-content" aria-hidden="true">           {data?.isStake ? "view":"purchase"}
</span>
            <span class="Button-hover-content" aria-hidden="true">           {data?.isStake ? "view":"purchase"}
</span>
            <span class="Button-hover-content" aria-hidden="true">           {data?.isStake ? "view":"purchase"}
</span>
            <span class="Button-hover-content" aria-hidden="true">           {data?.isStake ? "view":"purchase"}
</span>
          </a>
          </Link>
          </div>
                    </div>

                )
            })}

    
            </div>
            
        </Container>
    </Container>

    <Footer/>
    </>
  )
}

export default StakingDetails