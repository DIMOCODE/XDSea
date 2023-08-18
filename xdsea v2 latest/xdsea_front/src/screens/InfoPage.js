import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react'
import { Link,useLocation } from "react-router-dom";
import Header from '../app/Header'
import Footer from '../app/Footer'

import { Container, Row, Col, Nav, Tab, Table, Dropdown, Modal } from 'react-bootstrap';

import moment from 'moment'
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

import Countdown from "react-countdown";

import config from "../config/config";
import { address_showing, isEmpty } from "../actions/common";
import useContractProviderHook from "../actions/contractProviderHook";
import { Token_Info_Func, GetLikeStatus ,checkIfTokenExists,CreateNFT,addToCart,getpool,stopstake,createstake,withdrawstake,claimreward,getcollection,
        UpdateEligibilty_Db,UpdateWithdrawStatus} from "../actions/axioss/nft.axios";
import { userRegister, Token_MyList_Func } from '../actions/axioss/user.axios'

// Modal Imports

import { PutOnSaleModal } from "../modals/putonsale.js"
import { Cancel } from "../modals/cancelorder"
import { BuyNow } from "../modals/purchasemodal.js"

import { Bid } from "../modals/placeBid.js"
import { CancelBids } from "../modals/cancelBid.js"
import { Accept } from "../modals/AcceptBid.js"
import {Report} from "../modals/report.js"
import {Burn} from "../modals/Burn.js"
import {Share} from "../modals/share.js"
import {Stake} from "../modals/stakemodal.js"
import {EligibilityBacked} from "../modals/eligibilityBackedValue.js"
import {ClaimModal} from "../modals/ClaimModal.js"










