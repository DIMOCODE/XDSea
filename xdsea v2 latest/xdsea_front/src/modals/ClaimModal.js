import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Row,Col } from 'react-bootstrap';
import { useSelector } from "react-redux";
import {PendingClaimedRewards,claimreward} from "../actions/axioss/nft.axios.js"
import { toast } from "react-toastify";
import useContractProviderHook from "../actions/contractProviderHook.js";




export function ClaimModal({Tokens_Detail,Tokens_OwnerDetail,pooldetails}) {
  const [show, setShow] = useState(true);
  const [stakebtncontrol1, setstakebtncontrol1] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [claimpend,setclaimpend] = useState([])
  const ContractCall = useContractProviderHook();


  const { accountAddress } = useSelector(state => state.LoginReducer.AccountDetails);
  const formatter = Intl.NumberFormat('en', { notation: 'compact' }); 

  useEffect(()=>{
    if(accountAddress)
       getPendingClaimed()
  },[accountAddress])


  const getPendingClaimed = async()=>{


  
        var searchArr = []
      
            searchArr.push({
                NFTId:Tokens_OwnerDetail.NFTId,
                NFTOwner:Tokens_OwnerDetail.NFTOwner,
                isStake:true,
                isStakeable:true,
                backedValue:Tokens_OwnerDetail?.backedValue ? Tokens_OwnerDetail.backedValue : 1,
                rewardFrecuency:pooldetails?.rewardRates?.rewardFrecuency,
                rewardamount:pooldetails?.rewardRates?.amount,
                lockPeriod:pooldetails?.lockPeriod,
                CollectionName:Tokens_OwnerDetail.CollectionName 
             
            })
        

        var response = await PendingClaimedRewards({searchArr:searchArr})
        if(response?.data){
            setclaimpend(response?.data)
        }
  
     
   }

   const claimrewardcall = async()=>{
    if(String(Tokens_OwnerDetail?.NFTOwner) != String(accountAddress)) return toast.error("not owner")
 
   
    setstakebtncontrol1(true)
 
    var stakenftincontract = await ContractCall.claimedRewards(

      pooldetails.walletAddress,
      accountAddress,
      Tokens_OwnerDetail.NFTId,
      pooldetails.rewardContractAddress)

  if(stakenftincontract){
    
    let obj = {
      NFTOwner:Tokens_OwnerDetail.NFTOwner,
      NFTId:Tokens_OwnerDetail.NFTId  ,
      CollectionName:Tokens_OwnerDetail.CollectionName 
    }
     var resp = await claimreward(obj)
     if(resp?.status){
      setShow(false)
      toast.success("successfully claimed")
      setTimeout(() => {
        window.location.reload()
      }, 300);
     } else toast.error(resp?.msg)
    }
    else{
    setstakebtncontrol1(false)

    }
  }



  return (
    <>
    <Modal
    size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false} 
        className="modal_theme"
      >
        
        <Modal.Body>
          <Grid container columnSpacing={2} className='popy_whole_pad'>
            <Grid item xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                {/* <img className='popy_left_img' src={"https://xdseatestbucket.s3.amazonaws.com/nft/0x025c1667471685c323808647299e5dbf9d6adcc9/Original/NFT/1683800406991.webp"}/> */}
                {  (Tokens_Detail &&  Tokens_Detail?.fileType && Tokens_Detail?.fileType?.includes("image")) &&
                        <>
                        <img className='popy_left_img' src={Tokens_Detail?.NFTOrginalImage}/>
                          </>
                        }
                {  (Tokens_Detail &&  Tokens_Detail?.fileType && Tokens_Detail?.fileType?.includes("video")) &&
                        <>
                       { (!Tokens_Detail?.NFTThumpImage)?
                        <video className='popy_left_img' 
                           muted 
                           controlsList="nodownload"
                           onContextMenu="return false;"
                           src={Tokens_Detail?.NFTOrginalImage}/>:
                          <>
                          <img className='popy_left_img' src={
                          (Tokens_Detail?.NFTThumpImage)?
                          (Tokens_Detail?.NFTThumpImage)
                          :require('../app/assets/images/drop6.jpg')}
                          />
                          </>}
                          </>
                        }

{  (Tokens_Detail &&  Tokens_Detail?.fileType && Tokens_Detail?.fileType?.includes("audio")) &&
                        <>
                          <img className='popy_left_img' src={
                          (Tokens_Detail?.NFTThumpImage)?
                          (Tokens_Detail?.NFTThumpImage)
                          :require('../app/assets/images/drop6.jpg')}
                          />
                          </>
                        }
                          {/* // :
                          // <>
                          
                          //  <img className='popy_left_img' src={
                          // (Tokens_Detail?.NFTThumpImage)?
                          // (Tokens_Detail?.NFTThumpImage?.includes("xdsea.infura-"))?
                          // (Tokens_Detail?.NFTThumpImage)?.replace("xdsea.infura-",""):
                          // (Tokens_Detail?.NFTThumpImage)
                          // :require('../app/assets/images/drop6.jpg')
                          // // (Tokens_Detail?.NFTThumpImage &&Tokens_Detail?.NFTThumpImage).includes("xdsea.infura-")?
                          // // (Tokens_Detail?.NFTThumpImage).replace("xdsea.infura-",""):
                          // // (Tokens_Detail?.NFTThumpImage)?Tokens_Detail?.NFTThumpImage 
                          // // :
                          // // require('../app/assets/images/drop6.jpg')
                          
                          // }/>
                          // </>} */}
            </Grid>
            <Grid item xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                <h6 className='popy_whole_title'>{Tokens_Detail?.NFTName}</h6>
                <div className='popy_row_pad'>
                <Row >
                    <p className='gray_text_popy'>EARNING RATE</p>
                    <Col xxl={4} xl={4} lg={4} md={4} sm={12} xs={12}>
                    <div className='popy_whole_dtl'>
                    <div className='value_img_pop'>
                        <h6 className='popy_value_txt'>{formatter.format(((Tokens_OwnerDetail?.backedValue ? Tokens_OwnerDetail?.backedValue : 1)*24*pooldetails?.rewardRates?.amount )/ pooldetails?.rewardRates?.rewardFrecuency)}</h6>
                        
                        <img className='pzy_popy' src={require('../app/assets/images/xdcpzy.png')}
                        />
                          
                    </div>
                    {/* require('../app/assets/images/xdcpzy.png') */}
                    <h6 className='popy_day_txt'>XDC/D</h6>
                    </div>
                    
                    </Col>
                    <Col xxl={4} xl={4} lg={4} md={4} sm={12} xs={12}>
                    <div className='popy_whole_dtl'>
                    <div className='value_img_pop'>
                        <h6 className='popy_value_txt'>{formatter.format(((Tokens_OwnerDetail?.backedValue ? Tokens_OwnerDetail?.backedValue : 1)*730*pooldetails?.rewardRates?.amount )/ pooldetails?.rewardRates?.rewardFrecuency)}</h6>
                        <img className='pzy_popy' src={require('../app/assets/images/xdcpzy.png')}/>
                    </div>
                    <h6 className='popy_day_txt'>XDC/Mo</h6>
                    </div>
                    
                    </Col>
                    <Col xxl={4} xl={4} lg={4} md={4} sm={12} xs={12}>
                        <div className='popy_whole_dtl'>
                    <div className='value_img_pop'>
                        <h6 className='popy_value_txt'>{formatter.format(((Tokens_OwnerDetail?.backedValue ? Tokens_OwnerDetail?.backedValue : 1)*8760*pooldetails?.rewardRates?.amount )/ pooldetails?.rewardRates?.rewardFrecuency)}</h6>
                        <img className='pzy_popy' src={require('../app/assets/images/xdcpzy.png')}/>
                    </div>
                    <h6 className='popy_day_txt'>XDC/Yr</h6>
                    </div>
                    
                    </Col>
                </Row>
                </div>

                <div className='popy_row_pad mt-3'>
                <Row >
                    
                    <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                    <h6 className='popy_titles_txt'>PENDING</h6>
                    <div className='popy_whole_dtl'>
                    <div className='value_img_pop'>
                        <h6 className='popy_value_txt'>{formatter.format(claimpend[0]?.pending ?claimpend[0]?.pending:0)}</h6>
                        <img className='pzy_popy' src={require('../app/assets/images/xdcpzy.png')}/>
                    </div>
                    {/* <h6 className='popy_day_txt'>XDC/D</h6> */}
                    </div>
                    
                    </Col>
                    <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                    <h6 className='popy_titles_txt'>CLAIMED</h6>
                    <div className='popy_whole_dtl'>
                    <div className='value_img_pop'>
                        <h6 className='popy_value_txt'>{formatter.format(claimpend[0]?.claimed ?claimpend[0]?.claimed:0)}</h6>
                        <img className='pzy_popy' src={require('../app/assets/images/xdcpzy.png')}/>
                    </div>
                    {/* <h6 className='popy_day_txt'>XDC/Mo</h6> */}
                    </div>
                    
                    </Col>
                   
                </Row>
                </div>
                <div className='popy_bot_btn'>
                <Row>
                    <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                    <button className='popy_gray_btn' disabled={stakebtncontrol1} onClick={()=>{setShow(false)}}>Cancel</button>
                    </Col>
                    <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                    <button className='popy_blue_btn' disabled={stakebtncontrol1} onClick={()=>{claimrewardcall()}}>Claim</button>
                    </Col>
                </Row>
                </div>
            </Grid>

          </Grid>
        </Modal.Body>
       
      </Modal>
   
    </>
  )
}

 