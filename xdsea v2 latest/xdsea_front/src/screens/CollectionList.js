
import React, { useState, useEffect } from 'react'
import { Container, Dropdown, DropdownButton, Modal, Button, Col, Row } from 'react-bootstrap'
import Header from '../app/Header'
import Footer from '../app/Footer'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Link, useLocation, useParams } from "react-router-dom";

import { GetTopCollections } from "../../src/actions/axioss/nft.axios.js"
import config from "../config/config.js"
// import InfiniteScroll from "react-infinite-scroller";
import InfiniteScroll from "react-infinite-scroll-component";


function CollectionList() {

  const { category } = useParams()

  const { Categorys } = useSelector((state) => state.LoginReducer);

  const [TabName, SetTabName] = useState("Recent");
  const [TabArray, setTabArray] = useState(category ? [category] : [])
  const [hasMoreForcol, setHasmoreForCol] = useState(true)
  const [skip, setSkip] = useState(0)

  const Tabname = (newValue) => {
 
 
    setSkip(0)
 
    SetTabName(newValue);
    // setHasmoreForCol(false)
    setCollectionList([])
    setTabArray([])
  };


  const location = useLocation();
  const { Creator } = useParams()

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  const [showBurnToken, setShowBurnToken] = useState(false);
  const handleCloseBurnToken = () => setShowBurnToken(false);
  const handleShowBurnToken = () => setShowBurnToken(true);

  const [showTransferToken, setShowTransferToken] = useState(false);
  const handleCloseTransferToken = () => setShowTransferToken(false);
  const handleShowTransferToken = () => setShowTransferToken(true);

  const [showReport, setShowReport] = useState(false);
  const handleCloseReport = () => setShowReport(false);
  const handleShowReport = () => setShowReport(true);

  const [showLowerPrice, setShowLowerPrice] = useState(false);
  const handleCloseLowerPrice = () => setShowLowerPrice(false);
  const handleShowLowerPrice = () => setShowLowerPrice(true);

  const [showBuyNow, setShowBuyNow] = useState(false);
  const handleCloseBuyNow = () => setShowBuyNow(false);
  const handleShowBuyNow = () => setShowBuyNow(true);

  const [showPlaceaBid, setShowPlaceaBid] = useState(false);
  const handleClosePlaceaBid = () => setShowPlaceaBid(false);
  const handleShowPlaceaBid = () => setShowPlaceaBid(true);

 
  useEffect(() => {
    window.scrollTo(0, 0);
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

  const [page, setPage] = useState(1)
  const [collectionList, setCollectionList] = useState([])
  const [LoadMore, setLoadMore] = useState(true)


  // console.log("loacalala",location.pathname);

  useEffect(() => {
    GetCollections()
  }, [page, TabName])


  const GetCollections = async () => {
    // console.log("location", Creator)
    var querydata = (location.pathname.includes("mycollections")) ? { filter: "mycollections", page: page, Creator: Creator, sortfilter: TabName, skip } : { filter: "collectionlist", page: page, sortfilter: TabName, skip }
    // console.log("querydata", querydata);
    var list = await GetTopCollections(querydata)
    // console.log("list?.data", list)
    // if(list.status) (collectionList.length == 0 ) ? setCollectionList(list?.data) :setCollectionList(collectionList => [...collectionList, ...list?.data])
    // if(list.status && list?.data.length <15) setLoadMore(false)
    if (list?.data.length == 0) {setLoadMore(false); setHasmoreForCol(false) }
    if (list.status && list?.data.length != 0) { collectionList.length == 0 ? setCollectionList(list?.data) : setCollectionList([...collectionList, ...list?.data]); setSkip(skip + 15); setHasmoreForCol(true) }
    else { setLoadMore(false); setHasmoreForCol(false) }

  }

  const loadMore = async () => {
    setTimeout(() => {
      GetCollections()
    }, 1000)
  }
 

  return (
    <>
      <Header />
      <Container className='mt-5'>



        <Row className='triple_filters_align'>
          {/* <Col className='mb-2' xxl={3} xl={3} lg={3} md={3} sm={3} xs={12}>

            <DropdownButton className='fil_cat_tabs' id="dropdown-basic-button" title="Category">
            {Categorys && Categorys.map((data)=>{
              return(
                <>
                  <Link to={`/explore/${data?.label.replace(/\s/g, '')}`}>
                <Dropdown.Item className='fil_drp_items' href={`/explore/${data?.label.replace(/\s/g, '')}`}  onClick={()=>{
                  Tabname(data?.label.replace(/\s/g, ''))
                }}>{data.label}</Dropdown.Item>
                </Link>
                </>

              )
            })
          }
      </DropdownButton>
            
            </Col> */}
          {/* <Col className='mb-2' xxl={3} xl={3} lg={3} md={3} sm={3} xs={12}>
              <button className='all_nft_filters'><i class="bi bi-funnel"/> &nbsp;Filter</button>
              <DropdownButton className='fil_filter_tabs' id="dropdown-basic-button" title="Filter">
              <Dropdown.Header>Sale Type</Dropdown.Header>

      <Dropdown.Item className='fil_drp_items' onClick={()=>{Tabname("FixedPrice")}}>Sale</Dropdown.Item>
      <Dropdown.Item className='fil_drp_items' onClick={()=>{Tabname("TimedAuction")}}>Timed Auction</Dropdown.Item>
      <Dropdown.Item className='fil_drp_items'  onClick={()=>{Tabname("UnlimitedAuction")}}>Not for Sale</Dropdown.Item>
    </DropdownButton>

    
              
            </Col> */}

          <Col className='mb-2' xxl={3} xl={3} lg={3} md={3} sm={3} xs={12}>
            {/* <button className='all_nft_filters' ><i class="fa-solid fa-arrow-down-wide-short"/>&nbsp;Sort</button> */}
            <DropdownButton className='fil_filter_tabs fil_sort_tabs' id="dropdown-basic-button" title="Sort">

              <Dropdown.Item className='fil_drp_items' onClick={() => { Tabname("old") }}>Oldest</Dropdown.Item>
              <Dropdown.Item className='fil_drp_items' onClick={() => { Tabname("Staking") }}>Staking</Dropdown.Item>
              <Dropdown.Item className='fil_drp_items' onClick={() => { Tabname("Recent") }}>Recent</Dropdown.Item>
              <Dropdown.Item className='fil_drp_items' onClick={() => { Tabname("volume") }}>Highest sales</Dropdown.Item>
              {/* <Dropdown.Item className='fil_drp_items' href="">Most Offers</Dropdown.Item>
      <Dropdown.Item className='fil_drp_items' href="">Least Offers</Dropdown.Item>
      <Dropdown.Item className='fil_drp_items' href="">A to Z</Dropdown.Item>
      <Dropdown.Item className='fil_drp_items' href="">Z to A</Dropdown.Item> */}

            </DropdownButton>

          </Col>
        </Row>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className="top-collections-box-banner">

          {collectionList && collectionList?.length > 0 ?
            (<>
              {/* <InfiniteScroll className="w-100"
                pageStart={1}
                loadMore={loadMore}
                hasMore={hasMoreForcol}
                threshold={0}
                loader={
                  <div style={{textAlign:"center"}} key={0}>
                    Loading ...
                  </div>
                }
              > */}
  <InfiniteScroll
  dataLength={collectionList?.length} //This is important field to render the next data
  next={loadMore}
  hasMore={hasMoreForcol}
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
                  {collectionList.map((data, index) => {
                    return (

                      <Grid item xl={2.4} lg={2.4} md={6} sm={6} xs={6}>
                        <Box className="card">
                          {(data?.isStakeable) &&
                            <div className='stack_star_btn'>
                              <p className='stack_badge'>Stake <i class="fa-solid fa-star stack_badge_star"></i></p>
                            </div>}
                          <img src={
                            (data?.profileImage) ?
                             (data?.profileImage)
                              : require("../app/assets/images/collection.png")} className="mui-img-fluid" />
                          <Box className="collection-info">
                            <p className="collections-title">{data?.collectionName}</p>
                            <p className="collections-description">{data?.customUrl.length > 15 ? data?.customUrl.slice(0, 15).concat('...') : data?.customUrl}</p>
                          </Box>
                        </Box>
                        <Link to={
                          // (String(data?.contractAddress).toLowerCase() != config.ERC721
                          // || String(data?.contractAddress).toLowerCase() != config.ERC1155
                          // || String(data?.contractAddress).toLowerCase() != config.TradeContract
                          // )
                          (data?.isImported)
                            ? `/importcollection/${data.Creator}/${data.customUrl}` : `/collection/${data.Creator}/${data.customUrl}`}>
                          <Box className="collection-button">
                            {/* <button className="banner-button banner_button_align"  ><span>View Collections</span></button> */}

                            <a data-ignore-split="true" class="Button" id="" tabindex="0" aria-label="">
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
                          </Box>
                        </Link>
                      </Grid>
                    )
                  })}
                </div>
              </InfiniteScroll>
            </>)
            : <h2 className='collectionnoitem'>No items found</h2>
          }
        </Grid>

        {/* {LoadMore &&

          <div className='load_more_btn_align my-4 '>

            <a data-ignore-split="true" class="Button" id="" onClick={() => {
              setPage(page + 1)
            }} tabindex="0" aria-label="">
              Load more
              <span class="Button-hover-helper"></span>
              <span class="Button-hover-helper"></span>
              <span class="Button-hover-helper"></span>
              <span class="Button-hover-helper"></span>
              <span class="Button-hover-content" aria-hidden="true">Load more</span>
              <span class="Button-hover-content" aria-hidden="true">Load more</span>
              <span class="Button-hover-content" aria-hidden="true">Load more</span>
              <span class="Button-hover-content" aria-hidden="true">Load more</span>
            </a>


          </div>} */}

        <div className='load_more_btn_align my-4 '>
          {/* <DropdownButton id="dropdown-basic-button" title="Dropdown button">
      <Dropdown.Item href="#" onClick={handleShow}>Put On Sale</Dropdown.Item>
      <Dropdown.Item href="#" onClick={handleShowBurnToken}>Burn Token</Dropdown.Item>
      <Dropdown.Item href="#" onClick={handleShowTransferToken}>Transfer Token</Dropdown.Item>
      <Dropdown.Item href="#" onClick={handleShowPlaceaBid}>Place a Bid</Dropdown.Item>
      <Dropdown.Item href="#" onClick={handleShowReport}>Report</Dropdown.Item>
      <Dropdown.Item href="#" onClick={handleShowLowerPrice}>Lower Price</Dropdown.Item>
      <Dropdown.Item href="#">Delete Sale</Dropdown.Item>
      <Dropdown.Item href="#" onClick={handleShowBuyNow}>Buy Now</Dropdown.Item>
      
    </DropdownButton> */}
        </div>
      </Container>
      <Footer />












      {/* Modal Contents */}


      {/* Put on Sale Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        scrollable={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Put On Sale</Modal.Title>
        </Modal.Header>
        <Modal.Body className='burn_token_body'>
          <div className="burn_tokem_img_align d-flex justify-content-center w-100">
            <img className=" burn_token_img" src={require('../app/assets/images/collection.png')} alt="" />
          </div>
          <p className="placebid_hint_text mt-3">Your about to place
            <span className="placebid_span_text"> qweqw </span> On Sale
          </p>

          <div className=" w-100 mt-2 author-area">

            <div className="item-form placea_bid_item_form">
              <div class="input-group form-group mt-3 placea_bid_input">
                <input type="text" class="form-control placea_bid_input" placeholder="Enter new price" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                <div class="input-group-append">
                  <span class="input-group-text placea_bid_input" id="basic-addon2">MATIC</span>
                </div>
              </div>
            </div>
          </div>
          <div className='w-100 placea_bid_dtls_align'>
            <div className="placea_bid_dtls w-100">
              <p className="placebid_dtls_txt">Seller service fee</p>
              <p className="placebid_dtls_txt">2.5%</p>
            </div>

            <div className="placea_bid_dtls w-100">
              <p className="placebid_dtls_txt">You will get</p>
              <p className="placebid_dtls_txt">0</p>
            </div>
          </div>

          <div className="place_bid_modalbtn mt-3">
            <button type="button" class="btn btn-secondary w-100 modal_btn_align">List NFT for sale</button>

          </div>
        </Modal.Body>

      </Modal>

      {/* End of Put on Sale Modal */}


      {/* Burn Token Modal */}

      <Modal
        show={showBurnToken}
        onHide={handleCloseBurnToken}
        backdrop="static"
        keyboard={false}
        centered
        scrollable={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Burn Token</Modal.Title>
        </Modal.Header>
        <Modal.Body className='burn_token_body'>
          <div className="burn_tokem_img_align d-flex justify-content-center w-100">
            <img className=" burn_token_img" src={require('../app/assets/images/collection.png')} alt="" />
          </div>
          <p className="placebid_hint_text mt-3">You are about to

            <span className="placebid_span_text"> Burn </span>the NFT{" "}
            <span className="placebid_span_text"> qweqw </span>
          </p>
          <p className="placebid_hint_text">You only own <b className="placebid_span_text">1</b> quantity</p>

          <div className=" w-100 mt-2 author-area">
            <div className="item-form placea_bid_item_form">
              <div className="form-group mt-3">
                <input
                  type="text"
                  className="form-control placea_bid_input"
                  name="name"
                  placeholder="Enter Quantity to Burn"
                  required="required"
                />
              </div>
            </div>
            <p className="text-center burn_token_valid_text mt-1">Please Enter  <span className="placebid_span_text">Valid Quantity(Max:1)</span></p>
          </div>


          <div className="place_bid_modalbtn">
            <button type="button" class="btn btn-secondary w-100 modal_btn_align">Burn Token</button>
            <button className="modal_btn_align w-100 cmn_cancel_btn">Cancel</button>
          </div>
        </Modal.Body>

      </Modal>

      {/* End of Burn Token Modal */}

      {/* Transfer Token Modal */}

      <Modal
        show={showTransferToken}
        onHide={handleCloseTransferToken}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Transfer Token</Modal.Title>
        </Modal.Header>
        <Modal.Body className='burn_token_body'>
          <div className="burn_tokem_img_align d-flex justify-content-center w-100">
            <img className=" burn_token_img" src={require('../app/assets/images/collection.png')} alt="" />
          </div>
          <p className="placebid_hint_text mt-3">You are about to

            <span className="placebid_span_text"> Transfer </span>the NFT{" "}
            <span className="placebid_span_text"> qweqw </span>
          </p>
          <p className="placebid_hint_text">You only own <b className="placebid_span_text">1</b> quantity</p>

          <div className=" w-100 mt-2 author-area">
            <div className="item-form placea_bid_item_form">
              <div className="form-group mt-3">
                <input
                  type="text"
                  className="form-control placea_bid_input"
                  name="name"
                  placeholder="Enter Quantity to Transfer"
                  required="required"
                />
              </div>
            </div>
            <p className="text-center burn_token_valid_text">Please Enter  <span className="placebid_span_text">Valid Quantity(Max:1)</span></p>
          </div>


          <div className="place_bid_modalbtn">
            <button type="button" class="btn btn-secondary w-100 modal_btn_align">Transfer Token</button>
            <button className="modal_btn_align w-100 cmn_cancel_btn">Cancel</button>
          </div>
        </Modal.Body>

      </Modal>

      {/* End of Transfer Token Modal */}

      {/* Report Modal */}
      <Modal
        show={showReport}
        onHide={handleCloseReport}
        backdrop="static"
        keyboard={false}
        centered
        scrollable={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Report this Profile ?</Modal.Title>
        </Modal.Header>
        <Modal.Body className='burn_token_body'>

          <p className="placebid_hint_text text-center mt-3">Tell us how this user violates the rules of the site
          </p>
          <div className=" w-100 mt-2 author-area">


            <h6 className=''>Message</h6>
            <div className="item-form placea_bid_item_form">

              <div class="input-group form-group mt-3 placea_bid_input">
                <textarea id="report" name="w3review" placeholder="Tell us some Details" rows="3" >

                </textarea>
              </div>

            </div>
          </div>
          <div className="place_bid_modalbtn">
            <button type="button" class="btn btn-secondary w-100 modal_btn_align">Report</button>

          </div>
        </Modal.Body>

      </Modal>


      {/* End of Report Modal */}

      {/* Lower Price Modal */}

      <Modal
        show={showLowerPrice}
        onHide={handleCloseLowerPrice}
        backdrop="static"
        keyboard={false}
        centered
        scrollable={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Lower Price</Modal.Title>
        </Modal.Header>
        <Modal.Body className='burn_token_body'>
          <div className="burn_tokem_img_align mt-3 d-flex justify-content-center w-100">
            <img className=" burn_token_img" src={require('../app/assets/images/collection.png')} alt="" />
          </div>
          <p className="placebid_hint_text mt-3">You are about to change price for
            <span className="placebid_span_text"> qweqw </span>
          </p>

          <div className=" w-100 mt-2 author-area">

            <div className="item-form placea_bid_item_form">
              <div class="input-group form-group mt-3 placea_bid_input">
                <input type="text" class="form-control placea_bid_input" placeholder="Enter new price" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                <div class="input-group-append">
                  <span class="input-group-text placea_bid_input" id="basic-addon2">MATIC</span>
                </div>
              </div>
            </div>
            <p className="text-center burn_token_valid_text">Price must be less than the actual price  <span className="placebid_span_text">0.1</span></p>
          </div>

          <div className="placea_bid_dtls w-100">
            <p className="placebid_dtls_txt">Seller service fee</p>
            <p className="placebid_dtls_txt">2.5%</p>
          </div>

          <div className="placea_bid_dtls w-100">
            <p className="placebid_dtls_txt">You will get</p>
            <p className="placebid_dtls_txt">0</p>
          </div>


          <div className="place_bid_modalbtn">
            <button type="button" class="btn btn-secondary w-100 modal_btn_align">Change Price</button>
          </div>
        </Modal.Body>

      </Modal>

      {/* End of Lower Price Modal */}

      {/* Buy Now Modal */}

      <Modal
        show={showBuyNow}
        onHide={handleCloseBuyNow}
        backdrop="static"
        keyboard={false}
        centered
        scrollable={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body className='burn_token_body'>
          <div className="placea_bid_dtls w-100  mt-3">
            <p className="text-white buynow_head_text">Seller</p>
            <p className="text-white buynow_head_text">Buyer</p>
          </div>
          <div className="placea_bid_dtls w-100">
            <p className="placebid_dtls_txt">0x025c1667</p>
            <p className="placebid_dtls_txt">01xa6532fd</p>
          </div>
          <h5>0.1 MATIC</h5>
          <div className="placea_bid_dtls w-100">
            <p className="placebid_dtls_txt">Your balance</p>
            <p className="placebid_dtls_txt">0.39692 MATIC</p>
          </div>
          <div className="placea_bid_dtls w-100">
            <p className="placebid_dtls_txt">Service fee</p>
            <p className="placebid_dtls_txt">0%</p>
          </div>
          <div className="placea_bid_dtls w-100">
            <p className="placebid_dtls_txt">Price of the NFT</p>
            <p className="placebid_dtls_txt">0.1</p>
          </div>



          <div className="place_bid_modalbtn">
            <button type="button" class="btn btn-secondary w-100 modal_btn_align" data-toggle="modal"
              data-target="#hideBuyNowModal"
            //  onClick={hideBuyNowModal}
            >Proceed to Payment</button>
            <button className="modal_btn_align w-100 cmn_cancel_btn">Cancel</button>
          </div>
        </Modal.Body>

      </Modal>

      {/* End of Buy Now Modal */}

      {/* Place a Bid Modal */}

      <Modal
        show={showPlaceaBid}
        onHide={handleClosePlaceaBid}
        backdrop="static"
        keyboard={false}
        centered
        scrollable={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body className='burn_token_body'>
          <div className="placea_bid_dtls w-100  mt-3">
            <p className="text-white buynow_head_text">Seller</p>
            <p className="text-white buynow_head_text">Buyer</p>
          </div>
          <div className="placea_bid_dtls w-100">
            <p className="placebid_dtls_txt">0x025c1667</p>
            <p className="placebid_dtls_txt">01xa6532fd</p>
          </div>
          <h5>0.1 MATIC</h5>
          <div className="placea_bid_dtls w-100">
            <p className="placebid_dtls_txt">Your balance</p>
            <p className="placebid_dtls_txt">0.39692 MATIC</p>
          </div>
          <div className="placea_bid_dtls w-100">
            <p className="placebid_dtls_txt">Service fee</p>
            <p className="placebid_dtls_txt">0%</p>
          </div>
          <div className="placea_bid_dtls w-100">
            <p className="placebid_dtls_txt">Price of the NFT</p>
            <p className="placebid_dtls_txt">0.1</p>
          </div>



          <div className="place_bid_modalbtn">
            <button type="button" class="btn btn-secondary w-100 modal_btn_align" data-toggle="modal"
              data-target="#hideBuyNowModal"
            //  onClick={hideBuyNowModal}
            >Proceed to Payment</button>
            <button className="modal_btn_align w-100 cmn_cancel_btn">Cancel</button>
          </div>
        </Modal.Body>

      </Modal>

      {/* End of Place a Bid Modal */}
      {/* End of Modal Contents */}
    </>
  )
}

export default CollectionList