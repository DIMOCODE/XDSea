import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import React from "react"
// import '../app/assets/scss/style.scss'; 
import {Link} from "react-router-dom"
function TokenCard(){
  // console.log("props",props.data.fileType,props.data?.NFTOrginalImage)

  

    return(
    //     <div className="card-skeleton">
    //     <div className="card-skeleton-header"></div>
    //     <div className="card-skeleton-body"></div>
    //     <div className="card-skeleton-footer"></div>
    //   </div>
      <>

                <Grid item xl={2.4} lg={2.4} md={6} sm={6} xs={12} className='mb-3'>
                <Box className="card">
                    <img src={require("../app/assets/images/greyloader.gif")}/>     
                    <Box className="collection-info">
                    </Box>
                </Box>
             
                </Grid>
                 <Grid item xl={2.4} lg={2.4} md={6} sm={6} xs={12} className='mb-3'>
                 <Box className="card">
                     <img src={require("../app/assets/images/greyloader.gif")}/>     
                     <Box className="collection-info">
                     </Box>
                 </Box>
              
                 </Grid>
                  <Grid item xl={2.4} lg={2.4} md={6} sm={6} xs={12} className='mb-3'>
                  <Box className="card">
                      <img src={require("../app/assets/images/greyloader.gif")}/>     
                      <Box className="collection-info">
                      </Box>
                  </Box>
               
                  </Grid>
                   <Grid item xl={2.4} lg={2.4} md={6} sm={6} xs={12} className='mb-3'>
                   <Box className="card">
                       <img src={require("../app/assets/images/greyloader.gif")}/>     
                       <Box className="collection-info">
                       </Box>
                   </Box>
                
                   </Grid>
                    <Grid item xl={2.4} lg={2.4} md={6} sm={6} xs={12} className='mb-3'>
                    <Box className="card">
                        <img src={require("../app/assets/images/greyloader.gif")}/>     
                        <Box className="collection-info">
                        </Box>
                    </Box>
                 
                    </Grid>
                     
            
                    </>    
       
  
  
)
}

export default TokenCard
