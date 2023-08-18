import React, { useEffect, useState, useRef } from "react";
import Header from '../app/Header'
import DataTable from 'react-data-table-component';
import ReactDatatable from '@ashvin27/react-datatable';
import Footer from '../app/Footer'
import { Container, Row, Col, Nav, Tab, Modal } from 'react-bootstrap';
import { useSelector } from "react-redux";
import Box from '@mui/material/Box';
import { toast } from "react-toastify";
import action_config from '../config/config.js';
import { CancelBids } from "../modals/cancelBid.js"
import { Accept } from "../modals/AcceptBid.js"
import useContractProviderHook from "../actions/contractProviderHook";
// import InfiniteScroll from "react-infinite-scroller";
import InfiniteScroll from "react-infinite-scroll-component";


import {
  Link,
  useParams,

} from "react-router-dom";
import config from "../config/config.js"
import TokenCard from "../Components/tokencard.js"
import { userRegister, Token_MyList_Func, FollowUnFollowFunc, getFollowStatus } from '../actions/axioss/user.axios'
import { getCreatedCollections, ListNFts, getMyBids, getReceivedBids } from '../actions/axioss/nft.axios'
import { style } from "@mui/system";

toast.configure();



function MyItems() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  const configdata = {
    page_size: 10,
    length_menu: [10, 20, 50],
    filename: "Users",
    no_data_text: 'No user found!',

    language: {
      length_menu: "Show _MENU_ result per page",
      filter: "Filter in records...",
      info: "Showing _START_ to _END_ of _TOTAL_ records",
      pagination: {
        first: "First",
        previous: <> Previous </>,
        next: <>Next</>,
        last: "Last",

      }
    },
    show_length_menu: true,
    show_filter: true,
    show_pagination: true,
    show_info: true,
    defaultSortAsc: true,
  };

  const columns = [
    {
      name: "Offer",

      selector: (vals) => vals.time,
      sortable: true,

    },
    {
      name: "Price",
      selector: (vals) => vals.price,
      sortable: true
    },
    {
      name: "From",
      selector: (vals) => vals.from,
      sortable: true
    },
    {
      name: "Status",
      selector: (vals) => vals.status,
      sortable: true
    },
    {
      name: " ",
      selector: (vals) => vals.cancelbtn,
      sortable: true
    },

  ]

  // const tableCustomStyles = {
  //   headRow: {
  //     style: {
  //       color:'#223336',
  //       backgroundColor: '#e7eef0',
  //       fontSize:'15px'
  //     },
  //   },

  // }
  const styled = [
    {
      backgroundColor: "#141414"

    }
  ]
  const data = [

    {
      time: <div className="ofrrcvd_tbl_img_data"><img className="table_nft_img_align" src={require('../app/assets/images/drop6.jpg')} /><p>Moonbirds <i class="bi bi-patch-check-fill offrrcvd_badge_icon" /></p></div>,
      price: <b>0.002ETH</b>,
      from: "You",
      status: 'Valid',
      cancelbtn: <a data-ignore-split="true" class="Button tbl_Button" id="" tabindex="0" aria-label="">
        Accept
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
      </a>

    },
    {
      time: <div className="ofrrcvd_tbl_img_data"><img className="table_nft_img_align" src={require('../app/assets/images/drop6.jpg')} /><p>Moonbirds <i class="bi bi-patch-check-fill offrrcvd_badge_icon" /></p></div>,
      price: <b>0.002ETH</b>,
      from: "You",
      status: 'Valid',
      cancelbtn: <a data-ignore-split="true" class="Button tbl_Button" id="" tabindex="0" aria-label="">
        Accept
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
      </a>

    },
    {
      time: <div className="ofrrcvd_tbl_img_data"><img className="table_nft_img_align" src={require('../app/assets/images/drop6.jpg')} /><p>Moonbirds <i class="bi bi-patch-check-fill offrrcvd_badge_icon" /></p></div>,
      price: <b>0.002ETH</b>,
      from: "You",
      status: 'Valid',
      cancelbtn: <a data-ignore-split="true" class="Button tbl_Button" id="" tabindex="0" aria-label="">
        Accept
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
      </a>

    },
    {
      time: <div className="ofrrcvd_tbl_img_data"><img className="table_nft_img_align" src={require('../app/assets/images/drop6.jpg')} /><p>Moonbirds <i class="bi bi-patch-check-fill offrrcvd_badge_icon" /></p></div>,
      price: <b>0.002ETH</b>,
      from: "You",
      status: 'Valid',
      cancelbtn: <a data-ignore-split="true" class="Button tbl_Button" id="" tabindex="0" aria-label="">
        Accept
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
      </a>

    },
    {
      time: <div className="ofrrcvd_tbl_img_data"><img className="table_nft_img_align" src={require('../app/assets/images/drop6.jpg')} /><p>Moonbirds <i class="bi bi-patch-check-fill offrrcvd_badge_icon" /></p></div>,
      price: <b>0.002ETH</b>,
      from: "You",
      status: 'Valid',
      cancelbtn: <a data-ignore-split="true" class="Button tbl_Button" id="" tabindex="0" aria-label="">
        Accept
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-helper"></span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
        <span class="Button-hover-content" aria-hidden="true">Accept</span>
      </a>

    },

  ]


  const data1 = [

    {
      time: <div className="ofrrcvd_tbl_img_data"><img className="table_nft_img_align" src={require('../app/assets/images/drop6.jpg')} /><p>Moonbirds <i class="bi bi-patch-check-fill offrrcvd_badge_icon" /></p></div>,
      price: <b>0.002ETH</b>,
      from: "You",
      status: 'Valid',
      cancelbtn: <a data-ignore-split="true" class="Button tbl_Button" id="" tabindex="0" aria-label="">
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

    },
    {
      time: <div className="ofrrcvd_tbl_img_data"><img className="table_nft_img_align" src={require('../app/assets/images/drop6.jpg')} /><p>Moonbirds <i class="bi bi-patch-check-fill offrrcvd_badge_icon" /></p></div>,
      price: <b>0.002ETH</b>,
      from: "You",
      status: 'Valid',
      cancelbtn: <a data-ignore-split="true" class="Button tbl_Button" id="" tabindex="0" aria-label="">
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

    },
    {
      time: <div className="ofrrcvd_tbl_img_data"><img className="table_nft_img_align" src={require('../app/assets/images/drop6.jpg')} /><p>Moonbirds <i class="bi bi-patch-check-fill offrrcvd_badge_icon" /></p></div>,
      price: <b>0.002ETH</b>,
      from: "You",
      status: 'Valid',
      cancelbtn: <a data-ignore-split="true" class="Button tbl_Button" id="" tabindex="0" aria-label="">
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

    },
    {
      time: <div className="ofrrcvd_tbl_img_data"><img className="table_nft_img_align" src={require('../app/assets/images/drop6.jpg')} /><p>Moonbirds <i class="bi bi-patch-check-fill offrrcvd_badge_icon" /></p></div>,
      price: <b>0.002ETH</b>,
      from: "You",
      status: 'Valid',
      cancelbtn: <a data-ignore-split="true" class="Button tbl_Button" id="" tabindex="0" aria-label="">
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

    },
    {
      time: <div className="ofrrcvd_tbl_img_data"><img className="table_nft_img_align" src={require('../app/assets/images/drop6.jpg')} /><p>Moonbirds <i class="bi bi-patch-check-fill offrrcvd_badge_icon" /></p></div>,
      price: <b>0.002ETH</b>,
      from: "You",
      status: 'Valid',
      cancelbtn: <a data-ignore-split="true" class="Button tbl_Button" id="" tabindex="0" aria-label="">
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

    },

  ]



  const topCollectionsList = ([
    {
      title: "Super Man NFT",
      description: "Collection Creatore Name",
      // img:require("../app/assets/images/collection.png")
    },
    {
      title: "Super Man NFT",
      description: "Collection Creatore Name",
      // img:require("../app/assets/images/collection.png")
    },
    {
      title: "Super Man NFT",
      description: "Collection Creatore Name",
      // img:require("../app/assets/images/collection.png")
    },
    {
      title: "Super Man NFT",
      description: "Collection Creatore Name",
      // img:require("../app/assets/images/collection.png")
    },
    {
      title: "Super Man NFT",
      description: "Collection Creatore Name",
      // img:require("../app/assets/images/collection.png")
    },

  ])

  var { customurl } = useParams();
  const { payload, isAdmin } = useSelector(state => state.LoginReducer.User)
  const { web3p, accountAddress } = useSelector(
    (state) => state.LoginReducer.AccountDetails
  );

  var LikeForwardRef = useRef();
  const [LikedTokenList, setLikedTokenList] = useState([]);
  const [cursor, setcursor] = React.useState('');
  const [filter, setFilter] = useState('activity');
  const [Follow, SetFollow] = useState('follow');
  const [value, SetTabName] = React.useState('owned');
  const [userProfile, setUserProfile] = useState({})
  const [followStatus, SetFollowStatus] = useState("")
  const [createdCollections, setCreatedCollections] = useState([])
  const [showListPopup, setShowListPopup] = useState(false)
  const [myoffers, setmyoffers] = useState([])
  const [receivedoffers, setreceivedoffers] = useState([])
  const [openpopup, setopenpopup] = useState("")
  const [openpopup2, setopenpopup2] = useState(false)
  const [biddata, setbiddata] = useState({})

  const [responsive, setresponsive] = useState(true);
  const [Tokens, SetTokens] = useState({ 'owned': { 'loader': true, page: 1, list: [] } })
  const [item, setitem] = useState({})
  const [bidder, setbidder] = useState({})
  const [hasMore, setHasmore] = useState(true)



  useEffect(() => {

    if (typeof Tokens[value] == 'undefined') {
      Tokens[value] = { page: 1, list: [], loader: false };
      SetTokens(Tokens);
      Explore(1, value);
    }

  }, [value, customurl])




  useEffect(() => {

    Explore();
    getProfileDetails();
    CreatedCollections();
  }, [customurl, userProfile?.WalletAddress])

  useEffect(() => {

    getmyoffers()
    getreceivedoffers()
  }, [userProfile?.WalletAddress])

  const getmyoffers = async () => {
    if (userProfile?.WalletAddress) {
      var myoffers = await getMyBids({ myaddress: userProfile?.WalletAddress })
      setmyoffers(myoffers.data)
    }
  }

  const getreceivedoffers = async () => {
    if (userProfile?.WalletAddress) {
      var myoffers = await getReceivedBids({ myaddress: userProfile?.WalletAddress })
      setreceivedoffers(myoffers?.data)
    }
  }




  const CreatedCollections = async () => {
    var coll = await getCreatedCollections({ Creator: userProfile?.WalletAddress })
    if (coll.status) {
      setCreatedCollections(coll.data)
    } else { setCreatedCollections([]) }
  }


  const getProfileDetails = async () => {
    var SendDATA = {
      CustomUrl: customurl,
      Type: 'getProfile'
    }
    var profileInfo = await userRegister(SendDATA)
    if (profileInfo?.success == 'success' && profileInfo?.data?.WalletAddress) {
      setUserProfile(profileInfo.data)
    }
  }

  const Explore = async (data, tab) => {
    var page = data ? data : (Tokens[value]?.page)
    var SendDATA = {
      TabName: tab ? tab : value,
      limit: 12,
      CustomUrl: customurl,
      NFTOwner: (userProfile?.WalletAddress),
      page: page ?? 1,
      from: 'myItem',
      cursor: cursor
    }
    let Resp = await Token_MyList_Func(SendDATA)
    if (Resp.length == 0 || Resp.length < 12) setHasmore(false)
    if (Resp?.success == 'success' && Resp.data.length > 0) {
      setHasmore(true)
      setcursor(Resp?.cursor)

      SetTokens({
        ...Tokens, ...{
          [value]: {
            list: [...Tokens[value].list, ...Resp.data],
            loader: (Resp.data.length < 12 || (SendDATA.TabName == "usercollection" && Resp.cursor == null)) ? false : true,

            page: Tokens[value].page
          }
        }
      })
    }
    else {
      setHasmore(false)
      SetTokens({
        ...Tokens, ...{
          [value]: {
            list: [...Tokens[value].list, ...Resp.data],
            loader: false,
            page: Tokens[value].page

          }
        }
      })
    }
  }

  const LoadMore = () => {

    setTimeout(() => {
      Tokens[value].page = Tokens[value].page + 1;
      SetTokens(Tokens);
      Explore(Tokens[value].page);

    }, 100)

  }
  const CoverImg = async (event) => {
    const toastupd = toast.loading("You Updated Image")
    var reader = new FileReader()
    const { id, files } = event.target;
    if (event.target.files && event.target.files[0]) {
      var file = event.target.files[0];

      if (file.type.includes("image")) {

        var Resp;
        if (id == 'coverupload') {
          Resp = await userRegister({ Type: 'cover', CustomUrl: payload?.CustomUrl, Cover: files[0], WalletAddress: payload?.WalletAddress })
        }
        else {
          // not used
          Resp = await userRegister({ Type: 'profileimage', CustomUrl: payload?.CustomUrl, Profile: files[0] })
        }
        if (Resp.success == 'success') {
          getProfileDetails();
          toast.update(toastupd, { render: Resp.msg, type: 'success', isLoading: false, autoClose: 700 })
        }

      }
      else {
        return toast.update(toastupd, { render: "Choose a valid Image", type: 'error', isLoading: false, autoClose: 700 })
      }
    }

  }


  const [listbtn, setlistbtn] = useState("start")

  const ListAllNft = async () => {

    if (!accountAddress) return toast.error("connect wallet")

    setlistbtn("process")
    var tokenownermatch = {
      NFTOwner: accountAddress,
      Status: "not-list"
    }

    var response = await ListNFts(tokenownermatch)
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
  const columnsdata = [

    {
      key: "NFTName",
      text: "NFT",
      align: "left",
      sortable: true,
      cell: data =>
        <div className="ofrrcvd_tbl_img_data">
          <img className="table_nft_img_align" src={
            (data?.fileType.includes("image")) ?

              (data?.NFTOrginalImage)
              :
              (data?.NFTThumpImage) ?
                (data?.NFTThumpImage)
                : require('../app/assets/images/drop6.jpg')} />
          <p>{(data?.NFTName).slice(0, 10).concat("...")} <i class="bi bi-patch-check-fill offrrcvd_badge_icon" /></p></div>

    },
    {
      key: "NFTPrice",
      text: "price",
      align: "left",
      sortable: true,
      cell: data =>
        <div>
          <p>{data?.TokenBidAmt} {" "} {(data?.CoinName)}</p>
        </div>

    },

    {
      // key: "NFTPrice",
      key: "you",
      text: "from",
      align: "left",
      sortable: true,
      cell: data =>
        <div>
          <p>you</p>
        </div>

    },


    {
      key: "status",
      text: "status",
      align: "left",
      sortable: true,


    },

    {
      key: "NFTPrice",
      text: "",
      align: "left",
      sortable: true,
      cell: data =>
        <a data-ignore-split="true" class="Button tbl_Button" onClick={() => cancelBiddingcall(data)} tabindex="0" aria-label="">
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

    }


  ]

  const columnsdata2 = [

    {
      key: "NFTName",
      text: "NFT",
      align: "left",
      sortable: true,
      cell: data =>
        <div className="ofrrcvd_tbl_img_data">
          <img className="table_nft_img_align" src={
            (data?.fileType.includes("image")) ?

              (data?.NFTOrginalImage)
              :
              (data?.NFTThumpImage) ?
                (data?.NFTThumpImage)
                : require('../app/assets/images/drop6.jpg')
          } />
          <p>{(data?.NFTName).slice(0, 10).concat("...")} <i class="bi bi-patch-check-fill offrrcvd_badge_icon" /></p></div>

    },
    {
      key: "NFTPrice",
      text: "Price",
      align: "left",
      sortable: true,
      cell: data =>
        <div>
          <p>{data?.TokenBidAmt} {" "} {(data?.CoinName)}</p>
        </div>

    },

    {
      key: "TokenBidderAddress",
      text: "From",
      align: "left",
      sortable: true,


    },


    {
      key: "status",
      text: "Status",
      align: "left",
      sortable: true,


    },

    {
      key: "",
      text: "",
      align: "left",
      sortable: true,
      cell: data =>
        <a data-ignore-split="true" class="Button tbl_Button" onClick={() => AcceptBiddingcall(data)} tabindex="0" aria-label="">
          Accept
          <span class="Button-hover-helper"></span>
          <span class="Button-hover-helper"></span>
          <span class="Button-hover-helper"></span>
          <span class="Button-hover-helper"></span>
          <span class="Button-hover-content" aria-hidden="true">Accept</span>
          <span class="Button-hover-content" aria-hidden="true">Accept</span>
          <span class="Button-hover-content" aria-hidden="true">Accept</span>
          <span class="Button-hover-content" aria-hidden="true">Accept</span>
        </a>

    }
  ]


  const closePop = () => {
    SetOpenPopup("");
  };
  const [OpenPopup, SetOpenPopup] = useState('')

  const cancelBiddingcall = async (data) => {
    let bidder = {
      NFTQuantity: data.Pending

    }

    let item = {
      NFTId: data?.NFTId,
      ContractAddress: data?.ContractAddress,
      ContractType: data?.ContractType,
      NFTName: data?.NFTName,
      CollectionName:data?.CollectionName


    }

    setitem(item)
    setbidder(bidder)
    setopenpopup(true)
  }



  const [acceptowner, setacceptowner] = useState({})
  const [accepbidder, setacceptbidder] = useState({})
  const [accepitem, setaccepitem] = useState({})
  const [acceptapprove, setacceptapprove] = useState(false)

  const ContractCall = useContractProviderHook();

  const AcceptBiddingcall = async (data) => {
    if (data?.PutOnSaleType == "TimedAuction" && new Date(data?.EndClockTime).getTime() > Date.now())
      return toast.error("Please wait till the Timed Auction ends")


    let Statu = await ContractCall.GetApproveStatus(
      data.ContractType == 721 ||
        data.ContractType == "721"
        ? "Single"
        : "Multiple",
      data.ContractAddress
    );
    if (Statu) setacceptapprove(true)
    else setacceptapprove("open")

    let owner = {
      NFTOwner: accountAddress,
      PutOnSale: data.PutOnSale,
      PutOnSaleType: data.PutOnSaleType,

    }

    let bidder = {
      TokenBidderAddress: data.TokenBidderAddress,
      NFTPrice: data.TokenBidAmt,
      CoinName: data.CoinName,
      TokenBidAmt: data.TokenBidAmt,
      Pending: data.Pending,
      ContractType: data.ContractType,
      ContractAddress: data.ContractAddress
    }


    let acceotitem = {
      NFTId: data.NFTId,
      NFTName: data.NFTName,
      ContractAddress: data.ContractAddress,
      ContractType: data.ContractType,
      NFTRoyalty: data.NFTRoyalty,
      NFTCreator: data.NFTCreator,
      CollectionNetwork: data.CollectionNetwork,
      Category: data.Category,
      CollectionName: data.CollectionName,
    }


    let Biddata = {
      isStakeable: data?.isStakeable ? data.isStakeable : false,
      backedValue: data?.backedValue ? data.backedValue : 1
    }
    setacceptowner(owner)
    setacceptbidder(bidder)
    setaccepitem(acceotitem)
    setbiddata(Biddata)
    setopenpopup2(true)


  }




  return (
    <>

      {openpopup && (
        <CancelBids
          bidder={bidder}
          item={item}
          OpenPopup={OpenPopup}
          closePop={closePop}
        />
      )}


      {openpopup2 && (
        <Accept
          owner={acceptowner}
          bidder={accepbidder}
          OpenPopup={OpenPopup}
          closePop={closePop}
          approvestatus={acceptapprove}
          item={accepitem}
          bid={biddata}
        />
      )}
      <Header />
      <Container fluid className='edit_profile_whole_content'>
        <div className='banner_img_align'>
          <img src={userProfile?.Cover ? userProfile?.Cover : require('../app/assets/images/bannerbig.jpg')} />
          {accountAddress == userProfile?.WalletAddress &&

            <Link to='/editProfile'><button className='banner_edit_btn'>
              {/* <input className='choose_file_input_dtls' id="coverupload" type='file' onChange={(e) => CoverImg(e)}/> */}
              <span><i class="fa-solid fa-pen"></i></span> Edit</button></Link>
          }
        </div>
      </Container>
      <Container className="home_container">
        <div className='myitem_img_align'>
          {userProfile && userProfile.Profile ?
            <img className='myitem_small_img' src={userProfile.Profile} /> :
            <img className='myitem_small_img' src={require('../app/assets/images/collection.png')} />
          }
          <div className="prfl_dtls_flex_align">

            <div>
              <p className='prfl_waladdress_align'>{userProfile?.DisplayName ? userProfile?.DisplayName : (userProfile?.WalletAddress)?.slice(0, 10).concat("...")}</p>
              <p className="gray_text"><b>Bio:</b> {(userProfile?.Bio) ? userProfile?.Bio : "Tell the XDSea community a little about yourself"}</p>
            </div>

            {accountAddress == userProfile?.WalletAddress &&
              <Link to="/createCollection/importcollection/Single">
                {/* <button className='import_btn_align mb-2'>Import Collection</button> */}

                <a data-ignore-split="true" class="Button banner_earn_btn_align" id="" tabindex="0" aria-label="">
                  Import Collection
                  <span class="Button-hover-helper"></span>
                  <span class="Button-hover-helper"></span>
                  <span class="Button-hover-helper"></span>
                  <span class="Button-hover-helper"></span>
                  <span class="Button-hover-content" aria-hidden="true">Import Collection</span>
                  <span class="Button-hover-content" aria-hidden="true">Import Collection</span>
                  <span class="Button-hover-content" aria-hidden="true">Import Collection</span>
                  <span class="Button-hover-content" aria-hidden="true">Import Collection</span>
                </a>
              </Link>}
          </div>

        </div>

      </Container>
      <Container fluid>
        <Container className='home_container mt-5'>
          <Row>
            <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
              <Tab.Container id="left-tabs-example" className='all_tabs_align' defaultActiveKey="mynft">
                <Row>


                  <Nav variant="pills" className="flex-row">
                    {/* <Nav.Item className='myitems_tab_navitems'>
              <Nav.Link className='myitems_tab_navlinks' eventKey="first" onClick={() => SetTabName("onsale")}>On Sale</Nav.Link>
            </Nav.Item> */}
                    <Nav.Item className='myitems_tab_navitems'>
                      <Nav.Link className='myitems_tab_navlinks' eventKey="mynft" onClick={() => SetTabName("owned")}>My NFT</Nav.Link>
                    </Nav.Item>

                    <Nav.Item className='myitems_tab_navitems'>
                      <Nav.Link className='myitems_tab_navlinks' eventKey="created" onClick={() => SetTabName("created")}>Created</Nav.Link>
                    </Nav.Item>

                    {/* <Nav.Item className='myitems_tab_navitems'>
              <Nav.Link className='myitems_tab_navlinks' eventKey="favs"  >Favourites</Nav.Link>
            </Nav.Item> */}

                    <Nav.Item className='myitems_tab_navitems'>
                      <Nav.Link className='myitems_tab_navlinks' eventKey="offersreceived" >Offers Received</Nav.Link>
                    </Nav.Item>

                    <Nav.Item className='myitems_tab_navitems'>
                      <Nav.Link className='myitems_tab_navlinks' eventKey="offersmade" >Offers Made</Nav.Link>
                    </Nav.Item>

                   

                  </Nav>

                 

                  <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Tab.Content >
                      <Tab.Pane eventKey="mynft" >
                        <Row>

                         

                          {Tokens["owned"] &&
                            Tokens["owned"]?.list.length > 0 ?
                            (<>
                             
                                <InfiniteScroll
  dataLength={Tokens["owned"]?.list.length} //This is important field to render the next data
  next={LoadMore}
  hasMore={hasMore}
  loader={  <p style={{ textAlign: 'center' }}>
  <b>Loading...</b>
</p>}
  // endMessage={
  //   <p style={{ textAlign: 'center' }}>
  //     <b>Yay! You have seen it all</b>
  //   </p>
  // }
 
> 
                                <div className="row">
                                  {(Tokens["owned"]?.list.map((data, index) => {
                                    return (
                                     

                                      <Col xxl={4} xl={4} lg={4} md={6} sm={12} xs={12}>
                                        <TokenCard
                                          data={data} />
                                      </Col>


                                    )
                                  }
                                  ))}
                                </div>
                              </InfiniteScroll>
                            </>)
                            :
                            <div className="text-center py-5 col-12  ">
                              <div className="text-center py-3  no_items_row">
                                <div className="mt-3">
                                  <span class="address_text">No Items Found</span>
                                </div>
                              </div>
                            </div>

                          }

                        </Row>
                      
                      </Tab.Pane>
                      <Tab.Pane eventKey="created">
                        <Row>


                          {Tokens["created"] &&
                            Tokens["created"]?.list.length > 0 ?
                            (<>
                             
  <InfiniteScroll
  dataLength={Tokens["created"]?.list.length} //This is important field to render the next data
  next={LoadMore}
  hasMore={hasMore}
  loader={  <p style={{ textAlign: 'center' }}>
  <b>Loading...</b>
</p>}
  // endMessage={
  //   <p style={{ textAlign: 'center' }}>
  //     <b>Yay! You have seen it all</b>
  //   </p>
  // }
 
> 
                                <div className="row">
                                  {Tokens["created"]?.list.map((data, index) => {
                                    return (
                                      

                                      <Col xxl={4} xl={4} lg={4} md={6} sm={12} xs={12}>
                                        <TokenCard
                                          data={data} />
                                      </Col>


                                    )
                                  }
                                  )}
                                </div>
                              </InfiniteScroll>
                            </>)
                            :
                            <div className="text-center py-5 col-12  ">
                              <div className="text-center py-3  no_items_row">
                                <div className="mt-3">
                                  <span class="address_text">No Items Found</span>
                                </div>
                              </div>
                            </div>

                          }

                        </Row>
                       


                      </Tab.Pane>
                      <Tab.Pane eventKey="favs">
                        <Row>



                          No Items Found

                        </Row>
                        {/* {Tokens[value]?.loader &&
                    <button className='myitem_loadmore_align mb-3'   onClick={LoadMore}>Load More</button>} */}



                      </Tab.Pane>



                      <Tab.Pane eventKey="offersreceived">
                        <Row>
                          <Col className="mt-4" sm={12}>
                            <div className="offrrcvd_ttl_align">
                              <h6 className="offrrcvd_ttl"><i class="fa-solid fa-arrow-up offrrcvd_arrow" /> &nbsp;Offers Received <i class="bi bi-info-circle offrrcvd_crcle" /></h6>

                            </div>
                            {/* <DataTable   responsive={true} search={true} pagination
                        data={data}
                        columns={columns}
                        // customStyles={tableCustomStyles}
                    /> */}
                            <div className="offrrcvd_tbl_dtl">
                              <ReactDatatable
                                config={configdata}
                                records={receivedoffers}
                                responsive={responsive}
                                columns={columnsdata2}
                                sortable={false}
                              />
                            </div>
                          </Col>


                        
                        </Row>
                        {/* {Tokens[value]?.loader &&
                    <button className='myitem_loadmore_align mb-3'   onClick={LoadMore}>Load More</button>} */}

                      </Tab.Pane>

                      <Tab.Pane eventKey="offersmade">
                        <Row>
                          <Col className="mt-4" sm={12}>
                            <div className="offrrcvd_ttl_align">
                              <h6 className="offrmde_ttl"><i class="fa-solid fa-arrow-up offrmd_arrow" /> &nbsp;Offers made </h6>
                              {/* <p className="offrrcvd_ttl_blue_txt">Cancel all listings and offers <i class="bi bi-info-circle"/></p> */}
                            </div>
                            {/* <DataTable   responsive={true} search={true} pagination
                        data={data1}
                        columns={columns}
                        style={styled}
                        // customStyles={tableCustomStyles}
                    /> */}
                            <div className="offrrcvd_tbl_dtl">
                              <ReactDatatable responsive={responsive}
                                records={myoffers}
                                config={configdata}
                                columns={columnsdata}
                                sortable={false}
                              />
                            </div>
                          </Col>

                         
                        </Row>
                        {/* {Tokens[value]?.loader &&
                    <button className='myitem_loadmore_align mb-3'   onClick={LoadMore}>Load More</button>} */}

                      </Tab.Pane>
                    </Tab.Content>
                  </Col>


                </Row>
              </Tab.Container>

            </Col>
          </Row>


        </Container>

      </Container>
      <Footer />
      <Modal
        show={showListPopup}
        // onHide={handleCloseBurnToken}
        backdrop="static"
        keyboard={false}
        centered
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

export default MyItems