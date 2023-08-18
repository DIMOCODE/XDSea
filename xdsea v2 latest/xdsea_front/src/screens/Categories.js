import React,{useEffect} from 'react'
import Header from '../app/Header'
import Footer from '../app/Footer'
import { Box } from '@mui/system'
import {Link} from 'react-router-dom'

function Categories() {

  useEffect(() =>{
    window.scrollTo(0,0);
},[])
  return (
    <>
    <Header />

    <Box className="container home_container ">
        <h5 className='cat_head_title_align'>Categories</h5>
        <div className='row'>
            <div className='col-12 mt-2'>
                <div className='staking_whole_dtls'>
                    <h5 className='cat_title_align'>Staking</h5>
                    <p className='cat_hint_align'>Collections in this category offer rewards to it's users for holding the NFT in a

timely manner</p>

<Link className='cat_view_btn' to={`/explore/Staking`}>
                            {/* <button className="banner-button" id="white_btn_anim"><span>View Collections</span></button> */}
                            
                            <a data-ignore-split="true" class="Button"  id=""   tabindex="0" aria-label="">
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

            <div className='col-12 mt-2'>
                <div className='staking_whole_dtls cat_utility'>
                    <h5 className='cat_title_align'>Utility</h5>
                    <p className='cat_hint_align'>Collections in this category offer specific functions or uses beyond being a unique
digital asset, such as providing access to a service or product, unlocking features

in a game, or granting special privileges within a community</p>

                            <Link className='cat_view_btn' to={`/explore/Utility`}>
                            {/* <button className="banner-button" id="white_btn_anim"><span>View Collections</span></button> */}
                            
                            <a data-ignore-split="true" class="Button"  id=""   tabindex="0" aria-label="">
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

            <div className='col-12 mt-2'>
                <div className='staking_whole_dtls cat_arts'>
                    <h5 className='cat_title_align'>Arts</h5>
                    <p className='cat_hint_align'>Collections in this category represent digital artworks, such as images, videos,
animations, and music, that are unique and valuable because of their scarcity,

authenticity, and ownership rights</p>

                            <Link className='cat_view_btn' to={`/explore/Art`}>
                            {/* <button className="banner-button" id="white_btn_anim"><span>View Collections</span></button> */}
                            
                            <a data-ignore-split="true" class="Button"  id=""   tabindex="0" aria-label="">
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

            <div className='col-12 mt-2'>
                <div className='staking_whole_dtls cat_collectibles'>
                    <h5 className='cat_title_align'>Collectibles</h5>
                    <p className='cat_hint_align'>Collectible NFTs are digital assets that are created in limited quantities or as
unique items and are designed to be collected, just like traditional collectibles

such as stamps or sports cards</p>

                            <Link className='cat_view_btn' to={`/explore/Collectibles`}>
                            {/* <button className="banner-button" id="white_btn_anim"><span>View Collections</span></button> */}
                            
                            <a data-ignore-split="true" class="Button"  id=""   tabindex="0" aria-label="">
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
                            <div className='col-12 mt-2'>
                <div className='staking_whole_dtls cat_gaming'>

                            
                    <h5 className='cat_title_align'>Gaming</h5>
                    <p className='cat_hint_align'>Gaming NFTs are a type of NFT used in video games, where they represent unique
and valuable in-game assets or virtual items that can be owned, traded, or used to

enhance gameplay</p>

                            <Link className='cat_view_btn' to={`/explore/Gaming`}>
                            {/* <button className="banner-button" id="white_btn_anim"><span>View Collections</span></button> */}
                            
                            <a data-ignore-split="true" class="Button"  id=""   tabindex="0" aria-label="">
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

                            <div className='col-12 mt-2 cat_pfp'>
                <div className='staking_whole_dtls cat_pfp'>

                            <h5 className='cat_title_align'>PFP</h5>
                    <p className='cat_hint_align'>PFP NFTs are personalized profile picture NFTs, which are unique digital artworks

that can be used as profile pictures on various online platforms</p>

                            <Link className='cat_view_btn'  to={`/explore/PFP`}>
                            {/* <button className="banner-button" id="white_btn_anim"><span>View Collections</span></button> */}
                            
                            <a data-ignore-split="true" class="Button"  id="" tabindex="0" aria-label="">
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

           


           
            <div className='col-12 mt-2 mb-4'>
                <div className='staking_whole_dtls cat_photography'>
                    <h5 className='cat_title_align'>Photography</h5>
                    <p className='cat_hint_align'>Photography NFTs are non-fungible tokens that represent ownership and
authenticity of digital photographs, allowing photographers to sell their work

directly to collectors and fans</p>

                            <Link className='cat_view_btn'  to={`/explore/Photography`}>
                            {/* <button className="banner-button" id="white_btn_anim"><span>View Collections</span></button> */}
                            
                            <a data-ignore-split="true" class="Button"  id=""   tabindex="0" aria-label="">
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
    </Box>


    <Footer/>
    </>
  )
}

export default Categories