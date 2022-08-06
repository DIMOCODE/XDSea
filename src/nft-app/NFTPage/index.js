import React, { useEffect, useState } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import Xdc3 from "xdc3";
import { DEFAULT_PROVIDER, HEADER, LS, LS_ROOT_KEY } from "../../constant";
import { nftmarketlayeraddress } from "../../config";
import NFT from "../../abis/NFT.json";
import axios from "axios";
import { Divider } from "../../styles/Stacks";
import {
  LegacyBuyNFT,
  BuyNFT,
  SellNFT,
  LegacyWithdrawListing,
  WithdrawListing,
  TransferNFT,
  EditNFT,
  Offer,
  WithdrawOffer,
  AcceptOffer,
} from "../../common";
import { fromXdc, isSafari, isXdc, truncateAddress } from "../../common/common";
import NFTMarketLayer1 from "../../abis/NFTMarketLayer1.json";
import {
  permaBlacklist,
  contractFix,
  burnedNFTs,
  verifiedProfiles,
} from "../../blacklist";
import Tooltip from "@mui/material/Tooltip";
import lock from "../../images/unlockable2.gif";
import mint from "../../images/mintIcon.png";
import list from "../../images/listIcon.png";
import eyesEmpty from "../../images/eyesEmpty.png";
import withdrawList from "../../images/withdrawList.png";
import sale from "../../images/partyIcon.png";
import transferIcon from "../../images/transferIconGray.png";
import editListingIcon from "../../images/editListing.png";
import offerPlacedIcon from "../../images/xdcOffer.png";
import offerRejectedIcon from "../../images/offerRejected.png";
import offerAcceptedIcon from "../../images/offerAccepted.png";
import tokenIcon from "../../images/tokenID.png";
import blockchainIcon from "../../images/blockchainIcon.png";
import {
  HStack,
  IconImg,
  VStack,
  Spacer,
  ZStack,
  ZItem,
} from "../../styles/Stacks";
import xdclogo from "../../images/miniXdcLogo.png";
import {
  AnimatePresence,
  motion,
  LayoutGroup,
} from "framer-motion/dist/framer-motion";
import { SendTransaction } from "xdc-connect";
import linkSocial from "../../images/linkSocial.png";
import whatsSocial from "../../images/whatsSocial.png";
import telegramSocial from "../../images/telegramSocial.png";
import twitterSocial from "../../images/twitterSocial.png";
import facebookSocial from "../../images/facebookSocial.png";
import copiedLink from "../../images/oklink.png";
import {
  BodyBold,
  BodyRegular,
  CaptionBoldShort,
  CaptionRegular,
  TitleBold18,
  TitleBold27,
  CaptionBold,
} from "../../styles/TextStyles";
import ButtonApp from "../../styles/Buttons";
import { Property } from "../../styles/Property";
import star from "../../images/starColor.png";
import { appStyle } from "../../styles/AppStyles";
import tagWhite from "../../images/tagWhite.png";
import tagBlue from "../../images/offerBlue.png";
import useWindowSize from "../../styles/useWindowSize";
import { TableActivityNft } from "../../styles/TableActivityNft";
import styled from "styled-components";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";
import ReactPlayer from "react-player";
import { ImpulseSpinner } from "react-spinners-kit";
import { TableOffersNft } from "../../styles/TableOffersNft";
import { TxModal } from "../../styles/TxModal";
import { NftContainer } from "../../styles/NftContainer";
import CID from "cids";
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  InstapaperShareButton,
} from "react-share";
import {
  acceptOfferRequest,
  buyNFTRequest,
  editListingNFTRequest,
  getNFT,
  getNFTEvents,
  getNFTOffers,
  listNFTRequest,
  placeOfferRequest,
  transferNFTRequest,
  withdrawListingNFTRequest,
  withdrawOfferRequest,
} from "../../API/NFT";

import { useVideo } from "react-use";

