import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Button, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import ReactDatatable from '@ashvin27/react-datatable';
import { useDispatch, useSelector } from 'react-redux';
import * as tokenFunctions from '../../axioscalls/user.js'
import { CollectionPromotionAction } from '../../axioscalls/token';
import { event } from 'jquery';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isEmpty } from '../../lib/common';
// import {TokenDetail} from '';

export default function CollectionPromotionlist(props) {



  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1]




  const [tokenList, setTokenList] = useState([])
  var [promotedtoken, setPromotedToken] = useState(0);
  var [dropPromotionCount, setDropPromotionCount] = useState(0)
  var [stackProCount, setStackProCount] = useState(0)

  const columns = [
    {
      key: "",
      text: "SNO",
      className: "NFT",
      align: "left",
      // sortable: true,
      cell: (record, index) =>
        <div>{index + 1}
        </div>

    },
    {
      key: "customUrl",
      text: "Collection Url",
      className: "NFT",
      align: "left",
    },
    {
      key: "collectionName",
      text: "Collection Name",
      className: "NFT",
      align: "left"
    },
    {
      key: "Creator",
      text: "Collection Creator",
      className: "NFT",
      align: "left",
      cell: rec =>
        <div title={rec.Creator}>{rec.Creator ? rec.Creator.toString().slice(0, 2) + '...' + rec.Creator.toString().slice(-2) : ""}</div>
    },
    {
      key: "DisplayName",
      text: "Creator Name",
      className: "NFT",
      align: "left"
    },
    {
      key: "collectionCount",
      text: "NFT Count",
      className: "NFT",
      align: "left"
    },
    {
      key: "profileImage",
      text: "Profile",
      className: "NFT",
      align: "left",
      cell: rec =>
        <img src={rec.profileImage} />
    },
    // {
    //   key: "NFTBalance",
    //   text: "NFT Balance",
    //   className: "NFT",
    //   align: "left"
    // },


    {
      text: "Promotion",
      cell: record =>
        <div><input type={"checkbox"} onChange={() => PromotionAction(record)} checked={record?.bannerpromotion ? true : false} /></div>//checked={true}

    },
    {
      key: "droppromotion",
      text: "Drops Promotion",
      className: "NFT",
      // align: "left",
      cell: record => <div><input type={"checkbox"} onChange={() => DropsAction(record)} checked={record?.droppromotion ? true : false} /></div>//checked={true}
      // <img src={rec.profileImage} />
    },
    {
      key: "stackpromotion",
      text: "Stake Promotion",
      className: "NFT",
      // align: "left",
      cell: record => <div><input type={"checkbox"} onChange={() => stackAction(record)} checked={record?.stackpromotion ? true : false} /></div>//checked={true}
      // <img src={rec.profileImage} />
    }
  ]

  useEffect(() => {
    getUsers();
  }, [])

  const getUsers = async () => {

    var SendDATA = {
      TabName: "All",
      limit: 10,
      ProfileUrl: "",
      page: 1,
      from: "adminpromotion",
    };
    var resp = await tokenFunctions.CollectionList(SendDATA);
    if (resp?.data) {
      setTokenList(resp?.data);
      setPromotedToken(Number(resp.promotion))
      setDropPromotionCount(Number(resp.dropPromotionCount))
      setStackProCount(Number(resp.stackpromotionCount))
    }
  }

  const PromotionAction = async (val) => {
    const id = toast.loading("Updating Banner Token");
    var promotion;
    if (promotedtoken <= 8) {
      if (val.bannerpromotion) {
        promotion = await CollectionPromotionAction({ customUrl: val.customUrl, promotionStatus: false })
      }
      else if ((isEmpty(val.bannerpromotion) || val.bannerpromotion === false) && promotedtoken < 8) {
        promotion = await CollectionPromotionAction({ customUrl: val.customUrl, promotionStatus: true })
      }
      else {
        toast.update(id, {
          render: "Already 8 NFT has been Promoted",
          type: "error",
          autoClose: 1000,
          isLoading: false,
        });
      }
      if (promotion?.status == true) {
        await getUsers();
        toast.update(id, {
          render: promotion.message,
          type: "success",
          autoClose: 1000,
          isLoading: false,
        });
      }
      else if (promotion) {
        toast.update(id, {
          render: "Try Again",
          type: "error",
          autoClose: 1000,
          isLoading: false,
        });
      }
    }
    else {
      toast.update(id, {
        render: "Already 2 NFT has been Promoted",
        type: "error",
        autoClose: 1000,
        isLoading: false,
      });
    }
  }

  const DropsAction = async (val) => {
    const id = toast.loading("Updating Banner Token");
    var promotion;
    if (dropPromotionCount <= 4) {
      if (val.droppromotion) {
        promotion = await CollectionPromotionAction({ customUrl: val.customUrl, promotionStatus: false, from: "drop" })
      }
      else if ((isEmpty(val.droppromotion) || val.droppromotion === false) && dropPromotionCount < 4) {
        promotion = await CollectionPromotionAction({ customUrl: val.customUrl, promotionStatus: true, from: "drop" })
      }
      else {
        toast.update(id, {
          render: "Already 4 Drops has been Promoted",
          type: "error",
          autoClose: 1000,
          isLoading: false,
        });
      }
      if (promotion?.status == true) {
        await getUsers();
        toast.update(id, {
          render: promotion.message,
          type: "success",
          autoClose: 1000,
          isLoading: false,
        });
      }
      else if (promotion) {
        toast.update(id, {
          render: "Try Again",
          type: "error",
          autoClose: 1000,
          isLoading: false,
        });
      }
    }
    else {
      toast.update(id, {
        render: "Already 4 NFT has been Promoted",
        type: "error",
        autoClose: 1000,
        isLoading: false,
      });
    }
  }
  const stackAction = async (val) => {
    const id = toast.loading("Updating Banner Token");
    var promotion;
    if (stackProCount <= 2) {
      if (val.stackpromotion) {
        promotion = await CollectionPromotionAction({ customUrl: val.customUrl, promotionStatus: false, from: "stack" })
      }
      else if ((isEmpty(val.stackpromotion) || val.stackpromotion === false) && stackProCount < 2) {
        promotion = await CollectionPromotionAction({ customUrl: val.customUrl, promotionStatus: true, from: "stack" })
      }
      else {
        toast.update(id, {
          render: "Already 4 StacK has been Promoted",
          type: "error",
          autoClose: 1000,
          isLoading: false,
        });
      }
      if (promotion?.status == true) {
        await getUsers();
        toast.update(id, {
          render: promotion.message,
          type: "success",
          autoClose: 1000,
          isLoading: false,
        });
      }
      else if (promotion) {
        toast.update(id, {
          render: "Try Again",
          type: "error",
          autoClose: 1000,
          isLoading: false,
        });
      }
    }
    else {
      toast.update(id, {
        render: "Already 4 NFT has been Promoted",
        type: "error",
        autoClose: 1000,
        isLoading: false,
      });
    }
  }
  return (

    <>
      {path && path === "viewdetail" ?
        <div>
          {/* <TokenDetail detail={state} /> */}
        </div> :

        <div>
          <div className="page-header">
            <nav aria-label="breadcrumb">

            </nav>
          </div>
          <div className="row">

            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Promotion List</h4>
                  <div className="table-responsive">
                    <ReactDatatable

                      records={tokenList}
                      columns={columns}
                    />

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      }
    </>

  )

}


