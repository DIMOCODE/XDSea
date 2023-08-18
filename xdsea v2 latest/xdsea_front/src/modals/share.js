import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

import useContractProviderHook from "../actions/contractProviderHook.js";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Nav, Tab, Table, Dropdown, Modal } from 'react-bootstrap';
import { FacebookShareButton, TwitterShareButton, TelegramShareButton, WhatsappShareButton } from 'react-share';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../config/config.js"
import moment from "moment"
import { isEmpty, NumANdDotOnly } from "../actions/common";
import { report } from "../actions/axioss/user.axios";
toast.configure();


export function Share({title,url,from,closePop,quote}){
    return(
 
    <Modal
    show={true}
    // onHide={handleCloseShareModal}
    backdrop="static"
    keyboard={false}
    scrollable={false}
    centered
  >
    <Modal.Header className='align-items-center modal_theme_align'  >
      <Modal.Title className='text-center w-100'>Share Link</Modal.Title>
      <button type="button" class="btn-close" aria-label="Close" onClick={closePop}></button>

    </Modal.Header>
    <Modal.Body className=' common_modal_body modal_theme_align'>


      <Row className='mt-3'>
        <Col xs={3} className='d-flex justify-content-center align-items-center'>
          <div className='modal_bg_linear_gradient'>
            <div className='share_social_icons'>
           
              {/* <i class="fa-brands fa-instagram share_social_icon"></i> */}
              <WhatsappShareButton
                                           title={title}
                                           url={url}
                                         >
              <i className="fa-brands fa-whatsapp"></i>
              </WhatsappShareButton>


            </div>
          </div>

        </Col>
        <Col xs={3} className='d-flex justify-content-center align-items-center'>
          <div className='modal_bg_linear_gradient'>
            <div className='share_social_icons'>
            <FacebookShareButton
                    quote={quote}
                    url={url}>
              <i class="fa-brands fa-facebook-f share_social_icon"></i>
              </FacebookShareButton>

            </div>
          </div>

        </Col>
        <Col xs={3} className='d-flex justify-content-center align-items-center'>
          <div className='modal_bg_linear_gradient'>
            <div className='share_social_icons'>
            <TwitterShareButton
                                       
                                       title={title}
                                       url={url }
                                          
                                        >
              <i class="fa-brands fa-twitter share_social_icon"></i>
              </TwitterShareButton>

            </div>
          </div>

        </Col>
        <Col xs={3} className='d-flex justify-content-center align-items-center'>
          <div className='modal_bg_linear_gradient'>
            <div className='share_social_icons'>
              {/* <i class="fa-brands fa-youtube share_social_icon"></i> */}
              <TelegramShareButton
                                         title={title}
                                         url={url}
                                          >
              <i className="fa-brands fa-telegram-plane"></i>
              </TelegramShareButton>


            </div>
          </div>
        </Col>
      </Row>
      {/* <h5 className='mt-5'>Copy</h5>
      <input type="text" className='common_modal_input mt-3' id="Quantity" placeholder='Example.com/share link' name="Quantity" />




      <div className="place_bid_modalbtn mt-5 load_more_btn_align">
        <button type="button" class="btn confirm_btn me-2   modal_btn_align">Copy URL</button>
        <button type="button" class="btn  loadMore_btn me-2  modal_btn_align">Cancel</button>
      </div> */}
    </Modal.Body>

  </Modal>

    )}