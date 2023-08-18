import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import React from "react"
import {Link} from "react-router-dom"
function TokenCard(props){
  // console.log("props",props.data.fileType,props.data?.NFTOrginalImage)

  var data = props && props?.data
  // console.log("data console in tokencard",data.NFTName,data.SaleStatus)

    return(
    <Grid item xl={2.4} lg={2.4} md={6} sm={6} xs={12}>
    <Box className="card">
      {data && data?.isStakeable &&
      <div className='stack_star_btn'>
        <p className='stack_badge'>Stake <i class="fa-solid fa-ipfs stack_badge_star"></i></p> 
      </div>}

      {data && !data?.isStakeable && data?.PutOnSaleType == "FixedPrice" && data?.SaleStatus == "On Sale" &&
      <div className='stack_star_btn'>
        <p className='stack_badge'>On Sale <i class="fa-solid fa-ipfs stack_badge_star"></i></p> 
      </div>}

      {data && !data?.isStakeable && data?.PutOnSaleType == "UnlimitedAuction" && data?.SaleStatus == "Sold" &&
      <div className='stack_star_btn'>
        <p className='stack_badge'>Sold <i class="fa-solid fa-ipfs stack_badge_star"></i></p> 
      </div>}


       {/* image */}

       {data?.fileType?.includes("image") && 
       <>

         {
        //  (data?.NFTOrginalImage)
        //  ?
        //  (data?.NFTOrginalImage?.includes("xdsea.infura-") ?
        // <img src={(data?.NFTOrginalImage)?.replace("xdsea.infura-","")} className="mui-img-fluid" />:
        // <img src={data?.CompressedFile ?data?.CompressedFile:require("../app/assets/images/collection.png")} className="mui-img-fluid" />)
        // :
        <img src={(data?.NFTOrginalImage)} className="mui-img-fluid" />

         }
  


       </>}

       {/* video / Audio */}

       {(data?.fileType?.includes("video")  )&& 
       <>

       {/* {(data?.NFTOrginalImage.includes("ipfs")?
        <img src={require("../app/assets/images/collection.png")} className="mui-img-fluid" />:
        <img src={data?.NFTThumpImage} className="mui-img-fluid" />

       )} */}
           {( (!data?.NFTThumpImage ) ?
        // <img src={require("../app/assets/images/collection.png")} className="mui-img-fluid" />
        <video
        //  controls 
         muted 
         controlsList="nodownload"
         onContextMenu="return false;"
         src={data?.NFTOrginalImage}/>
        :

        <img src={data?.NFTThumpImage } className="mui-img-fluid"  />

       )}
       </>}

     
       {( data?.fileType?.includes("audio") )&& 
       <>


           {( (!data?.NFTThumpImage ) ?
        <>
        <img src={require("../app/assets/images/collection.png")} className="mui-img-fluid" />
        {/* <audio 
        // controls 
        muted 
        controlsList="nodownload"
        onContextMenu="return false;"
        src={(data?.NFTOrginalImage?.includes("xdsea.infura-")?(data?.NFTOrginalImage)?.replace("xdsea.infura-",""):data?.NFTOrginalImage)}/> */}

        </>
        :
        <img src={data?.NFTThumpImage
    
    } className="mui-img-fluid" />

       )}
       </>}



      
        <Box className="collection-info">
        <p className="collections-title">{(data?.NFTName)?.slice(0,20).concat("...")}</p>
 
        <p className="collections-description">{(data?.NFTOwner)?.slice(0,20).concat("...")}</p>
 
        </Box>
    </Box>
    <Box className="collection-button">
      <Link to={`/info/${data?.CollectionNetwork}/${data?.ContractAddress}/${data?.NFTOwner}/${data?.NFTId}`}>
      <a data-ignore-split="true" class="Button"  id="" onClick="" tabindex="0" aria-label="">
    View NFT
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">View NFT</span>
    <span class="Button-hover-content" aria-hidden="true">View NFT</span>
    <span class="Button-hover-content" aria-hidden="true">View NFT</span>
    <span class="Button-hover-content" aria-hidden="true">View NFT</span>
  </a>
        </Link>
        </Box>
</Grid>)
}

export default TokenCard
