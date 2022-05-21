import React, { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Xdc3 from "xdc3";
import { DEFAULT_PROVIDER } from "../../constant";
// import NFTMarket from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { nftmarketlayeraddress } from "../../config";
// import NFT from "../../artifacts/contracts/NFT.sol/NFT.json"
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
import { permaBlacklist, contractFix, burnedNFTs } from "../../blacklist";
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
import audioCover from "../../images/audioCover0.png";
import {
  HStack,
  IconImg,
  VStack,
  Spacer,
  ZStack,
} from "../../styles/Stacks";
import xdclogo from "../../images/miniXdcLogo.png";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
import {
  BodyBold,
  BodyRegular,
  CaptionBoldShort,
  CaptionRegular,
  TitleBold18,
  TitleBold27,
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
import { ListItemButton } from "@mui/material";

const NFTDetails = (props) => {
  const history = useHistory();
  const [wallet, setWallet] = useState(null);
  const [nft, setNFT] = useState(null);
  const [collections, setCollections] = useState([]);
  const [offers, setOffers] = useState([]);
  const [approved, setApproved] = useState(false);
  const [offerTokenId, setOfferTokenId] = useState(0);
  const [offerId, setOfferId] = useState(0);
  const [eventHistory, setEventHistory] = useState([]);
  const [propertyProportions, setPropertyProportions] = useState([]);
  const [moreFromCollectionNfts, setMoreFromCollectionNfts] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [contractFixes, setContractFixes] = useState([]);
  const [isFlip, setIsFlip] = useState(false);
  const [buyButtonStatus, setBuyButtonStatus] = useState(0);
  const [placingOffer, setPlacingOffer] = useState(false);
  const [offerButtonStatus, setOfferButtonStatus] = useState(0);
  const [offerPrice, setOfferPrice] = useState(0.00);
  const [priceIsInvalid, setPriceIsInvalid] = useState(false);
  const [withdrawButtonStatus, setWithdrawButtonStatus] = useState(0);
  const [editingListing, setEditingListing] = useState(false);
  const [editButtonStatus, setEditButtonStatus] = useState(0);
  const [editPrice, setEditPrice] = useState(0.00);
  const [listingNFT, setListingNFT] = useState(false);
  const [listButtonStatus, setListButtonStatus] = useState(0);
  const [listPrice, setListPrice] = useState(0.00);
  const [transferring, setTransferring] = useState(false);
  const [transferButtonStatus, setTransferButtonStatus] = useState(0);
  const [transferAddress, setTransferAddress] = useState(null);
  const [isActive, setIsActive] = useState(0);
  const [highestOffer, setHighestOffer] = useState(0);
  const [addressIsInvalid, setAddressIsInvalid] = useState(false);
  const [withdrawOfferButtonStatus, setWithdrawOfferButtonStatus] = useState(0);
  const [acceptOfferButtonStatus, setAcceptOfferButtonStatus] = useState(0);
  const size = useWindowSize();
  const variants = {
    selected: { opacity: 1 },
    normal: { opacity: 0.3 },
  };
  const appear = {
    selected: { opacity: 1, y: 0 },
    normal: { opacity: 0.3, y: 6 },
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
    setBuyButtonStatus(1);
    var success = false;
    if (blacklist.includes(nft.tokenId)) {
      success = await LegacyBuyNFT(nft);
    } else {
      success = await BuyNFT(nft);
    }
    if (success) {
      setBuyButtonStatus(3);
    } else {
      setBuyButtonStatus(4);
    }
    setTimeout(() => { setBuyButtonStatus(0) }, 1500);
  };

  const placeOffer = async () => {
    setOfferButtonStatus(1);
    setPlacingOffer(true);
  };

  const offer = async () => {
    if(isNaN(parseFloat(offerPrice))) {
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
    setTimeout(() => { setOfferButtonStatus(0) }, 1500);
  };

  const withdrawListing = async () => {
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
    setTimeout(() => { setWithdrawButtonStatus(0) }, 1500);
  };

  const editListing = async (nft) => {
    setEditButtonStatus(1);
    setEditingListing(true);
  };

  const editNFT = async () => {
    if(isNaN(parseFloat(editPrice))) {
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
    setTimeout(() => { setEditButtonStatus(0) }, 1500);
  };

  const startSale = async () => {
    setListingNFT(true);
    setListButtonStatus(1);
  };

  const listNFT = async () => {
    if(isNaN(parseFloat(listPrice))) {
      setPriceIsInvalid(true);
      return;
    }
    setListingNFT(false);
    var success = false;
    if (!blacklist.includes(nft.tokenId)) {
      success = await SellNFT(approved, nft, listPrice);
    }
    if (success) {
      setListButtonStatus(3);
    } else {
      setListButtonStatus(4);
    }
    setTimeout(() => { setListButtonStatus(0) }, 1500);
  };

  const startTransfer = async (nft) => {
    setTransferring(true);
    setTransferButtonStatus(1);
  };

  const transferNFT = async () => {
    if(!/0x[a-zA-Z0-9]{40}/.test(transferAddress)) {
      setAddressIsInvalid(true);
      return;
    }
    setTransferring(false);
    var success = false;
    if (!blacklist.includes(nft.tokenId)) {
      success = await TransferNFT(approved, transferNFT, transferAddress);
    }
    if (success) {
      setTransferButtonStatus(3);
    } else {
      setTransferButtonStatus(4);
    }
    setTimeout(() => { setTransferButtonStatus(0) }, 1500);
  };
  
  const withdrawOffer = async (i) => {
    setWithdrawOfferButtonStatus(1);
    var success = false;
    if (!blacklist.includes(nft.tokenId)) {
      success = await WithdrawOffer(approved, nft.tokenId, i + 1);
    }
    if (success) {
      setWithdrawOfferButtonStatus(3);
    } else {
      setWithdrawOfferButtonStatus(4);
    }
    setTimeout(() => { setWithdrawOfferButtonStatus(0) }, 1500);
  };

  const acceptOffer = async (i) => {
    setAcceptOfferButtonStatus(1);
    var success = false;
    if (!blacklist.includes(nft.tokenId)) {
      success = await AcceptOffer(approved, nft.tokenId, i + 1);
    }
    if (success) {
      setAcceptOfferButtonStatus(3);
    } else {
      setAcceptOfferButtonStatus(4);
    }
    setTimeout(() => { setAcceptOfferButtonStatus(0) }, 1500);
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
      const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
      const marketContract = new xdc3.eth.Contract(
        NFTMarketLayer1.abi,
        nftmarketlayeraddress,
        xdc3
      );
      const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
      if (wallet?.address !== "" && wallet?.address !== undefined)
        var getVal = await nftContract.methods
          .isApprovedForAll(
            isXdc(wallet?.address) ? fromXdc(wallet?.address) : wallet?.address,
            nftmarketlayeraddress
          )
          .call();
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
        collectionLogo: metadata?.data?.collection?.logo,
        image: metadata?.data?.collection?.nft?.image,
        name: metadata?.data?.collection?.nft?.name,
        description: metadata?.data?.collection?.nft?.description,
        nftContract: item.nftContract,
        itemId: item.itemId,
        isListed: item.isListed,
        properties: metadata?.data?.collection?.nft?.properties,
        fileType: metadata?.data?.collection?.nft?.fileType,
        preview: metadata?.data?.collection?.nft?.preview,
        royalty: metadata?.data?.collection?.nft?.royalty,
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
            tokenId: i.tokenId,
            itemId: i.itemId,
            seller: i.seller,
            owner: i.owner,
            collectionName: metadata?.data?.collection?.name,
            image: metadata?.data?.collection?.nft?.image,
            name: metadata?.data?.collection?.nft?.name,
            description: metadata?.data?.collection?.nft?.description,
            nftContract: i.nftContract,
            isListed: i.isListed,
            properties: metadata?.data?.collection?.nft?.properties,
            fileType: metadata?.data?.collection?.nft?.fileType,
            preview: metadata?.data?.collection?.nft?.preview,
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
            metadata?.data?.collection?.name ==
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
              filteredCollectionProperties[j][k].property ==
                properties[i].property &&
              filteredCollectionProperties[j][k].value == properties[i].value
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
      setApproved(getVal);
      setMoreFromCollectionNfts(moreFromCollectionItems);
    } catch (error) {
      console.log(error);
    }
  };

  const truncateAddress = (address) => {
    return address
      ? address.substring(0, 7) + "..." + address.substring(38)
      : "undefined";
  };

  const getOffers = async () => {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
    const marketContract = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nftmarketlayeraddress,
      xdc3
    );
    var offers = await marketContract.methods.getTokenOfferList(id).call();
    var highestOfferPrice = 0;
    const getHighest = await Promise.all(
      offers.map(async (i) => {
        if (i.price >= highestOfferPrice) highestOfferPrice = i.price;
      })
    );
    setHighestOffer(
      highestOfferPrice === 0
        ? 0
        : await xdc3.utils.fromWei(highestOfferPrice, "ether")
    );
    setOffers(offers);
  };

  const getEvents = async () => {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
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

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  useEffect(() => {
    setWallet(props?.wallet);
    getData();
    getOffers();
    getEvents();
  }, []);

  useEffect(() => {
    setWallet(props?.wallet);
  }, [props?.wallet]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <NFTPage>
      {placingOffer ? (
        <TxModal
          isOffer={true}
          cancelOffer={() => {
            setOfferButtonStatus(0);
            setPlacingOffer(false);
          }}
          placeOffer={() => offer()}
          onChangeOffer={(event) => {
            setPriceIsInvalid(false);
            setOfferPrice(event.target.value);
          }}
          priceInvalid={priceIsInvalid}
          offerPrice={offerPrice}
        ></TxModal>
        ) : null
      }
      {editingListing ? (
        <TxModal
          isEdit={true}
          cancelEdit={() => {
            console.log("Here")
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
      ) : null
      }
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
        ) : null
      }
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
        ) : null
      }
      {/* <TxModal
        isPurchaised={true}
        PurchaisedNftName="Amazing Plug #001"
        ListedImage={imageTest}
        cancelBtnPurchaise=""
        confirmBtnPurchaise=""
      ></TxModal> */}
      {/* <TxModal
        isList={true}
        ListedNftName="Amazing Woman #001"
        ListedImage={imageTest}
        cancelBtnList=""
        confirmBtnList=""
            ></TxModal> */}
      <ContentNftPage>
        <VStack height="auto" padding="90px 0 0 0 ">
          <HStack height="100%" responsive={true} alignment="flex-start">
            <VStack width="100%" padding="30px 15px">
              <VStack width={size.width < 768 ? "100%" : "540px"}>
                {nft?.owner ? (
                  <LockedContent>
                    <VStack
                      background={({ theme }) => theme.walletButton}
                      width="100%"
                      height="89%"
                      border="15px"
                      padding="30px 30px 60px 30px"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        duration: 1.1,
                        delay: 2.1,
                      }}
                    >
                      <Spacer></Spacer>
                      <HStack textcolor={({ theme }) => theme.walletText}>
                        Unlockable Content Here
                      </HStack>
                    </VStack>
                  </LockedContent>
                ) : null}

                <AnimatePresence>
                  <ZStack
                    variants={flipping}
                    animate={isFlip ? "finished" : "initial"}
                  >
                    {isImage(nft?.fileType) ? (
                      <VStack>
                        <Lock>
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
                        <IconImg
                          url={nft?.image}
                          width="100%"
                          height={size.width < 768 ? "360px" : "540px"}
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
                        background={({ theme }) => theme.backElement}
                        overflow="hidden"
                        cursor="pointer"
                      >
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
                        backgroundimage={audioCover}
                        // background={({ theme }) => theme.backElement}
                        overflow="hidden"
                        cursor="pointer"
                        padding="15px"
                      >
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
                        minheight={size.width < 768 ? "360px" : "540px"}
                        key="loader"
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: 1, scale: 0.9 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", duration: 1.1 }}
                      >
                        <LoadingNftContainer></LoadingNftContainer>
                      </VStack>
                    )}
                  </ZStack>
                </AnimatePresence>

                <HStack
                  background={({ theme }) => theme.backElement}
                  width="100%"
                  height="49px"
                  border="9px"
                >
                  <CaptionRegular>Owned by</CaptionRegular>
                  <HStack spacing="6px" cursor="pointer" onClick={() => NavigateTo(`UserProfile/${nft?.owner}`)}>
                    <IconImg
                        url={banner1}
                        width="18px"
                        height="18px"
                        backsize="cover"
                        border="18px"
                    ></IconImg>
                    {nft?.owner ? (
                      <Tooltip title={nft?.owner ? nft.owner : "-"}>
                        <BodyBold>{truncateAddress(nft?.owner)}</BodyBold>
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
            </VStack>
            <VStack width="100%" padding="30px 15px">
              <VStack width={size.width < 768 ? "100%" : "502px"}>
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
                        onClick={() => NavigateTo(`collection/${nft?.collectionName}`)}
                        btnStatus={0}
                      ></ButtonApp>
                    </VStack>
                    <HStack spacing="9px" justify="flex-start">
                      <CaptionRegular>Creator</CaptionRegular>
                      <HStack spacing="6px" cursor={"pointer"} onClick={() => NavigateTo(`UserProfile/${nft?.creator}`)}>
                        <IconImg
                          url={nft?.collectionLogo}
                          width="18px"
                          height="18px"
                          border="30px"
                          cursor={"pointer"}
                        ></IconImg>
                        <Tooltip title={nft?.creator ? nft.creator : "-"}>
                          <BodyBold>{truncateAddress(nft?.creator)}</BodyBold>
                        </Tooltip>
                      </HStack>
                      <CaptionRegular>
                        {nft?.royalty.replace(/^0+/, "")}% Royalty
                      </CaptionRegular>
                    </HStack>
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
                <VStack
                  height={size.width < 768 ? "450px" : "auto"}
                  width="100%"
                  spacing="0px"
                  border="9px"
                >
                  <HStack height="60px" justify="flex-start">
                    {propertyProportions[0]?.property === "" ? null : (
                      <BodyBold
                        animate={isActive === 1 ? "selected" : "normal"}
                        variants={variants}
                        onClick={() => setIsActive(1)}
                        cursor="pointer"
                      >
                        Properties
                      </BodyBold>
                    )}
                    <BodyBold
                      animate={isActive === 0 ? "selected" : "normal"}
                      variants={variants}
                      onClick={() => setIsActive(0)}
                      cursor="pointer"
                    >
                      Description
                    </BodyBold>
                    <BodyBold
                      animate={isActive === 2 ? "selected" : "normal"}
                      variants={variants}
                      onClick={() => setIsActive(2)}
                      cursor="pointer"
                    >
                      Token Details
                    </BodyBold>
                  </HStack>
                  <AnimatePresence>
                    <ZStack>
                      {isActive === 0 && (
                        <HStack
                          variants={appear}
                          key={1}
                          initial="normal"
                          animate="selected"
                          layoutId={1}
                          layout="position"
                          exit="normal"
                          spacing="6px"
                          width="100%"
                          padding="30px"
                          height="100%"
                          background={({ theme }) => theme.backElement}
                          border="9px"
                        >
                          <BodyRegular>{nft?.description}</BodyRegular>
                        </HStack>
                      )}
                      {isActive === 1 && (
                        <VStack>
                          <motion.div>
                            <HStack
                              variants={appear}
                              key={2}
                              initial="normal"
                              animate="selected"
                              layoutId={2}
                              layout="position"
                              exit="normal"
                              flexwrap="wrap"
                              spacing="6px"
                              width="100%"
                              justify="flex-start"
                              padding={
                                size.width < 768 ? "0 0 12px 15px" : "5px"
                              }
                            >
                              {propertyProportions[0]?.property !== ""
                                ? propertyProportions.map((property, index) => (
                                    <Property
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
                      )}
                      {isActive === 2 && (
                        <HStack
                          variants={appear}
                          key={3}
                          initial="normal"
                          animate="selected"
                          layoutId={3}
                          layout="position"
                          exit="normal"
                          flexwrap="wrap"
                          spacing="6px"
                          width="100%"
                          justify="flex-start"
                          padding={size.width < 768 ? "0 0 12px 15px" : "5px"}
                          height={"100%"}
                        >
                          <VStack
                            background={({ theme }) => theme.backElement}
                            width="100%"
                            height="auto"
                            border="9px"
                            padding="6px 15px"
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
                        </HStack>
                      )}
                    </ZStack>
                  </AnimatePresence>
                </VStack>
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
                      <IconImg
                        url={xdclogo}
                        width="18px"
                        height="18px"
                      ></IconImg>
                      <TitleBold18>{nft?.price}</TitleBold18>
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
                          <TitleBold18>{highestOffer}</TitleBold18>
                          <CaptionBoldShort>XDC</CaptionBoldShort>
                        </>
                      )}
                    </HStack>
                  </HStack>
                </VStack>
                <HStack>
                  {wallet?.connected ? (
                    nft?.isListed ? (
                      nft?.owner === wallet?.address ? (
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
                      ) ? null : nft?.owner === wallet?.address ? (
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
                padding="9px"
                border="9px"
              >
                {offers?.map((item, i) => (
                  <>
                    <TableOffersNft
                      imageBuyer={banner1}
                      offerBy={item.from}
                      wallet={wallet}
                      owner={item.to}
                      offerAmount={item.price}
                      isWithdrawn={item.isWithdrawn}
                      withdrawStatus={withdrawOfferButtonStatus}
                      onClickWithdraw={() => withdrawOffer(i)}
                      acceptStatus={acceptOfferButtonStatus}
                      onClickAccept={() => acceptOffer(i)}
                    ></TableOffersNft>
                    {i !== offers.length - 1 ? <Divider></Divider> : null }
                  </>
                ))}
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
        </VStack>
      </ContentNftPage>
    </NFTPage>
  );
};

export default NFTDetails;

const Lock = styled(motion.div)`
  position: absolute;
  bottom: 15px;
  right: 15px;
  z-index: 10;
`;

const LockedContent = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
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