function InfoPage() {

  const mintImg = require('../app/assets/images/mintImg.png');
  const listSale = require('../app/assets/images/listedforsale.png');
  const listRemove = require('../app/assets/images/listremoved.png');
  const saleImg = require('../app/assets/images/saleImg.png');
  const bidIMg = require('../app/assets/images/BidImg.png');
  const bidCancel = require('../app/assets/images/bidcancel.png');
  const editImg = require('../app/assets/images/editImg.png');
  

  const location = useLocation()
  const Wallet_Details = useSelector(state => state.wallet_connect_context);
  const { currency } = useSelector(state => state.LoginReducer)

  const ContractCall = useContractProviderHook();
  const [TabName, SetTabName] = useState("All");
 
  const [stakebtncontrol, setstakebtncontrol] = useState(false);

  const [showBids, setShowBids] = useState(false)
  const [eligibilitymodal, seteligibilitymodal] = useState(false)
  const [claimModalState, setClaimModalState] = useState(false)


  
  const [Tokens, SetTokens] = useState({
    All: {
      loader: true,
      page: 1,
      list: [],
      owner: {},
      myBid: {},
      highbid: {},
      myowner: {},
    },
  });
  const [Tokens_Detail, SetTokens_Detail] = useState({});
  const [nftprops, setnftprops] = useState([]);

  const [Tokens_OwnerDetail, SetTokens_OwnerDetail] = useState({});

  const [originalPath, setOriginalPath] = useState("")



  const [Explores, SetExplore] = useState([]);
  const { payload, isAdmin } = useSelector((state) => state.LoginReducer.User);
  const [InfoDetail, SetInfoDetail] = useState({});

  const { network, Contract, Owner, Id } = useParams()
  const [Loader, setLoader] = useState(false);
  const [LoaderTab, setLoaderTab] = useState(false);
  const [OpenPopup, SetOpenPopup] = useState('')
  const [SendDet, SetSendDet] = useState({});
  const [BtnData, SetBtnData] = useState('start')
  const [sendstakedata,setsendstakedata] = useState({})
  const [eligibilitydata,seteligibilitydata] = useState({})
  const [upatepricestate, setupdateprice] = useState(false)

  
  
  const [BidTableArr, setBidTableArr] = useState([])

  const [tempLike, setTempLike] = useState(Tokens_Detail?.likecount)

  const { accountAddress, web3 } = useSelector(state => state.LoginReducer.AccountDetails);
  const navigate = useNavigate();
  var LikeForwardRef = useRef();

  const [LikedTokenList, setLikedTokenList] = useState([]);
  const [heartClass, setHeartClass] = useState(false);


  // Modal Variables Declaration

  // Buy Now Modal

  const [showBuyNow, setShowBuyNow] = useState(false);
  const handleCloseBuyNow = () => setShowBuyNow(false);
  const handleShowBuyNow = () => setShowBuyNow(true);

  const [showPlaceaBid, setShowPlaceaBid] = useState(false);
  const handleClosePlaceaBid = () => setShowPlaceaBid(false);
  const handleShowPlaceaBid = () => setShowPlaceaBid(true);

  const [showBurnToken, setShowBurnToken] = useState(false);
  const handleCloseBurnToken = () => setShowBurnToken(false);
  const handleShowBurnToken = () => setShowBurnToken(true);

  const [showShareModal, setShowShareModal] = useState(false);
  const handleCloseShareModal = () => setShowShareModal(false);
  const handleShowShareModal = () => setShowShareModal(true);

  const [showReport, setShowReport] = useState(false);
  const [pool, setpool] = useState({});
  const [collectiondetail, setcollectiondetail] = useState({});
  const [locktime,setlocktime] = useState("")

  const handleCloseReport = () => setShowReport(false);
  const handleShowReport = () => setShowReport(true);

  const [Mintbtn, SetMintbtn] = useState("start");
  const [show8, setShow8] = useState(false);


  // End of Modal Variables Declaration



  useEffect(() =>{
    window.scrollTo(0,0);
},[])


  useEffect(() => {
 
  //  Explore();
    checkCollectionOrMarketNFt()
  }, []);

  useEffect(() => {
    // if(Tokens_OwnerDetail?.isStakeable){
     getstakingpool()
    // }
    }, [Tokens_OwnerDetail]);

useEffect(()=>{
  if(Tokens_OwnerDetail?.CollectionName)
    getcollectionowner()
},[Tokens_OwnerDetail?.CollectionName])

useEffect(()=>{
   getlocktime()
},[pool])





const getlocktime = async()=>{
  // if(pool?.walletAddress){
  //   var poollockperiod = await ContractCall.getLockPeriod(pool?.walletAddress)
  // }
}

const getcollectionowner = async()=>{
   var coll_owner = await getcollection({collectionName:Tokens_OwnerDetail?.CollectionName})
   setcollectiondetail(coll_owner?.data)
}

    const [lockdiff,setlockdiff] = useState("")

    const getstakingpool = async()=>{
 

      var pool = await getpool({collectionName:Tokens_OwnerDetail?.CollectionName,NFTId:Tokens_OwnerDetail?.NFTId,NFTOwner:Tokens_OwnerDetail?.NFTOwner})
      if(pool?.data){
        setpool(pool?.data)
        var poollockperiod = await ContractCall.getLockPeriod(pool?.data?.walletAddress,Id)
        // console.log("Lock Period",pool?.data?.lockDate,Date.now() > new Date(pool?.data?.lockDate).getTime(),new Date(pool?.data?.lockDate).getTime(),poollockperiod)
        // setlocktime(poollockperiod)
        setlocktime(poollockperiod)

        // const now = moment();
        // const diff = Math.abs(moment(pool.data.createdAt).diff(now, "hours"));
      
        // setlockdiff(diff)
      
      
      }
    }
 

    const checkCollectionOrMarketNFt = async(isExists)=>{
 
      var isExists = await checkIfTokenExists({NFTId:Id,ContractAddress:Contract,NFTOwner:Owner})  // contract address is also a unique field like "collecitonname"
 
      if(isExists.status) Explore();
      else{
      if(location?.state) {
         
         var savedata =  { 
         CollectionNetwork:location?.state.CollectionNetwork,
         CollectionName:location?.state.CollectionName,
         NFTId:location?.state.NFTId,
         NFTName:location?.state.NFTName,
         Category:"",
         NFTDescription:location?.state.NFTDescription?location?.state.NFTDescription:"",
         NFTOrginalImage:location?.state.NFTImage,
         NFTThumpImage:"",
         UnlockContent:"",
         CollectionSymbol:"",
         ContractAddress:location?.state.contractAddress,
         ContractType:location?.state.contractType,
         NFTRoyalty:location?.state.royalty,
         NFTProperties:[],
         CompressedFile:"",
         CompressedThumbFile:"",
         NFTOrginalImageIpfs:"",
         NFTThumpImageIpfs:"",
         MetaData:"",
         MetFile:"",
         NFTCreator:String(location?.state.NFTCreator).toLowerCase(),
         NFTQuantity:location?.state.contractType == 721?1:location?.state.quantity,
         PutOnSale:false,
         PutOnSaleType:"UnlimitedAuction",
         NFTPrice:0,
         CoinName:"",
         ClockTime:null,
         EndClockTime:null,
         HashValue:"",
         NFTOwner:String(location?.state.NFTOwner).toLowerCase(),
        //  activity:"import",
         NFTBalance:location?.state.contractType == 721?1:location?.state.quantity,
        //  fileType:"image"
        fileType:location?.state.fileType,
        frominfo:true
        }

        var resp = await CreateNFT(savedata)
        if(resp.success) Explore()
      }



    }
    }
 




  // useEffect(()=>{
  //   setTempLike(Tokens_Detail?.likecount)
  // },[Tokens_Detail])

  // useEffect(()=>{
  //   GetIsLiked()
  // },[payload,Id])

  // const GetIsLiked = async()=>{
  //     var liked = await GetLikeStatus({Id:Id,WalletAddress:payload?.WalletAddress})
  //     console.log("isliked info page",liked.isLiked)
  //     if((liked?.isLiked) && (liked?.isLiked == false)) setHeartClass(false)
  //     else if((liked?.isLiked) && (liked?.isLiked == true)) setHeartClass(true)


  // }
  const [usdVal,setUsdVal] = useState(0)

  // useEffect(()=>{
  //   if(Tokens_OwnerDetail?.CoinName){
  //   var val = currency?.find(data => data.label == Tokens_OwnerDetail?.CoinName)?.usd
  //   console.log("coin usd val",val)
  //   setUsdVal(val)}
  // },[Tokens_OwnerDetail?.CoinName])


  useEffect(() => {
    if (typeof Tokens[TabName] == 'undefined' && TabName != "All") {
      Tokens[TabName] = { page: 1, list: [], loader: false };
      SetTokens(Tokens);
      Explore(1, TabName);
    } else if(TabName == "All"){
      Tokens[TabName] = { page: 1, list: [], loader: false };
      SetTokens(Tokens);
      Explore(1, TabName);
    }else setLoaderTab(false)
  }, [TabName, Contract, Owner, Id, accountAddress])


  let renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>Auction Completed!</span>;
    } else {
      return (
        <span>
          {" "}
          <span className="hourds">{formatTime(days)} d</span>{" "}
          <span className="semicolan">:</span>{" "}
          <span className="hourds">{formatTime(hours)} h</span>{" "}
          <span className="semicolan">:</span>{" "}
          <span className="hourds">{formatTime(minutes)} m</span>{" "}
          <span className="semicolan">:</span>{" "}
          <span className="hourds">{formatTime(seconds)} s</span>{" "}
        </span>
      );
    }
  };

  let formatTime = (time) => {
    return String(time).padStart(2, "0");
  };



  const tabChange = (newValue) => {
    setLoaderTab(true);
    SetTabName(newValue);
  };

  const Explore = async (data, tab) => {
    // if(accountAddress){
    var page = data ? data : Tokens[TabName]?.page;
    var SendDATA = {
      TabName: tab ? tab : TabName,
      limit: 4,
      Owner: Owner,
      page: page ?? 1,
      from: "info",
      Contract: Contract,
      Id: Id.toString(),
      MyAdd: accountAddress && accountAddress ,
    };
    // if(accountAddress){
    let Resp = await Token_Info_Func(SendDATA);
 
    if (
      Resp?.token?.success == "success" &&
      Resp?.token?.data[0]?.Current_Owner.length > 0
    ) {
      
      if (TabName == "All") {
       
        // setOriginalPath(`${config.IMG_URL}/nft/${Resp?.token?.data[0].NFTCreator}/Original/NFT/${Resp?.token?.data[0].NFTOrginalImage}`)
        setOriginalPath(Resp?.token?.data[0].NFTOrginalImage)

        SetTokens_Detail(Resp?.token?.data[0]);
        setnftprops(Resp?.token?.data[0]?.NFTProperties)
        SetTokens_OwnerDetail(Resp?.token?.data[0]?.Current_Owner[0])

        SetExplore(Resp?.Explore?.data);
      }
      SetTokens({
        ...Tokens,
        ...{
          [TabName]: {
            list: [
              ...Tokens[TabName].list,
              ...(TabName == "owner"
                ? Resp.token.data[0].tokenowners_list
                : TabName == "bid"
                  ? Resp.Bid.data
                  : []),
            ],
            loader:
              Resp.token.Count ==
                Tokens[TabName]?.list?.length + Resp.token.data.length
                ? false
                : true,
            page: Tokens[TabName].page,
            owner:
              TabName == "All"
                ? Resp.token.data[0].Current_Owner.pop()
                : Tokens["All"].owner,
            myowner:
              TabName == "All"
                ? Resp.token.data[0].myowner.pop()
                : Tokens["All"].myowner,
            myBid: Resp?.myBid?.data.pop(),
            highbid: Resp?.highBid?.data[0],
          },
        },
      });
    } else {
      SetTokens({ [TabName]: { loader: true, page: 1, list: [] } });
    }

    setTimeout(() => {
      setLoaderTab(false);
      setLoader(false);
    }, 2000);
  // }
   
  };


 

  const POPUPACTION = useCallback(
    (data, item,updateprice) => {
      // check current nft balance of owner
      // var arr = ["createorder","Buy","Bid","Accept","Burn"]
      var arr = ["createorder","Buy","Accept","Burn"]

      if(data == "Buy" || data =="Accept") {
        item.isStakeable = Tokens_OwnerDetail.isStakeable
        item.backedValue = Tokens_OwnerDetail.backedValue
      }
      // if(arr.includes(data)) {
      //   (async () => { 
     
      //     var Nftbalance = await ContractCall.Current_NFT_Balance({NFTId:Tokens_OwnerDetail.NFTId,NFTOwner:Tokens_OwnerDetail.NFTOwner},Tokens_Detail)
      //     console.log("Nftbalance",Nftbalance)
      //     if(String(Nftbalance) !== String(Tokens_OwnerDetail.NFTBalance)){
      //       toast.warning("You won't buy at this moment please refresh you data");
      //       setTimeout(() => {
      //         navigate("/")
      //     }, 1000);
      //     }
      
      //    })();     
      // }
      if (accountAddress) {
        if (data == "Accept") {
          (async () => {
            let Statu = await ContractCall.GetApproveStatus(
              Tokens_Detail.ContractType == 721 ||
                Tokens_Detail.ContractType == "721"
                ? "Single"
                : "Multiple",
              Tokens_Detail.ContractAddress
            );
            if (Statu == false || Statu == "error") {
              toast.warn("Need To Approve");
              SetBtnData("open");
              SetOpenPopup(data);
            } else {
              SetBtnData("error");
              SetOpenPopup(data);
            }
          })();
        } else SetOpenPopup(data);
        if(updateprice) setupdateprice(true)
        SetSendDet(item);
      } else {
        if (data === "Share") {
          SetOpenPopup(data);
          SetSendDet(item);
        } else
          toast.error(" log in to connect to the wallet ", { autoClose: 1000, closeButton: true, closeOnClick: true });
      }
    },
    [OpenPopup, accountAddress, Tokens_Detail.ContractAddress]
  );
  const closePop = () => {
    SetOpenPopup("");
  };


  //for getting bid table data

  useEffect(() => {
    getBids(1, "bid");

  }, [accountAddress])


  const getBids = async (data, tab) => {
    var page = data ? data : Tokens[TabName]?.page;
    var SendDATA = {
      TabName: tab ? tab : TabName,
      limit: 4,
      Owner: Owner,
      page: page ?? 1,
      from: "info",
      Contract: Contract,
      Id: Id.toString(),
      MyAdd: accountAddress && accountAddress,
      
    };
    let Resp = await Token_Info_Func(SendDATA);
    // console.log("Owners List", Resp.token.data[0].tokenowners_list);
    if (
      Resp?.token?.success == "success" &&
      Resp?.token?.data[0]?.Current_Owner.length > 0
    ) {

      if ((Resp?.Bid?.data).length > 0) {
        setBidTableArr(Resp?.Bid?.data)
        // SetTokens({
        //   ...Tokens,
        //   ...{
        //     ["bid"]: {
        //       list: [
        //         ...Tokens["bid"].list,
        //         ...(TabName == "owner"
        //           ? Resp.token.data[0].tokenowners_list
        //           : TabName == "bid"
        //             ? Resp?.Bid.data
        //             : []),
        //       ],
        //       loader:
        //         Resp.token.Count ==
        //           Tokens["bid"]?.list?.length + Resp.token.data.length
        //           ? false
        //           : true,
        //       page: Tokens["bid"].page,
        //       owner:
        //         TabName == "All"
        //           ? Resp.token.data[0].Current_Owner.pop()
        //           : Tokens["All"].owner,
        //       myowner:
        //         TabName == "All"
        //           ? Resp.token.data[0].myowner.pop()
        //           : Tokens["All"].myowner,
        //       myBid: Resp?.myBid?.data.pop(),
        //       highbid: Resp?.highBid?.data[0],
        //     },
        //   },
        // });
      
      }
    } else {
      setBidTableArr([]);

    }


  };

  // for activity

  useEffect(() => {
    getActivityList()
  }, [Tokens_Detail])

  const [ActivityList, setActivityList] = useState([])

  const getActivityList = async () => {

    var SendDATA = {
      TabName: "activity",
      limit: 12,
      // CustomUrl: customurl,
      NFTId: Tokens_Detail?.NFTId,
      page: 1,
      from: 'myItem',
      cursor: "",
      filter: 'All',
      ContractAddress:Contract
    }
    let Resp = await Token_MyList_Func(SendDATA)
    if (Resp?.success == 'success' && Resp.data.length > 0) {
      setActivityList(Resp.data)
    } else {
      setActivityList([])
    }

  }

  ///// --- > Push To cart

  const PushToCart = async()=>{
    let data = {
      NFTId:Tokens_Detail?.NFTId,
      NFTOwner:Tokens[TabName]?.owner?.WalletAddress,
      ContractType:Tokens_Detail?.ContractType,
      ContractAddress: Tokens_Detail.ContractAddress,
      CollectionNetwork: Tokens_Detail.CollectionNetwork,
      buyerAddress:accountAddress,
      fileType:Tokens_Detail?.fileType,
      CollectionName:Tokens_Detail?.CollectionName
   
    }
 
    var resp = await addToCart(data) 
    if(resp.status){
       toast.success(resp.msg)
       setTimeout(() => {
         window.location.reload()
       }, 300);
    }
    else toast.error(resp.msg)
  }


  const stopstakecall = async()=>{
  
    if(String(Tokens_OwnerDetail?.NFTOwner) != String(accountAddress)) return toast.error("not owner")
    let obj = {
      NFTId:Tokens_OwnerDetail?.NFTId,
      NFTOwner:Tokens_OwnerDetail?.NFTOwner
    }

    var resp = await stopstake(obj)
    if(resp?.status) return toast.success("stake stopped")
    else return toast.error("failed")
  }





  const createstakecall = async()=>{
    if(String(Tokens_OwnerDetail?.NFTOwner) != String(accountAddress)) return toast.error("not owner")

     if(!Tokens_OwnerDetail?.isStakeable ) return toast.error("NFT unstakebale")
      let data =  { stakingContract:pool?.walletAddress ?? "",
      tokenId:Tokens_OwnerDetail?.NFTId ?? "",
      wallet:accountAddress?? "",
      type:Tokens_Detail?.ContractType ?? "",
      contract_address:Tokens_Detail?.ContractAddress ?? "",
      NFTOwner:Tokens_OwnerDetail.NFTOwner,
      NFTId:Tokens_OwnerDetail.NFTId,
      CollectionName: Tokens_OwnerDetail.CollectionName
     }
     setsendstakedata(data)
     SetOpenPopup("Stake")

  //    var stakenftincontract = await ContractCall.StakeNftInContract(pool.walletAddress,Tokens_OwnerDetail.NFTId,accountAddress,Tokens_Detail.ContractType,Tokens_Detail.ContractAddress)

  
  }

  const withdrawcall = async()=>{
    const id = toast.loading("Listing Processing");
    SetMintbtn("process");

    if(String(Tokens_OwnerDetail?.NFTOwner) != String(accountAddress)) return toast.error("not owner")
    setstakebtncontrol(true)

    // var stakenftincontract = await ContractCall.withdraw(pool.walletAddress,Tokens_OwnerDetail.NFTId,accountAddress,Tokens_Detail.ContractType,Tokens_Detail.ContractAddress)
 
    if(pool.walletAddress == config.RETROSTAKE_ADDRESS)
      var stakenftincontract = await ContractCall.withdraw_retro(pool.walletAddress,accountAddress,Tokens_Detail.ContractType,Tokens_Detail.ContractAddress,Tokens_OwnerDetail.NFTId)
    else if(pool.walletAddress != config.RETROSTAKE_ADDRESS)
      var stakenftincontract = await ContractCall.withdraw(pool.walletAddress,accountAddress,Tokens_Detail.ContractType,Tokens_Detail.ContractAddress,Tokens_OwnerDetail.NFTId)
 

    if(stakenftincontract){
    let obj = {
      NFTOwner:Tokens_OwnerDetail.NFTOwner,
      NFTId:Tokens_OwnerDetail.NFTId,
      CollectionName:Tokens_OwnerDetail.CollectionName
    }
     var resp = await withdrawstake(obj)
     if(resp?.status){
      SetMintbtn("done");
      toast.success("successfully withdrawn")
      
      setTimeout(() => {
        window.location.reload()
      }, 200);
     } else toast.error("failed to stake")
    }
  }
  


  const claimrewardcall = async()=>{
    if(String(Tokens_OwnerDetail?.NFTOwner) != String(accountAddress)) return toast.error("not owner")
 
    setstakebtncontrol(true)

    var stakenftincontract = await ContractCall.claimedRewards(

      pool.walletAddress,
      Tokens_OwnerDetail.NFTId,
      pool.rewardContractAddress,
      accountAddress)

  if(stakenftincontract){
    
    let obj = {
      NFTOwner:Tokens_OwnerDetail.NFTOwner,
      NFTId:Tokens_OwnerDetail.NFTId   
    }
     var resp = await claimreward(obj)
     if(resp?.status){
      toast.success("successfully claimed")
      setTimeout(() => {
        window.location.reload()
      }, 300);
     } else toast.error(resp?.msg)
    }
  }

  const updateEligibility = async()=>{

    if(String(Tokens_OwnerDetail?.NFTOwner) != String(accountAddress) 
      || Tokens_OwnerDetail?.NFTOwner != collectiondetail.Creator) return toast.error("not owner")

    //  if(!Tokens_OwnerDetail?.isStakeable ) return toast.error("NFT unstakebale")
     
      let data =  { stakingContract:pool?.walletAddress ?? "",
      tokenId:Tokens_OwnerDetail?.NFTId ?? "",
      wallet:accountAddress?? "",
      type:Tokens_Detail?.ContractType ?? "",
      contract_address:Tokens_Detail?.ContractAddress ?? "",
      NFTOwner:Tokens_OwnerDetail.NFTOwner,
      poolid:pool.poolid,
      CollectionName: Tokens_OwnerDetail.CollectionName
     }
     seteligibilitydata(data)
     seteligibilitymodal(true)




  
  }
  const withdrawNftFunc = async()=>{
    const id = toast.loading("Withdraw Processing");
    SetMintbtn("process");
    var data = await ContractCall.WithdrawListing(
      Tokens_Detail?.marketAddress,
      Tokens_Detail?.ContractAddress,
      Tokens_Detail.NFTId)

    if(data){
      var updateWithdrawStatus = await UpdateWithdrawStatus({NFTId:Tokens_Detail.NFTId,isWithdrawn:true,CollectionName:Tokens_OwnerDetail.CollectionName})
      if(updateWithdrawStatus.status){
        setShow8(false)
        toast.success("successfully withdrawn")
        setTimeout(() => {
          window.location.reload()
        }, 300);
      } 
      else{
      }     

    }
  
  }

  const CancelMarketBid = async()=>{

    var data = await ContractCall.CancelMarketBidCall(
      Tokens_Detail?.marketAddress,
      Tokens_Detail?.ContractAddress,
      Tokens_Detail.NFTId,
      "0x0000000000000000000000000000000000000000",)

    if(data){
      var updateWithdrawStatus = await UpdateWithdrawStatus({NFTId:Tokens_Detail.NFTId,isWithdrawn:true})
      if(updateWithdrawStatus.status){
        toast.error("successfully withdrawn")
        setTimeout(() => {
          window.location.reload()
        }, 300);
      } 
      else{
      }     

    }
  
  }

  

  return (
    <>
      <Header />
      <Container className="info mt-4 home_container">

        {OpenPopup == "createorder" && (
          < PutOnSaleModal
            owner={SendDet}
            OpenPopup={OpenPopup}
            closePop={closePop}
            file={`${config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Compressed/NFT/${Tokens_Detail.CompressedFile}`}
            type={
              Tokens_Detail.CompressedFile
                ? Tokens_Detail.CompressedFile?.includes(".webp")
                  ? "image"
                  : Tokens_Detail.CompressedFile.includes(".webm")
                    ? "video"
                    : "audio"
                : Tokens_Detail.CompressedFile
            }
            thumb={Tokens_Detail.CompressedThumbFile}
            item={{
              NFTName: Tokens_Detail.NFTName,
              ContractAddress: Tokens_Detail.ContractAddress,
              ContractType: Tokens_Detail.ContractType,
              CollectionNetwork: Tokens_Detail.CollectionNetwork,

              CompressedFile: Tokens_Detail.CompressedFile,
              CompressedThumbFile: Tokens_Detail.CompressedThumbFile,
              OriginalFile: Tokens_Detail.OriginalFile,
              NFTCreator: Tokens_Detail.NFTCreator,
              NFTRoyalty: Tokens_Detail.RoNFTRoyaltyyalty,

              Category: Tokens_Detail.Category,
              NFTPrice: Tokens[TabName]?.myowner?.NFTPrice,
              CoinName: Tokens[TabName]?.myowner?.CoinName,
              PutOnSaleType: "FixedPrice",
              PutOnSale: true,
              ClockTime: null,
            }}
            placeoredit={upatepricestate}            
          />
        )}

        {OpenPopup === "Buy" && (
          <BuyNow
            owner={SendDet}
            OpenPopup={OpenPopup}
            closePop={closePop}
            item={{
              NFTId: Tokens_Detail.NFTId,
              NFTName: Tokens_Detail.NFTName,
              ContractAddress: Tokens_Detail.ContractAddress,
              ContractType: Tokens_Detail.ContractType,
              NFTRoyalty: Tokens_Detail.NFTRoyalty,
              NFTCreator: Tokens_Detail.NFTCreator,
              CollectionNetwork: Tokens_Detail.CollectionNetwork,
              Category: Tokens_Detail.Category,
              CollectionName: Tokens_Detail.CollectionName
            }}
          />
        )}

        {OpenPopup == "Cancel" && (

          <Cancel
            owner={SendDet}
            types="Cancel"
            OpenPopup={OpenPopup}
            closePop={closePop}
            file={`${config.IMG_URL}/nft/${Tokens_Detail.NFTCreator}/Compressed/NFT/${Tokens_Detail.CompressedFile}`}
            type={
              Tokens_Detail.CompressedFile
                ? Tokens_Detail.CompressedFile?.includes(".webp")
                  ? "image"
                  : Tokens_Detail.CompressedFile.includes(".webm")
                    ? "video"
                    : "audio"
                : Tokens_Detail.CompressedFile
            }
            thumb={Tokens_Detail.CompressedThumbFile}
            // noimg={require("../assets/images/No_image.jpg")}
            item={{
              TokenName: Tokens_Detail.NFTName,
              ContractAddress: Tokens_Detail.ContractAddress,
              ContractType: Tokens_Detail.ContractType,
              CollectionNetwork: Tokens_Detail.CollectionNetwork,
              Category: Tokens_Detail.Category,
              NFTPrice: Tokens[TabName]?.myowner?.NFTPrice,
              CoinName: Tokens[TabName]?.myowner?.CoinName,
            }}
          />
        )}


        {OpenPopup === "Bid" && (
          <Bid
            owner={Tokens[TabName]?.owner}
            bidder={!isEmpty(SendDet) ? SendDet : Tokens[TabName]?.myBid}
            OpenPopup={OpenPopup}
            bid={Tokens[TabName]?.highbid}
            closePop={closePop}
            item={{
              NFTId: Tokens_Detail.NFTId,
              NFTName: Tokens_Detail.NFTName,
              ContractAddress: Tokens_Detail.ContractAddress,
              ContractType: Tokens_Detail.ContractType,
              NFTRoyalty: Tokens_Detail.NFTRoyalty,
              NFTCreator: Tokens_Detail.NFTCreator,
              CollectionNetwork: Tokens_Detail.CollectionNetwork,
              Category: Tokens_Detail.Category,
              CollectionName: Tokens_Detail.CollectionName,

            }}
          />
        )}


        {OpenPopup == "CancelBid" && (
          <CancelBids
            bidder={SendDet}
            OpenPopup={OpenPopup}
            owner={Tokens[TabName]?.owner}
            closePop={closePop}
            item={{
              NFTId: Tokens_Detail.NFTId,
              NFTName: Tokens_Detail.NFTName,
              ContractAddress: Tokens_Detail.ContractAddress,
              ContractType: Tokens_Detail.ContractType,
              NFTRoyalty: Tokens_Detail.NFTRoyalty,
              NFTCreator: Tokens_Detail.NFTCreator,
              CollectionNetwork: Tokens_Detail.CollectionNetwork,
              CollectionName: Tokens_Detail.CollectionName,
              Category: Tokens_Detail.Category,
            }}
          />
        )}

        {OpenPopup === "Accept" && (
          <Accept
            owner={Tokens[TabName]?.myowner}
            bidder={SendDet}
            OpenPopup={OpenPopup}
            bid={SendDet}
            closePop={closePop}
            approvestatus={BtnData}
            item={{
              NFTId: Tokens_Detail.NFTId,
              NFTName: Tokens_Detail.NFTName,
              ContractAddress: Tokens_Detail.ContractAddress,
              ContractType: Tokens_Detail.ContractType,
              NFTRoyalty: Tokens_Detail.NFTRoyalty,
              NFTCreator: Tokens_Detail.NFTCreator,
              CollectionNetwork: Tokens_Detail.CollectionNetwork,
              Category: Tokens_Detail.Category,
              CollectionName: Tokens_Detail.CollectionName,

              // CompressedFile:Tokens_Detail.CompressedFile,
              // OriginalFile:Tokens_Detail.OriginalFile,
              // CompressedThumbFile:Tokens_Detail.CompressedThumbFile,
              // OriginalThumbFile:Tokens_Detail.OriginalThumbFile,
            }}
          // file={`${config.IMG_URL}/token/${Tokens_Detail.Creator}/Compressed/NFT/${Tokens_Detail.CompressedFile}`}
          // type={Tokens_Detail.CompressedFile ? (Tokens_Detail.CompressedFile?.includes('.webp') ? 'image' : Tokens_Detail.CompressedFile.includes('.webm') ? 'video' : 'audio') : Tokens_Detail.CompressedFile}
          // thumb={Tokens_Detail.CompressedThumbFile}
          // noimg={require("../assets/images/No_image.jpg")}
          />
        )}


{
          OpenPopup === "Report" &&
          <Report
            OpenPopup={OpenPopup}
            closePop={closePop}
            item={{
              NFTId: Tokens_Detail.NFTId,
              NFTName: Tokens_Detail.NFTName,
              ContractAddress: Tokens_Detail.ContractAddress,
              ContractType: Tokens_Detail.ContractType,
              NFTRoyalty: Tokens_Detail.NFTRoyalty,
              NFTCreator: Tokens_Detail.NFTCreator,
              CollectionNetwork: Tokens_Detail.CollectionNetwork,
              Category: Tokens_Detail.Category
            }}
          />
        }

{
          OpenPopup === "Burn" &&
          <Burn
            OpenPopup={OpenPopup}
            closePop={closePop}
            item={{
              NFTId: Tokens_Detail.NFTId,
              NFTName: Tokens_Detail.NFTName,
              ContractAddress: Tokens_Detail.ContractAddress,
              ContractType: Tokens_Detail.ContractType,
              NFTRoyalty: Tokens_Detail.NFTRoyalty,
              NFTCreator: Tokens_Detail.NFTCreator,
              CollectionNetwork: Tokens_Detail.CollectionNetwork,
              Category: Tokens_Detail.Category,

            }}
            owner={Tokens[TabName]?.myowner}
          />
        }

{OpenPopup === "Share" && (
          <Share
            closePop={closePop}
            title={`${Tokens_Detail.NFTName}  NFT`}
            url={`${config.FRONT_URL}/info/${Tokens_Detail.CollectionNetwork}/${Tokens_Detail.ContractAddress}/${SendDet.NFTOwner}/${Tokens_Detail.NFTId}`}
            quote={`${Tokens_Detail.NFTName} NFT`}
          />
        )}

{OpenPopup === "Stake" && (
          <Stake
             data = { sendstakedata}
          />
        )} 

{/* update elgibility and backed values modal\ */}


{
         eligibilitymodal &&
          <EligibilityBacked
          data = { eligibilitydata}
            
          />
        }
{ claimModalState&&
  <ClaimModal
  Tokens_Detail={Tokens_Detail}
  Tokens_OwnerDetail={Tokens_OwnerDetail}
  pooldetails={pool}
  />
  }








        <Row>
          <Col className='mb-3' xxl={5} xl={5} lg={5} md={5} sm={12} xs={12}>
            
            {(Tokens_Detail &&  Tokens_Detail?.fileType && Tokens_Detail?.fileType.includes("image")) ?

              <img className='img-fluid info_banner_img' src={
                (Tokens_Detail?.NFTOrginalImage)
              } />
              :
            
            (Tokens_Detail &&  Tokens_Detail?.fileType && Tokens_Detail?.fileType.includes("audio")) ?
<>
<img className='img-fluid info_banner_img' src={
  
                (Tokens_Detail?.NFTThumpImage)
  } />

                <audio src={
                 
                  (Tokens_Detail?.NFTOrginalImage)
                  }  controls controlsList="nodownload"></audio>
                </> :
 <>{Tokens_Detail?.NFTOrginalImage &&
  <video className='info_page_video_align'  src={
    (Tokens_Detail?.NFTOrginalImage)
  }
  loop={true}
  muted
  controlsList="nodownload"

  autoPlay={true}
  controls
  // poster={thumb}
  onContextMenu="return false;"
  type="video/*"></video>
 }</>
             
            }
 
          </Col>
          <Col xxl={6} xl={6} lg={6} md={7} sm={12} xs={12}>
            <div className='info_title_align'>
              <h3 className='info_title_nme'>{Tokens_Detail?.NFTName}</h3>
 
              {/* <div className='info_cart_dot_dtls'>
              <i class="fa fa-shopping-cart" aria-hidden="true"></i>
 </div> */}

              <div className='d-flex justify-content-between align-items-center'>
{/* {(Tokens_OwnerDetail?.NFTOwner != accountAddress)&&()} */}
{/* {(Tokens[TabName]?.owner &&
                Tokens[TabName]?.owner?.WalletAddress !=
                accountAddress &&
                (Tokens[TabName]?.owner?.PutOnSaleType ==
                  "FixedPrice")&&
                  Tokens_OwnerDetail?.CoinName == config.COIN_NAME) &&
              <i class="fa-solid fa-cart-shopping cart_vandi" onClick={()=>{
                PushToCart()
              }}></i>} */}
                
              <Dropdown className='three_dots_dropdown'>
           
                <Dropdown.Toggle id="dropdown-basic">
                  <i class="fa-solid fa-ellipsis ellipsis_vertical" />
                </Dropdown.Toggle>

                <Dropdown.Menu>

                  {(Tokens_OwnerDetail?.NFTOwner  == accountAddress ) ?
                  <>
                  {(Tokens_Detail.ContractAddress == config.ERC721 || Tokens_Detail.ContractAddress == config.ERC1155 )&&
                  <Dropdown.Item className='three_dots_dropdown_optn'  onClick={() => POPUPACTION('Burn', Tokens[TabName]?.myowner)}>Burn Token</Dropdown.Item>}
                  </>:
                  <>
                  {/* <Dropdown.Item className='three_dots_dropdown_optn' onClick={()=>POPUPACTION('Report', Tokens[TabName]?.owner)}>Report</Dropdown.Item> */}
                  </>}
                  <Dropdown.Item className='three_dots_dropdown_optn' onClick={()=>POPUPACTION('Share', Tokens[TabName]?.owner)}>Share</Dropdown.Item>

                </Dropdown.Menu>
              </Dropdown>
              </div>

            </div>
 
            
            <p className='info_clctn_nme' onClick={()=>{
  
            navigate(!collectiondetail?.isImported?
              `/collection/${collectiondetail.Creator}/${collectiondetail.customUrl}`:
              `/importcollection/${collectiondetail.Creator}/${collectiondetail.customUrl}`)
  
            }} >{Tokens_Detail?.CollectionName}</p>
           
 
            {/* {console.log("Tokens_Detail",Tokens_Detail)} */}
            {/* <p className='info_clctn_nme'>{Tokens_Detail?.CollectionName}</p> */}
            {/* <Link to={`/collection/${Tokens_Detail?.Creator_WalletAddress}/${Tokens_Detail?.collectionCustomUrl}`}> */}

 
            <p className='info_owner_nme'>Owned by: {Tokens_OwnerDetail?.NFTOwner}</p>
            {/* {!Tokens_OwnerDetail?.isStake &&
 <>
            {/* <h3 >
              {(Tokens_OwnerDetail && Tokens_OwnerDetail?.PutOnSaleType == "UnlimitedAuction") ?
                <span >
                  Open For Bid
                </span> :
                (Tokens_OwnerDetail && Tokens_OwnerDetail?.PutOnSaleType == "TimedAuction") ?
                  <span  >
                    <Countdown
                      date={new Date(Tokens_OwnerDetail?.EndClockTime)}
                      autoStart={true}
                      onStart={() => new Date(Tokens_OwnerDetail?.ClockTime)}
                      
                      renderer={renderer}
                    >
                    </Countdown>
                  </span> :
                  <span  >Open For
                    price : {Tokens_OwnerDetail?.NFTPrice} {Tokens_OwnerDetail?.CoinName}
                  </span>
                
              }
                <span  >
                  {"   "} {Tokens_OwnerDetail?.NFTBalance} / {Tokens_OwnerDetail?.NFTQuantity} {" "} Available 
                  </span>

 
            </h3>
            </>} */}

{!Tokens_OwnerDetail?.isStake && (Tokens_Detail.ContractType == 1155 || Tokens_Detail.ContractType == "1155") &&
 
<>
<h3>
<span  >
               {Tokens_OwnerDetail?.NFTBalance} / {Tokens_OwnerDetail?.NFTQuantity} {" "} Available 
                  </span></h3>
</> }
 

            <Tab.Container id="left-tabs-example" className='all_tabs_align ' defaultActiveKey="first">
              <Row className='mt-2'>
                <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Nav variant="pills" className="flex-row">
                    <Nav.Item className='myitems_tab_navitems'>
                      <Nav.Link className='myitems_tab_navlinks' eventKey="first">Details</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className='myitems_tab_navitems' onClick={() => tabChange("owner")}>
                      <Nav.Link className='myitems_tab_navlinks' eventKey="second">Owner</Nav.Link>
                    </Nav.Item>
         
                            {!Tokens_OwnerDetail?.isStake &&
                            Tokens_OwnerDetail?.PutOnSaleType ==
                            "TimedAuction" &&
                            new Date(
                              Tokens_OwnerDetail?.EndClockTime
                            ).getTime() > Date.now() &&
                            <Nav.Item className='info_timer_after'>
                                 <Countdown className='time_teme_text'
                                 date={new Date(Tokens_OwnerDetail?.EndClockTime)}
                                 autoStart={true}
                                 onStart={() => new Date(Tokens_OwnerDetail?.ClockTime)}
                                 
                                 renderer={renderer}
                               >
                               </Countdown>
                               </Nav.Item>
}
                    

                  </Nav>
                </Col>

<Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
{(Tokens_OwnerDetail && Tokens_OwnerDetail?.PutOnSaleType == "FixedPrice" && !Tokens_OwnerDetail?.isStake) &&
                      <div className='current_price'>
                        <p className='current_price_value'>Current Price: {((Tokens_OwnerDetail?.NFTPrice)).toLocaleString()} {" "}{Tokens_OwnerDetail?.CoinName}</p>
                      </div>}
</Col>

               









{/* <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
  <div className='infopage_btn_after_align'>

  <button className='info_bidnow_btn info_page_btn'>Remove Listing</button>
  <button className='info_bidnow_btn info_page_btn'>List NFT for sale</button>
  <button className='info_bidnow_btn info_page_btn'>List NFT for sale</button>

  </div>
</Col> */}




{accountAddress ?
          <>
{/* {!Tokens_OwnerDetail?.isStakeable && */}

<Col className='mt-4' xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>

{/* {(Tokens_Detail?.hasOpenOffer && !Tokens_Detail?.isWithdrawn && Tokens_Detail?.marketAddress)?
 && Tokens_OwnerDetail?.NFTOwner == accountAddress)?
<div className='infopage_btn_after_align'>
<button className='info_bidnow_btn info_page_btn'  onClick={()=>{
  CancelMarketBid()
}}>Cancel Auction</button>
</div>: */}

<>
{(Tokens_Detail?.previouslyListed && !Tokens_Detail?.isWithdrawn && Tokens_Detail?.marketAddress
    && Tokens_OwnerDetail?.NFTOwner == accountAddress)?

<div className='infopage_btn_after_align'>
<button className='info_bidnow_btn info_page_btn' onClick={()=>{
 setShow8(true)
}}>Withdraw NFT</button>
</div>

:
<>
<div className='infopage_btn_after_align'>
                <>
{!Tokens_OwnerDetail?.isStake &&


          
                <>
               
                    
                  {
                    (Tokens_Detail?.ContractType?.toString() ===
                      "721" ? (
                      Tokens[TabName]?.myowner?.WalletAddress ==
                        accountAddress ? (
                        Tokens[TabName]?.myowner?.PutOnSaleType ==
                          "FixedPrice" ? (
                     
 
  <button className='info_bidnow_btn info_page_btn' onClick={() =>
    POPUPACTION(
      "Cancel",
      Tokens[TabName]?.myowner
    )
  }>Remove Listing</button>

                        ) : 
                        Tokens[TabName]?.myowner?.PutOnSaleType ==
                          "NotForSale" ||
                          Tokens[TabName]?.myowner?.PutOnSaleType ==
                          "UnlimitedAuction" ||
                          (Tokens[TabName]?.myowner?.PutOnSaleType ==
                            "TimedAuction" &&
                            new Date(
                              Tokens[TabName]?.myowner.EndClockTime
                            ).getTime() < Date.now()) ? (
                     
  <button className='info_bidnow_btn info_page_btn' onClick={() =>{
                          
 
                          POPUPACTION(
                            "createorder",
                            Tokens[TabName]?.myowner
                          )
                        }
                        }>List NFT for sale</button>

      
                          
                        ) : (
                          Tokens[TabName]?.myowner?.PutOnSaleType ==
                          "TimedAuction" &&
                          new Date(
                            Tokens[TabName]?.myowner?.EndClockTime
                          ).getTime() > Date.now() && (
<>
                            <h6 className='actions_live'>
                              Auction is Live Now
                            </h6>
                                 {/* <Countdown className='time_teme_text'
                                 date={new Date(Tokens_OwnerDetail?.EndClockTime)}
                                 autoStart={true}
                                 onStart={() => new Date(Tokens_OwnerDetail?.ClockTime)}
                                 
                                 renderer={renderer}
                               >
                               </Countdown> */}
                               </>

                          )
                        )
                      ) : (
                        Tokens[TabName]?.owner &&
                        Tokens[TabName]?.owner?.WalletAddress !=
                        accountAddress &&
                        (Tokens[TabName]?.owner?.PutOnSaleType ==
                          "FixedPrice" ? (
                    
                  
                          <button className='info_bidnow_btn info_page_btn' onClick={() =>
                          POPUPACTION("Buy", Tokens[TabName]?.owner)
                        }>Buy Now</button>
                       
                        ) : (
                          Tokens[TabName]?.myBid?.WalletAddress ==
                          accountAddress && (
                     

                         
                          <button className='info_bidnow_btn info_page_btn' onClick={() =>
                                    POPUPACTION("CancelBid", {})
                                  }>Cancel Offer</button>

                                 
                          )
                        ))
                      )
                    ) : Tokens[TabName]?.myowner?.WalletAddress ==
                      Tokens[TabName]?.owner?.WalletAddress ? (
                      <>
                        {Tokens[TabName]?.myowner?.PutOnSaleType ==
                          "FixedPrice" && (
                         

                         
                                                <button className='info_bidnow_btn info_page_btn'  onClick={() =>
                                                POPUPACTION(
                                                  "Cancel",
                                                  Tokens[TabName]?.myowner
                                                )
                                              }>Remove Listing</button>
                                               
                          )}
                        {Tokens[TabName]?.myBid?.WalletAddress ==
                          accountAddress ? (
                     

              
                      <button className='info_bidnow_btn info_page_btn' onClick={() =>
                                          POPUPACTION("Bid", Tokens[TabName]?.myBid)
                                        } >Edit Offer</button>
                    
                        ) : (
                          Tokens[TabName]?.myowner?.WalletAddress !=
                          Tokens[TabName]?.owner?.WalletAddress && (
                       

      
          <button className='info_bidnow_btn info_page_btn' onClick={() => POPUPACTION("Bid", {})}>Bid Now</button>
      
                          )
                        )}
                      </>
                    ) : Tokens[TabName]?.owner?.PutOnSaleType ===
                      "FixedPrice" ? (
                 

               
                                          <button className='info_bidnow_btn info_page_btn' onClick={() =>
                                            POPUPACTION("Buy", Tokens[TabName].owner)
                                          }>Buy Now</button>
                                        
                    ) : (
                      Tokens[TabName]?.myBid?.WalletAddress ==
                      accountAddress && (
                   

             
                                          <button className='info_bidnow_btn info_page_btn' onClick={() => POPUPACTION("CancelBid", {})}>Cancel Offer</button>
                                         
                      )
                    ))}
 
                  {
                    (Tokens_Detail?.ContractType?.toString() ===
                      "721" ? (
                      Tokens[TabName]?.myowner?.WalletAddress ==
                        accountAddress ? (
                        Tokens[TabName]?.myowner?.PutOnSaleType ==
                        "FixedPrice" && (
                        

                    
                                              <button className='info_bidnow_btn info_page_btn'  onClick={() =>
                                                POPUPACTION(
                                                  "createorder",
                                                  Tokens[TabName]?.myowner,
                                                  "updateprice"
                                                )
                                              }>Update Price</button>
                                            
                        )
                      ) : (
                        Tokens[TabName]?.owner?.WalletAddress !=
                        accountAddress &&
                        (Tokens[TabName]?.owner?.PutOnSaleType ==
                          "TimedAuction" &&
                          new Date(
                            Tokens[TabName].owner.EndClockTime
                          )?.getTime() < Date.now() ? (
                          <a href="#" className="tf-button">
                            Auction End
                          </a>

                        ) : Tokens[TabName]?.highbid?.WalletAddress !=
                          accountAddress &&
                          Tokens[TabName]?.owner?.WalletAddress ==
                          accountAddress ? (
                      

                  
                                  <button className='info_bidnow_btn info_page_btn'  onClick={() =>
                                    POPUPACTION(
                                      "Accept",
                                      Tokens[TabName]?.highbid
                                    )
                                  }>Accept</button>
                               
                        ) : Tokens[TabName]?.myBid?.WalletAddress ==
                          accountAddress ? (
                      
 
                            <button className='info_bidnow_btn info_page_btn' onClick={() =>
                              POPUPACTION("Bid", Tokens[TabName]?.myBid)
                            }>Edit Offer</button>
                          
                        ) : (
                    
                  
                                          <button className='info_bidnow_btn info_page_btn'  onClick={() => POPUPACTION("Bid", {})}>Bid Now</button>
                                         
                        ))
                      )
                    ) : Tokens[TabName]?.myowner?.WalletAddress ==
                      Tokens[TabName]?.owner?.WalletAddress ? (
                      Tokens[TabName]?.owner?.PutOnSaleType ==
                        "FixedPrice" ? (
                 
                                            <button className='info_bidnow_btn info_page_btn' onClick={() =>
                                              POPUPACTION(
                                                "createorder",
                                                Tokens[TabName]?.myowner,
                                                "updateprice"

                                              )
                                            }>Update Price</button>
                                         
                      ) : (
                     
  
          <button className='info_bidnow_btn info_page_btn' onClick={() =>{
                       
 
                       POPUPACTION(
                         "createorder",
                         Tokens[TabName]?.myowner
                       )
                     }
                     }>List NFT for sale</button>
        
                      )
                    ) : Tokens[TabName]?.owner?.WalletAddress !=
                      accountAddress &&
                      Tokens[TabName]?.highbid?.WalletAddress !=
                      accountAddress &&
                      Tokens[TabName]?.owner?.WalletAddress ==
                      accountAddress ? (
               
 
                      <button className='info_bidnow_btn info_page_btn' onClick={() =>
                                      POPUPACTION(
                                        "Accept",
                                        Tokens[TabName]?.highbid
                                      )
                                    }>Accept</button>
                    
                    ) : Tokens[TabName]?.myBid?.WalletAddress ==
                      accountAddress ? (
                

              
                            <button className='info_bidnow_btn info_page_btn' onClick={() =>
                                            POPUPACTION("Bid", Tokens[TabName]?.myBid)
                                          }>Edit Bid</button>
                            
                    ) : (
               
                              <button className='info_bidnow_btn info_page_btn' onClick={() => POPUPACTION("Bid", {})}>Bid Now</button>
                             
                    ))}

{(Tokens[TabName]?.owner &&
                Tokens[TabName]?.owner?.WalletAddress !=
                accountAddress &&
                (Tokens[TabName]?.owner?.PutOnSaleType ==
                  "FixedPrice")&&
                  Tokens_OwnerDetail?.CoinName == config.COIN_NAME) && !Tokens_OwnerDetail?.isStake &&
           
              <button className='info_bidnow_btn info_page_btn' disabled={stakebtncontrol} onClick={()=>PushToCart()}>Add to Bag</button>
 
  
          }
                             
</>
                  
         
          }



 {/* ==============   STAKING SECTION ================== */}


{/* stake call */}
{/* <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12} className='mt-3'>
<Row> */}

{/* update eligibility */}
{/* { 
  collectiondetail?.isStakeable &&
 !Tokens_OwnerDetail?.isStakeable && pool?.walletAddress && Tokens_OwnerDetail?.NFTOwner == accountAddress && Tokens_OwnerDetail?.NFTOwner == collectiondetail.Creator && 
       
           

  // <Col xxl={4} xl={4} lg={4} md={4} sm={4} xs={12}>

  // <div className='info_bid_btn_align '>

  // <div className='info_triple_btn_align' 
  //                     onClick={()=>{updateEligibility()}}>
  //                     <a data-ignore-split="true" class="Button"  id=""  tabindex="0" aria-label="" disabled={stakebtncontrol}>
  //                     upgrade NFT
  //                     <span class="Button-hover-helper"></span>
  //                     <span class="Button-hover-helper"></span>
  //                     <span class="Button-hover-helper"></span>
  //                     <span class="Button-hover-helper"></span>
  //                     <span class="Button-hover-content" aria-hidden="true"> upgrade NFT</span>
  //                     <span class="Button-hover-content" aria-hidden="true">  upgrade NFT</span>
  //                     <span class="Button-hover-content" aria-hidden="true"> upgrade NFT</span>
  //                     <span class="Button-hover-content" aria-hidden="true">  upgrade NFT</span>
  //                     </a>
  //                     </div>
  //                     </div>
  //                     </Col>
                   
 }


  {/* Create stake */}

{
Tokens_OwnerDetail?.isStakeable && Tokens_OwnerDetail?.NFTOwner == accountAddress &&  !Tokens_OwnerDetail?.isStake &&

// locktime &&
// (new Date(Date.now()) < new Date(locktime)) &&


 
                      <button className='info_bidnow_btn info_page_btn'  onClick={()=>createstakecall()} disabled={stakebtncontrol}>Stake</button>
                    

          }



{/* claim reward */}
{
(collectiondetail?.hasRetroactiveRewards)?
(Tokens_OwnerDetail?.isStakeable && 
  Tokens_OwnerDetail?.isStake &&
 Tokens_OwnerDetail?.NFTOwner == accountAddress && 
// locktime &&
// (new Date(Date.now()) < locktime)
//  &&  
                     <button className='info_bidnow_btn info_page_btn' disabled={stakebtncontrol} 
                        // onClick={()=>{claimrewardcall()}}
                        onClick={()=>{setClaimModalState(true)}}
                        
                        >Claim Reward</button>)
                        :
( Tokens_OwnerDetail?.isStakeable && 
  Tokens_OwnerDetail?.isStake &&
                        Tokens_OwnerDetail?.NFTOwner == accountAddress && 
                      //  locktime &&
                      // new Date(locktime).getTime() > Date.now() 
                      //  use get time =====(new Date(Date.now()) < locktime)

                        // && 
                        <button className='info_bidnow_btn info_page_btn' disabled={stakebtncontrol} 
                        // onClick={()=>{claimrewardcall()}}
                        onClick={()=>{setClaimModalState(true)}}
                        
                        >Claim Reward</button>)
                    
 
}

 
{/* withdraw */}

{
Tokens_OwnerDetail?.isStakeable && Tokens_OwnerDetail?.isStake && 
Tokens_OwnerDetail?.NFTOwner == accountAddress && 
 
pool?.walletAddress != config.RETROSTAKE_ADDRESS &&
locktime &&
            // (new Date(Date.now()) > locktime) &&
            Date.now() > new Date(locktime).getTime() &&
            
                      <button className='info_bidnow_btn info_page_btn' disabled={stakebtncontrol} onClick={()=>{withdrawcall()}}>withdraw</button>  

        }
{
Tokens_OwnerDetail?.isStakeable && Tokens_OwnerDetail?.isStake && 
Tokens_OwnerDetail?.NFTOwner == accountAddress && 
pool?.walletAddress == config.RETROSTAKE_ADDRESS &&
 

 
 
                      <button className='info_bidnow_btn info_page_btn' disabled={stakebtncontrol} onClick={()=>{withdrawcall()}}>withdraw</button>
                

                  
                     

        }



 

  
 
</>

 
 

</div>
</>}
</>
{/* </>} */}


</Col>

</>
:
<>
 
<h6 className='info_notwallet'>Wallet Not Connected</h6>
</>
}











{console.log("test the issue",Tokens_OwnerDetail?.isStakeable, Tokens_OwnerDetail?.isStake,Tokens_OwnerDetail?.NFTOwner,locktime, Date.now() > new Date(locktime).getTime() ,pool?.walletAddress)}


                <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
                  <Tab.Content>
                    <Tab.Pane eventKey="first">
                    
                      {Tokens_Detail.NFTDescription &&
                      <>
                      <h5 className='info_size_text '>Description</h5>
                        <div className='info_properties_dtls'>
                          


                          <p className='info_descr_dtls_txt'>{Tokens_Detail.NFTDescription} </p>
                          
                        </div></>}

                      {(nftprops && nftprops.length > 0) &&
                      
                      <>

                        <h5 className='info_size_text'>Properties</h5>
                        
                          <Row className='gx-2'>
                            {nftprops.map((data)=>{
                              return(
                                <>
                            <Col className='mb-2' xxl={3} xl={3} lg={3} md={4} sm={4} xs={12}>
                            <div className='info_propertiesess_dtls '>
                              <h6 className='name_prprt_info'>{data?.property}</h6>
                              <p className='value_prprt_info'>{data?.value}</p>
                              {/* <small className='txt_hint_info'>5% have this trait</small> */}
                            </div>

                            </Col>
                                </>
                              )
                            })}

                      

                      
                          </Row>

                          {/* <Row className=' gx-2'>
                            <Col className='mb-2' xxl={3} xl={3} lg={3} md={4} sm={4} xs={12}>
                            <div className='info_propertiesess_dtls '>
                              <h6 className='name_prprt_info'>Property Name</h6>
                              <p className='value_prprt_info'>Property Value</p>
                              <small className='txt_hint_info'>5% have this trait</small>
                            </div>

                            </Col>

                            <Col className='mb-2' xxl={3} xl={3} lg={3} md={4} sm={4} xs={12}>
                            <div className='info_propertiesess_dtls '>
                              <h6 className='name_prprt_info'>Property Name</h6>
                              <p className='value_prprt_info'>Property Value</p>
                              <small className='txt_hint_info'>5% have this trait</small>
                            </div>

                            </Col>

                            <Col className='mb-2' xxl={3} xl={3} lg={3} md={4} sm={4} xs={12}>
                            <div className='info_propertiesess_dtls '>
                              <h6 className='name_prprt_info'>Property Name</h6>
                              <p className='value_prprt_info'>Property Value</p>
                              <small className='txt_hint_info'>5% have this trait</small>
                            </div>

                            </Col>
                          </Row>   */}

                        
                          
                          {/* <div className='info_triple_div_align'>
                            <div className='info_size_dtls'> */}
                              {/* <small className='info_size_textone'>{nftprops && nftprops[0]?.value}</small> */}
                              {/* <p className='info_full_text'>{nftprops && nftprops[0]?.value}</p> */}
                              {/* <small className='info_rarity_text'>100 % Rarity</small> */}
                            {/* </div> */}
                            {/* <div className='info_size_dtls'>
                            <small className='info_size_text'>Colour</small>
                            <p className='info_full_text'>Full</p>
                            <small className='info_rarity_text'>100 % Rarity</small>
                        </div>
                        <div className='info_size_dtls'>
                            <small className='info_size_text'>Symbol</small>
                            <p className='info_full_text'>Full</p>
                            <small className='info_rarity_text'>100 % Rarity</small>
                        </div> */}
                          {/* </div> */}
                          {/* <div className='info_triple_div_align'>
                        <div className='info_size_dtls'>
                            <small className='info_size_text'>Licensor</small>
                            <p className='info_full_text'>Full</p>
                            <small className='info_rarity_text'>100 % Rarity</small>
                        </div>
                        <div className='info_size_dtls'>
                            <small className='info_size_text'>Asset ID</small>
                            <p className='info_full_text'>Full</p>
                            <small className='info_rarity_text'>100 % Rarity</small>
                        </div>
                        <div className='info_size_dtls'>
                            <small className='info_size_text'>Character</small>
                            <p className='info_full_text'>Full</p>
                            <small className='info_rarity_text'>100 % Rarity</small>
                        </div>
                    </div> */}

                        </>}


                    </Tab.Pane>


                    <Tab.Pane eventKey="second">
                      {Tokens["owner"]?.list?.map((data, key) => {
                        return (
                          <div className='owner_dtls_align mt-5'>
                             
                            <div className='info_image_side_align' onClick={()=>navigate(`/my-item/${data?.CustomUrl}`)}>
                              <img src={data?.Profile ? data?.Profile : require('../app/assets/images/collection.png')} />
                              <div className='creator_text_info'>
                                <p className='creator_text_info_txt1'>{data?.DisplayName
                                  ? data?.DisplayName

                                  : (data?.NFTOwner).slice(0, 8).concat("..")}</p>

                                {/* <p className='creator_text_info_txt2'>Lorem Ipsum</p> */}
                              </div>
                              {((data?.PutOnSaleType == "FixedPrice") && (data?.NFTOwner != accountAddress)) ?
                                <>
                                  <div className='info_image_sideops_align creator_text_info'>
                                    <p className='creator_text_info_txt1'>{data?.NFTBalance}/{data?.NFTQuantity} on sale for</p>
                                    <p className='creator_text_info_txt2'>{data?.NFTPrice} {data?.CoinName}

                                      {' each'}</p>

                                  </div>
                                </> :
                                <>
                                  <div className='info_image_sideops_align creator_text_info'>

                                    <p className='creator_text_info_txt1'>{data?.NFTBalance}/{data?.NFTQuantity} Editions</p>
                                  </div></>
                              }
                            </div> 

                          </div>
                        );
                      })
                      }





                    </Tab.Pane>

                    {/* <button className='addtocat_btn_align mt-5'>Add To Cart</button>
                <p className='info_royalty_txt mt-2'>2 % Royalty</p>
                <div className='info_bid_btn_align '>
                    <button className='me-3 info_buynow_btn'
                    //  onClick={handleShowBuyNow}
                    >Buy Now</button>
                    <button className='me-3 info_bidnow_btn' onClick={handleShowPlaceaBid}>Bid Now</button>
                </div> */}



                  </Tab.Content>
                </Col>
          




{/* {Tokens_OwnerDetail?.isStakeable && Tokens_OwnerDetail?.isStake && Tokens_OwnerDetail?.NFTOwner == accountAddress &&

<Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12} className='mt-5'>
<Row>
  <Col xxl={4} xl={4} lg={4} md={4} sm={4} xs={12}>

  <div className='info_bid_btn_align '>

  <div className='info_triple_btn_align' 
                      onClick={()=>{stopstakecall()}}>
                      <a data-ignore-split="true" class="Button"  id=""  tabindex="0" aria-label="">
                       stop stake
                      <span class="Button-hover-helper"></span>
                      <span class="Button-hover-helper"></span>
                      <span class="Button-hover-helper"></span>
                      <span class="Button-hover-helper"></span>
                      <span class="Button-hover-content" aria-hidden="true">stop stake </span>
                      <span class="Button-hover-content" aria-hidden="true"> stop stake</span>
                      <span class="Button-hover-content" aria-hidden="true"> stop stake</span>
                      <span class="Button-hover-content" aria-hidden="true"> stop stake</span>
                      </a>
                      </div>
                      </div>
                      </Col>
                      </Row>

          </Col>} */}

 

          {/* <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12} className='mt-5'>
            <Row>
              <Col xxl={4} xl={4} lg={4} md={4} sm={4} xs={12}>
                <div className='info_triple_btn_align'>
              <a data-ignore-split="true" class="Button"  id="" onclick="" tabindex="0" aria-label="">
    Buy Now
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Buy Now</span>
    <span class="Button-hover-content" aria-hidden="true">Buy Now</span>
    <span class="Button-hover-content" aria-hidden="true">Buy Now</span>
    <span class="Button-hover-content" aria-hidden="true">Buy Now</span>
  </a>
  </div>

              </Col>

              */}


              </Row>
            </Tab.Container>
          </Col>
          
        </Row>



        
{!Tokens_OwnerDetail?.isStake&&
<>
        <h4 className='mt-4'  > Offers </h4>

        <>
          {(BidTableArr)?.length > 0 ?


            <Table responsive className='info_common_table_align'>
              <thead>
                <tr>
                  <th>Bidder</th>
                  <th>Amount</th>
                  <th>Status</th>

                </tr>
              </thead>

              {BidTableArr?.map((data, key) => {

                return (
                  <>

                    <tbody>
                 
                      <tr>
                        <td>{data?.TokenBidderAddress}</td>
                        {/* <td>{data?.TokenBidAmt} {data?.CoinName} for {data?.NFTQuantity}/{Tokens_OwnerDetail && Tokens_OwnerDetail?.NFTQuantity} edition</td> */}
                      
                        <td>{data?.TokenBidAmt} {data?.CoinName}</td>
                        {data?.WalletAddress == accountAddress && (
                          <>
                            <td>

                            {/* <a data-ignore-split="true" class="Button me-3"  id="" onClick={() =>
                                POPUPACTION("Bid", data)
                              } tabindex="0" aria-label="">
    Edit Offer
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Edit Offer</span>
    <span class="Button-hover-content" aria-hidden="true">Edit Offer</span>
    <span class="Button-hover-content" aria-hidden="true">Edit Offer</span>
    <span class="Button-hover-content" aria-hidden="true">Edit Offer</span>
  </a> */}

                              <button class="me-3 info_buynow_btn" onClick={() =>
                                POPUPACTION("Bid", data)
                              }>Edit Offer</button>

{/* <a data-ignore-split="true" class="Button me-3"  id="" onClick={() =>
                                // POPUPACTION("CancelBid", data)
                                POPUPACTION("CancelBid", {})

                              } tabindex="0" aria-label="">
    Cancel Offer
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Cancel Offer</span>
    <span class="Button-hover-content" aria-hidden="true">Cancel Offer</span>
    <span class="Button-hover-content" aria-hidden="true">Cancel Offer</span>
    <span class="Button-hover-content" aria-hidden="true">Cancel Offer</span>
  </a> */}

                              
                              <button class="me-3 info_buynow_btn" onClick={() =>
                                // POPUPACTION("CancelBid", data)
                                POPUPACTION("CancelBid", {})}>Cancel Offer</button>

                            </td>
                          </>
                        )}
 
 
      {data.WalletAddress !=
                                        Tokens["All"]?.myowner?.WalletAddress &&
                                        Tokens["All"]?.myowner?.WalletAddress == accountAddress &&
                                        (Tokens["All"]?.myowner?.PutOnSaleType == "TimedAuction" ) &&
                                        new Date(
                                                                                  Tokens_OwnerDetail?.EndClockTime
                                                                                ).getTime() < Date.now() &&
    //  {data.WalletAddress !=
    //                                     Tokens_OwnerDetail?.NFTOwner &&
    //                                     Tokens_OwnerDetail?.NFTOwner == accountAddress &&
    //                                     (Tokens_OwnerDetail?.PutOnSaleType == "TimedAuction" ) &&
    //                                       new Date(
    //                                         Tokens_OwnerDetail?.EndClockTime
    //                                       ).getTime() < Date.now() &&  
    
    

                                           (


                                            <button
                                            className="me-3 info_buynow_btn" 
                                            onClick={() =>
                                              POPUPACTION("Accept", data)
                                            }
                                          >
                                            Accept Offer
                                          </button>
                                    
                                            // <a data-ignore-split="true" class="Button me-3"  id=""  onClick={() =>
                                            //                                             POPUPACTION("Accept", data)
                                            //                                           } tabindex="0" aria-label="">
                                            //   Accept Offer
                                            //   <span class="Button-hover-helper"></span>
                                            //   <span class="Button-hover-helper"></span>
                                            //   <span class="Button-hover-helper"></span>
                                            //   <span class="Button-hover-helper"></span>
                                            //   <span class="Button-hover-content" aria-hidden="true">Accept Offer</span>
                                            //   <span class="Button-hover-content" aria-hidden="true">Accept Offer</span>
                                            //   <span class="Button-hover-content" aria-hidden="true">Accept Offer</span>
                                            //   <span class="Button-hover-content" aria-hidden="true">Accept Offer</span>
                                            // </a>
                                        )} 
        {data.WalletAddress !=  Tokens["All"]?.myowner?.WalletAddress &&
         Tokens["All"]?.myowner?.WalletAddress ==  accountAddress &&
        (Tokens["All"]?.myowner?.PutOnSaleType == "UnlimitedAuction" || 
         Tokens["All"]?.myowner?.PutOnSaleType != "TimedAuction" ) &&
         
        // {data.WalletAddress !=  Tokens_OwnerDetail?.NFTOwner &&
        //  Tokens_OwnerDetail?.NFTOwner ==  accountAddress &&
        // (Tokens_OwnerDetail?.PutOnSaleType == "UnlimitedAuction" || 
        // Tokens_OwnerDetail?.PutOnSaleType != "TimedAuction" ) &&
         
                                           (

  //                                           <a data-ignore-split="true" class="Button me-3"  id=""  onClick={() =>
  //                                             POPUPACTION("Accept", data)
  //                                           } tabindex="0" aria-label="">
  //   Accept Offer
  //   <span class="Button-hover-helper"></span>
  //   <span class="Button-hover-helper"></span>
  //   <span class="Button-hover-helper"></span>
  //   <span class="Button-hover-helper"></span>
  //   <span class="Button-hover-content" aria-hidden="true">Accept Offer</span>
  //   <span class="Button-hover-content" aria-hidden="true">Accept Offer</span>
  //   <span class="Button-hover-content" aria-hidden="true">Accept Offer</span>
  //   <span class="Button-hover-content" aria-hidden="true">Accept Offer</span>
  // </a>
                                          <button
                                            className="me-3 info_buynow_btn" 
                                            onClick={() =>
                                              POPUPACTION("Accept", data)
                                            }
                                          >
                                            Accept Offer
                                          </button>
                                        )} 

                        {/* Not On sale , Unlimited Acution */}

                        {/* {(Tokens_OwnerDetail?.PutOnSaleType == "UnlimitedAuction") && (data?.WalletAddress != accountAddress) && (accountAddress == Tokens_OwnerDetail?.NFTOwner) &&
                          (

                            <button class="me-3 info_buynow_btn" onClick={() =>
                              POPUPACTION("Accept", data)
                            }>Accept Offer</button>
                          )
                        } */}

                        {/* TimedAuction */}
{/* 
                        {((Tokens_OwnerDetail?.PutOnSaleType == "TimedAuction") && (new Date(Date.now()) > new Date(Tokens_OwnerDetail?.EndClockTime))) &&
                          <>
                            {(data?.WalletAddress != accountAddress) && (accountAddress == Tokens_OwnerDetail?.NFTOwner) && (

                              <button class="me-3 info_buynow_btn" onClick={() =>
                                POPUPACTION("Accept", data)
                              }>Accept Offer</button>


                            )}

                          </>} */}



                      </tr>

                    </tbody>
                  </>)

              })}


            </Table> :
            <div><center>No Bids Currently</center></div>
          }
        </>
        </>}




        <h4>Activity</h4>

        <Table responsive className='info_common_table_align p-1'>
          <thead>
            <tr>
              <th>Event</th>
              <th>Price</th>
              <th>From</th>
              <th>To</th>
              <th>Date</th>

            </tr>
          </thead>
          <tbody>
            {ActivityList && ActivityList.map((item) => {
              return (
                <tr className='tr_font_align'>
                  <td ><div className='cat_img_txt'><img className='activity_cato_img' src={
                    (item?.Activity == "Bid")?bidIMg:
                    (item?.Activity == "CancelBid")?bidCancel:
                    (item?.Activity == "Buy")?saleImg:
                    (item?.Activity == "CancelOrder")?listRemove:
                    (item?.Activity == "Mint")?mintImg:
                    (item?.Activity == "PutOnSale")?listSale:
                    (item?.Activity == "Edit")?editImg:
                    (item?.Activity == "Accept")?saleImg:
                    (item?.Activity == "Burn")?listRemove:bidIMg



                    }/>{
                      (item?.Activity == "Bid")?"Bid":
                      (item?.Activity == "CancelBid")?"Bid Cancelled":
                      (item?.Activity == "Buy")?"Sale":
                      (item?.Activity == "CancelOrder")?"Listing Removed":
                      (item?.Activity == "Mint")?"Mint":
                      (item?.Activity == "PutOnSale")?"Listed for Sale":
                      (item?.Activity == "Edit")?"Edit":
                      (item?.Activity == "Accept")?"Bid Accepted":
                      (item?.Activity == "Burn")?"Listing Removed":""
                    }</div></td>
                  <td>
                    <div className='d-flex justify-content-start align-items-center'>
                      <img className='table_img_align' src={require('../app/assets/images/xdc_icon_small.png')} />
                      <span>{(item?.NFTPrice) ? item?.NFTPrice : "---"}</span>
                    </div>
                    <p>{(item?.CoinName && item?.NFTPrice) ? item?.CoinName : ""}</p>
                  </td>
                  {(item?.Activity == "Bid")?
                  <>
                    <td>{(item?.To) ? item?.To:""}</td>
                    <td>{"---"}</td>
                    </>
                  :
                  ((item?.Activity == "PutOnSale"))?
                  <>
                  <td>{(item?.From) ? (item?.From == "NullAddress") ? "---" : item?.From : "---"}</td>
                  <td>{ "---"}</td>

                  </>:
                   <>
                   <td>{(item?.From) ? (item?.From == "NullAddress") ? "---" : item?.From : "---"}</td>
                   <td>{(item?.To) ? item?.To : "---"}</td>
                   </>}
                  <td> {moment(new Date(item?.updatedAt)).format('DD/MM/YYYY, h:mm a')}</td>

                </tr>
              )
            })}



          </tbody>
        </Table>

      </Container>
      <Footer />




      {/* Modal Contents */}



      {/* Buy Now Modal */}


      <Modal
        show={showBuyNow}
        onHide={handleCloseBuyNow}
        backdrop="static"
        keyboard={false}
        centered
        scrollable={false}
      >
        <Modal.Header className='modal_theme_align' closeButton>
          <Modal.Title>Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body className='burn_token_body modal_theme_align common_modal_body'>
          <div className=" common_modal_table_dtls w-100  ">
            <p className=" buynow_head_text">Seller</p>
            <p className=" buynow_head_text">Buyer</p>
          </div>
          <div className=" common_modal_table_dtls w-100">
            <p className="placebid_dtls_txt">0x025c1667</p>
            <p className="placebid_dtls_txt">01xa6532fd</p>
          </div>
          {/* <h5>0.1 MATIC</h5> */}
          <div className=" common_modal_table_dtls w-100">
            <p className="placebid_dtls_txt">Your balance</p>
            <p className="placebid_dtls_txt">0.39692 MATIC</p>
          </div>
          <div className=" common_modal_table_dtls w-100">
            <p className="placebid_dtls_txt">Service fee</p>
            <p className="placebid_dtls_txt">0%</p>
          </div>
          <div className=" common_modal_table_dtls w-100">
            <p className="placebid_dtls_txt">Price of the NFT</p>
            <p className="placebid_dtls_txt">0.1</p>
          </div>



          <div className="place_bid_modalbtn load_more_btn_align">
            {/* <button type="button" class="btn confirm_btn me-2 w-100 modal_btn_align" data-toggle="modal" */}
              {/* data-target="#hideBuyNowModal" */}
              {/* onClick={hideBuyNowModal} */}
            {/* >Proceed to Payment</button> */}

<a data-ignore-split="true" class="Button me-2 w-100"  data-target="#hideBuyNowModal" data-toggle="modal"  tabindex="0" aria-label="">
    Proceed to Payment
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Proceed to Payment</span>
    <span class="Button-hover-content" aria-hidden="true">Proceed to Payment</span>
    <span class="Button-hover-content" aria-hidden="true">Proceed to Payment</span>
    <span class="Button-hover-content" aria-hidden="true">Proceed to Payment</span>
  </a>



            {/* <button className="modal_btn_align loadMore_btn me-2 w-100 cmn_cancel_btn">Cancel</button> */}

            <a data-ignore-split="true" class="Button me-2 w-100"  id="" onClick="" tabindex="0" aria-label="">
    Cancel
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Cancel</span>
    <span class="Button-hover-content" aria-hidden="true">Cancel</span>
    <span class="Button-hover-content" aria-hidden="true">Cancel</span>
    <span class="Button-hover-content" aria-hidden="true">Cancel</span>
  </a>
          </div>
        </Modal.Body>

      </Modal>
      {/* End of Buy Now Modal */}

      {/* Bid Now Modal */}


      <Modal
        show={showPlaceaBid}
        onHide={handleClosePlaceaBid}
        backdrop="static"
        keyboard={false}
        centered
        scrollable={false}
      >
        <Modal.Header className='align-items-center modal_theme_align' closeButton>
          <Modal.Title className='w-100'>Place a Bid</Modal.Title>
        </Modal.Header>
        <Modal.Body className='burn_token_body common_modal_body modal_theme_align'>
          <p className="placebid_hint_text common_modal_hint_text  ">You are about to Sale space NFT for
            <span className="placebid_span_text"> 72346tr8hk2ty28 </span>
          </p>
          <h5 className=''>Your Bid</h5>
          <input type="text" className='common_modal_input mt-1' id="Quantity" placeholder='Enter Your Bid Amount' name="Quantity" />
          <h5 className=' text-block'>Enter Quantity (50 Available)</h5>
          <input type="text" className='common_modal_input mt-1' id="Quantity" placeholder='Enter Your Bid Quantity' name="Quantity" />

          <div className=" common_modal_table_dtls  w-100">
            <p className="placebid_dtls_txt">Your  Balance</p>
            <p className="placebid_dtls_txt">6.8754NFT</p>
          </div>

          <div className=" common_modal_table_dtls w-100">
            <p className="placebid_dtls_txt">Your bidding balance</p>
            <p className="placebid_dtls_txt">2.4500000 XDC</p>
          </div>

          <div className=" common_modal_table_dtls w-100">
            <p className="placebid_dtls_txt">Serice Fee</p>
            <p className="placebid_dtls_txt">1 % XDC</p>
          </div>
          <div className=" common_modal_table_dtls w-100">
            <p className="placebid_dtls_txt">You will pay</p>
            <p className="placebid_dtls_txt">0</p>
          </div>
          <div className="place_bid_modalbtn  load_more_btn_align">
            <button type="button" class="btn confirm_btn me-2   modal_btn_align">Place a Bid</button>
            <button type="button" class="btn  loadMore_btn me-2  modal_btn_align">Cancel</button>
          </div>





        </Modal.Body>

      </Modal>

      {/* End of Bid Now Modal */}

      {/* Burn Token Modal */}

      <Modal
        show={showBurnToken}
        onHide={handleCloseBurnToken}
        backdrop="static"
        keyboard={false}
        scrollable={false}
        centered
      >
        <Modal.Header className='align-items-center modal_theme_align' closeButton>
          <Modal.Title className='w-100'>Burn Token</Modal.Title>
        </Modal.Header>
        <Modal.Body className=' common_modal_body modal_theme_align'>
          <div className="burn_tokem_img_align d-flex justify-content-center w-100">
            <img className=" burn_token_img" src={require('../app/assets/images/collection.png')} alt="" />
          </div>
          <h5 className='text-center mt-2'>2 Token Available</h5>
          <p className="placebid_hint_text text-center ">There are many variations of passages of
            <span className="placebid_span_text"> qweqw </span>
          </p>
          <input type="text" className='common_modal_input ' id="Quantity" placeholder='Quantity' name="Quantity" />
          <div className="place_bid_modalbtn mt-5 load_more_btn_align">
            <button type="button" class="btn confirm_btn me-2   modal_btn_align">Confirm</button>
            <button type="button" class="btn  loadMore_btn me-2  modal_btn_align">Cancel</button>
          </div>


        </Modal.Body>

      </Modal>

      {/* End of Burn Token Modal */}

      {/* Share Modal */}

      <Modal
        show={showShareModal}
        onHide={handleCloseShareModal}
        backdrop="static"
        keyboard={false}
        scrollable={false}
        centered
      >
        <Modal.Header className='align-items-center modal_theme_align' closeButton>
          <Modal.Title className='text-center w-100'>Share Link</Modal.Title>
        </Modal.Header>
        <Modal.Body className=' common_modal_body modal_theme_align'>


          <Row className=''>
            <Col xs={3} className='d-flex justify-content-center align-items-center'>
              <div className='modal_bg_linear_gradient'>
                <div className='share_social_icons'>
                  <i class="fa-brands fa-instagram share_social_icon"></i>
                </div>
              </div>

            </Col>
            <Col xs={3} className='d-flex justify-content-center align-items-center'>
              <div className='modal_bg_linear_gradient'>
                <div className='share_social_icons'>
                  <i class="fa-brands fa-facebook-f share_social_icon"></i>
                </div>
              </div>

            </Col>
            <Col xs={3} className='d-flex justify-content-center align-items-center'>
              <div className='modal_bg_linear_gradient'>
                <div className='share_social_icons'>
                  <i class="fa-brands fa-twitter share_social_icon"></i>
                </div>
              </div>

            </Col>
            <Col xs={3} className='d-flex justify-content-center align-items-center'>
              <div className='modal_bg_linear_gradient'>
                <div className='share_social_icons'>
                  <i class="fa-brands fa-youtube share_social_icon"></i>
                </div>
              </div>
            </Col>
          </Row>
          <h5 className='mt-5'>Copy</h5>
          <input type="text" className='common_modal_input ' id="Quantity" placeholder='Example.com/share link' name="Quantity" />




          <div className="place_bid_modalbtn mt-5 load_more_btn_align">
            <button type="button" class="btn confirm_btn me-2   modal_btn_align">Copy URL</button>
            <button type="button" class="btn  loadMore_btn me-2  modal_btn_align">Cancel</button>
          </div>
        </Modal.Body>

      </Modal>

      {/* End of Share Modal */}

      {/* Report Modal */}
      <Modal
        show={showReport}
        onHide={handleCloseReport}
        backdrop="static"
        keyboard={false}
        scrollable={false}
        centered
      >
        <Modal.Header className='align-items-center modal_theme_align' closeButton>
          <Modal.Title>Report this Profile ?</Modal.Title>
        </Modal.Header>
        <Modal.Body className='common_modal_body modal_theme_align'>

          <p className="placebid_hint_text text-center ">There are many variations of passages of <span className="placebid_span_text"> qweqw </span> available.
          </p>



          <h6 className=''>Message</h6>


          <textarea className='w-100  modal_textarea_dtls' rows="4" placeholder="Tell us some detils"></textarea>

          <div className="place_bid_modalbtn  load_more_btn_align">
            <button type="button" class="btn confirm_btn me-2   modal_btn_align">Report</button>
            <button type="button" class="btn  loadMore_btn me-2  modal_btn_align">Cancel</button>
          </div>


        </Modal.Body>

      </Modal>


      {/* End of Report Modal */}

      {/* End of Modal Contents */}

      <Modal
        show={show8}

// onHide={handleClose}
backdrop="static"
keyboard={false}
centered
className='whole_modal_text_align'

>
<Modal.Header className="modal_theme_align">

  <Modal.Title >            Let's get started

  
</Modal.Title>
<button
            type="button"
            class="btn-close"
            aria-label="Close"
            onClick={() => setShow8(false)}
            // onClick={setShow8(false)}
          ></button>
</Modal.Header>
<Modal.Body className='burn_token_body  modal_theme_align common_modal_body'>

      <div className="procedd_modals_dtls_align mt-3">
        {/* <p className="placebid_hint_text mt-3">Put On Sale</p>
        <p>Call contract method</p> */}

        <p className="placebid_hint_text mt-3">Withdraw your NFT</p>

        <button type="button" class="btn info_bidnow_btn w-100 modal_btn_align" 
         disabled={
            Mintbtn == "process" || Mintbtn == "done" ? true : false
          }
          onClick={Mintbtn == "start" || Mintbtn == "try" ? withdrawNftFunc : ""}
>
        {Mintbtn == "start" && "Withdraw"}
              {Mintbtn == "process" && "In-Progress"}
              {Mintbtn == "try" && "Try-Again"}
              {Mintbtn == "done" && "Done"}
              {Mintbtn == "init" && "Confirm"}
        </button>
        
      </div>
</Modal.Body>

</Modal>

    </>
  )
}

export default InfoPage