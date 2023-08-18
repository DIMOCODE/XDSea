


import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { Accordion } from 'react-bootstrap';
import TokenCard from "../Components/tokencard.js"
import LoaderCard from "../Components/loadercard.js"
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { Token_List_Func } from "../actions/axioss/nft.axios.js";
import Offcanvas from 'react-bootstrap/Offcanvas';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
// import InfiniteScroll from "react-infinite-scroller";
import InfiniteScroll from "react-infinite-scroll-component";



toast.configure();


function FilterContent(props) {


  const location = useLocation();
  const navigate = useNavigate();

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


  ///   Explore page 
  const { category } = useParams()

 
  
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const { ...rest } = props;
  const { Categorys } = useSelector((state) => state.LoginReducer);
  const { payload } = useSelector((state) => state.LoginReducer.User);

  const [TabName, SetTabName] = useState("All");
  const [loadingtext, setloadingtext] = useState(false);
  const [TabArray, setTabArray] = useState(category ? [category] : [])
  const [TokenList, setTokenList] = useState([])
  const [pagecount, setpagecount] = useState(1)
  const [showLoadMore, setShowLoadMore] = useState(true)
  const [hasMoreForcol, setHasmoreForCol] = useState(true)
  const [skip, setSkip] = useState(0)
  const [Tokens, SetTokens] = useState({
    All: { loader: true, page: 1, list: [] },
  });

  const Tabname = (newValue) => {
    SetTabName(newValue);
    setSkip(0)
    setTokenList([])
  };
  useEffect(() => {
    setloadingtext(true)
    Explore();

  }, [TabName]);

  // param based call

  useEffect(() => {
    if (category) {
      Tabname(category)
    }

  }, [category])

  const [loadstate, setloadstate] = useState({
    "All": true,
    "Art": true,
    "Collectibles": true,
    "Utility": true,
    "Gaming": true,
    "PFP": true,
    "Photography": true,
    "Staking": true,
    "FixedPrice": true,
    "TimedAuction": true,
    "UnlimitedAuction": true,
    "Staking": true,
    "old": true,
    "Recent": true,
    "PriceHighToLow": true,
    "PriceLowToHigh": true,
  })

  const Explore = async (data, oldtabname) => {
    var iscategory = false
    if (TabName == "All") iscategory = true
    else if (TabName == "Staking") iscategory = false
    else {

      var categorytest = Categorys.filter((data) => data?.label.replace(/\s/g, '') == TabName)
      if (categorytest.length) iscategory = true
    }

    var page = data ? data : pagecount;
    var SendDATA = {
      TabName: !iscategory ? TabName : category,
      limit: 12,
      ProfileUrl: payload?.ProfileUrl ? payload.ProfileUrl : "",
      page: page ?? 1,
      skip: skip,
      from: "Explore",
      isCategory: iscategory ? "category" : "notcategory"
    };
    let Resp = await Token_List_Func(SendDATA);
    if (Resp?.data?.length > 0) {
      setSkip(skip + 12)
      setloadingtext(false)
      if (oldtabname == TabName && Resp?.data?.length == 0 || Resp?.data?.length < 12) {
        setHasmoreForCol(false)
        setloadstate({ ...loadstate, ...{ [TabName]: false } })
        // setShowLoadMore(false) 
      } else {
        // setHasmoreForCol(false)
        setloadstate({ ...loadstate, ...{ [TabName]: true } })
      }
      TokenList.length == 0 ? setTokenList(Resp.data) : setTokenList([...TokenList, ...Resp?.data])
    } else {
      setloadingtext(false)
      setHasmoreForCol(false)
      SetTokens({
        ...Tokens,
        ...{
          [TabName]: {
            list: Tokens[TabName]?.list,
            loader: false,
            page: Tokens[TabName]?.page,
          },
        },
      });
    }
  };
  const LoadMore = () => {
    setTimeout(() => {
      setloadingtext(false)
      var changepage = pagecount + 1
      setpagecount(changepage)
      Explore(changepage, TabName);
    }, 150)

 

  };
  const [checkfilter, setcheckfilter] = useState("")



  const Arr = async (tabname) => {
    if (TabArray.includes(tabname)) {
      setTabArray(TabArray.filter((cat => cat != tabname)))
 

    } else {

      setTabArray([...TabArray, tabname]);
    }

  }





  return (
    <>
      <Container>
        {/* <h1 className='mt-3'>Explore Creations</h1> */}
        <h4 className='mt-3 explore_heading_align'>Shop all</h4>
        <Row className='mt-4'>
         
 
          <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
            <Row className='triple_filters_align'>
              <Col className='mb-2 shopall_drpmenu' xxl={3} xl={3} lg={3} md={3} sm={3} xs={12}>
                <DropdownButton className='fil_cat_tabs' id="dropdown-basic-button" title="Category">
                  {Categorys && Categorys.map((data) => {
                    return (
                      <>
                        {/* <Link to={`/explore/${data?.label.replace(/\s/g, '')}`}> */}
                        <Dropdown.Item className='fil_drp_items' onClick={() => {
                          Tabname(data?.label.replace(/\s/g, ''))
                          navigate(`/explore/${data?.label.replace(/\s/g, '')}`)
                        }}>{data.label}</Dropdown.Item>
                        {/* </Link> */}
                      </>

                    )
                  })
                  }
                </DropdownButton>

              </Col>
              <Col className='mb-2 shopall_drpmenu' xxl={3} xl={3} lg={3} md={3} sm={3} xs={12}>
                {/* <button className='all_nft_filters'><i class="bi bi-funnel"/> &nbsp;Filter</button> */}
                <DropdownButton className='fil_filter_tabs' id="dropdown-basic-button" title="Filter">
                  <Dropdown.Header className='dpr_shopall_head'>Sale Type :</Dropdown.Header>
                  <Dropdown.Divider />

                  <Dropdown.Item className='fil_drp_items' onClick={() => { Tabname("FixedPrice") }}>Sale</Dropdown.Item>
                  <Dropdown.Item className='fil_drp_items' onClick={() => {Tabname("TimedAuction") }}>Timed Auction</Dropdown.Item>
                  <Dropdown.Item className='fil_drp_items' onClick={() => { Tabname("UnlimitedAuction") }}>Not for Sale</Dropdown.Item>
                  <Dropdown.Item className='fil_drp_items' onClick={() => {
                    navigate(`/explore/Staking`)
                    Tabname("Staking")
                  }}>Staking</Dropdown.Item>

                </DropdownButton>



              </Col>

              <Col className='mb-2 shopall_drpmenu' xxl={3} xl={3} lg={3} md={3} sm={3} xs={12}>
                {/* <button className='all_nft_filters' ><i class="fa-solid fa-arrow-down-wide-short"/>&nbsp;Sort</button> */}
                <DropdownButton className='fil_filter_tabs fil_sort_tabs' id="dropdown-basic-button" title="Sort">

                  <Dropdown.Item className='fil_drp_items' onClick={() => { Tabname("old") }}>Oldest</Dropdown.Item>
                  <Dropdown.Item className='fil_drp_items' onClick={() => { Tabname("Recent") }}>Newest</Dropdown.Item>
                  <Dropdown.Item className='fil_drp_items' onClick={() => { Tabname("PriceHighToLow") }}>Highest Price</Dropdown.Item>
                  <Dropdown.Item className='fil_drp_items' onClick={() => { Tabname("PriceLowToHigh") }}>Lowest Price</Dropdown.Item>
                 

                </DropdownButton>

              </Col>
            </Row>
          </Col>


          <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12} className='mt-3'>
            <Row>
              {(TokenList && TokenList.length > 0) ?
                (
                <>
                 
 <InfiniteScroll
  dataLength={TokenList.length} //This is important field to render the next data
  next={LoadMore}
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
                      {
                        TokenList.map((data, index) => {
                          return (
                            <Col xxl={4} xl={4} lg={4} md={12} sm={6} xs={12}>

                              <TokenCard
                                data={data}
                              />
                            </Col>
                            // <Col xxl={4} xl={4} lg={4} md={12} sm={12} xs={12}>
                            //   <div className="card">



                            //                 <img src={data.NFTOrginalImage} className="mui-img-fluid" />
                            //                 <div className="collection-info">
                            //                 <p className="collections-title">{data?.NFTName}</p>
                            //                 <p className="collections-description">{data?.NFTOwner}</p>
                            //                 </div>
                            //             </div>
                            //             <div className="collection-button">
                            //                 <button className="banner-button">View NFT</button>
                            //                 </div>
                            //   </Col>


                          )
                        })
                      }
                    </div>
                  </InfiniteScroll>
                </>)
                :
                <div className='noitems_found_align'>
                  <h3 >No Items Found</h3>
                </div>
              }

            </Row>


          </Col>
        </Row>
        {/* {showLoadMore && */}
        {/* {loadstate[TabName] &&

          <div className='load_more_btn_align my-4 '>

            <a data-ignore-split="true" class="Button" id="" onClick={() => LoadMore()} tabindex="0" aria-label="">
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



      </Container>
 
    </>
  )
}


export default FilterContent

