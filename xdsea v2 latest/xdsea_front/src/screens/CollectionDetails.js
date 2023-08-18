
import React, { useEffect, useState, useRef } from "react";
import {
    Link,
    useParams,
    useLocation
} from "react-router-dom";
import { Container, Dropdown, DropdownButton, Modal, Row, Col } from 'react-bootstrap'
import Header from '../app/Header'
import Footer from '../app/Footer'

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { CollectionDetail, ListImportedNfts, ListNFts, createNewCollection, importedCollectionLoadMore } from '../actions/axioss/nft.axios'
import TokenCard from "../Components/tokencard.js"
import LoaderCard from "../Components/loadercard.js"
import Skeleton from '@mui/material/Skeleton';
import { useDispatch, useSelector } from 'react-redux'

import { Token_List_Func, CollectionStatsData, Token_List_Func_collection } from "../actions/axioss/nft.axios.js"
import { USDPRICE } from "../actions/axioss/cms.axios.js"
import { toast } from "react-toastify";
import useContractProviderHook from "../actions/contractProviderHook";
// import InfiniteScroll from "react-infinite-scroller";
import InfiniteScroll from "react-infinite-scroll-component";





function CollectionDetails() {

    const ContractCall = useContractProviderHook();

    const { creator, customurl } = useParams()
    const location = useLocation();

    const { payload } = useSelector((state) => state.LoginReducer.User);

    const [TabName, SetTabName] = useState("All");
    const [loadingtext, setloadingtext] = useState(false);
    const [TabArray, setTabArray] = useState([])
    const [load, setLoad] = useState(true)
    const [TokenList, setTokenList] = useState([])

    const [checkTemp, SetcheckTemp] = useState([])

    const [pagecount, setpagecount] = useState(1)
    const [Tokens, SetTokens] = useState({
        All: { loader: true, page: 1, list: [] },
    });
    const [skip, setskip] = useState(20)
    const [showListPopup, setShowListPopup] = useState(false)
    const [listbtn, setlistbtn] = useState("start")
    const [hasMore, setHasmore] = useState(true)
    const [currentRespCount, setCurrentRespCount] = useState(0)
    const [hasMoreForcol, setHasmoreForCol] = useState(true)
    // TokenList && console.log("TokenList", TokenList);
    // checkTemp && console.log("TokenList check", checkTemp);

    useEffect(() => {
        window.scrollTo(0, 0);
        // TokenList && console.log("TokenList", TokenList);

    }, [])


    const [state, setState] = useState({
        topcollections: ([
            {
                title: "Super Man NFT",
                description: "Collection Creatore Name",
                img: require("../app/assets/images/collection.png")
            },
            {
                title: "Super Man NFT",
                description: "Collection Creatore Name",
                img: require("../app/assets/images/collection.png")
            },
            {
                title: "Super Man NFT",
                description: "Collection Creatore Name",
                img: require("../app/assets/images/collection.png")
            },
            {
                title: "Super Man NFT",
                description: "Collection Creatore Name",
                img: require("../app/assets/images/collection.png")
            },
            {
                title: "Super Man NFT",
                description: "Collection Creatore Name",
                img: require("../app/assets/images/collection.png")
            },

        ])
    })

    const [collectionData, setCollectionData] = useState({})
    const [ownersCount, setOwnersCount] = useState(0)
    const [importnfts, setimportnfts] = useState([])

    const [availablenfts, setavailablenfts] = useState([])
    const [xdcusd, setxdcusd] = useState()
    const [TokCount, setTokCount] = useState(0)




    useEffect(() => {
        getCollectionDetails()
        getxdc_usdvalue()
    }, [])




    const getxdc_usdvalue = async () => {
        let val = await USDPRICE("XDC")

        setxdcusd(val)
    }


    const getCollectionDetails = async () => {

        var findData = {
            Creator: creator,
            customUrl: customurl
        }

        var collData = await CollectionDetail(findData)

        if (collData.status) {
            setCollectionData(collData.data)
            setOwnersCount(collData.ownerscount)
            setimportnfts(collData.data.importednfts)
            setavailablenfts(collData.fullArr)
            setTokCount(collData?.tokCount)

        }

    }

    useEffect(() => {

        getImportedCollectionSupply()
    }, [collectionData])

    const [importCollNftCount, setImportCollNftCount] = useState(0)

    const getImportedCollectionSupply = async () => {

        if (collectionData?.isImported) {
            var supplyresp = await ContractCall.GetSupply(collectionData?.contractAddress)
            if (supplyresp) setImportCollNftCount(supplyresp)

        }
    }

    useEffect(() => {
        if (!location.pathname.includes("importcollection")) {
            setloadingtext(true)

            Explore();
        }
    }, [TabArray, collectionData, location]);


    const Explore = async (data, tab) => {
        if (collectionData?.collectionName) {
            var page = data ? data : pagecount;
            var SendDATA = {
                TabName: TabArray.length > 0 ? TabArray : "All",

                limit: 20,
                skip: Number(TokenList.length) == 0 ? 0 : TokenList.length + 20,
                ProfileUrl: payload?.ProfileUrl ? payload.ProfileUrl : "",
                page: page ?? 1,
                from: "collection",
                Filter: collectionData?.collectionName,
            };
            // console.log("SendDATA",SendDATA);
            var Resp = await Token_List_Func_collection(SendDATA);
            // console.log("response received.......")
            // console.log("RespRespResp",Resp);
            if (Resp?.data) {
                // setloadingtext(false)
                if (Resp?.data?.length == 0) {
                    // console.log("nothin returned...")
                    setCurrentRespCount(0)
                    return setHasmoreForCol(false)
                    // setShowLoadMore(false) 
                }
                setCurrentRespCount(Resp?.data?.length)

                setHasmoreForCol(true)
                setTokenList([...TokenList, ...Resp.data])
                // if (TokenList.length == 0) setTokenList(Resp?.data)
                // else setTokenList([...TokenList, ...Resp.data])

            } else {
                setloadingtext(false)
                setHasmoreForCol(false)
                setCurrentRespCount(0)
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
        }
    };


    const LoadMore = async () => {

        setTimeout(() => {
            setloadingtext(false)
            // console.log("loadminre called......")
            var changepage = pagecount + 1
            setpagecount(changepage)
            Explore(changepage);
        }, 100)



    };


    // tolist all nfts -- adding entry in db

    const ListAllNFts = async () => {
        if (collectionData && collectionData?.Creator != payload?.WalletAddress) {
            return toast.error("only the collection owner can list nfts")
        }
        else {


            var searchData = {
                collectionFilter: {
                    customUrl: customurl,
                    Creator: collectionData?.Creator
                },
                walletAccount: payload?.WalletAddress,
                collectionName: collectionData.collectionName
            }

            var resp = await ListImportedNfts(searchData)

            if (resp.status) return toast.success(resp.msg)
            else toast.error(resp.msg)


        }
    }
    ///  ---> normal gallery nts listing

    const ListAllNft = async () => {

        // if(!accountAddress) return toast.error("connect wallet")

        setlistbtn("process")
        var tokenownermatch = {
            NFTOwner: collectionData.Creator,

            Status: "not-list",
            collectionName: collectionData.collectionName

        }

        var response = await ListNFts(tokenownermatch)
        // console.log("response for listing",response)
        if (response.status) {
            toast.success(response.msg)
            setlistbtn("done")
            setShowListPopup(false)

        }
        else {
            toast.error(response.msg)
            setShowListPopup(false)
        }


    }

    const loadImport = async () => {

        // console.log("hrerhweuirh");
        setLoad(false)
        var params = {
            skip: skip == 20 ? 20 : skip + 10,
            _id: collectionData._id,
            customUrl: customurl
        }
        // console.log("params", params);
        var respData = await importedCollectionLoadMore(params)
        setskip(skip + 10)
        // console.log("respData", respData);
        setLoad(true)
        // console.log("respData importnfts", importnfts);
        if (respData.data.importednfts.length == 0) return setLoad(false), setHasmore(false)
        setimportnfts([...importnfts, ...respData.data.importednfts])
    }

    console.log("collectionData", collectionData);

    const changeFunction = async (e) => {
        const { files, id } = e.target

        const _id = toast.loading(`${id} Uploading`);
        var sendData = {
            [id]: files[0],
            filter: "edit",
            collectionName: collectionData?.collectionName
        }

        var create = await createNewCollection(sendData)
        console.log("create",create);
        if (create.status) {
            //  toast.success(create.msg)

            toast.update(_id, {
                render: `${id} uploading Successfully`,
                type: "success",
                isLoading: false,
                autoClose: 1000,
            });

        } else {

            return toast.update(_id, {
                render: "Try-again",
                type: "error",
                isLoading: false,
                autoClose: 1000,
            });
        }

        window.location.reload()
    }

    return (
        <>
            <Header />
            {/* {console.log("procollection", collectionData?.profileImage?.includes("xdsea.infura-"), (collectionData?.profileImage)?.replace("xdsea.infura-", ""))} */}

            <Container fluid className='banner_img_dtls'>
                <div className='banner_img_full'>
                    <img className="banner_img_full_align" src={collectionData?.BannerImage ?
                        collectionData?.BannerImage
                        : require('../app/assets/images/bannerbig.jpg')} />
                    {(collectionData?.Creator == payload?.WalletAddress) && 
                    // <input type="file" id="profile" onChange={(e) => { changeFunction(e) }} />
                    <button className='banner_edit_btn'><input className='choose_file_input_dtls' type='file' id="banner" name="upload" onChange={(e) => { changeFunction(e) }} /><span><i class="fa-solid fa-pen"/></span> Edit</button>
                    }

                    <div className='creator_dtls'>
                        <div className='creator_img_align' >

                            <img className='creator_img' src={
                                collectionData?.profileImage ?
                                     collectionData?.profileImage

                                    : require('../app/assets/images/collection.png')} />
                            {(collectionData?.Creator == payload?.WalletAddress) && 
                            // <input type="file" id="profile" onChange={(e) => { changeFunction(e) }} />
                            <>
                            <button className='banner_edit_btn collection_details_profileedit'><input className='choose_file_input_dtls' type='file' id="profile" name="upload" onChange={(e) => { changeFunction(e) }}/><span className="spaning_pencil"><i class="fa-solid fa-pen"/></span> <span className="remove_spaning">Edit</span></button>

                            <button className='tabview_pencilbtn'><input className='choose_file_input_dtls' type='file' id="profile" name="upload" onChange={(e) => { changeFunction(e) }}/><span className=""><i class="fa-solid fa-pen"/></span> </button>
                            </>
                            }
                        </div>

                    </div>
                </div>
                <div className="container home_container">
                    <div className='creator_txt_dtls'>
                        <small className='creator_nme_dtlpg'>{collectionData?.collectionName}</small>

                    </div>
                    <div className='nme_and_icn_dtls'>
                        <div className='collection_banner_dtls_txt mbt_20  me-2'>
                            <small className='crtdby_dtl'>by &nbsp;{String(collectionData?.Creator)
                                // .slice(0,6).concat("...")
                            }
                                {/* <span> <i class="fa-solid fa-circle-check tick_icon"></i></span> */}
                            </small>
                            {/* <span className='collection_banner_hint'>{collectionData?.customUrl}</span> */}
                        </div>
                        {/* <div className='collection_banner_dtls_icons'>
                  
                {collectionData?.twitter &&
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
                    </div></a>}
                </div> */}

                        <div className='banner_social_icons_align'>
                            <div className='col_align'>
                                {collectionData?.instagram &&

                                    <a href={collectionData?.instagram} target="_blank">

                                        <i class="fa-brands fa-instagram banner_social_ic_align" /></a>}{ }
                                {collectionData?.facebook &&
                                    <a href={collectionData?.facebook} target="_blank">
                                        <i class="fa-brands fa-facebook-f banner_social_ic_align" /></a>}
                                {collectionData?.twitter &&
                                    <a href={collectionData?.twitter} target="_blank">

                                        <i class="fa-brands fa-twitter banner_social_ic_align" /></a>}
                                {collectionData?.discord &&
                                    <a href={collectionData?.discord} target="_blank">

                                        <i class="fa-brands fa-discord banner_social_ic_align"></i></a>

                                }
                                {/* <div className='p-1 d-flex justify-content-center align-items-center'>
            <img className='youtube_common_align' src={require('../app/assets/images/vaadin_youtube.png')}/>
            </div> */}

                            </div>
                        </div>
                    </div>
                    <div className="full_dscrptn_txt">
                        {(collectionData && collectionData?.Bio) &&
                            <div className='w-100'>

                                <p className="dscriptn_cnt">{collectionData?.Bio}</p>


                            </div>}
                    </div>

                    <div className="cntct_mmbr_scl_dtls">


                        <div className='banner_member_cnt_align'>


                            <div className='col_align_str' >
                                {/* <b className="mmbr_cnt">{ownersCount}</b> */}
                                <b className="mmbr_cnt">{collectionData?.isImported ? (importCollNftCount != 0) ? importCollNftCount : ownersCount : ownersCount}</b>
                                <span className='collection_banner_hint hint_gray'>Owners</span>


                            </div>
                            <div className='col_align_str' >
                                <b className="mmbr_cnt">{collectionData?.isImported ? (importCollNftCount != 0) ? importCollNftCount : importnfts.length : (collectionData?.collectionType == 721 || collectionData?.collectionType == "721") ? TokCount : collectionData?.collectionCount}</b>
                                <span className='collection_banner_hint hint_gray'>NFT's</span>


                            </div>
                            <div className='col_align_str'>
                                <div className='banner_xdcicon_small'>
                                    {/* {/ <img  src={require('../app/assets/images/xdc_icon_small.png')}/> /} */}
                                    {/* <b className="mmbr_cnt">{(Number(collectionData?.floorPrice)/Number(xdcusd)).toFixed(3)} XDC</b> */}
                                    {/* <b className="mmbr_cnt">{Math.floor((Number(collectionData?.floorPrice)/Number(xdcusd))).toLocaleString()} XDC</b> */}
                                    <b className="mmbr_cnt">{Math.floor((Number(collectionData?.floorPrice))).toLocaleString()} XDC</b>

                                </div>
                                <span className='collection_banner_hint hint_gray'>Floor Price</span>

                            </div>
                            <div className='col_align_str' >
                                <div className='banner_xdcicon_small'>
                                    {/* {/ <img  src={require('../app/assets/images/xdc_icon_small.png')}/> /} */}
                                    {/* <b className="mmbr_cnt">{(Number(collectionData?.volume)/Number(xdcusd)).toFixed(3)} XDC</b> */}
                                    {/* <b className="mmbr_cnt">{Math.floor((Number(collectionData?.volume)/Number(xdcusd))).toLocaleString()} XDC</b> */}
                                    <b className="mmbr_cnt">{Math.floor((Number(collectionData?.volume))).toLocaleString()} XDC</b>


                                </div>

                                <span className='collection_banner_hint hint_gray'>Volume Traded</span>

                            </div>

                        </div>

                        <div className="list_stake_btn">
                            {/* --------------changed to make all users list their own imported nfts ------------*/}

                            {/* {(collectionData && collectionData?.Creator == payload?.WalletAddress) && */}
                            {(collectionData && payload?.WalletAddress) &&

                                <>
                                    {(location && location.pathname.includes("importcollection")) ?
                                        <div>
                                            {/* <button onClick={()=>{ListAllNFts()}}>List Nfts</button> */}
                                            <a data-ignore-split="true" class="Button" id="" onClick={() => { ListAllNFts() }} tabindex="0" aria-label="">
                                                List All
                                                <span class="Button-hover-helper"></span>
                                                <span class="Button-hover-helper"></span>
                                                <span class="Button-hover-helper"></span>
                                                <span class="Button-hover-helper"></span>
                                                <span class="Button-hover-content" aria-hidden="true">List All</span>
                                                <span class="Button-hover-content" aria-hidden="true">List All</span>
                                                <span class="Button-hover-content" aria-hidden="true">List All</span>
                                                <span class="Button-hover-content" aria-hidden="true">List All</span>
                                            </a>
                                        </div> :
                                        <div>
                                            {/* <button onClick={()=>{ListAllNFts()}}>List Nfts</button> */}
                                            <a data-ignore-split="true" class="Button" id="" onClick={() => { ListAllNft() }} tabindex="0" aria-label="">
                                                List Nfts
                                                <span class="Button-hover-helper"></span>
                                                <span class="Button-hover-helper"></span>
                                                <span class="Button-hover-helper"></span>
                                                <span class="Button-hover-helper"></span>
                                                <span class="Button-hover-content" aria-hidden="true">List Nfts</span>
                                                <span class="Button-hover-content" aria-hidden="true">List Nfts</span>
                                                <span class="Button-hover-content" aria-hidden="true">List Nfts</span>
                                                <span class="Button-hover-content" aria-hidden="true">List Nfts</span>
                                            </a>
                                        </div>}




                                </>



                            }

                            {
                                collectionData && collectionData.isStakeable && location && !location.pathname.includes("importcollection") &&
                                <Link to={{ pathname: `/stackdetails/${creator}/${customurl}`, state: collectionData }}>
                                    <div className="stake_left_margin">
                                        {/* <button onClick={()=>{ListAllNFts()}}>List Nfts</button> */}
                                        <a data-ignore-split="true" class="Button" tabindex="0" aria-label="">
                                            Stake
                                            <span class="Button-hover-helper"></span>
                                            <span class="Button-hover-helper"></span>
                                            <span class="Button-hover-helper"></span>
                                            <span class="Button-hover-helper"></span>
                                            <span class="Button-hover-content" aria-hidden="true">Stake</span>
                                            <span class="Button-hover-content" aria-hidden="true">Stake</span>
                                            <span class="Button-hover-content" aria-hidden="true">Stake</span>
                                            <span class="Button-hover-content" aria-hidden="true">Stake</span>
                                        </a>
                                    </div>
                                </Link>
                            }
                        </div>
                    </div>





                </div>









                {/* {(location && location.pathname.includes("importcollection")) &&
            <div>
                <button onClick={()=>{ListAllNFts()}}>List Nfts</button>
            </div>} */}




                {/* <div className='banner_social_icons_align'>
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
            <div className='p-1 d-flex justify-content-center align-items-center'>
            <img className='youtube_common_align' src={require('../app/assets/images/vaadin_youtube.png')}/>
            </div>

                    </div>
            </div> */}




            </Container>
            {/* <Container >
    {(collectionData && collectionData?.Bio) &&
        <div className='detailed_text_dtls mt-5 w-100'>
            
            <p>{collectionData?.Bio}</p>
        
        </div>}
    </Container> */}


            <Container className='mt-5'>
                {/* {console.log("test hasMoreForcol",hasMoreForcol)} */}
                {!(location?.pathname.includes("importcollection")) ?

                    <>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className="top-collections-box-banner">
                            {TokenList && TokenList.length > 0 ?
                                (<>
                                    {/* <InfiniteScroll className="w-100"
                                        pageStart={1}
                                        loadMore={LoadMore}
                                        hasMore={hasMoreForcol}
                                        threshold={250}

                                        loader={
                                     
                                              
                                            <>
                                            <div style={{textAlign:"center"}} key={0}>
                                               Loading ...
                                            </div>
                                            </>
                                              
                                             
                                        }
                                    > */}
                                    <InfiniteScroll
                                        dataLength={TokenList.length} //This is important field to render the next data
                                        next={LoadMore}
                                        hasMore={hasMoreForcol}
                                        loader={<p style={{ textAlign: 'center' }}>
                                            <b>Loading...</b>
                                        </p>}
                                    //   endMessage={
                                    //     <p style={{ textAlign: 'center' }}>
                                    //       <b>Yay! You have seen it all</b>
                                    //     </p>
                                    //   }

                                    >
                                        <div className="row">
                                            {
                                                TokenList.map((data, index) => {
                                                    // console.log("data on ,ap", data)
                                                    return (
                                                        <TokenCard
                                                            data={data}
                                                        />

                                                    )

                                                })
                                            }</div>
                                        {/* </InfiniteScroll> */}
                                    </InfiniteScroll>
                                </>)
                                : (
                                    <>{

                                        (hasMoreForcol) ?
                                            <>

                                                <div className="w-100">
                                                    <center>
                                                        Loading ...
                                                    </center>

                                                </div>


                                            </>
                                            :
                                            <>
                                                <div className="w-100">
                                                    <center>
                                                        <h3 className="noitm_fnd_txt">
                                                            No Items Found</h3>
                                                    </center>

                                                </div>
                                            </>

                                    }
                                    </>)


                            }
                        </Grid>
                    </>
                    :

                    <>

                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className="top-collections-box-banner">
                            {importnfts && importnfts.length > 0 ?

                                (<>
                                    {/* <InfiniteScroll className="w-100"
                                        pageStart={1}
                                        loadMore={loadImport}
                                        hasMore={hasMore}
                                        threshold={0}
                                        loader={
                                            <div className="loader" key={0}>
                                                Loading ...
                                            </div>
                                        }
                                    > */}
                                    <InfiniteScroll
                                        dataLength={importnfts.length} //This is important field to render the next data
                                        next={loadImport}
                                        hasMore={hasMore}
                                        loader={
                                            <p style={{ textAlign: 'center' }}>
                                                <b>Loading...</b>
                                            </p>
                                        }
                                    //   endMessage={
                                    //     <p style={{ textAlign: 'center' }}>
                                    //       <b>Yay! You have seen it all</b>
                                    //     </p>
                                    //   }

                                    >
                                        <div className="row">
                                            {importnfts.map((data, index) => {

                                                data.CollectionName = collectionData?.collectionName
                                                data.royalty = collectionData?.royalty
                                                return (
                                                    <Grid item xl={2.4} lg={2.4} md={6} sm={6} xs={12}>
                                                        <Box className="card">
                                                            <img src={data?.NFTImage ? data?.NFTImage : require("../app/assets/images/collection.png")} className="mui-img-fluid" />
                                                            {/* <object data={data?.NFTImage} className="mui-img-fluid"></object> */}
                                                            <Box className="collection-info">
                                                                <p className="collections-title">{data?.NFTName ? data?.NFTName : "xdseanft"}</p>
                                                                <p className="collections-description">{(data?.NFTOwner).slice(0, 8).concat("...")}</p>
                                                            </Box>
                                                        </Box>
                                                        <Box className="collection-button">
                                                            <Link to={`/info/xdc/${data?.contractAddress}/${data?.NFTOwner}/${data?.NFTId}`} state={data}>

                                                                <button className="banner-button">View NFT</button>
                                                            </Link>
                                                        </Box>
                                                    </Grid>
                                                )
                                            })}
                                        </div>
                                    </InfiniteScroll>

                                </>) : <div className="w-100">

                                    <center>
                                        <h3 className="noitm_fnd_txt">
                                            No Items Found</h3>
                                    </center></div>}
                        </Grid>

                    </>

                }




                <div className='load_more_btn_align my-4 '>
                    {/* <button className='banner-button banner_button_align' id="testid" onClick={()=>LoadMore()}><span>Load more</span></button> */}


                    {/* {load ? <a data-ignore-split="true" class="Button" id="" onClick={() => { collectionData.isImported ? loadImport() : LoadMore() }} tabindex="0" aria-label="">
 
                        Load more
                        <span class="Button-hover-helper"></span>
                        <span class="Button-hover-helper"></span>
                        <span class="Button-hover-helper"></span>
                        <span class="Button-hover-helper"></span>
                        <span class="Button-hover-content" aria-hidden="true">Load more</span>
                        <span class="Button-hover-content" aria-hidden="true">Load more</span>
                        <span class="Button-hover-content" aria-hidden="true">Load more</span>
                        <span class="Button-hover-content" aria-hidden="true">Load more</span>
 
                    </a> : <></>} */}


                </div>


            </Container >

            <Footer />
            <Modal
                show={showListPopup}
                // onHide={handleCloseBurnToken}
                backdrop="static"
                keyboard={false}
                centered
                scrollable={false}
                className='whole_modal_text_align'

            >
                <Modal.Header className="modal_theme_align" >
                    <Modal.Title>Burn Token</Modal.Title>
                    {/* <button type="button" class="btn-close" aria-label="Close" onClick={()=>setShowListPopup(false)}></button> */}

                </Modal.Header>
                <Modal.Body
                    className='common_modal_body modal_theme_align'>
                    <p>You are about List Nfts for Sale</p>
                    <div className="d-flex justify-content-between w-50 m-auto">
                        <button type="button" class="btn info_bidnow_btn modal_btn_align mt-2"
                            onClick={() => ListAllNft()}
                            disabled={listbtn == "process" || listbtn == "done"} >
                            {listbtn == "start" && "start"}
                            {listbtn == "process" && "processing"}
                            {listbtn == "done" && "Done"}

                        </button>
                        <button type="button" class="btn info_bidnow_btn  modal_btn_align mt-2"
                            onClick={() => setShowListPopup(false)}
                            disabled={listbtn == "process"} >
                            cancel

                        </button>
                    </div>
                </Modal.Body>

            </Modal>
        </>
    )
}



export default CollectionDetails

