import React,{ useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

import useContractProviderHook from "../actions/contractProviderHook.js";
import {   useNavigate } from "react-router-dom";
 
import { Container,Dropdown,DropdownButton,Modal,Button,Row,Col,Form,InputGroup } from 'react-bootstrap'
 
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {Link} from "react-router-dom";
import { toast } from "react-toastify";
import config from "../config/config.js"
import moment from "moment"
import { isEmpty, NumANdDotOnly } from "../actions/common";
import { CreateOrder } from "../actions/axioss/nft.axios";

toast.configure();


export function PutOnSaleModal({owner, types, closePop, file, type, thumb, item,placeoredit}) {
 

const handleClose8 = () => setShow8(false);
  const [show4, setShow4] = useState(true);
  const [show8, setShow8] = useState(false);
  const handleClose4 = () => setShow4(false);
  const [BtnData, SetBtnData] = useState("start");
  const [TokenBtn, SetTokenBtn] = useState("start");
  const [Mintbtn, SetMintbtn] = useState("start");
  const [dropdown, setdropdown] = useState(false);
  const [dropdown1, setdropdown1] = useState(false);
  const [modal, setModal] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const { currency } = useSelector((state) => state.LoginReducer);
  const ContractCall = useContractProviderHook();
  const push = useNavigate();

  const { payload } = useSelector((state) => state.LoginReducer.User);
  const { web3 } = useSelector((state) => state.LoginReducer.AccountDetails);
  const { sellerFees } = useSelector((state) => state.LoginReducer.ServiceFees);

  const [FormValue, SetFormValue] = useState(item);
  const [ValidateError, SetValidateError] = useState({});

  const stylesselect = {
    option: (styles, {isFocused, isSelected,isHovered}) => ({
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

  useEffect(() => {
    if (!FormValue.CoinName) {
      SetFormValue({
        ...FormValue,
        ...{ ["CoinName"]: currency[0]?.label ?? config.COIN_NAME },
      });
    }

    SetFormValue({ ...FormValue, ...{ ["EmailId"]: payload.EmailId } });
  }, [currency]);

  const TokenApproveCall = async () => {
    SetTokenBtn("process");
    const id = toast.loading("Approve Processing");
    const cont = await ContractCall.SetApproveStatus(
      FormValue.ContractType == 721 || FormValue.ContractType == "721"
        ? "Single"
        : "Multiple",
      FormValue.ContractAddress
    );
    toast.update(id, {
      render: cont ? "Approved Successfully" : "Approved Failed",
      type: cont ? "success" : "error",
      isLoading: false,
      autoClose: 1000,
      closeButton:true,
      closeOnClick:true
    });
    if (cont.status) {
      SetTokenBtn("done");
      SetBtnData("process");
    } else SetTokenBtn("try");
  };

  const onSelectChange = (e, data) => {
    SetBtnData("start");

    const id = "CoinName";
    //console("ada", e,id)
    const { label, value } = e;
    SetFormValue({ ...FormValue, ...{ [id]: value } });
  };

  const YouWillGet = useMemo(() => {
    return ContractCall.price_calculation(FormValue.NFTPrice);
  }, [FormValue.NFTPrice]);

  const onChange = (e) => {
    const { files, value, id } = e.target;
 
    SetBtnData("start");
    // var price = NumANdDotOnly(value)
    // console.log("price@1243",price);
    SetFormValue({ ...FormValue, ...{ [id]: NumANdDotOnly(value) } });
  };

  const FormSubmit = async () => {
    SetBtnData("start");
    const id = toast.loading("Validating Form");
    var Error = await Validation(FormValue);
    SetBtnData("process");
    if (isEmpty(Error)) {
      let Respc = await ContractCall.Contract_Base_Validation();
      if (!Respc) {
        let Statu = await ContractCall.GetApproveStatus(
          FormValue.ContractType == 721 || FormValue.ContractType == "721"
            ? "Single"
            : "Multiple",
          FormValue.ContractAddress
        );
        if (Statu == true) {
          setShow4(false);
          setShow8(true);
          SetBtnData("process");
          toast.update(id, {
            render: (placeoredit?"Updating Price":"Listing NFT for Sale"),
            type: "success",
            isLoading: false,
            autoClose: 1000,
            closeButton:true,
            closeOnClick:true
          });
        } else {
          setShow4(false);
          setShow8(true);
          SetBtnData("open");
          toast.update(id, {
            render: "Get APProve",
            type: "success",
            isLoading: false,
            autoClose: 1000,closeButton:true,closeOnClick:true
          });
        }
      } else {
        SetBtnData("error");
        SetValidateError(Respc);
      }
    } else {
      toast.update(id, {
        render: "Check Fields",
        type: "error",
        isLoading: false,
        autoClose: 1000,closeButton:true,closeOnClick:true
      });
      SetBtnData("error");
      SetValidateError(Error);
    }
  };
  const closemodal = () => SetBtnData("start");

  const Validation = async(data) => {
    let ValidateError = {};
    const { NFTPrice, CoinName, PutOnSaleType, ClockTime, EndClockTime, NFTQuantity, ContractType } = data;
    
    if( isEmpty(NFTPrice)) ValidateError.NFTPrice = "Token Price Required";
    if( isEmpty(CoinName))  ValidateError.CoinName = "CoinName Required";
    if (
      (PutOnSaleType == "FixedPrice" || PutOnSaleType == "TimedAuction") &&
      isEmpty(NFTPrice)
    )
      ValidateError.NFTPrice = "Token Price Required";
    if (
      (PutOnSaleType == "FixedPrice" || PutOnSaleType == "TimedAuction") &&
      !CoinName
    )
      ValidateError.CoinName = "CoinName Required";
    if (PutOnSaleType == "TimedAuction" && !ClockTime)
      ValidateError.ClockTime = "ClockTime Required";
    if (PutOnSaleType == "TimedAuction" && !EndClockTime)
      ValidateError.EndClockTime = "EndClockTime Required";
    if(ContractType === '1155' || ContractType === 1155){
      if(Number(NFTQuantity) > Number(owner?.NFTBalance)){
        ValidateError.NFTQuantity = "Quantity Must Be Less Than "+owner?.NFTBalance
      }
    }
    return ValidateError;
  };

  const onChangeTab = (e, newValue) => {
    SetBtnData("start");
    SetFormValue({
      ...FormValue,
      ...{ ["PutOnSaleType"]: newValue, ["FixedPrice"]: "", ["CoinName"]: "" },
    });
  };

  const onSlectDate = (data, up) => {
    SetBtnData("start");
    setdropdown(false);
    setdropdown1(false);
    if (up == "RightAfterClick") {
      var date = new Date().setMinutes(20);
    } else if (up == "one" || up == "two") {
      var date = new Date().setDate(
        up == "one"
          ? 1 + new Date().getDate()
          : up == "two"
          ? 2 + new Date().getDate()
          : 0
      );
    } else setModal(data);

    var formvalue = {
      ...FormValue,
      ...{ [data]: moment(date).format("YYYY-MM-DD HH:mm:ss") },
    };
    SetFormValue(formvalue);
  };

  const setClockValue = (data, date) => {
    SetFormValue({
      ...FormValue,
      ...{ [data]: moment(date).format("YYYY-MM-DD HH:mm:ss") },
    });
  };

  async function ListCall() {
    const id = toast.loading("Listing Processing");
    SetMintbtn("process");
    if (FormValue.PutOnSaleType == "FixedPrice") {
      var error = await ContractCall.Contract_Base_Validation();
      if (error)
        toast.update(id, {
          render: error,
          type: "error",
          isLoading: false,
          autoClose: 1000,closeButton:true,closeOnClick:true
        });
      else {

  
        const cont = await ContractCall.place_order_721_1155(
          owner.NFTId,
          web3.utils.toWei(FormValue.NFTPrice?.toString()),
          FormValue.ContractAddress,
          Number(FormValue.ContractType),
          "data"
        );
        
        // const cont = await ContractCall.place_order_721_1155(
        //   "0x51cd989e1163abf8262bfcd7eb782d6ce1c1074a","1687158729",1
        // );

        // const cont = await ContractCall.place_order_721_1155(
        //   "0xFC8fd5C4CfE35b0AD7f1b02C851968E42F85e45A","1686585671"
        //   // "0x4101e8ad5a9977dd23421f6404c6d0449be0e813","1687158729"
        // );

        if (cont) {
          let _data = FormValue;
          _data.NFTOwner = payload.WalletAddress;
          _data.HashValue = cont.HashValue;
          _data.NFTId = owner.NFTId;
          _data.activity = "PutOnSale";
          _data.CollectionName = owner.CollectionName;   
          _data.click = `${config.FRONT_URL}/info/${FormValue.CollectionNetwork}/${FormValue.ContractAddress}/${owner.NFTOwner}/${owner.NFTId}`;
          BackCall(id, _data);
        } else {
          toast.update(id, {
            render: "Transaction Failed",
            type: "error",
            isLoading: false,
            autoClose: 1000,closeButton:true,closeOnClick:true
          });
          SetMintbtn("try");
        }
      }
    } else {
      let _data = FormValue;
      _data.NFTOwner = payload.WalletAddress;
      _data.HashValue = "";
      _data.NFTId = owner.NFTId;
      _data.activity = "PutOnSale";
      _data.click = `${config.FRONT_URL}/info/${FormValue.CollectionNetwork}/${FormValue.ContractAddress}/${owner.NFTOwner}/${owner.NFTId}`;

      BackCall(id, _data);
    }
  }
  const BackCall = async (id, _data) => {
    let Resp = await CreateOrder(_data);
    if (Resp.success == "success") {
      toast.update(id, {
        render: "Listed Successfully",
        type: Resp.success,
        isLoading: false,
        autoClose: 1000,closeButton:true,closeOnClick:true
      });
      SetMintbtn("done");
      push("/my-item/" + payload.CustomUrl);
    } else {
      toast.update(id, {
        render: "Transaction Failed",
        type: "error",
        isLoading: false,
        autoClose: 1000,closeButton:true,closeOnClick:true
      });
      SetMintbtn("try");
    }
  };

    return(
   <>     
<Modal
        show={show4}
        // onHide={closePop}
        backdrop="static"
        keyboard={false}
        scrollable={false}
        centered
        className='whole_modal_text_align'
      >
 
        <Modal.Header className="modal_theme_align"  >
        
      
 
          <Modal.Title>{placeoredit?"Update Price":"Put On Sale"}</Modal.Title>
          <button
 
 type="button"
 class="btn-close"
 aria-label="Close"
 onClick={closePop}
></button>
 
        </Modal.Header >
        <Modal.Body className='common_modal_body modal_theme_align'>
        {/* <div className="burn_tokem_img_align d-flex justify-content-center w-100">
                <img className=" burn_token_img" src={require('../app/assets/images/collection.png')} alt="" />
                </div> */}

{/* <p className="placebid_hint_text mt-3">Your about to sale space NFT for 
                  <span className="placebid_span_text"> qwei2y39whdgfhwthqw </span>
                </p> */}
                <p className="placebid_hint_text mt-3">Enter Price
                  <span className="placebid_span_text">  </span> 
                </p>
                {/* <div className='d-flex justify-content-center w-100'>
                <b className=' putonsale_title'>Quantity 1</b>
                </div>

                <div className='puton_sale_switch_dtls mt-3 d-flex justify-content-between'>
                    <div className='text_dtls_swtich'>
                      <h6>Put On Sale</h6>
                      <small>You will receive bids on this item</small>
                    </div>
                    <div className='switch_content'>
                    <div className='toggle_switch'>
                                    <label class="switch">
  <input type="checkbox"/>
  <span class="slider round"></span>
</label>
                                    </div>
                    </div>
                </div>

                <div className='selection_options_modal mt-3 w-100'>
                                        <Row>
                                            <Col className='mb-3 d-flex justify-content-center' xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                                            <div className='select_option_fixedPrice_modal '>
                                        <i class="bi bi-tag tag_icon"></i>
                                        <p className='select_option_fixedPrice_txt'>Fixed Price</p>
                                        </div>

                                            </Col>
                                            <Col className='mb-3 d-flex justify-content-center' xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                                            <div className='select_option_fixedPrice_modal '>
                                        <i class="bi bi-clock tag_icon"></i>
                                        <p className='select_option_fixedPrice_txt'>Timed Auction</p>
                                        </div>
                                        </Col>
                                           
                                        </Row>
                                        
                                        
                                        
                                    </div> */}

                                    <div className='input_dtls_area_one w-100 '>
  <InputGroup className="mb-3">
        <Form.Control
          placeholder="e.g.10"
          aria-label="Recipient's username"
          className='baseName_inputgroup'
          aria-describedby="basic-addon3"
                              maxLength=""                
                              autoComplete="off"
                              id="NFTPrice"
                              onChange={onChange}
                              value={FormValue.NFTPrice}
                              // value={NFTFormValue.NFTPrice}
        />
        {/* {(FormValue.PutOnSaleType == "FixedPrice" ||
                          FormValue.PutOnSaleType == "TimedAuction") &&
                          ValidateError.NFTPrice && (
                            <div className="error_msg">
                              {ValidateError.NFTPrice}
                            </div>
                          )} */}
          
       
        <InputGroup.Text id="basic-addon2" className="input_group_text_align">
          <Select
                                                defaultValue={selectedOption}
                                                isSearchable={false}
                                                
                                                // options={currency.filter(item => item.label !== config.COIN_NAME)}                        
                                                
                                                
                                                onChange={(e) => onSelectChange(e, "price")}
                                                value={
                                                  FormValue.PutOnSaleType
                                                    ? FormValue.PutOnSaleType == "FixedPrice"
                                                      ? {
                                                          label: FormValue.CoinName,
                                                          value: FormValue.CoinName,
                                                        }
                                                      : currency.filter(
                                                          (item) => item.value !== "ETH"
                                                        )[0]
                                                    : currency[0]
                                                }
                                                options={
                              FormValue.PutOnSaleType == "FixedPrice"
                                ? currency
                                : currency.filter((item) => item.value != "ETH")
                            }
                            id="CoinName"
                            classNamePrefix="react-select"
                                                // onChange={(e) =>
                                                //   setNFTFormValue({
                                                //     ...NFTFormValue, placeholder="e.g.10"
                                                //     ...{ ["CoinName"]: e.label },
                                                //   })
                                                // }
                                                styles={stylesselect} className="border_blue_selectOne"
 
                                            />
                     
                                            </InputGroup.Text>
      </InputGroup>
      {(FormValue.PutOnSaleType == "FixedPrice" ||
                          FormValue.PutOnSaleType == "TimedAuction") &&
                          ValidateError.NFTPrice && (
                            <div className="error_msg">
                              {ValidateError.NFTPrice}
                            </div>
                          )}
      {(FormValue.PutOnSaleType == "FixedPrice" ||
                          FormValue.PutOnSaleType == "TimedAuction") &&
                          ValidateError.CoinName && (
                            <div className="text-danger img-file">
                              {ValidateError.CoinName}
                            </div>
                          )}
 
    
      </div>

      {FormValue.PutOnSaleType == "FixedPrice" && (

<div className='simple_table_dtls mt-3  w-100'>

<div className="common_modal_table_dtls w-100">

   

    <span className="placebid_dtls_txt">Service fee</span>
    <span className="placebid_dtls_txt">{web3.utils.fromWei(String(sellerFees))}%</span>
</div>

<div className="common_modal_table_dtls w-100">
    <span className="placebid_dtls_txt">You will get</span>
    <span className="placebid_dtls_txt">{YouWillGet ?? 0}</span>
</div>


</div>)}

<div className="place_bid_modalbtn mt-3 load_more_btn_align">
                {/* <button type="button" class="btn loadMore_btn w-00  modal_btn_align" onClick={BtnData == "start" ? FormSubmit : ""}>
                {BtnData == "start" && "Put on Sale"}
                {BtnData == "error" && "Put on Sale"}
                {BtnData == "process" && "processing"}
                {BtnData == "done" && "Done"}
                </button> */}



                <a data-ignore-split="true" onClick={BtnData == "start" ? FormSubmit : ""} class="Button"  id=""  tabindex="0" aria-label="">
                {BtnData == "start" && (placeoredit?"Update Price":"List NFT for sale")}
                {BtnData == "error" && (placeoredit?"Update Price":"List NFT for sale")}
                {BtnData == "process" && "processing"}
                {BtnData == "done" && "Done"}
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">{BtnData == "start" &&(placeoredit?"Update Price":"List NFT for sale")}
                {BtnData == "error" && (placeoredit?"Update Price":"List NFT for sale")}
                {BtnData == "process" && "processing"}
                {BtnData == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true">{BtnData == "start" && (placeoredit?"Update Price":"List NFT for sale")}
                {BtnData == "error" && (placeoredit?"Update Price":"List NFT for sale")}
                {BtnData == "process" && "processing"}
                {BtnData == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true">{BtnData == "start" && (placeoredit?"Update Price":"List NFT for sale")}
                {BtnData == "error" && (placeoredit?"Update Price":"List NFT for sale")}
                {BtnData == "process" && "processing"}
                {BtnData == "done" && "Done"}</span>
    <span class="Button-hover-content" aria-hidden="true">{BtnData == "start" && (placeoredit?"Update Price":"List NFT for sale")}
                {BtnData == "error" && (placeoredit?"Update Price":"List NFT for sale")}
                {BtnData == "process" && "processing"}
                {BtnData == "done" && "Done"}</span>
  </a>
                
              </div>


      

   
        </Modal.Body>
       
      </Modal>

 
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
            onClick={closePop}
          ></button>
</Modal.Header>
<Modal.Body className='burn_token_body  modal_theme_align common_modal_body'>
{BtnData == "open" && (

        <div className="procedd_modals_dtls_align mt-3">
            <>
        <span className=" proceed_modal_text_align  mt-3"> Approve your NFT</span>
        {/* <span  className=" proceed_modal_text_align  mt-3">This Process Take One Time Gas Fees</span> */}


        <button type="button" class="btn info_bidnow_btn w-100 modal_btn_align mt-3"
        disabled={
            TokenBtn == "process" || TokenBtn == "done" ? true : false
          }
          onClick={
            TokenBtn == "start" || TokenBtn == "try"
              ? TokenApproveCall
              : null
          }>
        {TokenBtn == "start" && "Confirm"}
                {TokenBtn == "process" && "In-Progress"}
                {TokenBtn == "try" && "Try-Again"}
                {TokenBtn == "done" && "Done"}
        </button>
        </>
      </div>
           )} 

      <div className="procedd_modals_dtls_align mt-3">
        {/* <p className="placebid_hint_text mt-3">Put On Sale</p>
        <p>Call contract method</p> */}

        <p className="placebid_hint_text mt-3">List your NFT</p>

        <button type="button" class="btn info_bidnow_btn w-100 modal_btn_align" 
         disabled={
            Mintbtn == "process" || Mintbtn == "done" ? true : false
          }
          onClick={Mintbtn == "start" || Mintbtn == "try" ? ListCall : ""}
>
        {Mintbtn == "start" && "List"}
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