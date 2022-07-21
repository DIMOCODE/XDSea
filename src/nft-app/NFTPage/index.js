import React, { useEffect, useState } from "react";

import { useParams, useHistory, useLocation } from "react-router-dom";
import Xdc3 from "xdc3";
import { DEFAULT_PROVIDER, HEADER } from "../../constant";
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
import { fromXdc, isXdc } from "../../common/common";
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
import withdrawList from "../../images/withdrawList.png";
import sale from "../../images/partyIcon.png";
import transferIcon from "../../images/transferIconGray.png";
import editListingIcon from "../../images/editListing.png";
import offerPlacedIcon from "../../images/xdcOffer.png";
import offerRejectedIcon from "../../images/offerRejected.png";
import offerAcceptedIcon from "../../images/offerAccepted.png";
import tokenIcon from "../../images/tokenID.png";
import blockchainIcon from "../../images/blockchainIcon.png";
import banner1 from "../../images/Banner1.jpg";
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
import gradientlocked from "../../images/gradientlocked.jpg";

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
import xinfinLogo from "../../images/xinfinLogo.png";
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

const NFTDetails = (props) => {
  const webLocation = useLocation();
  const history = useHistory();
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

  const { id, nftaddress } = useParams();

  const buyNFT = async () => {
    setIsProcessingBuying(true);
    setBuyButtonStatus(1);
    var success = false;
    if (blacklist.includes(nft.tokenId)) {
      success = await LegacyBuyNFT(nft);
    } else {
      success = await BuyNFT(nft);
    }
    if (success) {
      setBuyButtonStatus(3);
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
    if (!blacklist.includes(nft.tokenId)) {
      success = await Offer(approved, nft, offerPrice);
    }
    if (success) {
      setOfferButtonStatus(3);
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
    if (blacklist.includes(nft.tokenId)) {
      success = await LegacyWithdrawListing(approved, nft);
    } else {
      success = await WithdrawListing(approved, nft);
    }
    if (success) {
      setWithdrawButtonStatus(3);
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
    if (!blacklist.includes(nft.tokenId)) {
      success = await EditNFT(approved, nft, editPrice);
    }
    if (success) {
      setEditButtonStatus(3);
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
    if (!blacklist.includes(nft.tokenId)) {
      // console.log(approved);
      success = await SellNFT(approved, nft, listPrice);
    }
    if (success) {
      setListButtonStatus(3);
    } else {
      setListButtonStatus(4);
    }
    setIsProcessingListing(false);
    setActions(actions + 1);
    setTimeout(() => {
      setListButtonStatus(0);
    }, 3500);
  };

  const startTransfer = async (nft) => {
    setTransferring(true);
    setTransferButtonStatus(1);
  };

  const transferNFT = async () => {
    setIsProcessingTransferring(true);
    setTransferring(false);
    var success = false;
    if (!blacklist.includes(nft.tokenId)) {
      success = await TransferNFT(approved, nft, transferAddress);
    }
    if (success) {
      setTransferButtonStatus(3);
    } else {
      setTransferButtonStatus(4);
    }
    setIsProcessingTransferring(false);
    setActions(actions + 1);
    setTimeout(() => {
      setTransferButtonStatus(0);
    }, 3500);
  };

  const withdrawOffer = async (i) => {
    setIsProcessingWithdrawingOffer(true);
    setWithdrawOfferButtonStatus((prevState) => {
      prevState[i] = 1;
      return [...prevState];
    });
    var success = false;
    if (!blacklist.includes(nft.tokenId)) {
      success = await WithdrawOffer(approved, nft.tokenId, i + 1);
    }
    if (success) {
      setWithdrawOfferButtonStatus((prevState) => {
        prevState[i] = 3;
        return [...prevState];
      });
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

  const acceptOffer = async (i) => {
    setIsProcessingAccepting(true);
    setAcceptOfferButtonStatus((prevState) => {
      prevState[i] = 1;
      return [...prevState];
    });
    var success = false;
    if (!blacklist.includes(nft.tokenId)) {
      success = await AcceptOffer(approved, nft.tokenId, i + 1);
    }
    if (success) {
      setAcceptOfferButtonStatus((prevState) => {
        prevState[i] = 3;
        return [...prevState];
      });
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

  const getData = async () => {
    try {
      setBlacklist(permaBlacklist);
      setContractFixes(contractFix);
      const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));
      const marketContract = new xdc3.eth.Contract(
        NFTMarketLayer1.abi,
        nftmarketlayeraddress,
        xdc3
      );
      const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
      var item = await marketContract.methods.idToMarketItem(id).call();
      var uri = await nftContract.methods.tokenURI(item.tokenId).call();
      var metadata = await axios.get(uri);
      var price = await xdc3.utils.fromWei(item.price, "ether");
      let currentItem = {
        price: price,
        tokenId: item.tokenId,
        itemId: item.itemId,
        creator: item.creator,
        owner: item.owner,
        collectionName: metadata?.data?.collection?.name,
        collectionLogo:
          metadata?.data?.collection?.logo?.split("/")[2] === "xdsea.infura-ipfs.io"
            ? `https://${new CID(metadata?.data?.collection?.logo.split("/")[4])
                .toV1()
                .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
            : metadata?.data?.collection?.logo,
        image:
          metadata?.data?.collection?.nft?.image?.split("/")[2] ===
          "xdsea.infura-ipfs.io"
            ? `https://${new CID(
                metadata?.data?.collection?.nft?.image.split("/")[4]
              )
                .toV1()
                .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
            : metadata?.data?.collection?.nft?.image,
        name:
          item.tokenId === "3567"
            ? "TAURULIOMPS 1/12"
            : item.tokenId === "3580"
            ? "GEMINLIOMP 2/12"
            : item.tokenId === "3584"
            ? "LIBRIOMP 2/12"
            : item.tokenId === "3650"
            ? "PISCELIOMPS 8/12"
            : item.tokenId === "3679"
            ? "LEOIOMP 10/12"
            : item.tokenId === "3695"
            ? "SAGITTARIOMPS 11/12"
            : metadata?.data?.collection?.nft?.name,
        description: metadata?.data?.collection?.nft?.description,
        nftContract: item.nftContract,
        isListed: item.isListed,
        properties: metadata?.data?.collection?.nft?.properties,
        fileType: metadata?.data?.collection?.nft?.fileType,
        preview:
          metadata?.data?.collection?.nft?.preview?.split("/")[2] ===
          "xdsea.infura-ipfs.io"
            ? `https://${new CID(
                metadata?.data?.collection?.nft?.preview.split("/")[4]
              )
                .toV1()
                .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
            : metadata?.data?.collection?.nft?.preview,
        royalty: metadata?.data?.collection?.nft?.royalty,
        unlockableContent: metadata?.data?.collection?.nft?.unlockableContent,
      };
      const data = await marketContract.methods
        .getCollectionNFTs(metadata?.data?.collection?.name)
        .call();
      var moreFromCollectionItems = [];
      const collection = await Promise.all(
        data.slice(0, 10).map(async (i) => {
          var price = await xdc3.utils.fromWei(i.price, "ether");
          const uri = await nftContract.methods.tokenURI(i.tokenId).call();
          var metadata = await axios.get(uri);
          let item = {
            price: price,
            isListed: i.isListed,
            offerCount: i.offerCount,
            tokenId: i.tokenId,
            itemId: i.itemId,
            seller: i.seller,
            owner: i.owner,
            creator: i.creator,
            collectionName: metadata?.data?.collection?.name,
            collectionLogo:
              metadata?.data?.collection?.logo?.split("/")[2] ===
              "xdsea.infura-ipfs.io"
                ? `https://${new CID(
                    metadata?.data?.collection?.logo.split("/")[4]
                  )
                    .toV1()
                    .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
                : metadata?.data?.collection?.logo,
            image:
              metadata?.data?.collection?.nft?.image?.split("/")[2] ===
              "xdsea.infura-ipfs.io"
                ? `https://${new CID(
                    metadata?.data?.collection?.nft?.image.split("/")[4]
                  )
                    .toV1()
                    .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
                : metadata?.data?.collection?.nft?.image,
            name:
              i.tokenId === "3567"
                ? "TAURULIOMPS 1/12"
                : i.tokenId === "3580"
                ? "GEMINLIOMP 2/12"
                : i.tokenId === "3584"
                ? "LIBRIOMP 2/12"
                : i.tokenId === "3650"
                ? "PISCELIOMPS 8/12"
                : i.tokenId === "3679"
                ? "LEOIOMP 10/12"
                : i.tokenId === "3695"
                ? "SAGITTARIOMPS 11/12"
                : metadata?.data?.collection?.nft?.name,
            description: metadata?.data?.collection?.nft?.description,
            nftContract: i.nftContract,
            properties: metadata?.data?.collection?.nft?.properties,
            fileType: metadata?.data?.collection?.nft?.fileType,
            preview:
              metadata?.data?.collection?.nft?.preview?.split("/")[2] ===
              "xdsea.infura-ipfs.io"
                ? `https://${new CID(
                    metadata?.data?.collection?.nft?.preview.split("/")[4]
                  )
                    .toV1()
                    .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
                : metadata?.data?.collection?.nft?.preview,
          };
          if (
            i.tokenId !== currentItem.tokenId &&
            moreFromCollectionItems.length < 8 &&
            !burnedNFTs.includes(i.tokenId)
          ) {
            moreFromCollectionItems.push(item);
          }
          return item;
        })
      );
      setCollections(collections);
      const properties = await Promise.all(
        metadata.data.collection.nft.properties.map(async (property, i) => {
          let propertyProp = {
            property: property.property,
            value: property.value,
            proportion: 0,
          };
          return propertyProp;
        })
      );
      const moreFromCollection = await Promise.all(
        collection.map(async (i) => {
          const uri = await nftContract.methods.tokenURI(i.tokenId).call();
          var metadata = await axios.get(uri);
          var currentItemURI = await nftContract.methods
            .tokenURI(item.tokenId)
            .call();
          var currentItemMetadata = await axios.get(currentItemURI);
          if (
            i.tokenId !== id &&
            metadata?.data?.collection?.name ===
              currentItemMetadata?.data?.collection?.name
          ) {
            var props = await Promise.all(
              metadata?.data?.collection?.nft?.properties.map(async (prop) => {
                return prop;
              })
            );
            return props;
          }
        })
      );
      const filteredCollectionProperties = moreFromCollection.filter(
        (element) => {
          return element !== undefined;
        }
      );
      for (var i = 0; i < properties.length; i++) {
        var propCount = 1;
        var totalCount = 1;
        for (var j = 0; j < filteredCollectionProperties.length; j++) {
          for (var k = 0; k < filteredCollectionProperties[j].length; k++) {
            if (
              filteredCollectionProperties[j][k].property ===
                properties[i].property &&
              filteredCollectionProperties[j][k].value === properties[i].value
            ) {
              propCount += 1;
            }
          }
          totalCount += 1;
        }
        properties[i].proportion = (propCount * 100) / totalCount;
      }
      setNFT(currentItem);
      setPropertyProportions(properties);
      setMoreFromCollectionNfts(moreFromCollectionItems.slice(0, 4));
    } catch (error) {
      console.log(error);
    }
  };

  const truncateAddress = (address) => {
    return address
      ? address.substring(0, 7) + "..." + address.substring(33)
      : "undefined";
  };

  const getOffers = async () => {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));
    const marketContract = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nftmarketlayeraddress,
      xdc3
    );
    var offers = await marketContract.methods.getTokenOfferList(id).call();
    var highestOfferPrice = 0;
    await Promise.all(
      offers.map(async (i) => {
        if (parseInt(i.price) >= parseInt(highestOfferPrice))
          highestOfferPrice = i.price;
      })
    );

    setHighestOffer(
      highestOfferPrice === 0
        ? 0
        : await xdc3.utils.fromWei(highestOfferPrice, "ether")
    );
    setOffers(offers);
    setAcceptOfferButtonStatus(new Array(offers.length).fill(0));
    setWithdrawOfferButtonStatus(new Array(offers.length).fill(0));
  };

  const getEvents = async () => {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));
    const marketContract = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nftmarketlayeraddress,
      xdc3
    );
    var events = await marketContract.methods.getTokenEventHistory(id).call();
    const activity = await Promise.all(
      events.map(async (item, i) => {
        let event = {
          id: i + 1,
          event:
            item.eventType === "0" ? (
              <HStack>
                <IconImg url={mint} width="26px" height="26px"></IconImg>
                <CaptionBoldShort>Mint</CaptionBoldShort>
              </HStack>
            ) : item.eventType === "1" ? (
              <HStack>
                <IconImg url={list} width="26px" height="26px"></IconImg>
                <CaptionBoldShort>List</CaptionBoldShort>
              </HStack>
            ) : item.eventType === "2" ? (
              <HStack>
                <IconImg
                  url={withdrawList}
                  width="26px"
                  height="26px"
                ></IconImg>
                <CaptionBoldShort>Withdraw Listing</CaptionBoldShort>
              </HStack>
            ) : item.eventType === "3" ? (
              <HStack>
                <IconImg url={sale} width="26px" height="26px"></IconImg>
                <CaptionBoldShort>Sale</CaptionBoldShort>
              </HStack>
            ) : item.eventType === "4" ? (
              <HStack>
                <IconImg
                  url={transferIcon}
                  width="26px"
                  height="26px"
                ></IconImg>
                <CaptionBoldShort>Transfer</CaptionBoldShort>
              </HStack>
            ) : item.eventType === "5" ? (
              <HStack>
                <IconImg
                  url={editListingIcon}
                  width="26px"
                  height="26px"
                ></IconImg>
                <CaptionBoldShort>Edit Listing</CaptionBoldShort>
              </HStack>
            ) : item.eventType === "6" ? (
              <HStack>
                <IconImg
                  url={offerPlacedIcon}
                  width="26px"
                  height="26px"
                ></IconImg>
                <CaptionBoldShort>Offer Placed</CaptionBoldShort>
              </HStack>
            ) : item.eventType === "7" ? (
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
          price: xdc3.utils.fromWei(item.price, "ether"),
          from: item.from,
          to: item.to,
          date: item.timestamp,
        };
        return event;
      })
    );
    setEventHistory(activity.reverse());
  };

  const getApproval = async () => {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));
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

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    setWallet(props?.wallet);
    getData();
    getOffers();
    getEvents();
    getApproval();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setWallet(props?.wallet);
    getData();
    getOffers();
    getEvents();
  }, [id]);

  useEffect(() => {
    setWallet(props?.wallet);
    getApproval();
  }, [props?.wallet]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getData();
    getOffers();
    getEvents();
  }, [actions]);

  // console.log(webLocation.pathname);

  const webLink = "https://www.xdsea.com" + webLocation.pathname.replace(/\s+/g, "%20").replace(/%20$/, "");

  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(webLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

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
          PurchaisedNftName={nft?.name}
          ListedImage={nft?.image}
          confirmBtnPurchaise={() =>
            NavigateTo(
              `UserProfile/${
                isXdc(wallet?.address)
                  ? fromXdc(wallet?.address)
                  : wallet?.address
              }`
            )
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
                    <TitleBold27>{nft?.name}</TitleBold27>
                    <ButtonApp
                      height="30px"
                      text={nft?.collectionName}
                      background={({ theme }) => theme.walletButton}
                      textcolor={({ theme }) => theme.walletText}
                      cursor="pointer"
                      onClick={() =>
                        NavigateTo(`collection/${nft?.collectionName}`)
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
                    <HStack textcolor="white">{nft?.unlockableContent}</HStack>
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
                          nft?.owner?.toLowerCase() &&
                        nft?.unlockableContent !== undefined &&
                        nft?.unlockableContent !== "" ? (
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
                          url={nft?.image}
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
                        // background={({ theme }) => theme.backElement}
                        background="black"
                        overflow="hidden"
                        cursor="pointer"
                      >
                        {(isXdc(wallet?.address)
                          ? fromXdc(wallet?.address?.toLowerCase())
                          : wallet?.address?.toLowerCase()) ===
                          nft?.owner?.toLowerCase() &&
                        nft?.unlockableContent !== undefined &&
                        nft?.unlockableContent !== "" ? (
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
                          url={nft?.image}
                          playing={true}
                          muted={true}
                          loop={true}
                          controls={true}
                          width="100%"
                          height="100%"
                        />
                      </VStack>
                    ) : isAudio(nft?.fileType) ? (
                      <VStack
                        width="100%"
                        height="540px"
                        border="15px"
                        backgroundimage={nft?.preview}
                        // background={({ theme }) => theme.backElement}
                        overflow="hidden"
                        cursor="pointer"
                        padding="15px"
                      >
                        {(isXdc(wallet?.address)
                          ? fromXdc(wallet?.address?.toLowerCase())
                          : wallet?.address?.toLowerCase()) ===
                          nft?.owner?.toLowerCase() &&
                        nft?.unlockableContent !== undefined &&
                        nft?.unlockableContent !== "" ? (
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
                          url={nft?.image}
                          playing={true}
                          muted={true}
                          controls={true}
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
                  onClick={() => NavigateTo(`UserProfile/${nft?.owner}`)}
                >
                  <IconImg
                    url={banner1}
                    width="18px"
                    height="18px"
                    backsize="cover"
                    border="18px"
                  ></IconImg>
                  {nft?.owner ? (
                    <Tooltip title={nft?.owner ? nft.owner : "-"}>
                      <BodyBold cursor={"pointer"}>
                        {truncateAddress(nft?.owner)}
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
            <VStack width="100%" padding="21px 21px">
              {/* NFT Description Tabs */}
              <HStack height="60px" justify="flex-start">
                {/* {propertyProportions[0]?.property === "" ? null : (
                      <TitleBold18
                        animate={isActive === 0 ? "selected" : "normal"}
                        variants={variants}
                        onClick={() => setIsActive(0)}
                        cursor="pointer"
                      >
                        Description
                      </TitleBold18>
                    )} */}
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
                              // padding={
                              //   size.width < 768 ? "0 0 12px 15px" : "5px"
                              // }
                            >
                              {propertyProportions[0]?.property !== ""
                                ? propertyProportions.map((property, index) => (
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
                                      Rarity={property.proportion.toFixed(2)}
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
                                url={xinfinLogo}
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

                {nft?.creator ? (
                  <HStack
                    spacing="6px"
                    cursor={"pointer"}
                    width="auto"
                    onClick={() => NavigateTo(`UserProfile/${nft?.creator}`)}
                  >
                    <IconImg
                      url={nft?.collectionLogo}
                      width="26px"
                      height="26px"
                      border="30px"
                      cursor={"pointer"}
                      backsize="cover"
                    ></IconImg>

                    <Tooltip title={nft?.creator ? nft.creator : "-"}>
                      <BodyBold>{truncateAddress(nft?.creator)}</BodyBold>
                    </Tooltip>
                  </HStack>
                ) : (
                  "Loading"
                )}

                <Spacer></Spacer>
                <BodyRegular>
                  {nft?.royalty ? parseInt(nft?.royalty) : "0"}% Royalty
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
                  url={"https://www.xdsea.com" + webLocation.pathname.replace(/\s+/g, "%20").replace(/%20$/, "")}
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
                  url={"https://www.xdsea.com" + webLocation.pathname.replace(/\s+/g, "%20").replace(/%20$/, "")}
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
                  url={"https://www.xdsea.com" + webLocation.pathname.replace(/\s+/g, "%20").replace(/%20$/, "")}
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
                  url={"https://www.xdsea.com" + webLocation.pathname.replace(/\s+/g, "%20").replace(/%20$/, "")}
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
                        ? Number(nft?.price).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })
                        : "0.00"}
                    </TitleBold18>
                    <CaptionBoldShort>XDC</CaptionBoldShort>
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
                      </>
                    )}
                  </HStack>
                </HStack>
              </VStack>

              {/* Buttons */}
              <HStack>
                {wallet?.connected ? (
                  nft?.isListed ? (
                    nft?.owner.toLowerCase() ===
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
                            contractFixes?.includes(nft?.tokenId)
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
                        {blacklist?.includes(nft?.tokenId) ? null : (
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
                        {blacklist?.includes(nft?.tokenId) ? null : (
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
                  ) : blacklist?.includes(
                      nft?.tokenId
                    ) ? null : nft?.owner.toLowerCase() ===
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
                          startTransfer(nft);
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

          <VStack width="100%" padding="15px 30px">
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
                    <BodyBold>AMOUNT </BodyBold>
                  </HStack>
                  <HStack width="100%" justify="flex-end">
                    <HStack padding="0 30px">
                      <BodyBold>STATUS</BodyBold>
                    </HStack>
                  </HStack>
                </HStack>
                {offers.length ? (
                  offers?.map((item, i) => (
                    <>
                      <TableOffersNft
                        key={i}
                        imageBuyer={banner1}
                        offerBy={item.from}
                        wallet={wallet}
                        owner={item.to}
                        offerAmount={item.price.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                        isWithdrawn={item.isWithdrawn}
                        withdrawStatus={withdrawOfferButtonStatus[i]}
                        onClickWithdraw={() => withdrawOffer(i)}
                        acceptStatus={acceptOfferButtonStatus[i]}
                        onClickAccept={() => acceptOffer(i)}
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
          <VStack width="100%" padding="15px 30px">
            <TitleBold27>Activity</TitleBold27>
            <HStack
              width="100%"
              overflowx={size.width < 768 ? "scroll" : "visible"}
              overflowy={size.width < 768 ? "hidden" : "visible"}
              justify="flex-start"
            >
              <HStack width={size.width < 768 ? "690px" : "100%"}>
                <TableActivityNft activity={eventHistory}></TableActivityNft>
              </HStack>
            </HStack>
          </VStack>
          <VStack width="100%" alignment="flex">
            <TitleBold27 align="center">More from this Collection</TitleBold27>

            <HStack
              responsive={true}
              padding="0 15px"
              height={size.width < 768 ? "1800px" : "auto"}
            >
              {moreFromCollectionNfts.map((item, i) => (
                <VStack
                  width="100%"
                  // minwidth={size.width < 768 ? "230px" : "280px"}
                  height="450px"
                  key={i}
                >
                  <NftContainer
                    isVerified={verifiedProfiles.includes(item.creator)}
                    iconStatus={item.isListed ? "sale" : "notforsale"}
                    // iconStatus are : notforsale, relist, sale, sold, empty returns null
                    hasOffers={item.offerCount > 0 ? true : false}
                    key={item.name}
                    fileType={item.fileType}
                    creatorImage={item.collectionLogo}
                    itemImage={item.image}
                    price={item.price}
                    collectionName={item.collectionName}
                    itemNumber={item.name}
                    background={({ theme }) => theme.backElement}
                    onClick={() => {
                      setNFT(null);
                      NavigateTo(`nft/${nftaddress}/${item.tokenId}`);
                    }}
                    onClickCreator={() =>
                      NavigateTo(`collection/${item.collectionName}`)
                    }
                  ></NftContainer>
                </VStack>
              ))}
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