const NFTDetails = (props) => {
  const webLocation = useLocation();
  const [wallet, setWallet] = useState(null);
  const [nft, setNFT] = useState(null);
  const [collections, setCollections] = useState([]);
  const [offers, setOffers] = useState([]);
  const [approved, setApproved] = useState(false);
  const [eventHistory, setEventHistory] = useState([]);
  const [propertyProportions, setPropertyProportions] = useState([]);
  const [moreFromCollectionNfts, setMoreFromCollectionNfts] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [contractFixes, setContractFixes] = useState([]);
  const [isFlip, setIsFlip] = useState(false);
  const [buyButtonStatus, setBuyButtonStatus] = useState(0);
  const [purchased, setPurchased] = useState(false);
  const [placingOffer, setPlacingOffer] = useState(false);
  const [offerButtonStatus, setOfferButtonStatus] = useState(0);
  const [offerPrice, setOfferPrice] = useState(0.0);
  const [priceIsInvalid, setPriceIsInvalid] = useState(false);
  const [withdrawButtonStatus, setWithdrawButtonStatus] = useState(0);
  const [editingListing, setEditingListing] = useState(false);
  const [editButtonStatus, setEditButtonStatus] = useState(0);
  const [editPrice, setEditPrice] = useState(0.0);
  const [listingNFT, setListingNFT] = useState(false);
  const [listButtonStatus, setListButtonStatus] = useState(0);
  const [listPrice, setListPrice] = useState(0.0);
  const [transferring, setTransferring] = useState(false);
  const [transferButtonStatus, setTransferButtonStatus] = useState(0);
  const [transferAddress, setTransferAddress] = useState(null);
  const [isActive, setIsActive] = useState(1);
  const [highestOffer, setHighestOffer] = useState(0);
  const [addressIsInvalid, setAddressIsInvalid] = useState(false);
  const [withdrawOfferButtonStatus, setWithdrawOfferButtonStatus] = useState(
    []
  );
  const [acceptOfferButtonStatus, setAcceptOfferButtonStatus] = useState([]);
  const [processingOffer, setIsProcessingOffer] = useState(false);
  const [processingBuying, setIsProcessingBuying] = useState(false);
  const [processingWithdrawing, setIsProcessingWithdrawing] = useState(false);
  const [processingEditing, setIsProcessingEditing] = useState(false);
  const [processingListing, setIsProcessingListing] = useState(false);
  const [processingTransferring, setIsProcessingTransferring] = useState(false);
  const [processingWithdrawingOffer, setIsProcessingWithdrawingOffer] =
    useState(false);
  const [processingAccepting, setIsProcessingAccepting] = useState(false);
  const [actions, setActions] = useState(0);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const size = useWindowSize();
  const variants = {
    selected: { opacity: 1 },
    normal: { opacity: 0.3 },
  };
  const appear = {
    selected: { opacity: 1, y: 0 },
    normal: { opacity: 0.3, y: -6 },
  };
  const flipping = {
    initial: {
      y: 0,
      transition: {
        type: "spring",
        duration: 0.6,
      },
    },
    finished: {
      y: -150,
      transition: {
        type: "spring",
        duration: 0.3,
      },
    },
  };
  const [loadingOffersArray] = useState([
    { id: 1, name: "Offer 1" },
    { id: 2, name: "Offer 2" },
    { id: 3, name: "Offer 3" },
    { id: 4, name: "Offer 4" },
  ]);
  const [loadingNFTs] = useState([
    { id: 1, name: "NFT 1" },
    { id: 2, name: "NFT 2" },
    { id: 3, name: "NFT 3" },
    { id: 4, name: "NFT 4" },
  ]);

  const { id, nftaddress } = useParams();

  const buyNFT = async () => {
    setIsProcessingBuying(true);
    setBuyButtonStatus(1);
    var success = false;
    if (nft.inBlacklist) {
      success = await LegacyBuyNFT(nft, wallet.address);
    } else {
      success = await BuyNFT(nft, wallet.address);
    }
    if (success) {
      setBuyButtonStatus(3);
      const buyData = await await buyNFTRequest(
        wallet?.address,
        nft.price,
        nft._id
      );
      setPurchased(true);
    } else {
      setBuyButtonStatus(4);
    }
    setIsProcessingBuying(false);
    setActions(actions + 1);
    setTimeout(() => {
      setBuyButtonStatus(0);
    }, 3500);
  };

  const placeOffer = async () => {
    setOfferButtonStatus(1);
    setPlacingOffer(true);
  };

  const offer = async () => {
    if (isNaN(parseFloat(offerPrice))) {
      setIsProcessingOffer(false);
      setPriceIsInvalid(true);
      return;
    }
    setPlacingOffer(false);
    var success = false;
    if (!nft.inBlacklist) {
      success = await Offer(approved, nft, offerPrice, wallet.address);
    }
    if (success) {
      setOfferButtonStatus(3);
      const offerData = await (
        await placeOfferRequest(offerPrice, wallet.address, nft._id)
      ).data;
    } else {
      setOfferButtonStatus(4);
    }
    setIsProcessingOffer(false);
    setActions(actions + 1);
    setTimeout(() => {
      setOfferButtonStatus(0);
    }, 3500);
  };

  const withdrawListing = async () => {
    setIsProcessingWithdrawing(true);
    setWithdrawButtonStatus(1);
    var success = false;
    if (nft.inBlacklist) {
      success = await LegacyWithdrawListing(approved, nft, wallet.address);
    } else {
      success = await WithdrawListing(approved, nft, wallet.address);
    }
    if (success) {
      setWithdrawButtonStatus(3);
      const withdrawListData = await (
        await withdrawListingNFTRequest(nft._id)
      ).data;
    } else {
      setWithdrawButtonStatus(4);
    }
    setIsProcessingWithdrawing(false);
    setActions(actions + 1);
    setTimeout(() => {
      setWithdrawButtonStatus(0);
    }, 3500);
  };

  const editListing = async (nft) => {
    setEditButtonStatus(1);
    setEditingListing(true);
  };

  const editNFT = async () => {
    setIsProcessingEditing(true);
    if (isNaN(parseFloat(editPrice))) {
      setIsProcessingEditing(false);
      setPriceIsInvalid(true);
      return;
    }
    setEditingListing(false);
    var success = false;
    if (!nft.inBlacklist) {
      success = await EditNFT(approved, nft, editPrice, wallet.address);
    }
    if (success) {
      setEditButtonStatus(3);
      const editListData = await (
        await editListingNFTRequest(editPrice, nft._id)
      ).data;
    } else {
      setEditButtonStatus(4);
    }
    setIsProcessingEditing(false);
    setActions(actions + 1);
    setTimeout(() => {
      setEditButtonStatus(0);
    }, 3500);
  };

  const startSale = async () => {
    setListingNFT(true);
    setListButtonStatus(1);
  };

  const listNFT = async () => {
    setIsProcessingListing(true);
    if (isNaN(parseFloat(listPrice))) {
      setIsProcessingListing(false);
      setPriceIsInvalid(true);
      return;
    }
    setListingNFT(false);
    var success = false;
    if (!nft.inBlacklist) {
      success = await SellNFT(approved, nft, listPrice, wallet.address);
    }
    if (success) {
      setListButtonStatus(3);
      const listData = await (await listNFTRequest(listPrice, nft._id)).data;
    } else {
      setListButtonStatus(4);
    }
    setIsProcessingListing(false);
    setActions(actions + 1);
    setTimeout(() => {
      setListButtonStatus(0);
    }, 3500);
  };

  const startTransfer = async () => {
    setTransferring(true);
    setTransferButtonStatus(1);
  };

  const transferNFT = async () => {
    setIsProcessingTransferring(true);
    setTransferring(false);
    var success = false;
    if (!nft.inBlacklist) {
      success = await TransferNFT(
        approved,
        nft,
        transferAddress,
        wallet.address
      );
    }
    if (success) {
      setTransferButtonStatus(3);
      const transferData = await (
        await transferNFTRequest(wallet?.address, transferAddress, nft._id)
      ).data;
    } else {
      setTransferButtonStatus(4);
    }
    setIsProcessingTransferring(false);
    setActions(actions + 1);
    setTimeout(() => {
      setTransferButtonStatus(0);
    }, 3500);
  };

  const withdrawOffer = async (i, id) => {
    setIsProcessingWithdrawingOffer(true);
    setWithdrawOfferButtonStatus((prevState) => {
      prevState[i] = 1;
      return [...prevState];
    });
    var success = false;
    if (!nft.inBlacklist) {
      success = await WithdrawOffer(
        approved,
        nft.tokenId,
        i + 1,
        wallet.address
      );
    }
    if (success) {
      setWithdrawOfferButtonStatus((prevState) => {
        prevState[i] = 3;
        return [...prevState];
      });
      const withdrawOfferData = await (await withdrawOfferRequest(id)).data;
    } else {
      setWithdrawOfferButtonStatus((prevState) => {
        prevState[i] = 4;
        return [...prevState];
      });
    }
    setIsProcessingWithdrawingOffer(false);
    setActions(actions + 1);
    setTimeout(() => {
      setWithdrawOfferButtonStatus((prevState) => {
        prevState[i] = 0;
        return [...prevState];
      });
    }, 3500);
  };

  const acceptOffer = async (i, id) => {
    setIsProcessingAccepting(true);
    setAcceptOfferButtonStatus((prevState) => {
      prevState[i] = 1;
      return [...prevState];
    });
    var success = false;
    if (!nft.inBlacklist) {
      success = await AcceptOffer(approved, nft.tokenId, i + 1, wallet.address);
    }
    if (success) {
      setAcceptOfferButtonStatus((prevState) => {
        prevState[i] = 3;
        return [...prevState];
      });
      const acceptOfferData = await (await acceptOfferRequest(id)).data;
    } else {
      setAcceptOfferButtonStatus((prevState) => {
        prevState[i] = 4;
        return [...prevState];
      });
    }
    setIsProcessingAccepting(false);
    setActions(actions + 1);
    setTimeout(() => {
      setAcceptOfferButtonStatus((prevState) => {
        prevState[i] = 0;
        return [...prevState];
      });
    }, 3500);
  };

  const isImage = (fileType) => {
    return !!fileType?.match("image.*");
  };

  const isVideo = (fileType) => {
    return !!fileType?.match("video.*");
  };

  const isAudio = (fileType) => {
    return !!fileType?.match("audio.*");
  };

  /**
   * Get the all the data for the current item including events, offers, and relatedNfts
   */
  const getData = async () => {
    try {

      // Update payout addresses of NFTs function
      {/*
      // const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));
      // const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
      // const marketContract = new xdc3.eth.Contract(
      //     NFTMarketLayer1.abi,
      //     nftmarketlayeraddress,
      //     xdc3
      //   );
      // const data2 = await marketContract.methods.idToMarketItem(2689).call()
      // var item = await marketContract.methods.getTokenEventHistory(2689).call();
      // const weiprice = await xdc3.utils.toWei("20", "ether");
      // console.log(data2, item)
      // let data = marketContract.methods.editMarketItem(
      //     data2.tokenId,
      //     data2.itemId,
      //     // "0x0d0C5e0F7F26277794753fBC739612CEd4cD1d18",
      //     data2.owner,
      //     // "0x0d0C5e0F7F26277794753fBC739612CEd4cD1d18",
      //     data2.creator,
      //     // weiprice,
      //     data2.price,
      //     // false,
      //     data2.isListed,
      //     data2.royalty,
      //     // 4,
      //     data2.eventCount,
      //     0,
      //     // data2.offerCount,
      //     data2.name,
      //     data2.collectionName,
      // ).encodeABI()
      // const tx = {
      //     from: props?.wallet?.address,
      //     to: nftmarketlayeraddress,
      //     data
      // }
      // var gasLimit = await xdc3.eth.estimateGas(tx)
      // tx["gas"] = gasLimit
      // let transaction = await SendTransaction(tx);
      */}

      const nftData = await (await getNFT(id)).data;

      await Promise.all(
        [1, 2].map(async (i) => {
          if (i === 1) {
            const offerData = await (
              await getNFTOffers(nftData.nft._id)
            ).data.offers;

            setOffers(offerData);
            setAcceptOfferButtonStatus(new Array(offerData.length).fill(0));
            setWithdrawOfferButtonStatus(new Array(offerData.length).fill(0));
            setLoadingOffers(false);
          } else {
            const eventData = await (
              await getNFTEvents(nftData.nft._id)
            ).data.events;
            const eventList = await Promise.all(
              eventData.map(async (item, i) => {
                let event = {
                  _id: item._id,
                  id: i + 1,
                  event:
                    item.eventTypeId.eventCode === "MINTED" ? (
                      <HStack>
                        <IconImg
                          url={mint}
                          width="26px"
                          height="26px"
                        ></IconImg>
                        <CaptionBoldShort>Mint</CaptionBoldShort>
                      </HStack>
                    ) : item.eventTypeId.eventCode === "LISTED" ? (
                      <HStack>
                        <IconImg
                          url={list}
                          width="26px"
                          height="26px"
                        ></IconImg>
                        <CaptionBoldShort>List</CaptionBoldShort>
                      </HStack>
                    ) : item.eventTypeId.eventCode === "WITHDRAWN" ? (
                      <HStack>
                        <IconImg
                          url={withdrawList}
                          width="26px"
                          height="26px"
                        ></IconImg>
                        <CaptionBoldShort>Withdraw Listing</CaptionBoldShort>
                      </HStack>
                    ) : item.eventTypeId.eventCode === "SALE" ? (
                      <HStack>
                        <IconImg
                          url={sale}
                          width="26px"
                          height="26px"
                        ></IconImg>
                        <CaptionBoldShort>Sale</CaptionBoldShort>
                      </HStack>
                    ) : item.eventTypeId.eventCode === "TRANSFER" ? (
                      <HStack>
                        <IconImg
                          url={transferIcon}
                          width="26px"
                          height="26px"
                        ></IconImg>
                        <CaptionBoldShort>Transfer</CaptionBoldShort>
                      </HStack>
                    ) : item.eventTypeId.eventCode === "EDIT" ? (
                      <HStack>
                        <IconImg
                          url={editListingIcon}
                          width="26px"
                          height="26px"
                        ></IconImg>
                        <CaptionBoldShort>Edit Listing</CaptionBoldShort>
                      </HStack>
                    ) : item.eventTypeId.eventCode === "OFFER_RECEIVED" ? (
                      <HStack>
                        <IconImg
                          url={offerPlacedIcon}
                          width="26px"
                          height="26px"
                        ></IconImg>
                        <CaptionBoldShort>Offer Placed</CaptionBoldShort>
                      </HStack>
                    ) : item.eventTypeId.eventCode === "OFFER_WITHDRAWN" ? (
                      <HStack>
                        <IconImg
                          url={offerRejectedIcon}
                          width="26px"
                          height="26px"
                        ></IconImg>
                        <CaptionBoldShort>Offer Withdrawn</CaptionBoldShort>
                      </HStack>
                    ) : (
                      <HStack>
                        <IconImg
                          url={offerAcceptedIcon}
                          width="26px"
                          height="26px"
                        ></IconImg>
                        <CaptionBoldShort>Offer Accepted</CaptionBoldShort>
                      </HStack>
                    ),
                  price: item.price,
                  from: item.fromAddress,
                  to: item.toAddress,
                  date: item.timestamp,
                };
                return event;
              })
            );
            
            setEventHistory(eventList);
            setLoadingEvents(false);
          }
        })
      );

      setNFT(nftData.nft);
      setMoreFromCollectionNfts(nftData.relatedNfts);
      setLoadingMore(false);
    } catch (error) {
      console.log(error);
    }
  };
  
  const getApproval = async () => {
    const xdc3 = new Xdc3(
      new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER)
    );
    const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
    if (props?.wallet?.address !== "" && props?.wallet?.address !== undefined)
      var getVal = await nftContract.methods
        .isApprovedForAll(
          isXdc(props?.wallet?.address)
            ? fromXdc(props?.wallet?.address)
            : props?.wallet?.address,
          nftmarketlayeraddress
        )
        .call();
    setApproved(getVal);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setWallet(props?.wallet);
    setLoadingOffers(true);
    setLoadingEvents(true);
    setLoadingMore(true);
    getData();
    if (!approved) getApproval();
  }, [id, actions]);

  useEffect(() => {
    setWallet(props?.wallet);
    getApproval();
  }, [props?.wallet]);

  const webLink = `https://www.xdsea.com/${nftaddress}/${id}`;

  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(webLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  // Alternative Video Component https://github.com/streamich/react-use/blob/master/docs/useVideo.md

  const [video, state, controls, ref] = useVideo(<video src={nft?.image} />);

  return (
    <NFTPage>
      {processingOffer ? (
        <TxModal
          isProcessing={true}
          processingMessage={"Placing your offer..."}
        ></TxModal>
      ) : null}
      {processingBuying ? (
        <TxModal
          isProcessing={true}
          processingMessage={"Buying the NFT..."}
        ></TxModal>
      ) : null}
      {processingWithdrawing ? (
        <TxModal
          isProcessing={true}
          processingMessage={"Withdrawing the NFT listing..."}
        ></TxModal>
      ) : null}
      {processingEditing ? (
        <TxModal
          isProcessing={true}
          processingMessage={"Editing the NFT listing..."}
        ></TxModal>
      ) : null}
      {processingListing ? (
        <TxModal
          isProcessing={true}
          processingMessage={"Listing the NFT..."}
        ></TxModal>
      ) : null}
      {processingTransferring ? (
        <TxModal
          isProcessing={true}
          processingMessage={"Transferring the NFT..."}
        ></TxModal>
      ) : null}
      {processingWithdrawingOffer ? (
        <TxModal
          isProcessing={true}
          processingMessage={"Withdrawing your offer..."}
        ></TxModal>
      ) : null}
      {processingAccepting ? (
        <TxModal
          isProcessing={true}
          processingMessage={"Accepting the offer..."}
        ></TxModal>
      ) : null}
      {placingOffer ? (
        <TxModal
          isOffer={true}
          cancelOffer={() => {
            setOfferButtonStatus(0);
            setPlacingOffer(false);
          }}
          placeOffer={() => {
            setIsProcessingOffer(true);
            offer();
          }}
          onChangeOffer={(event) => {
            setPriceIsInvalid(false);
            setOfferPrice(event.target.value);
          }}
          priceInvalid={priceIsInvalid}
          offerPrice={offerPrice}
        ></TxModal>
      ) : null}
      {editingListing ? (
        <TxModal
          isEdit={true}
          cancelEdit={() => {
            setEditButtonStatus(0);
            setEditingListing(false);
          }}
          editListing={() => editNFT()}
          onChangeEdit={(event) => {
            setPriceIsInvalid(false);
            setEditPrice(event.target.value);
          }}
          priceInvalid={priceIsInvalid}
          editPrice={editPrice}
        ></TxModal>
      ) : null}
      {listingNFT ? (
        <TxModal
          isList={true}
          cancelList={() => {
            setListButtonStatus(0);
            setListingNFT(false);
          }}
          listNFT={() => listNFT()}
          onChangeList={(event) => {
            setPriceIsInvalid(false);
            setListPrice(event.target.value);
          }}
          priceInvalid={priceIsInvalid}
          listPrice={listPrice}
        ></TxModal>
      ) : null}
      {transferring ? (
        <TxModal
          isTransfer={true}
          cancelTransfer={() => {
            setTransferButtonStatus(0);
            setTransferring(false);
          }}
          transferNFT={() => transferNFT()}
          onChangeTransfer={(event) => {
            setAddressIsInvalid(false);
            setTransferAddress(event.target.value);
          }}
          addressInvalid={addressIsInvalid}
          transferAddress={transferAddress}
        ></TxModal>
      ) : null}
      {purchased ? (
        <TxModal
          isPurchaised={true}
          PurchaisedNftName={nft.name}
          ListedImage={isSafari
            ? nft.urlFile.v1
            : nft.urlFile.v0
          }
          confirmBtnPurchaise={() =>
            props.redirect(`UserProfile/${LS.get(LS_ROOT_KEY).user._id}`)
          }
        ></TxModal>
      ) : null}
      <ContentNftPage>
        <VStack height="auto" padding="90px 0 0 0 ">
          <HStack height="100%" responsive={true} alignment="flex-start">
            {/* NFT Image  */}
            <VStack width="100%" padding="21px">
              {/* NFT Title Loader  */}
              {nft?.name ? (
                <VStack width="100%">
                  <VStack alignment="flex-start" width="100%" spacing="6px">
                    <TitleBold27>{nft.name}</TitleBold27>
                    <ButtonApp
                      height="30px"
                      text={nft.collectionId.name}
                      background={({ theme }) => theme.walletButton}
                      textcolor={({ theme }) => theme.walletText}
                      cursor="pointer"
                      onClick={() =>
                        props.redirect(`collection/${nft.collectionId.nickName}`)
                      }
                      btnStatus={0}
                    ></ButtonApp>
                  </VStack>
                </VStack>
              ) : (
                <VStack alignment="flex-start" width="100%" spacing="9px">
                  <HStack
                    background="rgba(153, 162, 175, 0.21)"
                    key="Title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 0.6,
                      delay: 0,
                    }}
                    border="9px"
                    width="300px"
                    height="39px"
                  ></HStack>
                  <HStack
                    background="rgba(153, 162, 175, 0.21)"
                    key="Collection"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 0.6,
                      delay: 0,
                    }}
                    border="9px"
                    width="260px"
                    height="30px"
                  ></HStack>
                  <HStack
                    background="rgba(153, 162, 175, 0.21)"
                    key="Creator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 0.6,
                      delay: 0,
                    }}
                    border="9px"
                    width="360px"
                    height="26px"
                  ></HStack>
                </VStack>
              )}
              {/* NFT Locked Content  */}
              {nft?.name ? (
                <LockedContent>
                  <VStack
                    background={({ theme }) => theme.fadedlocked}
                    width="100%"
                    height="50%"
                    border="15px"
                    alignment="flex-start"
                    padding="30px 15px 30px 15px"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "spring",
                      duration: 1.1,
                      delay: 5,
                    }}
                  >
                    <Spacer></Spacer>
                    <CaptionBold animate={{ opacity: 0.3 }} textcolor="white">
                      LOCKED CONTENT
                    </CaptionBold>
                    <HStack textcolor="white">{nft.unlockableContent}</HStack>
                  </VStack>
                </LockedContent>
              ) : null}

              {/* NFT Image, Video, Audio, Content  */}
              <AnimatePresence>
                <ZStack
                  variants={flipping}
                  animate={isFlip ? "finished" : "initial"}
                  height="540px"
                >
                  <ZItem>
                    {isImage(nft?.fileType) ? (
                      <VStack>
                        {(isXdc(wallet?.address)
                          ? fromXdc(wallet?.address?.toLowerCase())
                          : wallet?.address?.toLowerCase()) ===
                          nft.owner.userName.toLowerCase() &&
                        nft.unlockableContent !== undefined &&
                        nft.unlockableContent !== "" ? (
                          <AnimatePresence>
                            <Lock
                              key="unlock"
                              animate={isFlip ? { y: 120 } : { y: 15 }}
                              layout
                              style={{ cursor: "pointer!" }}
                            >
                              <HStack
                                background="white"
                                border="6px"
                                padding="3px 12px"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                  type: "spring",
                                  duration: 1.1,
                                  delay: 0.9,
                                }}
                                onClick={() => setIsFlip((isFlip) => !isFlip)}
                                cursor="pointer"
                              >
                                <VStack>
                                  <CaptionRegular
                                    align="flex-end"
                                    textcolor={appStyle.colors.darkgrey}
                                  >
                                    Unlockable <br></br>Content
                                  </CaptionRegular>
                                </VStack>
                                <IconImg
                                  url={lock}
                                  width="33px"
                                  height="33px"
                                ></IconImg>
                              </HStack>
                            </Lock>
                          </AnimatePresence>
                        ) : null}

                        <IconImg
                          url={isSafari
                            ? nft.urlFile.v1
                            : nft.urlFile.v0
                          }
                          width="100%"
                          height="540px"
                          border="15px"
                          key="imageNFT"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", duration: 1.1 }}
                          backsize="cover"
                        ></IconImg>
                      </VStack>
                    ) : isVideo(nft?.fileType) ? (
                      <VStack
                        width="100%"
                        height="540px"
                        border="15px"
                        background="black"
                        overflow="hidden"
                        cursor="pointer"
                      >
                        {(isXdc(wallet?.address)
                          ? fromXdc(wallet?.address?.toLowerCase())
                          : wallet?.address?.toLowerCase()) ===
                          nft.owner.userName.toLowerCase() &&
                        nft.unlockableContent !== undefined &&
                        nft.unlockableContent !== "" ? (
                          <AnimatePresence>
                            <Lock
                              key="unlock"
                              animate={isFlip ? { y: 120 } : { y: 15 }}
                              layout
                              style={{ cursor: "pointer!" }}
                            >
                              <HStack
                                background="white"
                                border="6px"
                                padding="3px 12px"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                  type: "spring",
                                  duration: 1.1,
                                  delay: 0.9,
                                }}
                                onClick={() => setIsFlip((isFlip) => !isFlip)}
                                cursor="pointer"
                              >
                                <VStack>
                                  <CaptionRegular
                                    align="flex-end"
                                    textcolor={appStyle.colors.darkgrey}
                                  >
                                    Unlockable <br></br>Content
                                  </CaptionRegular>
                                </VStack>
                                <IconImg
                                  url={lock}
                                  width="33px"
                                  height="33px"
                                ></IconImg>
                              </HStack>
                            </Lock>
                          </AnimatePresence>
                        ) : null}
                        <ReactPlayer
                          url={isSafari
                            ? nft.urlFile.v1
                            : nft.urlFile.v0
                          }
                          playing={true}
                          muted={true}
                          volume={0}
                          loop={true}
                          controls={true}
                          width="100%"
                          height="100%"
                        />

                        {/* <div>
                          {video}
                          <pre>{JSON.stringify(state, null, 2)}</pre>
                          <button onClick={controls.pause}>Pause</button>
                          <button onClick={controls.play}>Play</button>
                          <br />
                          <button onClick={controls.mute}>Mute</button>
                          <button onClick={controls.unmute}>Un-mute</button>
                          <br />
                          <button onClick={() => controls.volume(0.1)}>
                            Volume: 10%
                          </button>
                          <button onClick={() => controls.volume(0.5)}>
                            Volume: 50%
                          </button>
                          <button onClick={() => controls.volume(1)}>
                            Volume: 100%
                          </button>
                          <br />
                          <button onClick={() => controls.seek(state.time - 5)}>
                            -5 sec
                          </button>
                          <button onClick={() => controls.seek(state.time + 5)}>
                            +5 sec
                          </button>
                        </div> */}
                      </VStack>
                    ) : isAudio(nft?.fileType) ? (
                      <VStack
                        width="100%"
                        height="540px"
                        border="15px"
                        backgroundimage={isSafari
                          ? nft.preview.v1
                          : nft.preview.v0
                        }
                        overflow="hidden"
                        cursor="pointer"
                        padding="15px"
                      >
                        {(isXdc(wallet?.address)
                          ? fromXdc(wallet?.address?.toLowerCase())
                          : wallet?.address?.toLowerCase()) ===
                          nft.owner.userName.toLowerCase() &&
                        nft.unlockableContent !== undefined &&
                        nft.unlockableContent !== "" ? (
                          <AnimatePresence>
                            <Lock
                              key="unlock"
                              animate={isFlip ? { y: 120 } : { y: 15 }}
                              layout
                              style={{ cursor: "pointer!" }}
                            >
                              <HStack
                                background="white"
                                border="6px"
                                padding="3px 12px"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                  type: "spring",
                                  duration: 1.1,
                                  delay: 0.9,
                                }}
                                onClick={() => setIsFlip((isFlip) => !isFlip)}
                                cursor="pointer"
                              >
                                <VStack>
                                  <CaptionRegular
                                    align="flex-end"
                                    textcolor={appStyle.colors.darkgrey}
                                  >
                                    Unlockable <br></br>Content
                                  </CaptionRegular>
                                </VStack>
                                <IconImg
                                  url={lock}
                                  width="33px"
                                  height="33px"
                                ></IconImg>
                              </HStack>
                            </Lock>
                          </AnimatePresence>
                        ) : null}
                        <ReactPlayer
                          url={isSafari
                            ? nft.urlFile.v1
                            : nft.urlFile.v0
                          }
                          playing={true}
                          muted={true}
                          controls={true}
                          volume={0}
                          loop={true}
                          width="100%"
                          height="100%"
                        />
                      </VStack>
                    ) : (
                      <VStack
                        width="100%"
                        height="100%"
                        key="loader"
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: 1, scale: 0.9 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", duration: 1.1 }}
                      >
                        <LoadingNftContainer></LoadingNftContainer>
                      </VStack>
                    )}
                  </ZItem>
                </ZStack>
              </AnimatePresence>

              <HStack
                background={({ theme }) => theme.backElement}
                width="100%"
                height="49px"
                border="9px"
              >
                <CaptionRegular>Owned by</CaptionRegular>
                <HStack
                  spacing="6px"
                  cursor="pointer"
                  onClick={() => props.redirect(`UserProfile/${nft.owner._id}`)}
                >
                  <IconImg
                    url={nft?.owner.userProfile}
                    width="18px"
                    height="18px"
                    backsize="cover"
                    border="18px"
                  ></IconImg>
                  {nft?.owner.userName ? (
                    <Tooltip title={nft.owner.userName}>
                      <BodyBold cursor={"pointer"}>
                        {truncateAddress(nft.owner.userName)}
                      </BodyBold>
                    </Tooltip>
                  ) : (
                    <ImpulseSpinner
                      size={30}
                      frontColor="#99A2AF"
                      backColor="#686769"
                      loading={true}
                    />
                  )}
                </HStack>
              </HStack>
            </VStack>

            {/* NFT Description */}
            <VStack width="100%" padding="21px 12px">
              {/* NFT Description Tabs */}
              <HStack height="60px" justify="flex-start">
                <TitleBold18
                  animate={isActive === 1 ? "selected" : "normal"}
                  variants={variants}
                  onClick={() => setIsActive(1)}
                  cursor="pointer"
                >
                  Properties
                </TitleBold18>
                <TitleBold18
                  animate={isActive === 2 ? "selected" : "normal"}
                  variants={variants}
                  onClick={() => setIsActive(2)}
                  cursor="pointer"
                >
                  Token Details
                </TitleBold18>
              </HStack>

              {/* Description and Token Info */}

              <AnimatePresence initial={false}>
                <LayoutGroup id="NFTProperties">
                  <ZStack>
                    {isActive === 1 && (
                      <ZItem>
                        <VStack height="auto">
                          <BodyRegular>{nft?.description}</BodyRegular>

                          <motion.div>
                            <HStack
                              variants={appear}
                              key={2}
                              initial="normal"
                              animate="selected"
                              exit="normal"
                              flexwrap="wrap"
                              spacing="6px"
                              width="100%"
                              justify="flex-start"
                            >
                              {nft?.properties.length !== 0
                                ? nft?.properties.map((property, index) => (
                                    <Property
                                      width={
                                        size.width > 1300
                                          ? "176px"
                                          : size.width > 1024
                                          ? "164px"
                                          : size.width > 768
                                          ? "150px"
                                          : size.width > 480
                                          ? "160px"
                                          : "120px"
                                      }
                                      key={index}
                                      Title={property.property}
                                      Property={property.value}
                                      Rarity={property.rarity.toFixed(2)}
                                    />
                                  ))
                                : null}
                            </HStack>
                          </motion.div>
                        </VStack>
                      </ZItem>
                    )}
                    {isActive === 2 && (
                      <ZItem>
                        <VStack
                          variants={appear}
                          key={3}
                          initial="normal"
                          animate="selected"
                          layoutId={3}
                          layout="position"
                          exit="normal"
                          spacing="6px"
                          width="100%"
                          background={({ theme }) => theme.backElement}
                          border="9px"
                          justify="flex-start"
                          padding={"12px"}
                          height="150px"
                        >
                          <HStack width="100%" height="36px">
                            <IconImg
                              url={mint}
                              width="21px"
                              height="21px"
                            ></IconImg>
                            <CaptionBoldShort>NFT Address</CaptionBoldShort>
                            <Spacer></Spacer>
                            <HStack spacing="6px">
                              <Tooltip title={nftaddress}>
                                <TitleBold18>
                                  {truncateAddress(nftaddress)}
                                </TitleBold18>
                              </Tooltip>
                            </HStack>
                          </HStack>
                          <HStack width="100%" height="36px">
                            <IconImg
                              url={tokenIcon}
                              width="21px"
                              height="21px"
                            ></IconImg>
                            <CaptionBoldShort>Token ID</CaptionBoldShort>
                            <Spacer></Spacer>
                            <HStack spacing="6px">
                              <TitleBold18>{nft?.tokenId}</TitleBold18>
                            </HStack>
                          </HStack>
                          <HStack width="100%" height="36px">
                            <IconImg
                              url={blockchainIcon}
                              width="21px"
                              height="21px"
                            ></IconImg>
                            <CaptionBoldShort>Blockchain</CaptionBoldShort>
                            <Spacer></Spacer>
                            <HStack spacing="6px">
                              <IconImg
                                url={xdclogo}
                                width="18px"
                                height="18px"
                              ></IconImg>
                              <TitleBold18>XDC</TitleBold18>
                            </HStack>
                          </HStack>
                        </VStack>
                      </ZItem>
                    )}
                  </ZStack>
                </LayoutGroup>
              </AnimatePresence>

              {/* Creator */}
              <HStack
                spacing="9px"
                justify="flex-start"
                border="9px"
                padding="12px"
                background={({ theme }) => theme.backElement}
              >
                <CaptionBoldShort>CREATOR</CaptionBoldShort>
                <Spacer></Spacer>

                {nft?.creator.userName ? (
                  <HStack
                    spacing="6px"
                    cursor={"pointer"}
                    width="auto"
                    onClick={() => props.redirect(`UserProfile/${nft.creator._id}`)}
                  >
                    <IconImg
                      url={nft.creator.urlProfile}
                      width="26px"
                      height="26px"
                      border="30px"
                      cursor={"pointer"}
                      backsize="cover"
                    ></IconImg>

                    <Tooltip title={nft.creator.userName}>
                      <BodyBold>{truncateAddress(nft.creator.userName)}</BodyBold>
                    </Tooltip>
                  </HStack>
                ) : (
                  "Loading"
                )}

                <Spacer></Spacer>
                <BodyRegular>
                  {nft?.royalty ? parseInt(nft.royalty) : "0"}% Royalty
                </BodyRegular>
              </HStack>

              {/* Share */}
              <HStack
                justify="flex-start"
                border="9px"
                padding="12px"
                spacing="15px"
                background={({ theme }) => theme.backElement}
              >
                <CaptionBoldShort>SHARE</CaptionBoldShort>
                <Spacer></Spacer>
                <FacebookShareButton
                  url={
                    "https://www.xdsea.com" +
                    webLocation.pathname
                      .replace(/\s+/g, "%20")
                      .replace(/%20$/, "")
                  }
                  quote={"Check out this NFT!"}
                  hashtag={["#XDSea"]}
                  description={"XDSea NFT Marketplace"}
                  className="Demo__some-network__share-button"
                >
                  <a>
                    <IconImg
                      url={facebookSocial}
                      width="30px"
                      height="30px"
                    ></IconImg>
                  </a>
                </FacebookShareButton>
                <TwitterShareButton
                  title={"Check out this NFT!"}
                  url={
                    "https://www.xdsea.com" +
                    webLocation.pathname
                      .replace(/\s+/g, "%20")
                      .replace(/%20$/, "")
                  }
                  hashtags={["XDSea", "BuildItOnXDC"]}
                >
                  <a>
                    <IconImg
                      url={twitterSocial}
                      width="30px"
                      height="30px"
                    ></IconImg>
                  </a>
                </TwitterShareButton>
                <TelegramShareButton
                  title={"Check out this NFT!"}
                  url={
                    "https://www.xdsea.com" +
                    webLocation.pathname
                      .replace(/\s+/g, "%20")
                      .replace(/%20$/, "")
                  }
                >
                  <a>
                    <IconImg
                      url={telegramSocial}
                      width="30px"
                      height="30px"
                    ></IconImg>
                  </a>
                </TelegramShareButton>
                <WhatsappShareButton
                  title={"Check out this NFT!"}
                  url={
                    "https://www.xdsea.com" +
                    webLocation.pathname
                      .replace(/\s+/g, "%20")
                      .replace(/%20$/, "")
                  }
                >
                  <a>
                    <IconImg
                      url={whatsSocial}
                      width="30px"
                      height="30px"
                    ></IconImg>
                  </a>
                </WhatsappShareButton>
                {copied ? (
                  <HStack
                    background={({ theme }) => theme.faded}
                    padding="3px 9px"
                    border="6px"
                  >
                    <CaptionBoldShort>COPIED</CaptionBoldShort>
                  </HStack>
                ) : (
                  <a>
                    <IconImg
                      onClick={copy}
                      url={linkSocial}
                      width="30px"
                      height="30px"
                    ></IconImg>
                  </a>
                )}

                <Spacer></Spacer>
              </HStack>

              {/* Price */}
              <VStack
                background={({ theme }) => theme.backElement}
                width="100%"
                height="auto"
                border="9px"
                padding="6px 15px"
              >
                <HStack width="100%" height="36px">
                  <IconImg url={star} width="18px" height="18px"></IconImg>
                  <CaptionBoldShort>Price</CaptionBoldShort>
                  <Spacer></Spacer>
                  <HStack spacing="6px">
                    <IconImg url={xdclogo} width="18px" height="18px"></IconImg>

                    <TitleBold18>
                      {nft?.price
                        ? nft.price > 100000
                          ? Intl.NumberFormat("en-US", {
                              notation: "compact",
                              maximumFractionDigits: 2,
                            }).format(nft.price)
                          : nft.price.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            }) || "0"
                        : "0.00"}
                    </TitleBold18>
                    <CaptionBoldShort>XDC</CaptionBoldShort>
                    <CaptionRegular>{`(${
                      props.xdc.xdcPrice * Number(nft?.price) > 100000
                        ? Intl.NumberFormat("en-US", {
                            notation: "compact",
                            maximumFractionDigits: 2,
                          }).format(props.xdc.xdcPrice * Number(nft?.price))
                        : (
                            props.xdc.xdcPrice * Number(nft?.price)
                          ).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          }) || "0"
                    } USD)`}</CaptionRegular>
                  </HStack>
                </HStack>
                <HStack width="100%" height="36px">
                  <IconImg url={tagBlue} width="18px" height="18px"></IconImg>
                  <CaptionBoldShort>Highest Offer</CaptionBoldShort>
                  <Spacer></Spacer>
                  <HStack spacing="6px">
                    {highestOffer === 0 ? (
                      <TitleBold18>-</TitleBold18>
                    ) : (
                      <>
                        <IconImg
                          url={xdclogo}
                          width="18px"
                          height="18px"
                        ></IconImg>
                        <TitleBold18>
                          {parseInt(highestOffer).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </TitleBold18>
                        <CaptionBoldShort>XDC</CaptionBoldShort>
                        <CaptionRegular>{`(${(
                          props.xdc.xdcPrice * parseInt(highestOffer)
                        ).toFixed(2)} USD)`}</CaptionRegular>
                      </>
                    )}
                  </HStack>
                </HStack>
              </VStack>

              {/* Buttons for interacting with NFT */}
              <HStack>
                {wallet?.connected ? (
                  nft?.isListed ? (
                    nft?.owner.userName.toLowerCase() ===
                    (isXdc(wallet?.address)
                      ? fromXdc(wallet?.address.toLowerCase())
                      : wallet?.address.toLowerCase()) ? (
                      <>
                        <ButtonApp
                          btnStatus={withdrawButtonStatus}
                          func={"Withdraw"}
                          icon={tagWhite}
                          iconWidth="21px"
                          iconHeight="21px"
                          text={
                            nft.inBlacklist
                              ? "Withdraw Old"
                              : "Withdraw Listing"
                          }
                          onClick={() => {
                            withdrawListing();
                          }}
                          textcolor={appStyle.colors.white}
                          width="100%"
                          cursor={"pointer"}
                        ></ButtonApp>
                        {nft.inBlacklist ? null : (
                          <ButtonApp
                            icon={star}
                            btnStatus={editButtonStatus}
                            func={"Edit"}
                            iconWidth="21px"
                            iconHeight="21px"
                            text="Edit Listing"
                            onClick={() => {
                              editListing();
                            }}
                            textcolor={({ theme }) => theme.walletText}
                            width="100%"
                            background={({ theme }) => theme.walletButton}
                            cursor={"pointer"}
                          ></ButtonApp>
                        )}
                      </>
                    ) : (
                      <>
                        {nft?.inBlacklist ? null : (
                          <ButtonApp
                            btnStatus={offerButtonStatus}
                            func={"Offer"}
                            icon={star}
                            iconWidth="21px"
                            iconHeight="21px"
                            text="Place Offer"
                            onClick={() => {
                              placeOffer();
                            }}
                            cursor={"pointer"}
                            textcolor={({ theme }) => theme.walletText}
                            width="100%"
                            background={({ theme }) => theme.walletButton}
                          ></ButtonApp>
                        )}
                        <ButtonApp
                          btnStatus={buyButtonStatus}
                          func={"Buy"}
                          icon={tagWhite}
                          iconWidth="21px"
                          iconHeight="21px"
                          text="Buy Now"
                          onClick={() => {
                            buyNFT();
                          }}
                          textcolor={appStyle.colors.white}
                          width="100%"
                          cursor="pointer"
                        ></ButtonApp>
                      </>
                    )
                  ) : nft?.inBlacklist ? null : nft?.owner.userName.toLowerCase() ===
                    (isXdc(wallet?.address)
                      ? fromXdc(wallet?.address.toLowerCase())
                      : wallet?.address.toLowerCase()) ? (
                    <>
                      <ButtonApp
                        icon={tagWhite}
                        btnStatus={listButtonStatus}
                        func={"List"}
                        iconWidth="21px"
                        iconHeight="21px"
                        text="List NFT"
                        onClick={() => {
                          startSale();
                        }}
                        cursor="pointer"
                        textcolor={appStyle.colors.white}
                        width="100%"
                      ></ButtonApp>
                      <ButtonApp
                        icon={tagWhite}
                        btnStatus={transferButtonStatus}
                        func={"Transfer"}
                        iconWidth="21px"
                        iconHeight="21px"
                        text="Transfer"
                        onClick={() => {
                          startTransfer();
                        }}
                        cursor="pointer"
                        textcolor={appStyle.colors.white}
                        width="100%"
                      ></ButtonApp>
                    </>
                  ) : (
                    <ButtonApp
                      btnStatus={offerButtonStatus}
                      func={"Offer"}
                      icon={star}
                      iconWidth="21px"
                      iconHeight="21px"
                      text="Place Offer"
                      onClick={() => {
                        placeOffer();
                      }}
                      cursor="pointer"
                      textcolor={({ theme }) => theme.walletText}
                      width="100%"
                      background={({ theme }) => theme.walletButton}
                    ></ButtonApp>
                  )
                ) : null}
              </HStack>
            </VStack>
          </HStack>

          <VStack width="100%" padding="15px 12px">
            {/* Offers Table */}
            <TitleBold27>Offers</TitleBold27>
            <HStack
              width="100%"
              overflowx={size.width < 768 ? "scroll" : "visible"}
              overflowy={size.width < 768 ? "hidden" : "visible"}
              justify="flex-start"
            >
              <VStack
                width={size.width < 768 ? "690px" : "100%"}
                spacing="0px"
                background={({ theme }) => theme.backElement}
                border="9px"
              >
                {/* Table Head*/}
                <HStack width="100%" spacing="6px" height="51px">
                  <HStack width="100%" justify="flex-start">
                    <HStack padding="0 30px">
                      <BodyBold>OFFER</BodyBold>
                    </HStack>
                  </HStack>
                  <HStack width="100%">
                    <HStack padding="0 30px">
                      <BodyBold>AMOUNT</BodyBold>
                    </HStack>
                  </HStack>
                  <HStack width="100%" justify="flex-end">
                    <HStack padding="0 30px">
                      <BodyBold>STATUS</BodyBold>
                    </HStack>
                  </HStack>
                </HStack>
                {loadingOffers ? (
                  loadingOffersArray.map((i) => (
                    <>
                      <Divider></Divider>
                      <HStack width="100%" height={"69px"} spacing="6px">
                        <HStack background={"transparent"} width={"100%"}>
                          <VStack
                            alignment="flex-start"
                            padding="3px 30px"
                            spacing="3px"
                          >
                            <TitleLoading
                              key="Offerer"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: 0.6,
                                delay: 0.6,
                              }}
                            ></TitleLoading>
                          </VStack>
                        </HStack>
                        <HStack background={"transparent"} width={"100%"}>
                          <VStack spacing="3px">
                            <HStack spacing="6px">
                              <TitleLoading
                                key="Amount"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                  repeat: Infinity,
                                  repeatType: "reverse",
                                  duration: 0.6,
                                  delay: 0.6,
                                }}
                              ></TitleLoading>
                            </HStack>
                          </VStack>
                        </HStack>
                        <HStack background={"transparent"} width={"100%"}>
                          <Spacer></Spacer>
                          <HStack padding={"0 30px"}>
                            <TitleLoading
                              key="Status"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: 0.6,
                                delay: 0.6,
                              }}
                            ></TitleLoading>
                          </HStack>
                        </HStack>
                      </HStack>
                    </>
                  ))
                ) : offers?.length ? (
                  offers.map((item, i) => (
                    <>
                      <TableOffersNft
                        key={i}
                        imageBuyer={item.userId.urlProfile}
                        offerBy={item.fromAddress}
                        offerUser={item.userId._id}
                        wallet={wallet}
                        owner={item.toAddress}
                        offerAmount={item.price}
                        isWithdrawn={item.isWithdrawn}
                        withdrawStatus={withdrawOfferButtonStatus[i]}
                        onClickWithdraw={() => withdrawOffer(i, item._id)}
                        acceptStatus={acceptOfferButtonStatus[i]}
                        onClickAccept={() => acceptOffer(i, item._id)}
                        xdc={props.xdc}
                        redirect={props.redirect}
                      ></TableOffersNft>
                      {i !== offers.length - 1 ? <Divider></Divider> : null}
                    </>
                  ))
                ) : (
                  <VStack width="100%">
                    <Divider></Divider>
                    <HStack width="100%" spacing="6px" height="51px">
                      <HStack width="100%" justify="flex-start">
                        <HStack padding="0 30px">
                          <BodyRegular>---</BodyRegular>
                        </HStack>
                      </HStack>
                      <HStack width="100%">
                        <BodyRegular>---</BodyRegular>
                      </HStack>
                      <HStack width="100%" justify="flex-end">
                        <HStack padding="0 30px">
                          <BodyRegular>---</BodyRegular>
                        </HStack>
                      </HStack>
                    </HStack>
                  </VStack>
                )}
              </VStack>
            </HStack>
          </VStack>
          <VStack width="100%" padding="15px 12px">
            {/* Activity Table */}
            <TitleBold27>Activity</TitleBold27>

            <VStack
              maxwidth={size.width < 768 ? "360px" : "100%"}
              overflowy="scroll"
              alignment="flex-start"
            >
              <VStack
                background={({ theme }) => theme.backElement}
                width={size.width < 768 ? "790px" : "100%"}
                spacing="0px"
                border="9px"
              >
                {/* Table Header */}
                <HStack height={"50px"}>
                  <Spacer></Spacer>
                  <HStack width={"264px"}>
                    <BodyBold>EVENT</BodyBold>
                  </HStack>
                  <Spacer></Spacer>
                  <HStack width={"264px"}>
                    <BodyBold>PRICE</BodyBold>
                  </HStack>
                  <Spacer></Spacer>
                  <HStack width={"264px"}>
                    <BodyBold>FROM</BodyBold>
                  </HStack>
                  <Spacer></Spacer>
                  <HStack width={"264px"}>
                    <BodyBold>TO</BodyBold>
                  </HStack>
                  <Spacer></Spacer>
                  <HStack width={"264px"}>
                    <BodyBold>DATE</BodyBold>
                  </HStack>
                  <Spacer></Spacer>
                </HStack>

                {/* inside content */}
                <VStack
                  maxheight="390px"
                  justify="flex-start"
                  spacing="0"
                  overflowy="auto"
                  width="100%"
                >
                  <TableActivityNft
                    xdc={props.xdc}
                    activity={eventHistory}
                    loading={loadingEvents}
                  ></TableActivityNft>
                </VStack>
              </VStack>
            </VStack>
          </VStack>

          {/* More from this collection sections */}

          <VStack width="100%" alignment="flex">
            <TitleBold27 align="center">More from this Collection</TitleBold27>

            <HStack flexwrap="wrap" padding="0 15px">
              {loadingMore ? (
                loadingNFTs.map((item) => (
                  <VStack minwidth="240px" height="390px" key={item.name}>
                    <LoadingNftContainer></LoadingNftContainer>
                  </VStack>
                ))
              ) : moreFromCollectionNfts.length !== 0 ? (
                moreFromCollectionNfts.map((item, i) => (
                  <VStack minwidth="220px" height="450px" key={i}>
                    <NftContainer
                      isVerified={item.owner.isVerified}
                      iconStatus={item.saleType.toLowerCase()}
                      hasOffers={item.hasOpenOffer}
                      key={item.name}
                      fileType={item.fileType}
                      creatorImage={item.owner.urlProfile}
                      itemImage={isSafari
                        ? item.urlFile.v1
                        : item.urlFile.v0
                      }
                      price={item.price}
                      collectionName={item.collectionId.name}
                      itemNumber={item.name}
                      background={({ theme }) => theme.backElement}
                      onClick={() => {
                        setNFT(null);
                        props.redirect(`nft/${nftaddress}/${item.tokenId}`);
                      }}
                      onClickCreator={() =>
                        props.redirect(`UserProfile/${item.owner._id}`)
                      }
                      usdPrice={props.xdc}
                      owner={true}
                      collectionVerified={item.creator.isVerified}
                    ></NftContainer>
                  </VStack>
                ))
              ) : (
                <VStack
                  width="100%"
                  height="260px"
                  border="9px"
                  spacing="9px"
                  background={({ theme }) => theme.faded}
                >
                  <IconImg url={eyesEmpty} width="60px" height="60px"></IconImg>
                  <BodyBold>Oh Snap!</BodyBold>
                  <BodyRegular animate={{ opacity: 0.6 }}>
                    There is no more NFTs on this collection
                  </BodyRegular>
                </VStack>
              )}
            </HStack>
          </VStack>
        </VStack>
      </ContentNftPage>
    </NFTPage>
  );
};

export default NFTDetails;

const Lock = styled(motion.div)`
  position: absolute;
  top: 0px;
  right: 15px;
  z-index: 10;
`;

const LockedContent = styled(motion.div)`
  position: absolute;
  top: 349px;
  width: 100%;
  height: 80%;
  padding: 21px;
`;

const NFTPage = styled(motion.div)`
  padding: 30px 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.06);
`;

const ContentNftPage = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
`;

const TitleLoading = styled(motion.div)`
  width: 150px;
  height: 26px;
  border-radius: 6px;
  background: rgba(153, 162, 175, 0.21);
`;
