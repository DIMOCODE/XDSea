import React, { useEffect, useState } from 'react'
import Header from '../app/Header'
import Footer from '../app/Footer'
import { Box } from '@mui/system'
import { Link } from 'react-router-dom'
import { GetPromotedcollection } from '../actions/axioss/nft.axios'

function Drops() {

    const [promDrops, setPromDrops] = useState([])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        getDropPromotion()
    }, [])
 
 
    const getDropPromotion = async () => {
        var proDropCollection = await GetPromotedcollection({ from: "droppromotion" })
 
        if (proDropCollection.success == "success") {
            setPromDrops(proDropCollection.data)
        }
    }
    return (
        <>
            <Header />
            <Box className="container home_container ">
                <h5 className='cat_head_title_align'>Drops</h5>
                <div className='row'>
                    <div className='radial_dtls'>
                        <div className='green_radial_round'></div>
                        <div>
                            <h6 className='radital_title'>Live</h6>
                        </div>
                    </div>
                    <div className='col-12 mt-2'>
                        {promDrops && promDrops.map((data, index) => {
                            return (
                                <div className='drops_whole_dtls'>
                                    <img className='drop_img_aling'
                                        //  src={require('../app/assets/images/drop3.jpg')} 
                                        src={data.profileImage
                                        }
                                    />
                                    <div className='drops_abs_dtls'>

                                        <div>
                                            <p className='drop_dtls_align'>Collection name : {data.collectionName}</p>
                                            <p className='drop_dtls_align ml_5'>Creator name : {data.Creator_DisplayName}</p>
                                            <p className='drop_dtls_align ml_10'>Floor price : {data.floorPrice}</p>
                                        </div>

                                        <Link className='drop_view_btn' to={
                                            data.Creator
                                                ? //     (String(data?.contractAddress).toLowerCase() != config.ERC721
                                                //   || String(data?.contractAddress).toLowerCase() != config.ERC1155
                                                //   || String(data?.contractAddress).toLowerCase() != config.TradeContract
                                                //   )
                                                data?.isImported
                                                    ? `/importcollection/${data?.Creator}/${data?.customUrl}`
                                                    : `/collection/${data?.Creator}/${data?.customUrl}`
                                                : "/"
                                        }>
                                            {/* <button className="banner-button" id="white_btn_anim"><span>View Collections</span></button> */}

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

                                        </Link>


                                    </div>
                                </div>
                            )
                        })}

                    </div>
                    {/* <div className='col-12 mt-2'>
                        <div className='drops_whole_dtls'>
                            <img className='drop_img_aling' src={require('../app/assets/images/drop4.jpg')} />
                            <div className='drops_abs_dtls'>

                                <div>
                                    <p className='drop_dtls_align'>Collection name</p>
                                    <p className='drop_dtls_align ml_5'>Creator name</p>
                                    <p className='drop_dtls_align ml_10'>Floor price:</p>
                                </div>

                                <Link className='drop_view_btn' to=''>

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

                                </Link>


                            </div>
                        </div>
                    </div> */}
                </div>

                {/* <div className='row mt-4'>

                    <div className='radial_dtls'>
                        <div className='blue_radial_round'></div>
                        <div>
                            <h6 className='radital_title'>Launching 24th March</h6>
                        </div>
                    </div>
                    <div className='col-12 mt-2'>
                        <div className='drops_whole_dtls'>
                            <img className='drop_img_aling' src={require('../app/assets/images/drop5.jpg')} />
                            <div className='drops_abs_dtls'>

                                <div>
                                    <p className='drop_dtls_align'>Collection name</p>
                                    <p className='drop_dtls_align ml_5'>Creator name</p>
                                    <p className='drop_dtls_align ml_10'>Floor price:</p>
                                </div>

                                <Link className='drop_view_btn' to=''>

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

                                </Link>


                            </div>
                        </div>
                    </div>
                    
                    <div className='col-12 mt-2 mb-4'>
                        <div className='drops_whole_dtls'>
                            <img className='drop_img_aling' src={require('../app/assets/images/drop6.jpg')} />
                            <div className='drops_abs_dtls'>

                                <div>
                                    <p className='drop_dtls_align'>Collection name</p>
                                    <p className='drop_dtls_align ml_5'>Creator name</p>
                                    <p className='drop_dtls_align ml_10'>Floor price:</p>
                                </div>

                                <Link className='drop_view_btn' to=''>

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

                                </Link>


                            </div>
                        </div>
                    </div>
                </div> */}
            </Box>





            <Footer />
        </>
    )
}

export default Drops