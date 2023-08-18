
import React, { useState, useEffect, useMemo } from "react";
import Web3 from "web3";
import singlecon from "../Abi/erc721.json"
import {
  Col,
  Nav,
  Row,
  Tab,
  Card,
  Button,
  Container,
  Dropdown,
  DropdownButton,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";

import { Box, Grid } from "@mui/material";
import Select from "react-select";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import config from "../config/config.js";
import useContractProviderHook from "../actions/contractProviderHook";
import { toast } from "react-toastify";
import moment from "moment";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import $ from "jquery";

import { isEmpty } from "../actions/common";
import { ImgValidation } from "../actions/validations";
import {
  CollectionByCreator,
  nftCreate,
  createNewCollection,
  validateCollection,
  CollectionDetail
} from "../actions/axioss/nft.axios";
import {
  nftNameValidation,
  NFTImageUpload,
  CreateNFT,
  BulkMintFunc
} from "../actions/axioss/nft.axios";
import {EligibilityBacked} from "../modals/eligibilityBackedValue.js"


toast.configure();

function TabsContent() {
  // const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const selectOptions = [
    "sample",
    "sample1",
    "sample2",
    "sample3",
    "sample4",
    "Create New Collection",
  ];
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "Strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  const options1 = [
    {
      value: "Create New Collection",
      label: "Create New Collection",
      url: "createCollection",
    },
    { value: "chocolate", label: "Chocolate" },

    { value: "vanilla", label: "Vanilla" },
  ];
  const options2 = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  const options3 = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  const options4 = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  const options5 = [
    { value: "Choose specific date", label: "Choose specific date" },
    { value: "1 day", label: "1 day" },
    { value: "2 day", label: "2 day" },
  ];
  const options6 = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const startcalender = [
    {
      value: "Right After Listing",
      label: "Right After Listing",
      id: "RightAfterListing",
    },
    { value: "Pick Specific Date", label: "Pick Start", id: "PickStart" },

    { value: "vanilla", label: "Vanilla" },
  ];

  const endcalender = [
    { value: "1 day", label: "1 day", id: "RightAfterListing" },
    { value: "2 days", label: "2 days", id: "PickStart" },
    {
      value: "Pick Specific Date",
      label: "Pick End Date",
      id: "Pick End Date",
    },
  ];

  const stylesselect = {
    option: (styles, {isFocused, isSelected,siHovered}) => ({
      ...styles,
      color: "white",
      background: isFocused
          ? 'rgba(60,88,203,1)'
          : isSelected
              ? '#262626 '
              : "#262626 ",
      zIndex: 1,
      cursor:"pointer"
  }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: '66px',
      padding: '0 6px',
      backgroundColor: "rgba(60,88,203,1)",
    borderRadius: 30,
    padding:10
    
    }),
    control: (provided, state) => ({
      ...provided,
      height: '66px',
      borderRadius:30,
      backgroundColor: "#fff",
      border:'none'
     
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '66px',
      position: 'absolute',
      right: 0,
      top: 0,
      color:'#fff' 
    }),    
    singleValue: (provided, state) => ({
      ...provided,
      color: "#fff"
    }),
    menuList: base => ({
      ...base,
      // kill the white space on first and last option
      padding: 0
    })
  };
  const styles = {
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      color: "white",
      background: isFocused ? "#414141" : isSelected ? "#414141" : "#414141",

      zIndex: 1,
    }),

    option: (styles, {isHovered }) => {
      // const color = chroma(data.color);
      
      return {
        ...styles,
        backgroundColor: isHovered ? "#999999" : null,
        
      };
    },
    valueContainer: (provided, state) => ({
      ...provided,
      height: "62px",
      padding: "0 6px",
      backgroundColor: "#fff ",

      border: "none",

      borderRadius: 30,
      padding: 10,
    }),
    control: (provided, state) => ({
      ...provided,
      height: "62px",
      borderRadius: 30,

      backgroundColor: "#343434",

      border: "none",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "62px",
      position: "absolute",
      right: 0,
      top: 0,
      color: "#fff",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#fff",
    }),
    menuList: (base) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
    }),
  };
  const gotoUrl = (e) => {
    if (e?.collectionName) {
      GetCollectionDetails(e.collectionName)
      setNFTFormValue({
        ...NFTFormValue,
        ...{ ["CollectionName"]: e.collectionName },
      });
    } else navigate(`/createCollection/gallery/${mintType}`);
  };

  const bulkminttype = (e)=>{

    setNFTFormValue({
      ...NFTFormValue,
      ...{
        ["CollectionName"]: ""
        
      },
    });

    if(e && e?.label == 721 ) setMintType("Single")
    else if(e && e?.label == 1155)  setMintType("Multiple")

    setShowBulkCollections(true)

  }
  const [mintType, setMintType] = useState("Single");
  const [ShowBulkCollections, setShowBulkCollections] = useState(false);
  const [propertycounter, setpropertycounter] = useState(1);



  const { buyerFees, sellerFees } = useSelector(
    (state) => state.LoginReducer.ServiceFees
  );
  const { web3p, web3, accountAddress } = useSelector(
    (state) => state.LoginReducer.AccountDetails
  );

  const { payload } = useSelector((state) => state.LoginReducer.User);
  const { currency, Categorys } = useSelector((state) => state.LoginReducer);

  const navigate = useNavigate();
  const urllocation = useLocation();

  useEffect(() =>{
    window.scrollTo(0,0);
},[])

 

  const initialTokenValue = {
    NFTName: "",
    NFTQuantity: 1,
    NFTOrginalImage: null,
    NFTOrginalImagePreview: null,
    NFTThumpImage: "",
    NFTThumpImagePreview: "",
    NFTOrginalImageIpfs: "",
    NFTThumpImageIpfs: "",
    CompressedFile: "",
    CompressedThumbFile: "",
    NFTDescription: "",
    PutOnSaleType: "UnlimitedAuction",
    PutOnSale: false,
    NFTPrice: 0,
    NFTMinimumBid: 0,
    ClockTime: "",
    EndClockTime: "",
    NFTRoyalty: 0,
    NFTProperties: "",
    NFTCreator: accountAddress,
    NFTOwner: accountAddress,
    HashValue: "",
    MetFile: "",
    MetaData: "",
    ContractAddress: "",
    ContractType: "",
    Category: Categorys.length > 0 && Categorys[0].label,
    CoinName: "",
    UnlockContent: "",
    CollectionName: "",
    CollectionNetwork: config.COIN_NAME,
    CollectionSymbol: "",
  };
  const [NFTFormValue, setNFTFormValue] = useState(initialTokenValue);
  const [ValidateError, SetValidateError] = useState({});
  const [FormButton, SetFormButton] = useState("start");
  const [ApproveButton, SetApproveButton] = useState("start");
  const [BulkButton,SetBulkButton] = useState("start")
  const [BulkMintButton, SetBulkMintButton] = useState(false);
  const [UploadButton, SetUploadButton] = useState("stop");
  const [MintButton, setMintButton] = useState("stop");
  const [eligibiltyButton, seteligibiltyButton] = useState("stop");
  const [theme, setTheme] = useState(false);
  const [show8, setShow8] = useState(false);
  const [location, SetLocation] = useState("");
  const [OpenPopup, SetOpenPopup] = useState("");
  const [CreateCollectionState, SetCreateCollectionState] = useState([]);

  const [listforsalenow, setlistforsalenow] = useState(false);
  const [list, setlist] = useState("timed_auction");
  const [start, setstart] = useState("");
  const [end, setend] = useState("");

  const [previewFile, setPreviewFile] = useState(
    require("../app/assets/images/collection.png")
  );
  const [previewThumbnail, setPreviewThumbnail] = useState(
    require("../app/assets/images/collection.png")
  );
  const [fileType, setFileType] = useState("");
  const [nftFileType, setNftFileType] = useState("");

  const [unlock, setUnlock] = useState(false); // for cursor cehckox
  const [stake, setStake] = useState(false); // for cursor cehckox

  const [activeTab, setActiveTab] = useState(1); // for cursor cehckox  customUrl

  const [useExistingCollection, setUseExistingCollection] = useState(true);
  const [collectioncustomurl, setcollectioncustomurl] = useState("");
  const [collectionProfile, setcollectionProfile] = useState("");
  const [collectionBanner, setcollectionBanner] = useState("");
  const [eligibilitymodal, seteligibilitymodal] = useState(false)
  const [eligibilitydata,seteligibilitydata] = useState({})


  const ContractCall = useContractProviderHook();

  const YouWillGet = useMemo(() => {
    return ContractCall.price_calculation(NFTFormValue.NFTPrice);
  }, [NFTFormValue.NFTPrice]);


  useEffect(() => {
    let path = mintType == "Single" ? "Single" : "Multiple";
    SetLocation(path);
    let type = mintType == "Single" ? 721 : 1155;
    let Addr = mintType == "Single" ? config.ERC721 : config.ERC1155;
    setNFTFormValue({
      ...NFTFormValue,
      ...{
        ["ContractAddress"]: Addr,
        ["ContractType"]: type,
      },
    });

    CollectionByCreate({
      Type: mintType == "Single" ? 721 : 1155,
      Creator: accountAddress,
    });
  }, [accountAddress, mintType]);

  // input field onchange function
  const onChange = (e, type, isBulkMint) => {
  
    SetFormButton("start");
    SetValidateError({});
    if (e && e.target && !e.target.files) {
      const { files, value, id, name } = e.target;
      setNFTFormValue({ ...NFTFormValue, ...{ [id]: value } });
    }
    if (e.target.files) {
      var files = e.target.files;

      // var reader = new FileReader()
      var file = files[0];
      var validExtensions =
        type == "Orginal"
          ? [
              "png",
              "gif",
              "webp",
              "mp4",
              // "PNG",
              "jpg",
              // "JPEG",
              "jpeg",
              // "JPG",
              "mp3",
              "aac",
              // "AAC",
              "flac",
              // "FLAC",
              // "WEBM",
              "webm",
              "ogv",
              // "OGV",
            ]
          : ["png", "gif", "webp", "jpg", "jpeg", 
            //  "JPG","PNG"
            ];

      var fileName = file.name;
      var fileNameExt = fileName.substr(fileName.lastIndexOf(".") + 1);

      var fileformat = file.type.split("/"); // image/video/audio
      var filetype = fileformat[0];


      if (!validExtensions.some((val) => fileNameExt === val)) {
        toast.error(
          "Only these file types are accepted : " + validExtensions.join(", ")
        );
      }
      if (type == "Orginal") {
        if(!isBulkMint) NFTFormValue["NFTOrginalImage"] = files[0];
        else NFTFormValue["NFTOrginalImage"] = files;

        setPreviewFile(URL.createObjectURL(files[0]));
        setFileType(filetype);
        setNftFileType(filetype);
        // setNFTFormValue({
        //   ...NFTFormValue,
        //   ...{ ["NFTOrginalImage"]: files[0] },
        // });
      }
      if (type == "Thump") {

        if(!isBulkMint) NFTFormValue["NFTThumpImage"] = files[0];
        else NFTFormValue["NFTThumpImage"] = files;

        //  setPreviewThumbnail(URL.createObjectURL(files[0]))
        setPreviewFile(URL.createObjectURL(files[0]));
        setFileType("image");

        // setNFTFormValue({
        //   ...NFTFormValue,
        //   ...{ ["NFTThumpImage"]: files[0] },
        // });
      }
    }
    if (NFTFormValue.NFTCreator == "") {
      setNFTFormValue({
        ...NFTFormValue,
        ...{ ["NFTCreator"]: accountAddress, ["NFTOwner"]: accountAddress },
      });
    }
  };

  //NFT mint validation function
  const Validation = async (data,bulkstats) => {
    try {
      let ValidateError = {};
      const {
        NFTName,
        NFTOrginalImage,
        NFTThumpImage,
        NFTPrice,
        EndClockTime,
        ClockTime,
        NFTRoyalty,
        Category,
        PutOnSaleType,
        PutOnSale,
        CoinName,
        NFTQuantity,
        ContractType,
        CollectionName,
        NFTCreator,
      } = data;
      // collection validation
 
      if (!CollectionName ||  CollectionName == "")
        ValidateError.collectionname = "Collection Name Required";

      /// ---> nft validatoion
      if (!NFTRoyalty) ValidateError.NFTRoyalty = "Royalty Required";
      else if (isEmpty(NFTRoyalty))
        ValidateError.NFTRoyalty = "Royalty Must Be Greate Than 0";
      else if (isNaN(NFTRoyalty) === true)
        ValidateError.NFTRoyalty = "Royalty must be a number";
      else if (String(NFTRoyalty).includes("."))
        ValidateError.NFTRoyalty = "Royalty must be a whole number";
      else if (Number(NFTRoyalty) > 100)
        ValidateError.NFTRoyalty = "Royalty must be less than 100 %";

      if (!NFTName || NFTName == "") {
        ValidateError.NFTName = "Token Name Required";
      }
      if (
        (PutOnSaleType == "FixedPrice" || PutOnSaleType == "TimedAuction") &&
        isEmpty(NFTPrice)
      )
        ValidateError.NFTPrice = "NFTPrice Required";
      if (
        (PutOnSaleType == "FixedPrice" || PutOnSaleType == "TimedAuction") &&
        !CoinName
      )
        ValidateError.CoinName = "CoinName Required";
      if (PutOnSaleType == "TimedAuction" && !ClockTime)
        ValidateError.ClockTime = "ClockTime Required";
      if (PutOnSaleType == "TimedAuction" && !EndClockTime)
        ValidateError.EndClockTime = "EndClockTime Required";
      if(PutOnSaleType == "TimedAuction" && ClockTime > EndClockTime)
        ValidateError.EndClockTime = "Auction Ending time should be more than starting time.";

      if (!Category) ValidateError.Category = "Category Required";


      //image validations
      if(!bulkstats){

      if (!NFTOrginalImage)
        ValidateError.NFTOrginalImage = "Original File Required";
      else {
        if (ImgValidation(NFTOrginalImage, "pro"))
          ValidateError.NFTOrginalImage = ImgValidation(NFTOrginalImage, "pro");
        if (
          (NFTOrginalImage.type.includes("video") ||
            NFTOrginalImage.type.includes("audio")) &&
          !NFTThumpImage
        )
          ValidateError.NFTThumpImage = "ThumbFile Required";
        else if (NFTThumpImage)
          if (ImgValidation(NFTThumpImage, "thumb"))
            ValidateError.NFTThumpImage = ImgValidation(NFTThumpImage, "thumb");
      }}
      else{
        if (!NFTOrginalImage)
        ValidateError.NFTOrginalImage = "OriginalFile Required";
      else {
        if (ImgValidation(NFTOrginalImage[0], "pro"))
          ValidateError.NFTOrginalImage = ImgValidation(NFTOrginalImage, "pro");
        if (
          (NFTOrginalImage[0].type.includes("video") ||
            NFTOrginalImage[0].type.includes("audio")) &&
          !NFTThumpImage
        )
          ValidateError.NFTThumpImage = "ThumbFile Required";
        else if (NFTThumpImage[0])
          if (ImgValidation(NFTThumpImage[0], "thumb"))
            ValidateError.NFTThumpImage = ImgValidation(NFTThumpImage[0], "thumb");
      }
      }
      if (isNaN(NFTPrice) === true)
        ValidateError.NFTPrice = "NFT Price Should Be a Number";
      else if (
        (PutOnSaleType == "FixedPrice" || PutOnSaleType == "TimedAuction") &&
        Number(NFTPrice) <= 0
      ) {
        ValidateError.NFTPrice = "NFTPrice should be above Zero";
      }

      if (ContractType === 1155 || ContractType === "1155") {
        if (Number(NFTQuantity) % 1 !== 0) {
          ValidateError.NFTQuantity = 'Quantity must be a Valid number';
        }
        else if(NFTQuantity == 0 || (NFTQuantity == "0")){
          ValidateError.NFTQuantity = 'Quantity must be a greater than zero';

        }
      }

      return ValidateError;
    } catch (err) {
    }
  };
  const FormSubmit = async (bulkmintstatus) => {
    SetValidateError({});
    const id = toast.loading("Validating Form");
    if(!bulkmintstatus)
       var Error = await Validation(NFTFormValue);
    else  
        var Error = await Validation(NFTFormValue,true);


    if (isEmpty(Error)) {

      SetFormButton("process");
      let Resp = await nftNameValidation({
        NFTName: NFTFormValue.NFTName,
      });
      if (Resp.success != "success") {
        // SetFormButton("try")
        return toast.update(id, {
          render: "TokenName Exists try a Different name",
          type: Resp.success,
          isLoading: false,
          autoClose: 5000,
        });
      }

      toast.update(id, {
        render:
          Resp.success == "success"
            ? "Ready To Mint"
            : "TokenName Exists try a Different name",
        type: Resp.success,
        isLoading: false,
        autoClose: 1000,
      });
      if (Resp?.success == "success") {
        let Respc = await ContractCall.Contract_Base_Validation();

        if (!Respc) {
  

          let Statu = await ContractCall.GetApproveStatus(
            location,
            NFTFormValue.ContractAddress
          );
          if (Statu == true) {
            SetApproveButton("stop");
            SetUploadButton("start");
            if(bulkmintstatus) SetBulkMintButton(true)
          } else {
            SetApproveButton("start");
            if(bulkmintstatus) SetBulkMintButton(true)
            toast.update(id, {
              render: "Get APProve",
              type: "success",
              isLoading: false,
              autoClose: 1000,
            });

          }
        } else {
          SetFormButton("error");
          SetValidateError(Respc);
        }
      }
      setShowMint(true);
      // setShow8(true);
      //  window.$("#create_item_modal").modal("show");
    } else {
      SetFormButton("error");
      SetValidateError(Error);
      
      toast.update(id, {
        render: "Form Validation failed Check Fields and Submit again",
        type: "error",
        isLoading: false,
        autoClose: 500,
      });
   
    }
  };
  //NFT Initial Approve
  const TokenApproveCall = async () => {
    SetApproveButton("process");
    const id = toast.loading("Approve in process");
    const cont = await ContractCall.SetApproveStatus(
      location,
      NFTFormValue.ContractAddress
    );
    toast.update(id, {
      render: cont ? "Approved Successfully" : "Approved Failed",
      type: cont ? "success" : "error",
      isLoading: false,
      autoClose: 1000,
    });
    if (cont.status) {
      // SetApproveButton("done");
      SetApproveButton("stop");
      SetUploadButton("start");
    } else SetApproveButton("try");
  };

  //Upload image in IPFS
  async function UploadIPFScall() {
    const {
      NFTCreator,
      NFTThumpImage,
      NFTOrginalImage,
      NFTName,
      NFTDescription,
    } = NFTFormValue;
    SetUploadButton("process");
    const id = toast.loading("Uploading  File");
 
    let Resp = await NFTImageUpload({
      NFTCreator: NFTCreator ? NFTCreator : accountAddress,
      NFTThumpImage,
      NFTOrginalImage,
      NFTName,
      NFTDescription,
    });
    if (Resp.success == "success") {
      toast.update(id, {
        render: "Successfully Updated",
        type: Resp.success,
        isLoading: false,
        autoClose: 1000,
      });
      setNFTFormValue({ ...NFTFormValue, ...Resp.data });
      SetUploadButton("done");
      setMintButton("start");
    } else {
      SetUploadButton("try");
      toast.update(id, {
        render: "Try Again",
        type: Resp.success,
        isLoading: false,
        autoClose: 1000,
      });
    }
    
  }

  
  async function MintCall() {
    const id = toast.loading("Minting Processing");
    setMintButton("process");
    var _data = NFTFormValue;
    _data.activity = "Mint";
    let ENc = window.btoa(JSON.stringify(_data));
    const cont = await ContractCall.minting_721_1155(
      config.IPFS + NFTFormValue.MetaData,
      [
        NFTFormValue.NFTQuantity,
        NFTFormValue.ContractType,
        web3?.utils.toWei(NFTFormValue.NFTRoyalty),
        web3.utils.toWei(
          (NFTFormValue.PutOnSaleType == "FixedPrice"
            ? NFTFormValue.NFTPrice
            : "0"
          ).toString()
        ),
        0,
      ],

      ENc
    );
    if (cont) {
      _data.HashValue = cont.HashValue;
      _data.NFTId = cont?.tokenCounts?.toString();
      _data.click = `${config.FRONT_URL}/info/${
        NFTFormValue.CollectionNetwork
      }/${
        NFTFormValue.ContractAddress
      }/${accountAddress}/${cont?.tokenCounts?.toString()}`;

      _data.fileType = nftFileType;

      let Resp = await CreateNFT(_data);
      if (Resp.success == "success") {
        toast.update(id, {
          render: "Successfully Minted",
          type: Resp.success,
          isLoading: false,
          autoClose: 1000,
        });
        setMintButton("done");

       if( isCollectionStakeable?.stakingpool?.walletAddress ){
        let data =  { 
        stakingContract:isCollectionStakeable?.stakingpool?.walletAddress ?? "",
        tokenId:_data.NFTId?[_data.NFTId ] : "",
        NFTOwner:_data.NFTOwner,
        poolid:isCollectionStakeable?.stakingpool?._id,
        CollectionName:_data.CollectionName
        }
        seteligibilitydata(data)
        seteligibilitymodal(true)
        setShowMint(false)
      }else{
        setShowMint(false)
        navigate("/explore/All");

      }


        // push("/user/" + payload.CustomUrl ? payload.CustomUrl  : payload.ProfileUrl  );
      } else {
        toast.update(id, {
          render: "Transaction Failed",
          type: "error",
          isLoading: false,
          autoClose: 1000,
        });
        setMintButton("try");
      }
    } else {
      toast.update(id, {
        render: "Transaction Failed",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      setMintButton("try");
    }
  }
  // to get list of collections created by user based on type

  const CollectionByCreate = async (data) => {
    let Resp = await CollectionByCreator(data);

    SetCreateCollectionState(Resp?.data);
  };

  const CurrecyChange = () => {
    if (NFTFormValue.PutOnSaleType === "FixedPrice")
      NFTFormValue.CoinName = currency[0]?.label;
    else if (NFTFormValue.PutOnSaleType === "TimedAuction")
      NFTFormValue.CoinName = currency[1]?.label;
    else NFTFormValue.CoinName = "";
  };

  const DiscardAll = () => {
    setNFTFormValue(initialTokenValue);
    // NFTPrice.val('')
  };

  const checkPutOnSale = (putonsale) => {
    if (!putonsale) {
      setNFTFormValue({
        ...NFTFormValue,
        ...{
          ["PutOnSale"]: putonsale,
          ["PutOnSaleType"]: "UnlimitedAuction",
          ["NFTPrice"]: 0,
          ["NFTMinimumBid"]: 0,
          ["ClockTime"]: "",
          ["EndClockTime"]: "",
          ["CoinName"]: "",
        },
      });
    } else {
      setNFTFormValue({
        ...NFTFormValue,
        ...{
          ["PutOnSale"]: putonsale,
        },
      });
    }
  };

  /// calendar Functionalities

  var yesterday = moment().subtract(1, "day");
  const [AucCalendar, setAucCalender] = useState("Start"); // to select start or end calendar
  const [PicStartselected, setPicStartselected] = useState(false); // to cehck if specfic date picked in start listing
  const [AuctionStart, setAuctionStart] = useState(null); //  state to maintain start clocktime
  const [AuctionEnd, setAuctionEnd] = useState(null); //  state to maintain End clocktime

  //// -----> used for "right after listing ", 1 day, 2 days
  const CalAction = (a, day) => {
    var myDate = new Date();
    var newdat = myDate.setDate(myDate.getDate() + parseInt(day));
    var newdate = new Date(newdat);
    newdate = moment(newdate).format("YYYY-MM-DD HH:mm:ss");
    if (a === "now") {
      setAuctionStart(newdate);
      setNFTFormValue({
        ...NFTFormValue,
        ...{
          ["ClockTime"]: newdate,
        },
      });
    } else {
      setAuctionEnd(newdate);
      setNFTFormValue({
        ...NFTFormValue,
        ...{
          ["EndClockTime"]: newdate,
        },
      });
    }
  };

  // ------> isvalidate in calender_modal (to restrict date selection)
  var valid = function (current) {
    if (AucCalendar === "Start" && AuctionEnd === null)
      return current.isAfter(yesterday);
    else if (AuctionStart !== null)
      return current.isAfter(new Date(AuctionStart));
    else if (AuctionEnd !== null)
      return (
        current.isAfter(yesterday) && current.isBefore(new Date(AuctionEnd))
      );
    else return current.isAfter(moment());
  };

  //-----> onchange function for date picker
  const Auctionset = (date) => {
    var datesel = new Date(date);
    datesel = moment(datesel).format("YYYY-MM-DD HH:mm:ss");
    if (AucCalendar === "Start") {
 

      setAuctionStart(datesel);
      setNFTFormValue({
        ...NFTFormValue,
        ...{
          ["ClockTime"]: datesel,
        },
      });
    } else {
      setAuctionEnd(datesel);
      setNFTFormValue({
        ...NFTFormValue,
        ...{
          ["EndClockTime"]: datesel,
        },
      });
    }
  };

  // popup controle
  const [showMint, setShowMint] = useState(false);
  const [showCalender, setShowCalender] = useState(false);

  const handleCloseMint = () => setShowMint(false);
  const handleShowMint = () => setShowMint(true);

 


  ///image preview states

  const [imgpreview,setimagepreview] = useState(false)

  const BulkMintCall = async()=>{
    NFTFormValue["fileType"] =  nftFileType
    if(nftFileType != "image"){
      if(NFTFormValue["NFTOrginalImage"].length != NFTFormValue["NFTThumpImage"].length)
         return toast.error("no of thumbnails should match with no of nfts.")
    }

    try{
        SetBulkButton("process")

        var Resp = await BulkMintFunc(NFTFormValue)
        if(Resp?.success == "success"){
          var nfts = Resp?.data
          var ipfsArr = Resp?.ipfs
          SetBulkButton("mint")

          if(nfts[0].ContractType == 721 || nfts[0].ContractType == "721"){

            var resp = await ContractCall.BulkMint_721_1155(
              nfts[0].ContractType,
              nfts[0].ContractAddress,
              ipfsArr,
              nfts.length,
              nfts[0].NFTRoyalty
              )


             
          }else{
            var resp = await ContractCall.BulkMint_721_1155(
              nfts[0].ContractType,
              nfts[0].ContractAddress,
              ipfsArr,
              nfts[0].NFTRoyalty,
              nfts.length,
              nfts[0].NFTQuantity
              )

          }
 
          if(resp){
            await Promise.all(
              await resp?.NftIdArray?.map((id,index)=>{
              nfts[index].HashValue = resp.HashValue;
              nfts[index].NFTId = id;
              nfts[index].PutOnSale = 'true';
              nfts[index].PutOnSaleType = 'UnlimitedAuction';
              nfts[index].click = `${config.FRONT_URL}/info/${
                                     nfts[index].CollectionNetwork}/${
                                     nfts[index].ContractAddress
                                    }/${accountAddress}/${id}`;
             CreateNFT(nfts[index]);
            
             }),
             SetBulkButton("done"),
             setTimeout(toast.success("Successfully minted"),200),
            //  setShowMint(false)
            )

            if(isCollectionStakeable?.stakingpool?.walletAddress && isCollectionStakeable?.data?.Creator == accountAddress){

         let data =  { 
        stakingContract:isCollectionStakeable?.stakingpool?.walletAddress ?? "",
        tokenId: resp?.NftIdArray ?? "",
        NFTOwner:accountAddress,
        poolid:isCollectionStakeable?.stakingpool?._id,
        CollectionName:nfts[0].CollectionName
        }
        seteligibilitydata(data)
        seteligibilitymodal(true)
        setShowMint(false)
      }else{
        setShowMint(false)
        setTimeout(() => {
          navigate(`/my-item/${payload.CustomUrl}`)
        }, 300);


      }
            

          }
           

        }else{
          SetBulkButton("try")

        }

    }catch(err){
        SetBulkButton("try")

    }




   }


   const [propState,setPropState] = useState([{}])
   const [CollectionDetails,setCollectionDetails] = useState([{}])

   const addproperties  = async(e,index,filter)=>{
    propState[index][filter] = e.target.value

   setNFTFormValue({
    ...NFTFormValue,
    ...{
      ["NFTProperties"]: propState,
    },
  });

   }

  const [isCollectionStakeable,setisCollectionStakeable]= useState({})

  const GetCollectionDetails = async(collectionname)=>{

    var resp = await CollectionDetail({ Creator: accountAddress,collectionName:collectionname})
    setisCollectionStakeable(resp)
 
  }


  return (
    <>
  
  {/* update elgibility and backed values modal\ */}


{
         eligibilitymodal &&
          <EligibilityBacked
          data = { eligibilitydata}
            
          />
        }
      <Container>
        <Tab.Container
          id="left-tabs-example"
          className="all_tabs_align"
          defaultActiveKey="first"
        >
          <Row className="pt-4 mt-3">
            <Col sm={12} className="all_tabs_srcoll_align">
              <Nav variant="pills" className="flex-row">
                <Nav.Item className="tab_content_navitem me-5 mb-3">
                  <Nav.Link eventKey="first" className="tab_content_navlink">
                    <div
                      className="create_pg_tab_one"
                      onClick={() => {
                        setMintType("Single")
                        setimagepreview(false)
                        setPreviewFile( require("../app/assets/images/collection.png"))
                        setPreviewThumbnail(require("../app/assets/images/collection.png"))
                        NFTFormValue["NFTOrginalImage"] = ""
                        NFTFormValue["NFTThumpImage"] = ""

                      }}

                    >
                      <div className="create_pg_tab_one_img">
                        <img
                          src={require("../app/assets/images/single_create.png")}
                        />
                      </div>
                      <p className="create_single_text me-5">Create Single</p>
                      {/* <p className='create_single_text me-5' onClick={()=>{
                            window.$("#calendar_modal").modal("show")
                            // alert("dsll")
                        }}>Crea</p> */}
                    </div>
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item className="tab_content_navitem me-5 mb-3">
                  <Nav.Link eventKey="second" className="tab_content_navlink">
                    <div
                      className="create_pg_tab_one"
                      onClick={() => {
                        setMintType("Multiple")
                        setimagepreview(false)
                        setPreviewFile( require("../app/assets/images/collection.png"))
                        setPreviewThumbnail(require("../app/assets/images/collection.png"))
                        NFTFormValue["NFTOrginalImage"] = ""
                        NFTFormValue["NFTThumpImage"] = ""
                      
                      }}
                    >
                      <div className="create_pg_tab_one_img">
                        <img
                          src={require("../app/assets/images/create_multiple.png")}
                        />
                      </div>
                      <p className="create_single_text me-5">Create Multiple</p>
                    </div>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="tab_content_navitem me-5 mb-3">
                  <Nav.Link eventKey="third" className="tab_content_navlink">
                    <div
                      className="create_pg_tab_one"
                      onClick={() => {
                        setimagepreview(false)
                        setPreviewFile( require("../app/assets/images/collection.png"))
                        setPreviewThumbnail(require("../app/assets/images/collection.png"))
                        NFTFormValue["NFTOrginalImage"] = ""
                        NFTFormValue["NFTThumpImage"] = ""
                      
                      }}
                       
                    >
                      <div className="create_pg_tab_one_img">
                        <img
                          src={require("../app/assets/images/bulkmint.png")}
                        />
                      </div>
                      <p className="create_single_text me-5">Bulk Minting</p>
                    </div>
                  </Nav.Link>
                </Nav.Item>
       
               
              </Nav>
            </Col>
            <Col sm={12}>
              <Tab.Content className="create_pg_tabContent pt-5 pb-5">
                <Tab.Pane eventKey="first">
                  <Row>
                    <Col xxl={4} xl={4} lg={4} md={6} sm={12}>
                      <h5 className="upld_fle_ttle">Upload File</h5>
                      <div className="input_file_area_align mt-5 p-3">
                        <div className="input_file_area">
                          <h6 className="text-center">Upload your NFT</h6>
                          <small className="category_hint_txt text-center px-1 mt-5">
                            Common file types for NFTs include JPEG,PNG,GIF,BMP,MP4 Or MOV.
                          </small>
                          {/* <h6 className="text-center mt-1">Max 50mb.</h6> */}
                          <div className="w-100 create_btn_align">



                          
                            
                            {/* <a data-ignore-split="true" type="button" class="Button"  id="" onclick="" tabindex="0" aria-label="">
                            <input
                                type="file"
                                className="choose_file_input_dtls "
                                name="file"
                                id="NFTOrginalImage"
                                accept="audio/*,video/*,image/*"
                                onChange={(e) => onChange(e, "Orginal")}
                              />
    View Collections
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    
  </a> */}

  
                            







                            <button className="choose_file_btn " onClick={()=>{setimagepreview(true)}}>
                              Upload file
                              <input
                                type="file"
                                className="choose_file_input_dtls "
                                name="file"
                                id="NFTOrginalImage"
                                accept="audio/*,video/*,image/*"
                                onChange={(e) => onChange(e, "Orginal")}
                              />
                            </button>
                            {(fileType == "video" || fileType == "audio") && (
                              <button className="choose_file_btn thumbnail_btn mt-5">
                                Pick Thumbnail
                                <input
                                  className="choose_file_input_dtls"
                                  type="file"
                                  name="file"
                                  id="NFTThumpImage"
                                  accept="audio/*,video/*,image/*"
                                  onChange={(e) => {
                                    onChange(e, "Thump");
                                  }}
                                />
                              </button>
                            )}
                          </div>
                          {ValidateError.NFTOrginalImage && (
                            <span className="text-danger text-center img-file">
                              {ValidateError.NFTOrginalImage}
                            </span>
                          )}
                          {ValidateError.NFTThumpImage && (
                            <span className="text-danger text-center img-file">
                              {ValidateError.NFTThumpImage}
                            </span>
                          )}
                        </div>
                        {imgpreview &&
                        <div className="img_show_div_align">
                        {fileType == "video" ? (

                        <video  controls controlsList="nodownload" autoPlay='true' muted>
  <source src={previewFile} type="video/mp4"></source>
  </video>):
   fileType == "audio" ? (
    <audio
      src={previewFile}
      alt="collections"
      autoPlay={false}
      muted={true}
      controls
    />
  ) : 
  <img src={previewFile}/>}
                      </div>}
                        
                      </div>
                      {imgpreview &&

<div className="clear_preview_align">
<a data-ignore-split="true" class="Button"  id="" onClick={()=>{
                        setimagepreview(false)
                        setPreviewFile( require("../app/assets/images/collection.png"))
                        setPreviewThumbnail(require("../app/assets/images/collection.png"))
                        }} tabindex="0" aria-label="">
Clear Preview
<span class="Button-hover-helper"></span>
<span class="Button-hover-helper"></span>
<span class="Button-hover-helper"></span>
<span class="Button-hover-helper"></span>
<span class="Button-hover-content" aria-hidden="true">Clear Preview</span>
<span class="Button-hover-content" aria-hidden="true">Clear Preview</span>
<span class="Button-hover-content" aria-hidden="true">Clear Preview</span>
<span class="Button-hover-content" aria-hidden="true">Clear Preview</span>
</a>
</div>
                      // <button onClick={()=>{
                      //   setimagepreview(false)
                      //   setPreviewFile( require("../app/assets/images/collection.png"))
                      //   setPreviewThumbnail(require("../app/assets/images/collection.png"))
                      //   }} className="create_item_single_btn">Clear Preview</button>
}
                      
                      {/* <h5 className="mt-4">Note:</h5>
                      <p className="service_fee_txt">
                        Service Fee : {web3?.utils?.fromWei(sellerFees)}%
                      </p>

                      <span className="receive_amnt_txt">
                        You Will Receive : {YouWillGet} {NFTFormValue?.CoinName}
                      </span> */}

                      {/* <div className="view_collection_card d-flex justify-content-center mt-5 w-100">
                        <Grid item xxl={3} xl={3} lg={3} md={6} sm={6} xs={12}>
                          <Box className="card card_align">
                            {fileType == "video" ? (
                              <video
                                src={previewFile}
                                alt="collections"
                                autoPlay={true}
                                muted={true}
                                controls
                              />
                            ) : fileType == "audio" ? (
                              <audio
                                src={previewFile}
                                alt="collections"
                                autoPlay={false}
                                muted={true}
                                controls
                              />
                            ) : (
                              <img
                                src={previewFile}
                                className="mui-img-fluid"
                              />
                            )}
                            <Box className="collection-info collection_info_bg">
                              <p className="collections-title">
                                {NFTFormValue?.NFTName
                                  ? NFTFormValue?.NFTName
                                  : "xdsea nft"}
                              </p>
                              <p className="collections-description">
                                {NFTFormValue?.CollectionName
                                  ? NFTFormValue?.CollectionName
                                  : "xdsea collection"}
                              </p>
                            </Box>
                          </Box>
                          <Box className="collection-button">
                            <button className="banner-button">View NFT</button>
                          </Box>
                        </Grid>
                      </div> */}
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={6} sm={12}>
                      <Row>
                        <Col xxl={6} xl={6} lg={6} md={12} sm={12}>
                          <p className="upld_sub_hnt">Item details</p>
                          <div className="input_dtls_area_one w-100 mt-5">
                            <label
                              for="baseName"
                              className="baseName_label w-100 mb-2"
                            >
                              Name your NFT
                            </label>
                            <br />
                           
                            <input
                              type="text"
                              className="w-100 baseName_input"
                              onChange={onChange}
                              id="NFTName"
                              placeholder="Enter name"
                            />
                             {ValidateError.NFTName && (
                              <span className="text-danger img-file">
                                {ValidateError.NFTName}
                              </span>
                            )}

                            <label
                              for="selectCollection"
                              className="baseName_label w-100 mt-5 mb-2"
                            >
                              Which collection does this NFT
belong to?
                            </label>
                            <br />
                            {/* <select className='normal_drpdwn_align'  form="carform">
    <option>Select a collection</option>

      {CreateCollectionState && CreateCollectionState.map((item, index) =>{
        return(
          <>
          <option onClick={() =>
            setNFTFormValue({
              ...NFTFormValue,
              ...{ ["CollectionName"]: item.collectionName },
            })}>{item.collectionName}</option>
          
          </>
        )
        
      })}
    <option onClick={()=>navigate("/createCollection/gallery")}>Create collection</option>

  
  
</select> */}
                            <Select
                              options={CreateCollectionState}
                              onChange={(e) => gotoUrl(e)}
                              styles={styles}
                              className="border_blue_select"
                              classNamePrefix="react-select"
                              placeholder='Choose or create new collection'
                         
                            />
                            <div>
                              {ValidateError.collectionname && (
                                <span className="text-danger img-file">
                                  {ValidateError.collectionname}
                                </span>
                              )}
                            </div>

                            <label
                              for="selectCollection"
                              className="baseName_label w-100 mt-5 mb-2"
                            >
                              Category
                            </label>

                            <small className="category_hint_txt">NFT marketplace categories can include art, music, sports, gaming,
collectibles, virtual real estate, celebrity, memes etc</small>
                            <br />
                            <Select
                              options={Categorys.filter((item)=>item.label != "Staking")}
                              
                              placeholder='Select Category...'
                              onChange={(e) =>
                                setNFTFormValue({
                                  ...NFTFormValue,
                                  ...{ ["Category"]: e.label },
                                })
                              }
                              label="Select or type name"
                              styles={styles}
                              className="border_blue_select"
                              classNamePrefix="react-select"
                            />
                            {ValidateError.Category && (
                              <span className="text-danger img-file">
                                {ValidateError.Category}
                              </span>
                            )}

                            
                          </div>
                        </Col>
                        <Col xxl={6} xl={6} lg={6} md={12} sm={12}>
                          <div className="input_dtls_area_one w-100 mt-5">
                            <label
                              for="desciption"
                              className="baseName_label w-100 mt-4 mb-2"
                            >
                              Description
                            </label>
                            <br />
                            <textarea
                              className="w-100 input_three_textarea"
                              rows="7"
                              onChange={onChange}
                              id="NFTDescription"
                              // value={NFTFormValue.NFTDescription}

                              placeholder="Share the story of this NFT, what is it, the idea or inspiration..."
                              autoComplete="off"
                            ></textarea>

                            <label
                              for="selectCollection"
                              className="baseName_label number_of_copies w-100  mb-2"
                            >
                              Royalty %
                            </label>
                            <span className="category_hint_txt">Royalties in NFTs allow creators to earn a percentage of
the sale price each time their digital artwork is resold.</span>
                            <br />
                            <input
                              type="text"
                              className="w-100 baseName_input"
                              onChange={onChange}
                              id="NFTRoyalty"
                              // value={NFTFormValue.NFTRoyalty}
                              placeholder="A typical artist royalty ranges from 0-20%..."
                            />
                            {ValidateError.NFTRoyalty && (
                              <span className="text-danger img-file">
                                {ValidateError.NFTRoyalty}
                              </span>
                            )}
                            {mintType == "Multiple" && (
                              <>
                                <label
                                  for="selectCollection"
                                  className="baseName_label mt-5 w-100  mb-2"
                                >
                                  Number of Copies
                                </label>
                                <br />
                                <input
                                  type="text"
                                  className="w-100 baseName_input"
                                  onChange={onChange}
                                  id="NFTQuantity"
                                  // value={NFTFormValue.NFTQuantity}
                                  placeholder="e.g. 1"
                                  autoComplete="off"
                                  maxLength={3}
                                />
                              </>
                            )}
                            {ValidateError.NFTQuantity && (
                              <span className="text-danger img-file">
                                {ValidateError.NFTQuantity}
                              </span>
                            )}
                          </div>
                        </Col>
                        <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
                          <div className="input_dtls_area_one w-100">
                        <label
                              for="selectCollection"
                              className="baseName_label label_optinal_align w-100 mt-5 mb-2"
                            >
                              Properties
                              <small className="prprt_hint_txt">Optional</small>
                            </label>
                            <small className="category_hint_txt">Properties are like special things you can add to your NFTs to make them even cooler which decides the rarity of your NFT. Rarity refers to how unique and scarce an NFT is compared to others in the same collection and is often a key factor in determining its value.<br/> 
                            For example:<br/> 
                            Property Name: Gender; Property Value: Male</small>
                            <br />
                            <Row className="gx-2">
                              {([...Array(propertycounter)]).map((data,index)=>{
                                return(
                                  <>
                                    
                              <Col className="h-100 mb-2" xxl={3} xl={3} lg={6} md={6} sm={12} xs={12}>
                              <div className="prprt_tri_btn">
                              <input className="prprt_name_inp_align" type='text' placeholder="Property Name" onChange={(e)=>{addproperties(e,index,"property")}}/>
                              <input className="prprt_value_inp_align mt-2" type='text' placeholder="Property Value" onChange={(e)=>{addproperties(e,index,"value")}}/>
                            </div>

                                </Col>

                         
                           



                              </>
                                )
                         
                              })}
                               <Col className="h-100 mb-2" xxl={3} xl={3} lg={6} md={6} sm={12} xs={12}>

<div className="prprt_tri_add_btn" onClick={()=>{
var inc_count = propertycounter +1
setpropertycounter(inc_count)
propState.push({})
}}>
<i class="fa-solid fa-plus plussess"/>
<small className="prprt_addmore_txt">Add more</small>  
</div>
</Col>
                                </Row>
                                      

                               

                                                   

                            
                            

                            
                            {/* <input
                              type="text"
                              className="w-100 baseName_input"
                              onChange={onChange}
                              id="NFTProperties"
                              value={NFTFormValue.NFTProperties}
                              autoComplete="off"
                              placeholder="e.g. size"
                            /> */}
                            {/* <Select
                                                
                                                
                                                options={options4}
                                                styles={styles} className="border_blue_select"
                                            /> */}
                                            </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xxl={12} xl={12} lg={12} md={12} sm={12}>
                          <div className="whole_unlockable_content mt-5 d-flex justify-content-between">
                            <div className="unlockable_content">
                              <h5>Add Unlockable Content</h5>
                              <small className="category_hint_txt">Unlockable content in NFTs refers to additional digital assets or experiences that are made available to the owner of the NFT after
purchase through a special code or link included</small>
                            </div>
                            <div className="toggle_switch">
                              <label class="switch">
                                <input
                                  type="checkbox"
                                  id="unlockoncepurchased"
                                  name="unlockoncepurchased"
                                  autoComplete="off"
                                  onChange={() => {
                                    setUnlock(!unlock);
                                  }}
                                />
                                <span class="slider round"></span>
                              </label>
                            </div>
                          </div>
                          {unlock && (
                            <div className="form-group input_dtls_area_one unlock_sec">
                              <input
                                type="text"
                                className="form-control w-100 baseName_input primary_inp mt-4"
                                name="UnLockcontent"
                                id="UnLockcontent"
                                autoComplete="off"
                                placeholder="E.g: Secret Code, Invitation Link"
                                onChange={(e) => {
                                  setNFTFormValue({
                                    ...NFTFormValue,
                                    ...{
                                      ["UnlockContent"]: e.target.value,
                                    },
                                  });
                                }}
                              />

                              <p className="form_note mt-1">
                                Tip: Markdown syntax is supported
                              </p>
                            </div>
                          )}



                          {/* Staking details */}

                          {/* <div className="whole_unlockable_content mt-5 d-flex justify-content-between">
                            <div className="unlockable_content">
                              <h5>Staking</h5>
                              <small className="category_hint_txt">Unlockable content in NFTs refers to additional digital assets or experiences that are made available to the owner of the NFT after
purchase through a special code or link included</small>
                            </div>
                            <div className="toggle_switch">
                              <label class="switch">
                                <input
                                  type="checkbox"
                                  id="unlockoncepurchased"
                                  name="unlockoncepurchased"
                                  autoComplete="off"
                                  onChange={() => {
                                    setStake(!stake);
                                  }}
                                />
                                <span class="slider round"></span>
                              </label>
                            </div>
                          </div>
                          {stake && (
                            <div className="form-group input_dtls_area_one unlock_sec">
                              <input
                                type="text"
                                className="form-control w-100 baseName_input primary_inp mt-4"
                                name="UnLockcontent"
                                id="UnLockcontent"
                                autoComplete="off"
                                placeholder="E.g: Secret Code, Invitation Link"
                                // onChange={(e) => {
                                //   setNFTFormValue({
                                //     ...NFTFormValue,
                                //     ...{
                                //       ["UnlockContent"]: e.target.value,
                                //     },
                                //   });
                                // }}
                              />

                              <p className="form_note mt-1">
                                Tip: Markdown syntax is supported
                              </p>
                            </div>
                          )} */}






                          {/* end of staking details */}















                          <div className="whole_unlockable_content mt-5 d-flex justify-content-between">
                            <div className="unlockable_content">
                              <h5>Put it on sale Instantly</h5>
                            </div>
                            <div className="toggle_switch">
                              <label class="switch">
                                <input
                                  type="checkbox"
                                  id="putonsale"
                                  name="putonsale"
                                  checked={NFTFormValue.PutOnSale}
                                  onChange={() => {
                                    checkPutOnSale(!NFTFormValue.PutOnSale);
                                  }}
                                />
                                <span class="slider round"></span>
                              </label>
                            </div>
                          </div>
                          {NFTFormValue?.PutOnSale && (
                          <Row className="mt-5">
                            <Col className="mb-2" xxl={4} xl={4} lg={4} md={6} sm={12} xs={12}>
                              <div className="price_fixed_dtls"       id="fixedprice"
                                    onClick={() =>
                                      setNFTFormValue({
                                        ...NFTFormValue,
                                        ...{
                                          ["PutOnSaleType"]: "FixedPrice",
                                          ["NFTPrice"]: 0,
                                          ["ClockTime"]: "",
                                          ["EndClockTime"]: "",
                                          ["CoinName"]: "",
                                        },
                                      })
                                    }>
                              <div className="price_fixed_img_align">
                                  </div>
                                <small className="category_hint_txt text-center mt-3">Fixed price listing is when the seller sets a non-negotiable price for their NFT, and interested buyers can purchase it</small>



                              </div>
                              </Col>
                              <Col className="mb-2" xxl={4} xl={4} lg={4} md={6} sm={12} xs={12}>

                              <div className="price_fixed_dtls"   onClick={() =>
                                      setNFTFormValue({
                                        ...NFTFormValue,
                                        ...{
                                          ["PutOnSaleType"]: "UnlimitedAuction",
                                          ["NFTPrice"]: 0,
                                          ["ClockTime"]: "",
                                          ["EndClockTime"]: "",
                                          ["CoinName"]: "",
                                        },
                                      })
                                    }>
                              <div className="auction_unlimited_img_align">
                                  </div>
                                <small className="category_hint_txt mt-3">Unlimited auction is a sale where the seller sets a minimum price for their NFT and buyers can bid higher amounts until the end of the auction, with no upper limit on the final price.</small>

                              </div>
                              </Col>
                              {mintType == "Single" && (

                              <Col className="mb-2" xxl={4} xl={4} lg={4} md={6} sm={12} xs={12}>

                              <div className="price_fixed_dtls" onClick={() =>
                                        setNFTFormValue({
                                          ...NFTFormValue,
                                          ...{
                                            ["PutOnSaleType"]: "TimedAuction",
                                            ["NFTPrice"]: 0,
                                            ["ClockTime"]: "",
                                            ["EndClockTime"]: "",
                                            ["CoinName"]: "",
                                          },
                                        })
                                      }>
                                <div className="auction_timed_img_align">
                                  </div>
                                <small className="category_hint_txt mt-3">Timed auction is a sale where the seller sets a specific time period during which interested buyers can bid on their NFT, and the highest
                                bidder at the end of the auction wins the NFT.</small>

                              </div>
                            </Col>)}
                          </Row>)}

                          {NFTFormValue?.PutOnSaleType == "FixedPrice" && (
                          <>
                               <Row>
                                  <label
                                    for="selectCollection"
                                    className="baseName_label w-100  mb-2"
                                  >
                                    Fixed Price
                                  </label>
                                  <Col
                                    xxl={6}
                                    xl={6}
                                    lg={6}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                  >
                                    <div className="input_dtls_area_one w-100 ">
                                      <InputGroup className="mb-3 w-100 ">
                                        <Form.Control
                                          placeholder="Enter price"
                                          aria-label="Recipient's username"
                                          aria-describedby="basic-addon2"
                                          id="NFTPrice"
                                          name="TokenPrice"
                                          className="baseName_inputgroup"
                                          onChange={onChange}
                                          step="0.01"
                                          maxLength={15}
                                        />

                                        <InputGroup.Text id="basic-addon2">
                                          <Select
                                            name="coinname"
                                            styles={stylesselect}
                                            options={currency}
                                            placeholder=""
                                            isSearchable={false}
                                            onChange={(e) =>
                                              setNFTFormValue({
                                                ...NFTFormValue,
                                                ...{ ["CoinName"]: e.label },
                                              })
                                            }
                                           
                                            className="border_blue_selectOne"
                                          />
                                        </InputGroup.Text>
                                      </InputGroup>
                                      {ValidateError.CoinName && (
                                        <span className="text-danger img-file">
                                          {ValidateError.CoinName}
                                        </span>
                                      )}
                                    </div>
                                  </Col>
                                </Row></>)}

                         {mintType == "Single" && (
                          <>
                                <>
                                  {NFTFormValue?.PutOnSaleType ==
                                    "TimedAuction" && (
                                    <Row>
                                      <label
                                        for="selectCollection"
                                        className="baseName_label w-100  mb-2"
                                      >
                                        Minimum bid
                                      </label>
                                      <Col
                                        xxl={6}
                                        xl={6}
                                        lg={6}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                      >
                                        <div className="input_dtls_area_one w-100 ">

                                        <InputGroup className="mb-3 w-100 ">
                                        <Form.Control
                                          placeholder="Enter Minimum Bid"
                                          aria-label="Recipient's username"
                                          aria-describedby="basic-addon3"
                                          id="NFTPrice"
                                          name="MinimumBid"
                                              maxLength=""
                                              autoComplete="off"
                                          className="baseName_inputgroup"
                                          onChange={onChange}
                                           // value={NFTFormValue.NFTPrice}
                                        />

                                        <InputGroup.Text id="basic-addon2">
                                          <Select
                                            name="coinname"
                                            options={currency.filter(
                                              (item) =>
                                                item.label !==
                                                config.COIN_NAME
                                            )}
                                            placeholder=""
                                            isSearchable={false}
                                            onChange={(e) =>
                                              setNFTFormValue({
                                                ...NFTFormValue,
                                                ...{
                                                  ["CoinName"]: e.label,
                                                },
                                              })
                                            }
                                            styles={stylesselect}
                                            className="border_blue_selectOne"
                                          />
                                        </InputGroup.Text>
                                      </InputGroup>
                                          
                                        </div>
                                      </Col>
                                      <Row>
                                        <Col
                                          xxl={6}
                                          xl={6}
                                          lg={6}
                                          md={12}
                                          sm={12}
                                          xs={12}
                                        >
                                          <label
                                            for="selectCollection"
                                            className="baseName_label w-100  mb-2"
                                          >
                                            Starting Date
                                          </label>
                                          <Dropdown className="react_dropdown_cntnt_align">
      <Dropdown.Toggle className="react_dropdown_btn_align w-100"  variant="success" id="dropdown-basic">
      {AuctionStart ? (AuctionStart).toLocaleString() : "Select Starting Date"}
      </Dropdown.Toggle>

      <Dropdown.Menu className="react_dropdown_menu_align">
   
                                              <>
        <Dropdown.Item className="react_dropdown_menuitem_align"  id="RightAfterListing"
                                              onClick={() => {
                                                setPicStartselected(false);
                                                CalAction("now", 0);
                                              }}>Right After Listing</Dropdown.Item>
        <Dropdown.Item className="react_dropdown_menuitem_align"    id="PickStart"
                                              onClick={() => {
                                                setAucCalender("Start");
                                                setPicStartselected(true);
                                                setShowCalender(true);
                                              }}>Pick Specific Date</Dropdown.Item>
                                                     </>
        
      </Dropdown.Menu>
    </Dropdown>
    {ValidateError.ClockTime && (
                                            <span className="text-danger img-file">
                                              {ValidateError.ClockTime}
                                            </span>
                                          )}
                                         
                                        </Col>

                                        <Col
                                          xxl={6}
                                          xl={6}
                                          lg={6}
                                          md={12}
                                          sm={12}
                                          xs={12}
                                        >
                                          
                                          <label
                                            for="selectCollection"
                                            className="baseName_label w-100  mb-2"
                                          >
                                            Expiration Date
                                          </label>

     <Dropdown className="react_dropdown_cntnt_align">
      <Dropdown.Toggle className="react_dropdown_btn_align w-100"  variant="success" id="dropdown-basic">
      {AuctionEnd ? (AuctionEnd).toLocaleString() : "Expiration Date"}
      </Dropdown.Toggle>

      <Dropdown.Menu className="react_dropdown_menu_align">
      {!PicStartselected && (
                                              <>
        <Dropdown.Item className="react_dropdown_menuitem_align"     onClick={() =>{
          if(!AuctionStart) return toast.error("select start date first")

                                                    CalAction("end", 1)}
                                                  }>1 Day</Dropdown.Item>
        <Dropdown.Item className="react_dropdown_menuitem_align"    onClick={() =>{
          if(!AuctionStart) return toast.error("select start date first")

                                                    CalAction("end", 2)}
                                                  }>2 Days</Dropdown.Item>
                                                     </>
                                            )}
        <Dropdown.Item className="react_dropdown_menuitem_align"    onClick={() => {
          if(!AuctionStart) return toast.error("select start date first")


                                                setAucCalender("End");
                                                setShowCalender(true);
                                              }}> Pick Specific Date</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    {ValidateError.EndClockTime && (
                                            <span className="text-danger img-file">
                                              {ValidateError.EndClockTime}
                                            </span>
                                          )}
                                        </Col>
                                      </Row>
                                    </Row>
                                  )}
                                </></>)}
                          
                        </Col>
                        <div className="create_item_btn_align">


                        <a data-ignore-split="true" class="Button mt-4"  id="" onClick={FormButton == "start" ? ()=>{FormSubmit(false)} : null} tabindex="0" aria-label="">
                        {" "}
                            {FormButton == "start" && "Create"}
                            {FormButton == "error" && "Error"}
                            {FormButton == "process" && "processing"}
                            {FormButton == "done" && "Done"}
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">{" "}
                            {FormButton == "start" && "Create"}
                            {FormButton == "error" && "Error"}
                            {FormButton == "process" && "processing"}
                            {FormButton == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true">{" "}
                            {FormButton == "start" && "Create"}
                            {FormButton == "error" && "Error"}
                            {FormButton == "process" && "processing"}
                            {FormButton == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true">{" "}
                            {FormButton == "start" && "Create"}
                            {FormButton == "error" && "Error"}
                            {FormButton == "process" && "processing"}
                            {FormButton == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true">{" "}
                            {FormButton == "start" && "Create"}
                            {FormButton == "error" && "Error"}
                            {FormButton == "process" && "processing"}
                            {FormButton == "done" && "Done"}</span>
  </a>





                          {/* <button
                            className="create_item_single_btn"
                                              disabled={
                              FormButton == "error" ||
                              FormButton == "done" ||
                              FormButton == "process"
                                ? true
                                : false
                            }
                            onClick={FormButton == "start" ? ()=>{FormSubmit(false)} : null}
                          >
                            {" "}
                            {FormButton == "start" && "Create"}
                            {FormButton == "error" && "Error"}
                            {FormButton == "process" && "processing"}
                            {FormButton == "done" && "Done"}
                          </button> */}

                          {/* <p id="RightAfterListing" onClick={() => { setPicStartselected(false); CalAction("now", 0) }}>rightafter listing</p>
                        <p id="PickStart" onClick={() => {
                          setAucCalender("Start"); setPicStartselected(true)
                          setShowCalender(true)

                        }} >pick sepecific date</p>
                        {!PicStartselected &&
                          <>
                            <div onClick={() => CalAction("end", 1)}>1 day</div>
                            <div onClick={() => CalAction("end", 2)}>2 days</div></>}
                        <p onClick={() => {
                          setAucCalender("End")
                          setShowCalender(true)

                        }}>end specific date</p>

                        {ValidateError.ClockTime && (
                          <span className="text-danger img-file">
                            {ValidateError.ClockTime}
                          </span>
                        )} */}
                        </div>
                      </Row>
                    </Col>
                  </Row>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <Row>
                    <Col xxl={4} xl={4} lg={4} md={6} sm={12}>
                      <h5 className="upld_fle_ttle">Upload File</h5>
                      <div className="input_file_area_align mt-5 p-3">
                        <div className="input_file_area">
                          <h6 className="text-center">Upload your NFT</h6>
                          <small className="category_hint_txt text-center px-1 mt-5">
                            Common file types for NFTs include JPEG,PNG,GIF,BMP,MP4 Or MOV.
                          </small>
                          {/* <h6 className="text-center mt-1">Max 50mb.</h6> */}
                          <div className="w-100 create_btn_align">



                          
                            
                            {/* <a data-ignore-split="true" type="button" class="Button"  id="" onclick="" tabindex="0" aria-label="">
                            <input
                                type="file"
                                className="choose_file_input_dtls "
                                name="file"
                                id="NFTOrginalImage"
                                accept="audio/*,video/*,image/*"
                                onChange={(e) => onChange(e, "Orginal")}
                              />
    View Collections
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    <span class="Button-hover-content" aria-hidden="true">View Collections</span>
    
  </a> */}

  
                            







                            <button className="choose_file_btn" onClick={()=>{setimagepreview(true)}}>
                              Upload file
                              <input
                                type="file"
                                className="choose_file_input_dtls "
                                name="file"
                                id="NFTOrginalImage"
                                accept="audio/*,video/*,image/*"
                                onChange={(e) => onChange(e, "Orginal")}
                              />
                            </button>
                            {(fileType == "video" || fileType == "audio") && (
                              <button className="choose_file_btn thumbnail_btn mt-5">
                                Pick Thumbnail
                                <input
                                  className="choose_file_input_dtls"
                                  type="file"
                                  name="file"
                                  id="NFTThumpImage"
                                  accept="audio/*,video/*,image/*"
                                  onChange={(e) => {
                                    onChange(e, "Thump");
                                  }}
                                />
                              </button>
                            )}
                          </div>
                          {ValidateError.NFTOrginalImage && (
                            <span className="text-danger text-center dngr_txt img-file">
                              {ValidateError.NFTOrginalImage}
                            </span>
                          )}
                          {ValidateError.NFTThumpImage && (
                            <span className="text-danger text-center dngr_txt img-file">
                              {ValidateError.NFTThumpImage}
                            </span>
                          )}
                        </div>
                        {imgpreview &&
                        <div className="img_show_div_align">
                        {fileType == "video" ? (

                        <video  controls controlsList="nodownload" autoPlay='true' muted>
  <source src={previewFile} type="video/mp4"></source>
  </video>):
   fileType == "audio" ? (
    <audio
      src={previewFile}
      alt="collections"
      autoPlay={false}
      muted={true}
      controls
    />
  ) : 
  <img src={previewFile}/>}
                      </div>}
                        
                      </div>
                      {imgpreview &&
                      <button onClick={()=>{
                        setimagepreview(false)
                        setPreviewFile( require("../app/assets/images/collection.png"))
                        setPreviewThumbnail(require("../app/assets/images/collection.png"))
                        }} className="create_item_single_btn">clear preview</button>
}
                      
                      {/* <h5 className="mt-4">Note:</h5>
                      <p className="service_fee_txt">
                        Service Fee : {web3?.utils?.fromWei(sellerFees)}%
                      </p>

                      <span className="receive_amnt_txt">
                        You Will Receive : {YouWillGet} {NFTFormValue?.CoinName}
                      </span> */}

                      {/* <div className="view_collection_card d-flex justify-content-center mt-5 w-100">
                        <Grid item xxl={3} xl={3} lg={3} md={6} sm={6} xs={12}>
                          <Box className="card card_align">
                            {fileType == "video" ? (
                              <video
                                src={previewFile}
                                alt="collections"
                                autoPlay={true}
                                muted={true}
                                controls
                              />
                            ) : fileType == "audio" ? (
                              <audio
                                src={previewFile}
                                alt="collections"
                                autoPlay={false}
                                muted={true}
                                controls
                              />
                            ) : (
                              <img
                                src={previewFile}
                                className="mui-img-fluid"
                              />
                            )}
                            <Box className="collection-info collection_info_bg">
                              <p className="collections-title">
                                {NFTFormValue?.NFTName
                                  ? NFTFormValue?.NFTName
                                  : "xdsea nft"}
                              </p>
                              <p className="collections-description">
                                {NFTFormValue?.CollectionName
                                  ? NFTFormValue?.CollectionName
                                  : "xdsea collection"}
                              </p>
                            </Box>
                          </Box>
                          <Box className="collection-button">
                            <button className="banner-button">View NFT</button>
                          </Box>
                        </Grid>
                      </div> */}
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={6} sm={12}>
                      <Row>
                        <Col xxl={6} xl={6} lg={6} md={12} sm={12}>
                          <p className="upld_sub_hnt">Item details</p>
                          <div className="input_dtls_area_one w-100 mt-5">
                            <label
                              for="baseName"
                              className="baseName_label w-100 mb-2"
                            >
                              Name Your NFT
                            </label>
                            <br />
                           
                            <input
                              type="text"
                              className="w-100 baseName_input"
                              onChange={onChange}
                              id="NFTName"
                              placeholder="Enter name"
                            />

{ValidateError.NFTName && (
                              <span className="text-danger img-file">
                                {ValidateError.NFTName}
                              </span>
                            )}

                            <label
                              for="selectCollection"
                              className="baseName_label w-100 mt-5 mb-2"
                            >
                              Which collection does this NFT
belong to?
                            </label>
                            <br />
                            {/* <select className='normal_drpdwn_align'  form="carform">
    <option>Select a collection</option>

      {CreateCollectionState && CreateCollectionState.map((item, index) =>{
        return(
          <>
          <option onClick={() =>
            setNFTFormValue({
              ...NFTFormValue,
              ...{ ["CollectionName"]: item.collectionName },
            })}>{item.collectionName}</option>
          
          </>
        )
        
      })}
    <option onClick={()=>navigate("/createCollection/gallery")}>Create collection</option>

  
  
</select> */}
                            <Select
                              options={CreateCollectionState}
                              onChange={(e) => gotoUrl(e)}
                              styles={styles}
                              className="border_blue_select"
                              classNamePrefix="react-select"
                              placeholder='Choose or create new collection'
                            />
                            <div>
                              {ValidateError.collectionname && (
                                <span className="text-danger img-file">
                                  {ValidateError.collectionname}
                                </span>
                              )}
                            </div>

                            <label
                              for="selectCollection"
                              className="baseName_label w-100 mt-5 mb-2"
                            >
                              Category
                            </label>

                            <small className="category_hint_txt">NFT marketplace categories can include art, music, sports, gaming,
collectibles, virtual real estate, celebrity, memes etc</small>
                            <br />
                            <Select
                              options={Categorys.filter((item)=>item.label != "Staking")}
                              placeholder='Select Category...'
                              onChange={(e) =>
                                setNFTFormValue({
                                  ...NFTFormValue,
                                  ...{ ["Category"]: e.label },
                                })
                              }
                              label="Select or type name"
                              styles={styles}
                              className="border_blue_select"
                              classNamePrefix="react-select"
                            />
                            {ValidateError.Category && (
                              <span className="text-danger img-file">
                                {ValidateError.Category}
                              </span>
                            )}

                            
                          </div>
                        </Col>
                        <Col xxl={6} xl={6} lg={6} md={12} sm={12}>
                          <div className="input_dtls_area_one w-100 mt-5">
                            <label
                              for="desciption"
                              className="baseName_label w-100 mt-4 mb-2"
                            >
                              Description
                            </label>
                            <br />
                            <textarea
                              className="w-100 input_three_textarea"
                              rows="7"
                              onChange={onChange}
                              id="NFTDescription"
                              // value={NFTFormValue.NFTDescription}

                              placeholder="Share the story of this NFT, what is it, the idea or inspiration..."
                              autoComplete="off"
                            ></textarea>

                            <label
                              for="selectCollection"
                              className="baseName_label number_of_copies w-100  mb-2"
                            >
                              Royalty %
                            </label>
                            <span className="category_hint_txt">Royalties in NFTs allow creators to earn a percentage of
the sale price each time their digital artwork is resold.</span>
                            <br />
                            <input
                              type="text"
                              className="w-100 baseName_input"
                              onChange={onChange}
                              id="NFTRoyalty"
                              // value={NFTFormValue.NFTRoyalty}
                              placeholder="A typical artist royalty ranges from 0-20%..."
                            />
                            {ValidateError.NFTRoyalty && (
                              <span className="text-danger img-file">
                                {ValidateError.NFTRoyalty}
                              </span>
                            )}
                            {mintType == "Multiple" && (
                              <>
                                <label
                                  for="selectCollection"
                                  className="baseName_label mt-5 w-100  mb-2"
                                >
                                  Number of Copies
                                </label>
                                <br />
                                <input
                                  type="text"
                                  className="w-100 baseName_input"
                                  onChange={onChange}
                                  id="NFTQuantity"
                                  // value={NFTFormValue.NFTQuantity}
                                  placeholder="e.g. 1"
                                  autoComplete="off"
                                  maxLength={3}
                                />
                              </>
                            )}
                            {ValidateError.NFTQuantity && (
                              <span className="text-danger img-file">
                                {ValidateError.NFTQuantity}
                              </span>
                            )}
                          </div>
                        </Col>
                        <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
                          <div className="input_dtls_area_one w-100">
                        <label
                              for="selectCollection"
                              className="baseName_label label_optinal_align w-100 mt-5 mb-2"
                            >
                              Properties
                              <small className="prprt_hint_txt">Optional</small>
                            </label>
                            <small className="category_hint_txt">Properties are like special things you can add to your NFTs to make them even cooler which decides the rarity of your NFT. Rarity refers to how unique and scarce an NFT is compared to others in the same collection and is often a key factor in determining its value.<br/> 
                            For example:<br/> 
                            Property Name: Gender; Property Value: Male</small>
                            <br /> <Row className="gx-2">

                                            {([...Array(propertycounter)]).map((data,index)=>{
                                return(
                                  <>
                                     
                              <Col className="h-100 mb-2" xxl={3} xl={3} lg={6} md={6} sm={12} xs={12}>
                              <div className="prprt_tri_btn">
                              <input className="prprt_name_inp_align" type='text' 
                               
                              minlength={0} maxlength={2} size={2}
                              placeholder="Property Name" onChange={(e)=>{addproperties(e,index,"property")}}/>
                              <input className="prprt_value_inp_align mt-2" type='text' max={25} placeholder="Property Value" onChange={(e)=>{addproperties(e,index,"value")}}/>
                            </div>

                                </Col>

                         
                           



                                </>
                                )
                         
                              })}
                              </Row>
                                      <Row className="gx-2">

                                <Col className="h-100 mb-2" xxl={3} xl={3} lg={6} md={6} sm={12} xs={12}>

                                     <div className="prprt_tri_add_btn" onClick={()=>{
                                  var inc_count = propertycounter +1
                                  setpropertycounter(inc_count)
                                  propState.push({})
                                }}>
                            <i class="fa-solid fa-plus plussess"/>
                            <small className="prprt_addmore_txt">Add more</small>  
                            </div>
                            </Col>
</Row>                         

                            
                            

                            
                            {/* <input
                              type="text"
                              className="w-100 baseName_input"
                              onChange={onChange}
                              id="NFTProperties"
                              value={NFTFormValue.NFTProperties}
                              autoComplete="off"
                              placeholder="e.g. size"
                            /> */}
                            {/* <Select
                                                
                                                
                                                options={options4}
                                                styles={styles} className="border_blue_select"
                                            /> */}
                                            </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xxl={12} xl={12} lg={12} md={12} sm={12}>
                          <div className="whole_unlockable_content mt-5 d-flex justify-content-between">
                            <div className="unlockable_content">
                              <h5>Add Unlockable Content</h5>
                              <small className="category_hint_txt">Unlockable content in NFTs refers to additional digital assets or experiences that are made available to the owner of the NFT after
purchase through a special code or link included</small>
                            </div>
                            <div className="toggle_switch">
                              <label class="switch">
                                <input
                                  type="checkbox"
                                  id="unlockoncepurchased"
                                  name="unlockoncepurchased"
                                  autoComplete="off"
                                  onChange={() => {
                                    setUnlock(!unlock);
                                  }}
                                />
                                <span class="slider round"></span>
                              </label>
                            </div>
                          </div>
                          {unlock && (
                            <div className="form-group input_dtls_area_one unlock_sec">
                              <input
                                type="text"
                                className="form-control w-100 baseName_input primary_inp mt-4"
                                name="UnLockcontent"
                                id="UnLockcontent"
                                autoComplete="off"
                                placeholder="E.g: Secret Code, Invitation Link"
                                onChange={(e) => {
                                  setNFTFormValue({
                                    ...NFTFormValue,
                                    ...{
                                      ["UnlockContent"]: e.target.value,
                                    },
                                  });
                                }}
                              />

                              <p className="form_note mt-1">
                                Tip: Markdown syntax is supported
                              </p>
                            </div>
                          )}



                          {/* Staking details */}

                          {/* <div className="whole_unlockable_content mt-5 d-flex justify-content-between">
                            <div className="unlockable_content">
                              <h5>Staking</h5>
                              <small className="category_hint_txt">Unlockable content in NFTs refers to additional digital assets or experiences that are made available to the owner of the NFT after
purchase through a special code or link included</small>
                            </div>
                            <div className="toggle_switch">
                              <label class="switch">
                                <input
                                  type="checkbox"
                                  id="unlockoncepurchased"
                                  name="unlockoncepurchased"
                                  autoComplete="off"
                                  onChange={() => {
                                    setUnlock(!unlock);
                                  }}
                                />
                                <span class="slider round"></span>
                              </label>
                            </div>
                          </div>
                          {unlock && (
                            <div className="form-group input_dtls_area_one unlock_sec">
                              <input
                                type="text"
                                className="form-control w-100 baseName_input primary_inp mt-4"
                                name="UnLockcontent"
                                id="UnLockcontent"
                                autoComplete="off"
                                placeholder="E.g: Secret Code, Invitation Link"
                                onChange={(e) => {
                                  setNFTFormValue({
                                    ...NFTFormValue,
                                    ...{
                                      ["UnlockContent"]: e.target.value,
                                    },
                                  });
                                }}
                              />

                              <p className="form_note mt-1">
                                Tip: Markdown syntax is supported
                              </p>
                            </div>
                          )} */}






                          {/* end of staking details */}















                          <div className="whole_unlockable_content mt-5 d-flex justify-content-between">
                            <div className="unlockable_content">
                              <h5>Put it on sale Instantly</h5>
                            </div>
                            <div className="toggle_switch">
                              <label class="switch">
                                <input
                                  type="checkbox"
                                  id="putonsale"
                                  name="putonsale"
                                  checked={NFTFormValue.PutOnSale}
                                  onChange={() => {
                                    checkPutOnSale(!NFTFormValue.PutOnSale);
                                  }}
                                />
                                <span class="slider round"></span>
                              </label>
                            </div>
                          </div>
                          {NFTFormValue?.PutOnSale && (
                          <Row className="mt-5">
                            <Col className="mb-2" xxl={4} xl={4} lg={4} md={6} sm={12} xs={12}>
                              <div className="price_fixed_dtls"       id="fixedprice"
                                    onClick={() =>
                                      setNFTFormValue({
                                        ...NFTFormValue,
                                        ...{
                                          ["PutOnSaleType"]: "FixedPrice",
                                          ["NFTPrice"]: 0,
                                          ["ClockTime"]: "",
                                          ["EndClockTime"]: "",
                                          ["CoinName"]: "",
                                        },
                                      })
                                    }>
                              <div className="price_fixed_img_align">
                                  </div>
                                <small className="category_hint_txt text-center mt-3">Fixed price listing is when the seller sets a non-negotiable price for their NFT, and interested buyers can purchase it</small>



                              </div>
                              </Col>
                              <Col className="mb-2" xxl={4} xl={4} lg={4} md={6} sm={12} xs={12}>

                              <div className="price_fixed_dtls"   onClick={() =>
                                      setNFTFormValue({
                                        ...NFTFormValue,
                                        ...{
                                          ["PutOnSaleType"]: "UnlimitedAuction",
                                          ["NFTPrice"]: 0,
                                          ["ClockTime"]: "",
                                          ["EndClockTime"]: "",
                                          ["CoinName"]: "",
                                        },
                                      })
                                    }>
                              <div className="auction_unlimited_img_align">
                                  </div>
                                <small className="category_hint_txt mt-3">Unlimited auction is a sale where the seller sets a minimum price for their NFT and buyers can bid higher amounts until the end of the auction, with no upper limit on the final price.</small>

                              </div>
                              </Col>
                              {mintType == "Single" && (

                              <Col className="mb-2" xxl={4} xl={4} lg={4} md={6} sm={12} xs={12}>

                              <div className="price_fixed_dtls" onClick={() =>
                                        setNFTFormValue({
                                          ...NFTFormValue,
                                          ...{
                                            ["PutOnSaleType"]: "TimedAuction",
                                            ["NFTPrice"]: 0,
                                            ["ClockTime"]: "",
                                            ["EndClockTime"]: "",
                                            ["CoinName"]: "",
                                          },
                                        })
                                      }>
                                <div className="auction_timed_img_align">
                                  </div>
                                <small className="category_hint_txt mt-3">Timed auction is a sale where the seller sets a specific time period during which interested buyers can bid on their NFT, and the highest
                                bidder at the end of the auction wins the NFT.</small>

                              </div>
                            </Col>)}
                          </Row>)}

                          {NFTFormValue?.PutOnSaleType == "FixedPrice" && (
                          <>
                               <Row>
                                  <label
                                    for="selectCollection"
                                    className="baseName_label w-100  mb-2"
                                  >
                                    Fixed Price
                                  </label>
                                  <Col
                                    xxl={6}
                                    xl={6}
                                    lg={6}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                  >
                                    <div className="input_dtls_area_one w-100 ">
                                      <InputGroup className="mb-3 w-100 ">
                                        <Form.Control
                                          placeholder="Enter price"
                                          aria-label="Recipient's username"
                                          aria-describedby="basic-addon2"
                                          id="NFTPrice"
                                          name="TokenPrice"
                                          className="baseName_inputgroup"
                                          onChange={onChange}
                                          step="0.01"
                                          maxLength={15}
                                        />

                                        <InputGroup.Text id="basic-addon2">
                                          <Select
                                            name="coinname"
                                            options={currency}
                                            styles={stylesselect}
                                            placeholder=""
                                            isSearchable={false}
                                            onChange={(e) =>
                                              setNFTFormValue({
                                                ...NFTFormValue,
                                                ...{ ["CoinName"]: e.label },
                                              })
                                            }
                                            
                                            className="border_blue_selectOne"
                                          />
                                        </InputGroup.Text>
                                      </InputGroup>
                                      {ValidateError.CoinName && (
                                        <span className="text-danger img-file">
                                          {ValidateError.CoinName}
                                        </span>
                                      )}
                                    </div>
                                  </Col>
                                </Row></>)}

                         {mintType == "Single" && (
                          <>
                                <>
                                  {NFTFormValue?.PutOnSaleType ==
                                    "TimedAuction" && (
                                    <Row>
                                      <label
                                        for="selectCollection"
                                        className="baseName_label w-100  mb-2"
                                      >
                                        Minimum bid
                                      </label>
                                      <Col
                                        xxl={6}
                                        xl={6}
                                        lg={6}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                      >
                                        <div className="input_dtls_area_one w-100 ">
                                          <InputGroup className="mb-3">
                                            <Form.Control
                                              placeholder="Enter Minimum Bid"
                                              aria-label="Recipient's username"
                                              className="baseName_inputgroup"
                                              aria-describedby="basic-addon3"
                                              name="MinimumBid"
                                              maxLength=""
                                              autoComplete="off"
                                              id="NFTPrice"
                                              onChange={onChange}
                                              // value={NFTFormValue.NFTPrice}
                                            />

                                            <InputGroup.Text
                                              id="basic-addon2"
                                              className="input_group_text_align"
                                            >
                                              <Select
                                                name="coinname"
                                                options={currency.filter(
                                                  (item) =>
                                                    item.label !==
                                                    config.COIN_NAME
                                                )}
                                                placeholder=""
                                                isSearchable={false}
                                                onChange={(e) =>
                                                  setNFTFormValue({
                                                    ...NFTFormValue,
                                                    ...{
                                                      ["CoinName"]: e.label,
                                                    },
                                                  })
                                                }
                                                styles={stylesselect}
                                                className="border_blue_selectOne"
                                              />
                                            </InputGroup.Text>
                                          </InputGroup>
                                        </div>
                                      </Col>
                                      <Row>
                                        <Col
                                          xxl={6}
                                          xl={6}
                                          lg={6}
                                          md={12}
                                          sm={12}
                                          xs={12}
                                        >
                                          <label
                                            for="selectCollection"
                                            className="baseName_label w-100  mb-2"
                                          >
                                            Starting Date
                                          </label>
                                          <Dropdown className="react_dropdown_cntnt_align">
      <Dropdown.Toggle className="react_dropdown_btn_align w-100"  variant="success" id="dropdown-basic">
      {AuctionStart ? (AuctionStart).toLocaleString() : "Select Starting Date"}
      </Dropdown.Toggle>

      <Dropdown.Menu className="react_dropdown_menu_align">
   
                                              <>
        <Dropdown.Item className="react_dropdown_menuitem_align"  id="RightAfterListing"
                                              onClick={() => {
                                                setPicStartselected(false);
                                                CalAction("now", 0);
                                              }}>Right After Listing</Dropdown.Item>
        <Dropdown.Item className="react_dropdown_menuitem_align"    id="PickStart"
                                              onClick={() => {
                                                setAucCalender("Start");
                                                setPicStartselected(true);
                                                setShowCalender(true);
                                              }}>Pick Specific Date</Dropdown.Item>
                                                     </>
        
      </Dropdown.Menu>
    </Dropdown>
    {ValidateError.ClockTime && (
                                            <span className="text-danger img-file">
                                              {ValidateError.ClockTime}
                                            </span>
                                          )}
                                         
                                        </Col>

                                        <Col
                                          xxl={6}
                                          xl={6}
                                          lg={6}
                                          md={12}
                                          sm={12}
                                          xs={12}
                                        >
                                          
                                          <label
                                            for="selectCollection"
                                            className="baseName_label w-100  mb-2"
                                          >
                                            Expiration Date
                                          </label>

     <Dropdown className="react_dropdown_cntnt_align">
      <Dropdown.Toggle className="react_dropdown_btn_align w-100"  variant="success" id="dropdown-basic">
      {AuctionEnd ? (AuctionEnd).toLocaleString() : "Expiration Date"}
      </Dropdown.Toggle>

      <Dropdown.Menu className="react_dropdown_menu_align">
      {!PicStartselected && (
                                              <>
        <Dropdown.Item className="react_dropdown_menuitem_align"     onClick={() =>
                                                    CalAction("end", 1)
                                                  }>1 Day</Dropdown.Item>
        <Dropdown.Item className="react_dropdown_menuitem_align"    onClick={() =>
                                                    CalAction("end", 2)
                                                  }>2 Days</Dropdown.Item>
                                                     </>
                                            )}
        <Dropdown.Item className="react_dropdown_menuitem_align"    onClick={() => {
                                                setAucCalender("End");
                                                setShowCalender(true);
                                              }}> Pick Specific Date</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    {ValidateError.EndClockTime && (
                                            <span className="text-danger img-file">
                                              {ValidateError.EndClockTime}
                                            </span>
                                          )}
                                        </Col>
                                      </Row>
                                    </Row>
                                  )}
                                </></>)}
                          
                        </Col>
                        <div className="create_item_btn_align">

                        <a data-ignore-split="true" class="Button mt-5"  id="" onClick={FormButton == "start" ? ()=>{FormSubmit(false)} : null} tabindex="0" aria-label="">
                        {" "}
                            {FormButton == "start" && "Create"}
                            {FormButton == "error" && "Error"}
                            {FormButton == "process" && "processing"}
                            {FormButton == "done" && "Done"}
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">{" "}
                            {FormButton == "start" && "Create"}
                            {FormButton == "error" && "Error"}
                            {FormButton == "process" && "processing"}
                            {FormButton == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true">{" "}
                            {FormButton == "start" && "Create"}
                            {FormButton == "error" && "Error"}
                            {FormButton == "process" && "processing"}
                            {FormButton == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true">{" "}
                            {FormButton == "start" && "Create"}
                            {FormButton == "error" && "Error"}
                            {FormButton == "process" && "processing"}
                            {FormButton == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true">{" "}
                            {FormButton == "start" && "Create"}
                            {FormButton == "error" && "Error"}
                            {FormButton == "process" && "processing"}
                            {FormButton == "done" && "Done"}</span>
  </a>
                          
                        </div>
                      </Row>
                    </Col>
                  </Row>
                </Tab.Pane>
             
                <Tab.Pane eventKey="third">
                  <Row>
                    <Col xxl={4} xl={4} lg={4} md={6} sm={12}>
                      <h5 className="upld_fle_ttle">Upload File</h5>
                      <div className="input_file_area_align mt-5 p-3">
                        <div className="input_file_area">
                          <h6 className="text-center">Upload your NFT</h6>
                          <small className="category_hint_txt text-center px-1 mt-5">
                            Common file types for NFTs include JPEG,PNG,GIF,BMP,MP4 Or MOV.
                          </small>
                          <div className="w-100 create_btn_align">
                            <button className="choose_file_btn mt-5" onClick={()=>{setimagepreview(true)}}>
                              Choose file
                              <input
                                type="file"
                                className="choose_file_input_dtls "
                                name="file"
                                id="NFTOrginalImage"
                                // accept="audio/*,video/*,image/*"
                                webkitdirectory="true"
                                multiple
                                onChange={(e) => onChange(e, "Orginal",true)}
                              />
                            </button>
                            {(fileType == "video" || fileType == "audio") && (
                              <button className="choose_file_btn thumbnail_btn mt-5">
                                Pick Thumbnail
                                <input
                                  className="choose_file_input_dtls"
                                  type="file"
                                  name="file"
                                  id="NFTThumpImage"
                                  // accept="audio/*,video/*,image/*"
                                  webkitdirectory="true"
                                  multiple
                                  onChange={(e) => {
                                    onChange(e, "Thump",true);
                                  }}
                                />
                              </button>
                            )}
                          </div>
                          {ValidateError.NFTOrginalImage && (
                            <span className="text-danger text-center img-file">
                              {ValidateError.NFTOrginalImage}
                            </span>
                          )}
                          {ValidateError.NFTThumpImage && (
                            <span className="text-danger img-file">
                              {ValidateError.NFTThumpImage}
                            </span>
                          )}
                        </div>
                        {imgpreview &&
                        <div className="img_show_div_align">
                        {fileType == "video" ? (

                        <video  controls controlsList="nodownload" autoPlay='true' muted>
  <source src={previewFile} type="video/mp4"></source>
  </video>):
   fileType == "audio" ? (
    <audio
      src={previewFile}
      alt="collections"
      autoPlay={false}
      muted={true}
      controls
    />
  ) : 
  <img src={previewFile}/>}
                      </div>}
                        
                      </div>
                      {imgpreview &&
                      <button onClick={()=>setimagepreview(false)} className="create_item_single_btn">clear preview</button>
}
                    
                    </Col>
                    <Col xxl={8} xl={8} lg={8} md={6} sm={12}>
                      <Row>
                        <Col xxl={6} xl={6} lg={6} md={12} sm={12}>
                          <p className="upld_sub_hnt">Item details</p>
                          <div className="input_dtls_area_one w-100 mt-5">
                            <label
                              for="baseName"
                              className="baseName_label w-100 mb-2"
                            >
                             Name Your NFT
                            </label>
                            <br />
                            
                           <input
                              type="text"
                              className="w-100 baseName_input"
                              onChange={onChange}
                              id="NFTName"
                              placeholder="Enter name"
                            />
                            {ValidateError.NFTName && (
                              <span className="text-danger img-file">
                                {ValidateError.NFTName}
                              </span>
                            )}

                            <label
                              for="selectCollection"
                              className="baseName_label w-100 mt-5 mb-2"
                            >
                              Which collection type does this NFT belong to?
                             
                            </label>
                            <br />
                            <Select
 
                              options={[{label:721},{label:1155}]}
                              onChange={(e) => bulkminttype(e)}
                              styles={styles}
                              className="border_blue_select"
                              classNamePrefix="react-select"
                              placeholder='Choose Collection'
                            />

{ShowBulkCollections&& <>
                            <label
                              for="selectCollection"
                              className="baseName_label w-100 mt-5 mb-2"
                            >
                              Select Collection
                            </label>
                            <br />
                             
                            <Select
                            styles={styles}
                              options={CreateCollectionState}
                              onChange={(e) => gotoUrl(e)}
                              classNamePrefix="react-select"
                              className="border_blue_select"
                            /></>}
                              <div>
                              {ValidateError.collectionname && (
                                <span className="text-danger img-file">
                                  {ValidateError.collectionname}
                                </span>
                              )}
                            </div>


                            <label
                              for="selectCollection"
                              className="baseName_label w-100 mt-5 mb-2"
                            >
                              Category
                            </label>
                            <small className="category_hint_txt">NFT marketplace categories can include art, music, sports, gaming,
collectibles, virtual real estate, celebrity, memes etc</small>
<br />
                          
                            <Select
                            placeholder='Select Category...'
 
                              options={Categorys.filter((item)=>item.label != "Staking")}
                              onChange={(e) =>
                                setNFTFormValue({
                                  ...NFTFormValue,
                                  ...{ ["Category"]: e.label },
                                })
                              }
                              styles={styles}
                              label="Select or type name"
                              className="border_blue_select"
                              classNamePrefix="react-select"
                              
                            />
                            {ValidateError.Category && (
                              <span className="text-danger img-file">
                                {ValidateError.Category}
                              </span>
                            )}
                          </div>
                        </Col>
                        <Col xxl={6} xl={6} lg={6} md={12} sm={12}>
                          <div className="input_dtls_area_one w-100 mt-5">
                            <label
                              for="desciption"
                              className="baseName_label w-100 mt-4 mb-2"
                            >
                              Description
                            </label>
                            <br />
                            <textarea
                              className="w-100 input_three_textarea"
                              rows="7"
                              onChange={onChange}
                              id="NFTDescription"
                              // value={NFTFormValue.NFTDescription}

                              placeholder="Share the story of this NFT, what is it, the idea or inspiration..."
                              autoComplete="off"
                            ></textarea>

<label
                              for="selectCollection"
                              className="baseName_label number_of_copies w-100  mb-2"
                            >
                              Royalty %
                            </label>
                            <small className="category_hint_txt">Royalties in NFTs allow creators to earn a percentage of
the sale price each time their digital artwork is resold.</small>
<br />
                            <input
                              type="text"
                              className="w-100 baseName_input"
                              onChange={onChange}
                              id="NFTRoyalty"
                              // value={NFTFormValue.NFTRoyalty}
                              placeholder="A typical artist royalty ranges from 0-20%..."
                            />
                            {ValidateError.NFTRoyalty && (
                              <span className="text-danger img-file">
                                {ValidateError.NFTRoyalty}
                              </span>
                            )}
                                {mintType == "Multiple" && (
                              <>
                                <label
                                  for="selectCollection"
                                  className="baseName_label mt-5 w-100  mb-2"
                                >
                                  Number of Copies
                                </label>
                                <br />
                                <input
                                  type="text"
                                  className="w-100 baseName_input"
                                  onChange={onChange}
                                  id="NFTQuantity"
                                  // value={NFTFormValue.NFTQuantity}
                                  placeholder="e.g. 1"
                                  autoComplete="off"
                                  maxLength={3}
                                />
                              </>
                            )}
                            {ValidateError.NFTQuantity && (
                              <span className="text-danger img-file">
                                {ValidateError.NFTQuantity}
                              </span>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <div className="w-100 d-flex justify-content-end">

                        <a data-ignore-split="true" class="Button mt-5"  id="" onClick={()=>FormSubmit(true)} tabindex="0" aria-label="">
    Bulk Mint
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Bulk Mint</span>
    <span class="Button-hover-content" aria-hidden="true">Bulk Mint</span>
    <span class="Button-hover-content" aria-hidden="true">Bulk Mint</span>
    <span class="Button-hover-content" aria-hidden="true">Bulk Mint</span>
  </a>
                        
                        </div>
                      </Row>
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      <Modal
        show={showMint}
        onHide={handleCloseMint}
        backdrop="static"
        keyboard={false}
        centered
        className="whole_modal_text_align invert_btn modal_theme"
      >
        <Modal.Header className="align-items-start" closeButton>
          <Modal.Title className="text-center w-100">You are almost there!<br/>
          <small className="text-center font_12 min_sub_head">just {ApproveButton != "stop" ? 3 :2} clicks away</small></Modal.Title>
        </Modal.Header>
        <Modal.Body className="burn_token_body common_modal_body">
          <div className="simple_table_dtls mt-3  w-100">
            {ApproveButton != "stop" && (
              <>
                <h6 className="text-center">Approve Your Creation</h6>
                <p className="font_12 text-center">Let's take this to the next level</p>

                <div className="place_bid_modalbtn m-3 load_more_btn_align">

                <a data-ignore-split="true" class="Button"  id="" disabled={
                      ApproveButton == "process" || ApproveButton == "done"
                        ? true
                        : false
                    }
                    onClick={
                      ApproveButton == "start" || ApproveButton == "try"
                        ? TokenApproveCall
                        : null
                    } tabindex="0" aria-label="">
     {ApproveButton == "start" && "Let's Go"}
                    {ApproveButton == "process" && "In-Progress"}
                    {ApproveButton == "try" && "Try-Again"}
                    {/* {/ {/ {ApproveButton == "done" && "Done"} /} /} */}
                    {ApproveButton == "stop" && "Done"}
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">  {ApproveButton == "start" && "Let's Go"}
                    {ApproveButton == "process" && "In-Progress"}
                    {ApproveButton == "try" && "Try-Again"}
                    {/* {/ {/ {ApproveButton == "done" && "Done"} /} /} */}
                    {ApproveButton == "stop" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true">  {ApproveButton == "start" && "Let's Go"}
                    {ApproveButton == "process" && "In-Progress"}
                    {ApproveButton == "try" && "Try-Again"}
                    {/* {/ {/ {ApproveButton == "done" && "Done"} /} /} */}
                    {ApproveButton == "stop" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true">  {ApproveButton == "start" && "Let's Go"}
                    {ApproveButton == "process" && "In-Progress"}
                    {ApproveButton == "try" && "Try-Again"}
                    {/* {/ {/ {ApproveButton == "done" && "Done"} /} /} */}
                    {ApproveButton == "stop" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true">  {ApproveButton == "start" && "Let's Go"}
                    {ApproveButton == "process" && "In-Progress"}
                    {ApproveButton == "try" && "Try-Again"}
                    {/* {/ {/ {ApproveButton == "done" && "Done"} /} /} */}
                    {ApproveButton == "stop" && "Done"}</span>
  </a>
                </div>
              </>
            )}

            {!BulkMintButton?
              <>
            <h6 className="text-center">Upload NFT</h6>
            <p className="text-center font_12">Upload your creation</p>
            <div className="place_bid_modalbtn  m-3 load_more_btn_align">

            <a data-ignore-split="true" class="Button"  id="" disabled={
                  UploadButton == "process" || UploadButton == "done"
                    ? true
                    : false
                }
                onClick={
                  UploadButton == "start" || UploadButton == "try"
                    ? UploadIPFScall
                    : null
                } tabindex="0" aria-label="">
     {UploadButton == "stop" && "Upload"}
                {UploadButton == "start" && "Start"}
                {UploadButton == "process" && "In-Progress"}
                {UploadButton == "try" && "Try-Again"}
                {UploadButton == "done" && "Done"}
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true"> {UploadButton == "stop" && "Upload"}
                {UploadButton == "start" && "Start"}
                {UploadButton == "process" && "In-Progress"}
                {UploadButton == "try" && "Try-Again"}
                {UploadButton == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true"> {UploadButton == "stop" && "Upload"}
                {UploadButton == "start" && "Start"}
                {UploadButton == "process" && "In-Progress"}
                {UploadButton == "try" && "Try-Again"}
                {UploadButton == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true"> {UploadButton == "stop" && "Upload"}
                {UploadButton == "start" && "Start"}
                {UploadButton == "process" && "In-Progress"}
                {UploadButton == "try" && "Try-Again"}
                {UploadButton == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true"> {UploadButton == "stop" && "Upload"}
                {UploadButton == "start" && "Start"}
                {UploadButton == "process" && "In-Progress"}
                {UploadButton == "try" && "Try-Again"}
                {UploadButton == "done" && "Done"}</span>
  </a>
            
            </div>

            <h6 className="text-center">Publish NFT</h6>
            <p className="font_12 text-center px-md-3">Commonly known as minting: "Minting" an NFT means creating a unique digital asset on a blockchain network that verifies its authenticity, ownership and scarcity</p>
            <div className="place_bid_modalbtn m-3 load_more_btn_align">
            <a data-ignore-split="true" class="Button"  id=""  disabled={
                 UploadButton != "done" || MintButton == "process" || MintButton == "done" ? true : false
                }
                onClick={
                  MintButton == "start" || MintButton == "try" ? MintCall : null
                } tabindex="0" aria-label="">
     {" "}
                {MintButton == "stop" && "Mint"}
                {MintButton == "start" && "Start"}
                {MintButton == "process" && "In-Progress"}
                {MintButton == "try" && "Try-Again"}
                {MintButton == "done" && "Done"}
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true"> {" "}
                {MintButton == "stop" && "Mint"}
                {MintButton == "start" && "Start"}
                {MintButton == "process" && "In-Progress"}
                {MintButton == "try" && "Try-Again"}
                {MintButton == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true"> {" "}
                {MintButton == "stop" && "Mint"}
                {MintButton == "start" && "Start"}
                {MintButton == "process" && "In-Progress"}
                {MintButton == "try" && "Try-Again"}
                {MintButton == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true"> {" "}
                {MintButton == "stop" && "Mint"}
                {MintButton == "start" && "Start"}
                {MintButton == "process" && "In-Progress"}
                {MintButton == "try" && "Try-Again"}
                {MintButton == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true"> {" "}
                {MintButton == "stop" && "Mint"}
                {MintButton == "start" && "Start"}
                {MintButton == "process" && "In-Progress"}
                {MintButton == "try" && "Try-Again"}
                {MintButton == "done" && "Done"}</span>
  </a>
            
            </div>
            
 
            </>
            :
            <>
            <h5 className="text-center">Publish NFT</h5>
            <p className="font_12 text-center">Commonly known as minting: "Minting" an NFT means creating a unique
digital asset on a blockchain network that verifies its authenticity,

ownership and scarcity</p>
            <div className="place_bid_modalbtn mt-3 load_more_btn_align">
              <button
                type="button"
                class="btn  loadMore_btn me-2  modal_btn_align"
                disabled={
                  BulkButton == "process" || BulkButton == "done" ||BulkButton == "mint"|| ApproveButton == "process" ? true : false
                }
                onClick={
                  BulkButton == "start" || BulkButton == "try" ? BulkMintCall: null
                }
               >
                {BulkButton == "start" && "Start"}
                {BulkButton == "process" && "processing ..."}
                {BulkButton == "mint" && "minting ..."}             
                {BulkButton == "try" && "try-again"}
                {BulkButton == "done" && "Done"}


              </button>



            </div></>
            
            }

          </div>
        </Modal.Body>
      </Modal>
      {/* Calendar Modal */}

      

      <Modal
        show={showCalender}
        onHide={handleCloseMint}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop={false}
        className="datepicker_modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Choose Date
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal_calendar_align">
            <Datetime
              input={false}
              isValidDate={valid}
              className="w-100"
              timeFormat="HH:mm:ss"
              timeConstraints={{
                hours: { min: new Date(Date.now()).getHours(), max: 23 },
              }}
              onChange={(value) => {
                Auctionset(value);
              }}
            />
          </div>
          <div className="connecwalletbtns">
            <a
              className="connectwallet"
              tabIndex="-1"
              aria-disabled="true"
              onClick={() => setShowCalender(false)}
            >
              Done
            </a>
          </div>
        </Modal.Body>
      </Modal>
      {/* End of Calendar Modal */}
    </>
  );
}

export default TabsContent;
 
