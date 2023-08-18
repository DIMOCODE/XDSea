 import React,
{ useEffect,useState, useRef } from "react";
import Header from '../app/Header'
import Footer from '../app/Footer'
import { Row,Col,Nav,Tab, Container } from 'react-bootstrap'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Link,useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import {SearchAction} from "../actions/axioss/nft.axios"
import TokenCard from "../Components/tokencard.js"

function SearchPage() {

  useEffect(() =>{
    window.scrollTo(0,0);
},[])

  const navigate = useNavigate();

  const [topCollectionsList,setTopCollectionsList] = useState([]);

  const { key } = useParams()

  const [noitems, setnoitems] = useState(false);

  const [KeyVal, SetKeyVal] = useState(key);
	const [TabName, SetTabName] = useState("Items");
	const [Tokens, SetTokens] = useState({
		'Items': { loader: true, page: 1, list: [] },
	});



  const Tabname = ( newValue) => {
		SetTabName(newValue);
	};


  useEffect(() => {
    setnoitems(true)
		Explore('','',key);
	}, [KeyVal,key]);


	useEffect(() => {
		if (typeof Tokens[TabName] == "undefined") {
			Tokens[TabName] = { page: 1, list: [], loader: false };
    setnoitems(true)

			SetTokens(Tokens);
			Explore(1, TabName);
		}
	}, [TabName]);

  const Explore = async (data, tab,keys) => {
		var page = data ? data : Tokens[TabName]?.page;
		var SendDATA = {
			TabName: tab ? tab : TabName,
			limit: 1000,
			page: page ?? 1,
			from: "Explore",
			keyword : keys?keys:key,
			from:'Over All Search'
		};
		var Resp = await SearchAction(SendDATA); 
 
    
		if (Resp) {
    setnoitems(false)
       
			SetTokens({
				...Tokens,
				...{
					[TabName]: {
						list: [...Tokens[TabName].list??[],  ...(TabName === 'Items' ? Resp?.token?.data??[] : TabName === 'Users' ? Resp?.user?.msg??[] : TabName === 'Drops' ? Resp?.drop?.msg??[] :  TabName === 'Artist' ? Resp?.artist?.msg??[] : TabName === 'Collections' && Resp?.collection?.msg)],
						loader:
						TabName === 'Items' && Resp?.token?.data?.length === 0? false
								:TabName === 'Users' && 	Resp?.user?.msg.length === 0? false
								:	TabName === 'Drops' && Resp?.drop?.msg.length === 0? false
								:		TabName === 'Artist' && Resp?.artist?.msg.length === 0? false
								:		TabName === 'Collections' && Resp?.collection?.msg.length === 0? false
								:	 true,
						page: Tokens[TabName].page,
					},
				},
			});
		}
	};

  const LoadMore = () => {
		Tokens[TabName].page = Tokens[TabName].page + 1;
		SetTokens(Tokens);
		Explore(Tokens[TabName].page);
	};


 
  return (
    <>
    <Header/>
    <div className='container'>
    <Tab.Container id="left-tabs-example" className='all_tabs_align ' defaultActiveKey="first">
      <Row className='mt-4'>
        <Col xxl={12} xl={12} lg={12} md={12}  sm={12} xs={12}>
          <Nav variant="pills" className="flex-row">
            <Nav.Item className='myitems_tab_navitems'>
              <Nav.Link className='myitems_tab_navlinks' eventKey="first" onClick={()=>Tabname("Items")}>Token</Nav.Link>
            </Nav.Item>
            <Nav.Item className='myitems_tab_navitems'  >
              <Nav.Link className='myitems_tab_navlinks' eventKey="second" onClick={()=>Tabname("Users")}>User</Nav.Link>
            </Nav.Item>
            <Nav.Item className='myitems_tab_navitems'  >
              <Nav.Link className='myitems_tab_navlinks' eventKey="third" onClick={()=>Tabname("Collections")}>Collections</Nav.Link>
            </Nav.Item>
            
            
          </Nav>
        </Col>

        <Col  xxl={12} xl={12} lg={12} md={12}  sm={12} xs={12}>
        <Tab.Content>
            <Tab.Pane eventKey="first">
            <Container className='mt-3'>
                <Grid container rowSpacing={1} columnSpacing={{ xs:1, sm:2, md:3}} className="top-collections-box-banner">
                    
                    {/* <Grid item xl={2.4} lg={2.4} md={4} sm={6} xs={12}>
                        <Box className="card">
                            <img src={require("../app/assets/images/collection.png")} className="mui-img-fluid" />
                            <Box className="collection-info">
                            <p className="collections-title">Super Man NFT</p>
                            <p className="collections-description">@Super Man NFT</p>
                            </Box>
                        </Box>
                        <Box className="collection-button">
                            <Link to=''>
                            <button className="banner-button">View Collections</button>
                            </Link>
                            </Box>
                            
                    </Grid> */}

{noitems?
  <div className='noitems_found_align'> 
 <p >Loading Please Wait...</p>
 </div>
 :
(Tokens["Items"]?.list.length>0)?
<>
{ Tokens["Items"]?.list.map((item ,index) => (

<>

 <TokenCard
  data={item}
 />   
 </>
 ))}
 </>

 :  <div className='noitems_found_align'> 
 <h3 >No Items Found</h3>
 </div>}


                       
                </Grid>
                {Tokens["Items"]?.loader &&
                <div className='search_loadmore_btn_align '>
                      <button className='info_bidnow_btn' onClick={()=>LoadMore()}>Load More</button>
                    </div>}
                </Container>
               
            </Tab.Pane>
            <Tab.Pane eventKey="second">
              <Container className='mt-3'>
                <Row className='mb-4'>
                  
                {noitems?
                  <div className='noitems_found_align'> 
 <p >Loading Please Wait...</p>
 </div>
 :
<>
	{Tokens["Users"]?.list.length>0?
  <>
         { Tokens["Users"]?.list.map((product ,index) => (
                    
<Col className='mb-3' xxl={3} xl={3} lg={3} md={4} sm={6} xs={6}>
                    <div className='user_dtls_align' onClick={()=>{
                      navigate(`/my-item/${product?.CustomUrl}`)
                    }}>
                    {(product?.Profile)?
                      <img className='img-fluid search_user_img_align' src={product?.Profile}/>:
                      <img className='img-fluid search_user_img_align' src={require('../app/assets/images/logo.png')}/>
                    }
                      <div className='user_dtls_txt_align'>
                        {/* <h6>{product?.WalletAddress}</h6> */}
                        <small>
               { (product?.DisplayName).length>16?(product?.DisplayName).slice(0,16).concat("..."):(product?.DisplayName)}

                        </small>
                      </div>
                    </div>
                  </Col>
                   ))}</>
                  : <div className='noitems_found_align'> 
                  <h3 >No Items Found</h3>
                  </div>}
                  </>
                }
  
                  
 
                </Row>
                
              </Container>
              {Tokens["Users"]?.loader &&
              <div className='search_loadmore_btn_align '>
                      <button className='info_bidnow_btn' onClick={()=>LoadMore()}>Load More</button>
                    </div>}
  
      
            </Tab.Pane>

            <Tab.Pane eventKey="third">
              <Container className='mt-3'>
                <Row className='mb-4'>
                  
                {noitems?
                  <div className='noitems_found_align'> 
 <p >Loading Please Wait...</p>
 </div>
 :
<>
	{Tokens["Collections"]?.list.length>0?
  <>
         { Tokens["Collections"]?.list.map((product ,index) => (
                    
<Col className='mb-3' xxl={3} xl={3} lg={3} md={4} sm={6} xs={6}>
                    <div className='user_dtls_align' onClick={()=>{
                        navigate(
                          (product?.isImported)
                          ?`/importcollection/${product.Creator}/${product.customUrl}`:`/collection/${product.Creator}/${product.customUrl}`
                          );
                    }}>
                    {(product?.profileImage)?
                      <img className='img-fluid search_user_img_align' src={product?.profileImage}/>:
                      <img className='img-fluid search_user_img_align' src={require('../app/assets/images/logo.png')}/>
                    }
                      <div className='user_dtls_txt_align'>
                        {/* <h6>{product?.WalletAddress}</h6> */}
                        <small>
               { (product?.collectionName).length>16?(product?.collectionName).slice(0,16).concat("..."):(product?.collectionName)}

                        </small>
                      </div>
                    </div>
                  </Col>
                   ))}</>
                  : <div className='noitems_found_align'> 
                  <h3 >No Items Found</h3>
                  </div>}
                  </>
                }
  
                  
 
                </Row>
                
              </Container>
              {Tokens["Collections"]?.loader &&
              <div className='search_loadmore_btn_align '>
                      <button className='info_bidnow_btn' onClick={()=>LoadMore()}>Load More</button>
                    </div>}
  
      
            </Tab.Pane>

           
          </Tab.Content>
        </Col>
       
       
      </Row>
    </Tab.Container>
    </div>
    <Footer/>
    </>
  )
}

 
export default SearchPage