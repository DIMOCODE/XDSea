import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

import useContractProviderHook from "../actions/contractProviderHook.js";
import { useNavigate } from "react-router-dom";
import { Container, Dropdown, DropdownButton, Modal, Button } from 'react-bootstrap'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../config/config.js"
import moment from "moment"
import { isEmpty, NumANdDotOnly } from "../actions/common";
import { BurnNFT ,updateBackValueDB,UpdateEligibilty_Db} from "../actions/axioss/nft.axios";

toast.configure();



export function EligibilityBacked(props){

    var {stakingContract, tokenId, wallet,type,contract_address,NFTOwner,poolid,CollectionName}= props.data

  //  console.log("eligibility data test",stakingContract, tokenId, wallet,type,contract_address,NFTOwner,poolid,CollectionName)
    const ContractCall = useContractProviderHook()
    const navigate = useNavigate();

   const [OpenPopup,setOpenPopup] = useState(true)

    // const [item,setItem] = useState();
    // const [owner, SetOwner] = useState("");
   
    const [Btn, SetBtn] = useState('start')
    const [Btn2, SetBtn2] = useState('start')
    const [inputBtn, setinputBtn] = useState(true)

    
    const { web3, accountAddress } = useSelector(state => state.LoginReducer.AccountDetails);
    const { payload } = useSelector(state => state.LoginReducer.User)
    const [disablestate,setdisablestate] = useState(false)

    const [backedValue,setBackedValue] = useState(1)


    const UpdateBackedValue = async()=>{
     
      
            SetBtn("process")

        if(backedValue == 1) {
          var resp = true
          if(resp){
          toast.success("updated successfully")
          setTimeout(() => {
          window.location.reload()
              
          }, 200);
        }
        else{
          SetBtn("try")
      }
        }
        else{
          var resp = await ContractCall.UpdateBackedValue(stakingContract, "", tokenId, Array(tokenId.length).fill(backedValue))
          if(resp){
            

            var updatedb = await  Promise.all(
              await tokenId.map(async(nftid,index)=>{
               await updateBackValueDB({NFTId:nftid,NFTOwner:accountAddress,stakingPoolId: poolid, value:backedValue,CollectionName:CollectionName})
            
              })
              
            )
              if(updatedb) {
                  SetBtn("done")
                  // setOpenPopup(false)
                  toast.success("updated successfully")
                  setTimeout(() => {
                  window.location.reload()
                      
                  }, 200);
              }
          }
          else{
            SetBtn("try")
        }
        }



       
       

        
    }

    const updateEligibility = async()=>{
        SetBtn2("process")
    setinputBtn(false)
    var resp = await ContractCall.UpdateEligibility(stakingContract,"",tokenId,Array(tokenId.length).fill(true))
    if(resp){

      var updateeligibilty_db = await  Promise.all(
        await tokenId.map(async(nftid,index)=>{
          await UpdateEligibilty_Db({NFTId:nftid,NFTOwner:NFTOwner,CollectionName:CollectionName})
        })
      )
     
      toast.success(resp.msg)
      SetBtn2("done")
      
    }
      else {
        SetBtn2("try")
        setinputBtn(false)
        return toast.error(resp.msg)}

    }
  
 


    return(
        <Modal
        show={OpenPopup}
        // onHide={handleCloseBurnToken}
        backdrop="static"
        scrollable={false}
        keyboard={false}
        centered
        className='whole_modal_text_align'

      >
        <Modal.Header className='align-items-center modal_theme_align' >
          <Modal.Title className='w-100'>Make Token Stakeable</Modal.Title>

        </Modal.Header>
        <Modal.Body className=' common_modal_body modal_theme_align'>
      
          <p className="placebid_hint_text text-center mt-3">Update Staking Eligibility
            <span className="placebid_span_text"> and Update multiplier i.e 2x the reward (optional)</span>
          </p>
          <input type="text" className='common_modal_input mt-3'   id = "burn" 
                        name="burn" 
                        placeholder="Enter multiplier ex:2"
                        disabled={ inputBtn == false}
                        onChange={(e)=>{
                            // setBurnQuantity(e.target.value)
                            setBackedValue(e.target.value)
                        }}
                         />
          <div className="place_bid_modalbtn mt-5 load_more_btn_align">
          <button type="button" class="btn confirm_btn me-2   modal_btn_align"
               disabled={Btn2 == 'error' || Btn2 === "process" || Btn2 === "done" ? true : false}
               onClick={Btn2 == 'start' || Btn2 === "try" ? updateEligibility : null
               }
               >
                    {Btn2 == 'start' && 'Start'
                                            || Btn2 == 'try' && 'Try-Again'
                                            || Btn2 == 'error' && 'Error'
                                            || Btn2 == 'done' && 'Done'
                                            || Btn2 == 'process' && 'In-Progress'
                                        }
             

               </button>
            <button type="button" class="btn confirm_btn me-2   modal_btn_align"
               disabled={Btn === "process" || Btn === "done" || Btn2 !== "done" ? true : false}
               onClick={Btn == 'start' || Btn === "try" ? UpdateBackedValue : null
               }
               >
                    {Btn == 'start' && 'Update multiplier'
                                            || Btn == 'try' && 'Try-Again'
                                            || Btn == 'error' && 'Error'
                                            || Btn == 'done' && 'Done'
                                            || Btn == 'process' && 'In-Progress'
                                        }
             

               </button>

        
            {/* <button type="button" class="btn  loadMore_btn me-2  modal_btn_align" disabled={Btn == 'process' || Btn2 == 'process'} onClick={()=>OpenPopup(false)}>Cancel</button> */}
          </div>


        </Modal.Body>

      </Modal>
    )
}