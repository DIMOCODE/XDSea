import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import { nftaddress } from "../../config";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
import { LoopLogo } from "../../styles/LoopLogo";
import emptyCollection from "../../images/emptyCollection.png";
import emptyNFT from "../../images/emptyNFT.png";
import copyIcon from "../../images/copyAddress.png";
import verified from "../../images/verified.png";
import styled from "styled-components";
import {
  HStack,
  Spacer,
  VStack,
  IconImg,
  ZStack,
  ZItem,
} from "../../styles/Stacks";
import { motion } from "framer-motion/dist/framer-motion";
import {
  BodyRegular,
  CaptionBold,
  TitleBold15,
  TitleBold18,
  CaptionBoldShort,
  TitleBold27,
  TitleSemi21,
  CaptionSmallRegular,
  TitleSemi18,
  BodyBold,
  TitleRegular18,
  BodyMedium,
  CaptionRegular,
} from "../../styles/TextStyles";
import xdcLogo from "../../images/miniXdcLogo.png";
import gradientBase from "../../images/gradientBase.jpg";
import logoWhiteX from "../../images/logoWhiteX.png";
import { SortButtonNFTS } from "../../styles/SortButtonNFTS";
import { FiltersButton } from "../../styles/FiltersButton";
import uploadIcon from "../../images/uploadiconwhite.png";
import addIcon from "../../images/addIcon.png";
import crossIcon from "../../images/crossIcon.png";
import crossWhite from "../../images/crossWhite.png";
import doneIcon from "../../images/doneIcon.png";
import doneIconWhite from "../../images/doneIconWhite.png";
import minusIcon from "../../images/minusIcon.png";
import editProfile from "../../images/editProfile.png";
import mountain from "../../images/mountain.jpg";

import exampleImage from "../../images/audioCover0.png";
import instagramColor from "../../images/instagramColor.png";
import twitterColor from "../../images/twitterColor.png";
import webColor from "../../images/webColor.png";
import walletBlue from "../../images/walletBlue.png";
import useWindowSize from "../../styles/useWindowSize";
import ButtonApp from "../../styles/Buttons";
import { TextAreaStyled } from "../../styles/TextAreaStyled";
import newBlue from "../../images/newBlue.webp";
import warning from "../../images/alert.png";

import { appStyle } from "../../styles/AppStyles";
import { BubbleCopied } from "../../styles/BubbleCopied";
import ReactPlayer from "react-player";
import InfiniteScroll from "react-infinite-scroll-component";
import { getNFTs } from "../../API/NFT";
import { getCollections } from "../../API/Collection";
import { getUser, updateUser, updateUserSettings } from "../../API/User";
import { isImage, isVideo, isAudio } from "../../common";
import { CircleButton } from "../../styles/CircleButton";
import { toXdc, truncateAddress } from "../../common/common";
import { Navigation, Pagination, Scrollbar, A11y, Mousewheel } from "swiper";
import { StickySectionHeader } from "../../CustomModules/sticky/StickySectionHeader.js";
import { Grid, FreeMode, Thumbs } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import editPencil from "../../images/editPencil.png";
import editPencilWhite from "../../images/editPencilWhite.png";
import confirmation from "../../images/confirmation.png";

// Import Swiper styles
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import "./styles.css";

import { InputStyled } from "../../styles/InputStyled";

import { UploadMultimedia } from "../../styles/UploadMultimedia";
import { Activity } from "./Activity";
import { CollectionTab } from "./CollectionTab";
import { Icon } from "@mui/material";
import { uploadFileInS3Bucket } from "../../helpers/fileUploader";
import { GuardSpinner, SwishSpinner, TraceSpinner } from "react-spinners-kit";
import { getXdcDomain } from "../../constant";

const MyNFT = (props) => {
  const { userId } = useParams();
  const size = useWindowSize();

  const [collections, setCollections] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [ownedNFTPlaying, setOwnedNFTPlaying] = useState([]);
  const [totalNfts, setTotalNfts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingCollection, setLoadingCollection] = useState(false);
  const [user, setUser] = useState({});
  const [nftParams, setNftParams] = useState({
    pageSize: 15,
    page: 1,
  });
  const [subMenu, setSubMenu] = useState(0);
  const [, setShowMenu] = useState(props.showMenu);
  const [scrollTop, setScrollTop] = useState();
  const [scrolling, setScrolling] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isInstaAdded, setIsInstaAdded] = useState(false);
  const [isTweetAdded, setIsTweetAdded] = useState(false);
  const [isWebAdded, setIsWebAdded] = useState(false);
  const [isDarkUI, setIsDarkUI] = useState(false);
  const [isAdjust, setIsAdjust] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newUserName, setNewUserName] = useState(false);
  const [newInstagramUsername, setNewInstagramUsername] = useState("");
  const [newTwitterUsername, setNewTwitterUsername] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [highestPrice, setHighestPrice] = useState(0);
  const [statusPublished, setStatusPublished] = useState(false);
  const [collectionFilters, setCollectionFilters] = useState([]);
  const [isCollectionFilterSelected, setIsCollectionFilterSelected] = useState(
    []
  );
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [userSettings, setUserSettings] = useState({});
  const [newStatus, setNewStatus] = useState("");
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [userDomain, setUserDomain] = useState("");

  const heights = [260, 360, 300];

  let position = Math.round(Math.random() * 2);

  /**
   * Get the first page of owned NFTs, created collections, and profile of the user
   */
  const getData = async () => {
    let userData = await (await getUser(userId)).data;
    const id = userData.user._id;
    setUser(userData.user);
    setUserSettings(userData.settings);
    let domain = await getXdcDomain(toXdc(userData.user.XDCWallets[0]));
    setUserDomain(domain);
    await Promise.all(
      [1, 2].map(async (i) => {
        if (i === 1) {
          let nftData = await (
            await getNFTs({ ...nftParams, userId: id })
          ).data;

          let nftHeights = nftData.nfts.map((item) => ({
            ...item,
            height: heights[Math.round(Math.random() * 2)],
          }));

          setNfts(nftHeights);
          setTotalNfts(nftData.nftsAmount);
          setOwnedNFTPlaying(new Array(nftData.nftsAmount.length).fill(false));
          setHighestPrice(nftData.higherPrice);
          setCollectionFilters(nftData.associatedCollections);
          setIsCollectionFilterSelected(
            new Array(nftData.associatedCollections.length).fill(false)
          );
        } else {
          let collectionData = await (
            await getCollections({ userId: id })
          ).data;

          setCollections(collectionData.collections);
          setLoadingCollection(false);
        }
      })
    );

    if (props?.wallet?.address === userData.user.XDCWallets[0]) {
      setIsLoggedIn(true);
    }
    if (userData?.settings?.dashboardMode === "dark") {
      setIsDarkUI(true);
    }

    setNftParams({
      ...nftParams,
      userId: id,
      page: nftParams.page + 1,
    });
    setLoading(false);
  };

  /**
   * Get the next page of owned NFTs of the user
   */
  const fetchMoreNFTs = async () => {
    const nftData = await (await getNFTs(nftParams)).data;

    let nftHeights = nftData.nfts.map((item) => ({
      ...item,
      height: heights[Math.round(Math.random() * 2)],
    }));

    setNfts([...nfts, ...nftHeights]);
    setNftParams({
      ...nftParams,
      page: nftParams.page + 1,
    });
  };

  /**
   * Get the filtered list of owned NFTs of the user
   *
   * @param {*} params parameters used to filter the query results
   */
  const updateNFTs = async (params) => {
    let nftData = await (await getNFTs(params)).data;

    let nftHeights = nftData.nfts.map((item) => ({
      ...item,
      height: heights[Math.round(Math.random() * 2)],
    }));

    setNfts(nftHeights);
    setTotalNfts(nftData.nftsAmount);
    setHighestPrice(nftData.higherPrice);

    setNftParams({
      ...params,
      page: params.page + 1,
    });
  };

  /**
   * Truncate the string to the specified number of characters
   *
   * @param {string} str the string to be truncated
   * @param {number} n the maximum number of characters to include
   * @returns the truncated string
   */
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  const cancelEdit = () => {
    setProfilePicture({ preview: "", raw: "" });
    setNewUserName("");
    setNewInstagramUsername("");
    setNewTwitterUsername("");
    setNewWebsite("");
    setIsDarkUI(user?.theme === "dark" ? true : false);
    setBanner({ preview: "", raw: "" });
    setIsEditing(false);
  };

  function longPress(callback, ms = 250) {
    let timeout = null;

    const start = () => (timeout = setTimeout(callback, ms));
    const stop = () => timeout && window.clearTimeout(timeout);
    return callback
      ? {
          onMouseDown: start,
          onMouseUp: stop,
          onMouseLeave: stop,
          onTouchStart: start,
          onTouchMove: stop,
          onTouchEnd: stop,
        }
      : {};
  }

  const handleCollectionFilter = (i, isNew) => {
    console.log(isCollectionFilterSelected);
    const newIsCollectionFilterSelected = new Array(
      isCollectionFilterSelected.length
    ).fill(false);
    newIsCollectionFilterSelected[i] = isNew;
    setIsCollectionFilterSelected([...newIsCollectionFilterSelected]);
  };

  function determineAgoTime(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

  /**
   * React Hook to re-render the component when the userId state changes
   */
  useEffect(() => {
    window.scrollTo(0, 0);
    setSubMenu(1);
    setLoading(true);
    getData();
    setIsLoggedIn(false);
  }, [userId]);

  useEffect(() => {
    if (user?.XDCWallets !== undefined) {
      if (props?.wallet?.address === user.XDCWallets[0]) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
  }, [props?.wallet]);

  /**
   * Scroll listeners to close the menu on scroll
   */
  useEffect(() => {
    const onScroll = (e) => {
      setScrollTop(e.target.documentElement.scrollTop);
      setScrolling(e.target.documentElement.scrollTop > scrollTop);
      setShowMenu(false);
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

  useEffect(() => {}, [scrolling]);

  const selection = {
    active: {
      opacity: 1,
    },
    faded: {
      opacity: 0.3,
    },
  };

  const [width, setWidth] = React.useState(200);
  const [height, setHeight] = React.useState(200);

  const [target, setTarget] = React.useState();
  const [frame, setFrame] = React.useState({
    translate: [0, 0],
  });
  React.useEffect(() => {
    setTarget(document.querySelector(".target"));
  }, []);

  // First Uploader

  const [profilePicture, setProfilePicture] = useState({
    preview: "",
    raw: "",
  });

  const handleChange = (e) => {
    if (e.target.files.length) {
      setProfilePicture({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  // Second Uploader

  const [banner, setBanner] = useState({ preview: "", raw: "" });

  const handleChangeBanner = (e) => {
    if (e.target.files.length) {
      setBanner({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  /**
   * Update NFT list based on the filters chosen by the user
   *
   * @param {*} params parameters used to filter query results
   */
  const handleChangeFilterNFT = (params) => {
    setNftParams(params);
    updateNFTs(params);
  };

  const updateUserProfile = async () => {
    setIsProfileUpdated(true);
    if (profilePicture.raw !== "") {
      const profilePictureSuccess = await uploadFileInS3Bucket(
        profilePicture.raw,
        "user",
        "urlProfile"
      );
    }
    if (banner.raw !== "") {
      const bannerPictureSuccess = await uploadFileInS3Bucket(
        banner.raw,
        "user",
        "urlCover"
      );
    }
    if (
      user.userName !== newUserName ||
      user.instagram !== newInstagramUsername ||
      user.twitter !== newTwitterUsername ||
      user.siteUrl !== newWebsite
    ) {
      const updateSuccess = await updateUser({
        userName: newUserName,
        instagram: newInstagramUsername,
        twitter: newTwitterUsername,
        siteUrl: newWebsite,
      });
    }
    if (userSettings?.dashboardMode !== (isDarkUI ? "dark" : "light")) {
      const updateSettingsSuccess = await updateUserSettings({
        dashboardMode: isDarkUI ? "dark" : "light",
      });
    }

    let userData = (await getUser(userId)).data;
    setUser(userData.user);
    setUserSettings(userData.settings);
    setIsProfileUpdated(false);
    setIsEditing(false);
  };

  const updateUserStatus = async () => {
    if (user.statusRecord?.status !== newStatus) {
      const updateSuccess = await await updateUser({
        newStatus,
      });
    }
    let userData = await (await getUser(userId)).data;
    setUser(userData.user);
    setNewMessage(false);
  };

  return (
    <UserSection>
      {size.width > 425 ? (
        <ZStack>
          <ZItem>
            <VStack width="100%" height="900px" justify="flex-start">
              <VStack
                width="100%"
                minwidth="100%"
                maxheight="522px"
                overflowx="hidden"
              >
                <IconImg
                  url={
                    isEditing
                      ? banner?.preview
                        ? banner.preview
                        : user.urlCover
                      : user?.urlCover || gradientBase
                  }
                  backsize="cover"
                  width="100%"
                  height="100%"
                ></IconImg>
              </VStack>
            </VStack>
          </ZItem>

          {isEditing ? (
            <>
              <ZItem zindex="1">
                <Content>
                  {isProfileUpdated && (
                    <FadedBack
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.21,
                        delay: 0.1,
                      }}
                    >
                      <VStack>
                        <Spacer></Spacer>
                        <VStack
                          background={({ theme }) => theme.backElement}
                          width="390px"
                          border="9px"
                          spacing="12px"
                          padding="36px 30px"
                          flex="0"
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.21,
                            delay: 0.3,
                          }}
                        >
                          <SwishSpinner
                            size={42}
                            frontColor="#3A60FF"
                            backColor="#3A60FF"
                          ></SwishSpinner>
                          {/* <GuardSpinner
                            size={42}
                            frontColor="#3A60FF"
                            backColor="#B8BFDC"
                          ></GuardSpinner> */}
                          {/* <TraceSpinner
                            size={42}
                            frontColor="#3A60FF"
                            backColor="#B8BFDC"
                          ></TraceSpinner> */}
                          <HStack padding="0 30px">
                            <BodyRegular
                              textcolor={({ theme }) => theme.text}
                              align="center"
                            >
                              {"Saving Changes"}
                            </BodyRegular>
                          </HStack>
                        </VStack>
                        <Spacer></Spacer>
                      </VStack>
                    </FadedBack>
                  )}

                  {confirmCancel && (
                    <FadedBack
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.21,
                        delay: 0.1,
                      }}
                    >
                      <VStack>
                        <Spacer></Spacer>
                        <VStack
                          background={({ theme }) => theme.backElement}
                          width="390px"
                          border="9px"
                          spacing="12px"
                          padding="36px 30px"
                          flex="0"
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.21,
                            delay: 0.3,
                          }}
                        >
                          <IconImg
                            url={warning}
                            width="59px"
                            height="59px"
                          ></IconImg>
                          <HStack padding="0 30px">
                            <BodyRegular
                              textcolor={({ theme }) => theme.text}
                              align="center"
                            >
                              {"Are you sure you want to discard your changes?"}
                            </BodyRegular>
                          </HStack>
                          <HStack>
                            <ButtonApp
                              text="Cancel"
                              textcolor={({ theme }) => theme.text}
                              background={appStyle.colors.darkgrey10}
                              width="100%"
                              onClick={() => {
                                setConfirmCancel(false);
                              }}
                              cursor="pointer"
                              btnStatus={0}
                            ></ButtonApp>
                            <ButtonApp
                              text="Confirm"
                              width="100%"
                              textcolor={appStyle.colors.white}
                              onClick={() => {
                                cancelEdit();
                                setConfirmCancel(false);
                              }}
                              cursor="pointer"
                              btnStatus={0}
                            ></ButtonApp>
                          </HStack>
                        </VStack>
                        <Spacer></Spacer>
                      </VStack>
                    </FadedBack>
                  )}
                  <VStack height="900px">
                    <HStack
                      width="100%"
                      spacing="0%"
                      height="552px"
                      alignment="flex-start"
                      self="none"
                      padding="90px 0 0 0"
                    >
                      <VStack
                        minwidth="70%"
                        height="420px"
                        alignment="flex-start"
                        padding="24px 12px 12px 12px"
                      >
                        <HStack>
                          {/* User image uploader*/}
                          <VStack
                            maxwidth="96px"
                            maxheight="96px"
                            cursor="pointer"
                            overflow="visible"
                            spacing="17px"
                          >
                            <ZStack
                              cursor="pointer"
                              width="96px"
                              minheight="96px"
                              overflow="visible"
                            >
                              <ZItem>
                                <HStack
                                  width="90px"
                                  height="90px"
                                  border="90px"
                                  background={"rgba(0,0,0,0.3)"}
                                >
                                  <IconImg
                                    url={uploadIcon}
                                    width="30px"
                                    height="30px"
                                  ></IconImg>
                                </HStack>
                              </ZItem>
                              <ZItem>
                                <label htmlFor="upload-button">
                                  {profilePicture.preview ? (
                                    <IconImg
                                      whileTap={{ scale: 0.97 }}
                                      cursor="pointer"
                                      url={profilePicture.preview}
                                      width="90px"
                                      height="90px"
                                      border="90px"
                                      backsize="cover"
                                      bordercolor="white"
                                      bordersize="3px"
                                      style={{
                                        boxShadow:
                                          "0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
                                      }}
                                    ></IconImg>
                                  ) : (
                                    <>
                                      <IconImg
                                        whileTap={{ scale: 0.97 }}
                                        cursor="pointer"
                                        url={user?.urlProfile}
                                        width="90px"
                                        height="90px"
                                        border="90px"
                                        backsize="cover"
                                        bordercolor="white"
                                        bordersize="3px"
                                        style={{
                                          boxShadow:
                                            "0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
                                        }}
                                      ></IconImg>
                                    </>
                                  )}
                                </label>
                                <input
                                  type="file"
                                  id="upload-button"
                                  style={{ display: "none" }}
                                  onChange={handleChange}
                                />
                              </ZItem>
                            </ZStack>

                            <CaptionBoldShort
                              textcolor={isDarkUI ? "#363537" : "#FAFAFA"}
                              align="center"
                            >
                              UPLOAD USER PROFILE
                            </CaptionBoldShort>
                          </VStack>

                          {/* Username and social networks selector    */}
                          <VStack alignment="flex-start">
                            <VStack
                              spacing="9px"
                              alignment="flex-start"
                              width="360px"
                            >
                              <CaptionBoldShort
                                textcolor={isDarkUI ? "#363537" : "#FAFAFA"}
                              >
                                EDIT CREATOR NAME
                              </CaptionBoldShort>

                              <InputStyled
                                placeholder={user?.userName}
                                fontsize="21px"
                                textcolor={isDarkUI ? "#363537" : "#FAFAFA"}
                                background={"rgba(0,0,0,0.3)"}
                                onChange={(event) => {
                                  setNewUserName(event.target.value);
                                }}
                              ></InputStyled>
                            </VStack>

                            <HStack spacing="12px" justify="flex-start">
                              {/* Instagram Button */}
                              {user?.instagram ? (
                                <CircleButton
                                  image={instagramColor}
                                  background={isDarkUI ? "#20222D" : "white"}
                                ></CircleButton>
                              ) : null}

                              {/* Twitter Button  */}
                              {user?.twitter ? (
                                <CircleButton
                                  image={twitterColor}
                                  background={isDarkUI ? "#20222D" : "white"}
                                ></CircleButton>
                              ) : null}

                              {/* Web Icon  */}
                              {user?.siteUrl ? (
                                <CircleButton
                                  image={webColor}
                                  background={isDarkUI ? "#20222D" : "white"}
                                ></CircleButton>
                              ) : null}

                              {/* Wallet button  */}
                              <BubbleCopied
                                logo={walletBlue}
                                address={
                                  userDomain ? userDomain : user?.XDCWallets ? truncateAddress(user.XDCWallets[0]) : ""
                                }
                                addressCreator={
                                  user?.XDCWallets ? user.XDCWallets[0] : ""
                                }
                                icon={copyIcon}
                                background={isDarkUI ? "#20222D" : "white"}
                                textColor={isDarkUI ? "#FAFAFA" : "#363537"}
                              ></BubbleCopied>
                            </HStack>
                          </VStack>
                        </HStack>

                        <Spacer></Spacer>
                        <VStack width="360px">
                          {/* Add instagram input */}

                          <HStack>
                            <InputStyled
                              icon={instagramColor}
                              background={"rgba(0,0,0,0.3)"}
                              placeholder={
                                user?.instagram
                                  ? user.instagram
                                  : "Instagram URL"
                              }
                              textcolor={isDarkUI ? "#363537" : "#FAFAFA"}
                              iconRight=""
                              iconLeft="15px"
                              padding="0 0 0 42px"
                              disabled={!isInstaAdded}
                              onChange={(event) => {
                                setNewInstagramUsername(event.target.value);
                              }}
                            ></InputStyled>

                            {!isInstaAdded ? (
                              <HStack
                                width="42px"
                                height="36px"
                                border="36px"
                                background={isDarkUI ? "#20222D" : "white"}
                                cursor="pointer"
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setIsInstaAdded(true)}
                              >
                                <IconImg
                                  url={isDarkUI ? editPencilWhite : editPencil}
                                  width="12px"
                                  height="12px"
                                  cursor="pointer"
                                ></IconImg>
                              </HStack>
                            ) : (
                              <HStack spacing="6px">
                                <HStack
                                  width="36px"
                                  height="36px"
                                  border="36px"
                                  background={isDarkUI ? "#20222D" : "white"}
                                  cursor="pointer"
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => {
                                    setIsInstaAdded(false);
                                  }}
                                >
                                  <IconImg
                                    url={isDarkUI ? doneIconWhite : doneIcon}
                                    width="12px"
                                    height="12px"
                                    cursor="pointer"
                                  ></IconImg>
                                </HStack>{" "}
                                <HStack
                                  width="36px"
                                  height="36px"
                                  border="36px"
                                  background="rgba(0,0,0,0.3)"
                                  cursor="pointer"
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => {
                                    setNewInstagramUsername("");
                                    setIsInstaAdded(false);
                                  }}
                                >
                                  <IconImg
                                    url={crossWhite}
                                    width="18px"
                                    height="18px"
                                    cursor="pointer"
                                  ></IconImg>
                                </HStack>
                              </HStack>
                            )}
                          </HStack>

                          {/* Add twitter input */}

                          <HStack>
                            <InputStyled
                              icon={twitterColor}
                              background={"rgba(0,0,0,0.3)"}
                              placeholder={
                                user?.twitter ? user.twitter : "Twitter URL"
                              }
                              textcolor={isDarkUI ? "#363537" : "#FAFAFA"}
                              iconRight=""
                              iconLeft="15px"
                              padding="0 0 0 42px"
                              disabled={!isTweetAdded}
                              onChange={(event) => {
                                setNewTwitterUsername(event.target.value);
                              }}
                            ></InputStyled>

                            {!isTweetAdded ? (
                              <HStack
                                width="42px"
                                height="36px"
                                border="36px"
                                background={isDarkUI ? "#20222D" : "white"}
                                cursor="pointer"
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setIsTweetAdded(true)}
                              >
                                <IconImg
                                  url={isDarkUI ? editPencilWhite : editPencil}
                                  width="12px"
                                  height="12px"
                                  cursor="pointer"
                                ></IconImg>
                              </HStack>
                            ) : (
                              <HStack spacing="6px">
                                <HStack
                                  width="36px"
                                  height="36px"
                                  border="36px"
                                  background={isDarkUI ? "#20222D" : "white"}
                                  cursor="pointer"
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => setIsTweetAdded(false)}
                                >
                                  <IconImg
                                    url={isDarkUI ? doneIconWhite : doneIcon}
                                    width="12px"
                                    height="12px"
                                    cursor="pointer"
                                  ></IconImg>
                                </HStack>

                                <HStack
                                  width="36px"
                                  height="36px"
                                  border="36px"
                                  background="rgba(0,0,0,0.3)"
                                  cursor="pointer"
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => {
                                    setNewTwitterUsername("");
                                    setIsTweetAdded(false);
                                  }}
                                >
                                  <IconImg
                                    url={crossWhite}
                                    width="18px"
                                    height="18px"
                                    cursor="pointer"
                                  ></IconImg>
                                </HStack>
                              </HStack>
                            )}
                          </HStack>

                          {/* Add website input */}
                          <HStack>
                            <InputStyled
                              icon={webColor}
                              background={"rgba(0,0,0,0.3)"}
                              placeholder={
                                user?.siteUrl ? user.siteUrl : "Website URL"
                              }
                              textcolor={isDarkUI ? "#363537" : "#FAFAFA"}
                              iconRight=""
                              iconLeft="15px"
                              padding="0 0 0 42px"
                              disabled={!isWebAdded}
                              onChange={(event) => {
                                setNewWebsite(event.target.value);
                              }}
                            ></InputStyled>

                            {!isWebAdded ? (
                              <HStack
                                width="42px"
                                height="36px"
                                border="36px"
                                background={isDarkUI ? "#20222D" : "white"}
                                cursor="pointer"
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setIsWebAdded(true)}
                              >
                                <IconImg
                                  url={isDarkUI ? editPencilWhite : editPencil}
                                  width="12px"
                                  height="12px"
                                  cursor="pointer"
                                ></IconImg>
                              </HStack>
                            ) : (
                              <HStack spacing="6px">
                                <HStack
                                  width="36px"
                                  height="36px"
                                  border="36px"
                                  background={isDarkUI ? "#20222D" : "white"}
                                  cursor="pointer"
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => setIsWebAdded(false)}
                                >
                                  <IconImg
                                    url={isDarkUI ? doneIconWhite : doneIcon}
                                    width="12px"
                                    height="12px"
                                    cursor="pointer"
                                  ></IconImg>
                                </HStack>
                                <HStack
                                  width="36px"
                                  height="36px"
                                  border="36px"
                                  background="rgba(0,0,0,0.3)"
                                  cursor="pointer"
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => {
                                    setNewWebsite("");
                                    setIsWebAdded(false);
                                  }}
                                >
                                  <IconImg
                                    url={crossWhite}
                                    width="18px"
                                    height="18px"
                                    cursor="pointer"
                                  ></IconImg>
                                </HStack>
                              </HStack>
                            )}
                          </HStack>
                        </VStack>
                      </VStack>

                      <VStack
                        // background="pink"
                        height="420px"
                        minwidth="30%"
                        alignment="flex-end"
                        padding="12px 12px 12px 0"
                      >
                        {/* Close button  */}
                        <HStack
                          background={isDarkUI ? "#20222D" : "white"}
                          border="30px"
                          cursor="pointer"
                          height="42px"
                          self="none"
                          spacing="6px"
                          padding="6px 10px"
                          onClick={() => {
                            setIsEditing(false);
                          }}
                        >
                          <IconImg
                            cursor="pointer"
                            url={isDarkUI ? crossWhite : crossIcon}
                            width="21px"
                            height="21px"
                          ></IconImg>
                        </HStack>

                        <HStack width="100%" justify="flex-end">
                          <HStack
                            background="rgba(0, 0, 0, 0.21)"
                            height="42px"
                            width="240px"
                            spacing="0px"
                            border="6px"
                            blur="30px"
                            overflowx="hidden"
                          >
                            <Selector>
                              <AnimatePresence initial="false">
                                <HStack
                                  width="100%"
                                  justify={isDarkUI ? "flex-start" : "flex-end"}
                                >
                                  <HStack
                                    height="42px"
                                    width="120px"
                                    background="rgba(0, 0, 0, 0.52)"
                                    border="6px"
                                    cursor="pointer"
                                    layout
                                  ></HStack>
                                </HStack>
                              </AnimatePresence>
                            </Selector>

                            <HStack
                              width="100%"
                              cursor="pointer"
                              onClick={() => {
                                setIsDarkUI(true);
                              }}
                            >
                              <CaptionBoldShort
                                cursor="pointer"
                                textcolor="white"
                              >
                                DARK UI
                              </CaptionBoldShort>
                            </HStack>
                            <HStack
                              width="100%"
                              onClick={() => {
                                setIsDarkUI(false);
                              }}
                              cursor="pointer"
                            >
                              <CaptionBoldShort
                                textcolor="white"
                                cursor="pointer"
                              >
                                CLEAN UI
                              </CaptionBoldShort>
                            </HStack>
                          </HStack>
                        </HStack>

                        <Spacer></Spacer>

                        <label htmlFor="upload-button-banner">
                          <HStack
                            width="240px"
                            overflowx="hidden"
                            self="none"
                            style={{
                              boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.6)",
                            }}
                            whileTap={{ scale: 0.98 }}
                            cursor="pointer"
                            border="6px"
                          >
                            <IconImg
                              url={
                                banner?.preview
                                  ? banner.preview
                                  : user?.urlCover
                              }
                              width="100%"
                              height="120px"
                              border="6px"
                              backsize="cover"
                              cursor="pointer"
                            ></IconImg>

                            <OverImage>
                              <VStack
                                background="rgba(0,0,0,0.3)"
                                border="6px"
                                cursor="pointer"
                              >
                                <IconImg
                                  url={uploadIcon}
                                  width="30px"
                                  height="30px"
                                  cursor="pointer"
                                ></IconImg>
                                <CaptionBoldShort
                                  textcolor="white"
                                  cursor="pointer"
                                >
                                  CHANGE BANNER IMAGE
                                </CaptionBoldShort>
                              </VStack>
                            </OverImage>
                          </HStack>
                        </label>
                        <input
                          type="file"
                          id="upload-button-banner"
                          style={{ display: "none" }}
                          onChange={handleChangeBanner}
                        />
                      </VStack>
                    </HStack>
                    {/* Buttons */}
                    <HStack>
                      <HStack
                        height="42px"
                        background="white"
                        width="210px"
                        border="6px"
                        cursor="pointer"
                        whileTap={{ scale: 0.98 }}
                        style={{
                          boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                        }}
                        onClick={() => {
                          setConfirmCancel(true);
                        }}
                      >
                        <BodyRegular cursor="pointer">Cancel</BodyRegular>
                      </HStack>
                      <HStack
                        height="42px"
                        background="linear-gradient(166.99deg, #2868F4 37.6%, #0E27C1 115.6%)"
                        width="210px"
                        border="6px"
                        cursor="pointer"
                        whileTap={{ scale: 0.98 }}
                        style={{
                          boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <BodyRegular
                          cursor="pointer"
                          textcolor="white"
                          onClick={updateUserProfile}
                        >
                          Save Changes
                        </BodyRegular>
                      </HStack>
                    </HStack>
                    <Spacer></Spacer>
                  </VStack>
                </Content>
              </ZItem>

              <ZItem>
                <Content>
                  <VStack height="900px">
                    <HStack
                      width="100%"
                      spacing="0%"
                      height="552px"
                      alignment="flex-start"
                      self="none"
                      padding="90px 0 0 0"
                    >
                      <VStack
                        minwidth="70%"
                        height="420px"
                        alignment="flex-start"
                        padding="24px 12px 12px 12px"
                      >
                        <HStack>
                          {/* User image uploader*/}
                          <VStack
                            maxwidth="96px"
                            maxheight="96px"
                            cursor="pointer"
                            overflow="visible"
                            spacing="17px"
                          >
                            <ZStack
                              cursor="pointer"
                              width="96px"
                              minheight="96px"
                              overflow="visible"
                            >
                              <ZItem>
                                <HStack
                                  width="90px"
                                  height="90px"
                                  border="90px"
                                  background={"rgba(0,0,0,0.3)"}
                                >
                                  <IconImg
                                    url={uploadIcon}
                                    width="30px"
                                    height="30px"
                                  ></IconImg>
                                </HStack>
                              </ZItem>
                              <ZItem>
                                <label htmlFor="upload-button">
                                  {profilePicture.preview ? (
                                    <IconImg
                                      whileTap={{ scale: 0.97 }}
                                      cursor="pointer"
                                      url={profilePicture.preview}
                                      width="90px"
                                      height="90px"
                                      border="90px"
                                      backsize="cover"
                                      bordercolor="white"
                                      bordersize="3px"
                                      style={{
                                        boxShadow:
                                          "0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
                                      }}
                                    ></IconImg>
                                  ) : (
                                    <>
                                      <IconImg
                                        whileTap={{ scale: 0.97 }}
                                        cursor="pointer"
                                        url={user?.urlProfile}
                                        width="90px"
                                        height="90px"
                                        border="90px"
                                        backsize="cover"
                                        bordercolor="white"
                                        bordersize="3px"
                                        style={{
                                          boxShadow:
                                            "0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
                                        }}
                                      ></IconImg>
                                    </>
                                  )}
                                </label>
                                <input
                                  type="file"
                                  id="upload-button"
                                  style={{ display: "none" }}
                                  onChange={handleChange}
                                />
                              </ZItem>
                            </ZStack>

                            <CaptionBoldShort
                              textcolor={isDarkUI ? "#363537" : "#FAFAFA"}
                              align="center"
                            >
                              UPLOAD USER PROFILE
                            </CaptionBoldShort>
                          </VStack>

                          {/* Username and social networks selector    */}
                          <VStack alignment="flex-start">
                            <VStack
                              spacing="9px"
                              alignment="flex-start"
                              width="360px"
                            >
                              <CaptionBoldShort
                                textcolor={isDarkUI ? "#363537" : "#FAFAFA"}
                              >
                                EDIT CREATOR NAME
                              </CaptionBoldShort>

                              <InputStyled
                                placeholder={user?.userName}
                                fontsize="21px"
                                textcolor={isDarkUI ? "#363537" : "#FAFAFA"}
                                background={"rgba(0,0,0,0.3)"}
                                onChange={(event) => {
                                  setNewUserName(event.target.value);
                                }}
                              ></InputStyled>
                            </VStack>

                            <HStack spacing="12px" justify="flex-start">
                              {/* Instagram Button */}
                              {user?.instagram ? (
                                <CircleButton
                                  image={instagramColor}
                                  background={isDarkUI ? "#20222D" : "white"}
                                ></CircleButton>
                              ) : null}

                              {/* Twitter Button  */}
                              {user?.twitter ? (
                                <CircleButton
                                  image={twitterColor}
                                  background={isDarkUI ? "#20222D" : "white"}
                                ></CircleButton>
                              ) : null}

                              {/* Web Icon  */}
                              {user?.siteUrl ? (
                                <CircleButton
                                  image={webColor}
                                  background={isDarkUI ? "#20222D" : "white"}
                                ></CircleButton>
                              ) : null}

                              {/* Wallet button  */}
                              <BubbleCopied
                                logo={walletBlue}
                                address={
                                  userDomain ? userDomain : user?.XDCWallets ? truncateAddress(user.XDCWallets[0]) : ""
                                }
                                addressCreator={
                                  user?.XDCWallets ? user.XDCWallets[0] : ""
                                }
                                icon={copyIcon}
                                background={isDarkUI ? "#20222D" : "white"}
                                textColor={isDarkUI ? "#FAFAFA" : "#363537"}
                              ></BubbleCopied>
                            </HStack>
                          </VStack>
                        </HStack>

                        <Spacer></Spacer>
                        <VStack width="360px">
                          {/* Add instagram input */}

                          <HStack>
                            <InputStyled
                              icon={instagramColor}
                              background={"rgba(0,0,0,0.3)"}
                              placeholder={
                                user?.instagram
                                  ? user.instagram
                                  : "Instagram URL"
                              }
                              textcolor={isDarkUI ? "#363537" : "#FAFAFA"}
                              iconRight=""
                              iconLeft="15px"
                              padding="0 0 0 42px"
                              disabled={!isInstaAdded}
                              onChange={(event) => {
                                setNewInstagramUsername(event.target.value);
                              }}
                            ></InputStyled>

                            {!isInstaAdded ? (
                              <HStack
                                width="42px"
                                height="36px"
                                border="36px"
                                background={isDarkUI ? "#20222D" : "white"}
                                cursor="pointer"
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setIsInstaAdded(true)}
                              >
                                <IconImg
                                  url={isDarkUI ? editPencilWhite : editPencil}
                                  width="12px"
                                  height="12px"
                                  cursor="pointer"
                                ></IconImg>
                              </HStack>
                            ) : (
                              <HStack spacing="6px">
                                <HStack
                                  width="36px"
                                  height="36px"
                                  border="36px"
                                  background={isDarkUI ? "#20222D" : "white"}
                                  cursor="pointer"
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => {
                                    setIsInstaAdded(false);
                                  }}
                                >
                                  <IconImg
                                    url={isDarkUI ? doneIconWhite : doneIcon}
                                    width="12px"
                                    height="12px"
                                    cursor="pointer"
                                  ></IconImg>
                                </HStack>{" "}
                                <HStack
                                  width="36px"
                                  height="36px"
                                  border="36px"
                                  background="rgba(0,0,0,0.3)"
                                  cursor="pointer"
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => {
                                    setNewInstagramUsername("");
                                    setIsInstaAdded(false);
                                  }}
                                >
                                  <IconImg
                                    url={crossWhite}
                                    width="18px"
                                    height="18px"
                                    cursor="pointer"
                                  ></IconImg>
                                </HStack>
                              </HStack>
                            )}
                          </HStack>

                          {/* Add twitter input */}

                          <HStack>
                            <InputStyled
                              icon={twitterColor}
                              background={"rgba(0,0,0,0.3)"}
                              placeholder={
                                user?.twitter ? user.twitter : "Twitter URL"
                              }
                              textcolor={isDarkUI ? "#363537" : "#FAFAFA"}
                              iconRight=""
                              iconLeft="15px"
                              padding="0 0 0 42px"
                              disabled={!isTweetAdded}
                              onChange={(event) => {
                                setNewTwitterUsername(event.target.value);
                              }}
                            ></InputStyled>

                            {!isTweetAdded ? (
                              <HStack
                                width="42px"
                                height="36px"
                                border="36px"
                                background={isDarkUI ? "#20222D" : "white"}
                                cursor="pointer"
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setIsTweetAdded(true)}
                              >
                                <IconImg
                                  url={isDarkUI ? editPencilWhite : editPencil}
                                  width="12px"
                                  height="12px"
                                  cursor="pointer"
                                ></IconImg>
                              </HStack>
                            ) : (
                              <HStack spacing="6px">
                                <HStack
                                  width="36px"
                                  height="36px"
                                  border="36px"
                                  background={isDarkUI ? "#20222D" : "white"}
                                  cursor="pointer"
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => setIsTweetAdded(false)}
                                >
                                  <IconImg
                                    url={isDarkUI ? doneIconWhite : doneIcon}
                                    width="12px"
                                    height="12px"
                                    cursor="pointer"
                                  ></IconImg>
                                </HStack>

                                <HStack
                                  width="36px"
                                  height="36px"
                                  border="36px"
                                  background="rgba(0,0,0,0.3)"
                                  cursor="pointer"
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => {
                                    setNewTwitterUsername("");
                                    setIsTweetAdded(false);
                                  }}
                                >
                                  <IconImg
                                    url={crossWhite}
                                    width="18px"
                                    height="18px"
                                    cursor="pointer"
                                  ></IconImg>
                                </HStack>
                              </HStack>
                            )}
                          </HStack>

                          {/* Add website input */}
                          <HStack>
                            <InputStyled
                              icon={webColor}
                              background={"rgba(0,0,0,0.3)"}
                              placeholder={
                                user?.siteUrl ? user.siteUrl : "Website URL"
                              }
                              textcolor={isDarkUI ? "#363537" : "#FAFAFA"}
                              iconRight=""
                              iconLeft="15px"
                              padding="0 0 0 42px"
                              disabled={!isWebAdded}
                              onChange={(event) => {
                                setNewWebsite(event.target.value);
                              }}
                            ></InputStyled>

                            {!isWebAdded ? (
                              <HStack
                                width="42px"
                                height="36px"
                                border="36px"
                                background={isDarkUI ? "#20222D" : "white"}
                                cursor="pointer"
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setIsWebAdded(true)}
                              >
                                <IconImg
                                  url={isDarkUI ? editPencilWhite : editPencil}
                                  width="12px"
                                  height="12px"
                                  cursor="pointer"
                                ></IconImg>
                              </HStack>
                            ) : (
                              <HStack spacing="6px">
                                <HStack
                                  width="36px"
                                  height="36px"
                                  border="36px"
                                  background={isDarkUI ? "#20222D" : "white"}
                                  cursor="pointer"
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => setIsWebAdded(false)}
                                >
                                  <IconImg
                                    url={isDarkUI ? doneIconWhite : doneIcon}
                                    width="12px"
                                    height="12px"
                                    cursor="pointer"
                                  ></IconImg>
                                </HStack>
                                <HStack
                                  width="36px"
                                  height="36px"
                                  border="36px"
                                  background="rgba(0,0,0,0.3)"
                                  cursor="pointer"
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => {
                                    setNewWebsite("");
                                    setIsWebAdded(false);
                                  }}
                                >
                                  <IconImg
                                    url={crossWhite}
                                    width="18px"
                                    height="18px"
                                    cursor="pointer"
                                  ></IconImg>
                                </HStack>
                              </HStack>
                            )}
                          </HStack>
                        </VStack>
                      </VStack>

                      <VStack
                        // background="pink"
                        height="420px"
                        minwidth="30%"
                        alignment="flex-end"
                        padding="12px 12px 12px 0"
                      >
                        {/* Close button  */}
                        <HStack
                          background={isDarkUI ? "#20222D" : "white"}
                          border="30px"
                          cursor="pointer"
                          height="42px"
                          self="none"
                          spacing="6px"
                          padding="6px 10px"
                          onClick={() => {
                            setIsEditing(false);
                          }}
                        >
                          <IconImg
                            cursor="pointer"
                            url={isDarkUI ? crossWhite : crossIcon}
                            width="21px"
                            height="21px"
                          ></IconImg>
                        </HStack>

                        <HStack width="100%" justify="flex-end">
                          <HStack
                            background="rgba(0, 0, 0, 0.21)"
                            height="42px"
                            width="240px"
                            spacing="0px"
                            border="6px"
                            blur="30px"
                            overflowx="hidden"
                          >
                            <Selector>
                              <AnimatePresence initial="false">
                                <HStack
                                  width="100%"
                                  justify={isDarkUI ? "flex-start" : "flex-end"}
                                >
                                  <HStack
                                    height="42px"
                                    width="120px"
                                    background="rgba(0, 0, 0, 0.52)"
                                    border="6px"
                                    cursor="pointer"
                                    layout
                                  ></HStack>
                                </HStack>
                              </AnimatePresence>
                            </Selector>

                            <HStack
                              width="100%"
                              cursor="pointer"
                              onClick={() => {
                                setIsDarkUI(true);
                              }}
                            >
                              <CaptionBoldShort
                                cursor="pointer"
                                textcolor="white"
                              >
                                DARK UI
                              </CaptionBoldShort>
                            </HStack>
                            <HStack
                              width="100%"
                              onClick={() => {
                                setIsDarkUI(false);
                              }}
                              cursor="pointer"
                            >
                              <CaptionBoldShort
                                textcolor="white"
                                cursor="pointer"
                              >
                                CLEAN UI
                              </CaptionBoldShort>
                            </HStack>
                          </HStack>
                        </HStack>

                        <Spacer></Spacer>

                        <label htmlFor="upload-button-banner">
                          <HStack
                            width="240px"
                            overflowx="hidden"
                            self="none"
                            style={{
                              boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.6)",
                            }}
                            whileTap={{ scale: 0.98 }}
                            cursor="pointer"
                            border="6px"
                          >
                            <IconImg
                              url={
                                banner?.preview
                                  ? banner.preview
                                  : user?.urlCover
                              }
                              width="100%"
                              height="120px"
                              border="6px"
                              backsize="cover"
                              cursor="pointer"
                            ></IconImg>

                            <OverImage>
                              <VStack
                                background="rgba(0,0,0,0.3)"
                                border="6px"
                                cursor="pointer"
                              >
                                <IconImg
                                  url={uploadIcon}
                                  width="30px"
                                  height="30px"
                                  cursor="pointer"
                                ></IconImg>
                                <CaptionBoldShort
                                  textcolor="white"
                                  cursor="pointer"
                                >
                                  CHANGE BANNER IMAGE
                                </CaptionBoldShort>
                              </VStack>
                            </OverImage>
                          </HStack>
                        </label>
                        <input
                          type="file"
                          id="upload-button-banner"
                          style={{ display: "none" }}
                          onChange={handleChangeBanner}
                        />
                      </VStack>
                    </HStack>
                    {/* Buttons */}
                    <HStack>
                      <HStack
                        height="42px"
                        background="white"
                        width="210px"
                        border="6px"
                        cursor="pointer"
                        whileTap={{ scale: 0.98 }}
                        style={{
                          boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                        }}
                        onClick={() => {
                          setConfirmCancel(true);
                        }}
                      >
                        <BodyRegular cursor="pointer">Cancel</BodyRegular>
                      </HStack>
                      <HStack
                        height="42px"
                        background="linear-gradient(166.99deg, #2868F4 37.6%, #0E27C1 115.6%)"
                        width="210px"
                        border="6px"
                        cursor="pointer"
                        whileTap={{ scale: 0.98 }}
                        style={{
                          boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <BodyRegular
                          cursor="pointer"
                          textcolor="white"
                          onClick={() => {
                            updateUserProfile();
                            setIsEditing(false);
                          }}
                        >
                          Save Changes
                        </BodyRegular>
                      </HStack>
                    </HStack>
                    <Spacer></Spacer>
                  </VStack>
                </Content>
              </ZItem>
            </>
          ) : (
            <ZItem zindex="0">
              <Content>
                <VStack>
                  <HStack
                    spacing="0px"
                    width="100%"
                    height={size.width > 1024
                      ? isLoggedIn
                        ? "410px"
                        : "280px"
                      : size.width > 768
                        ? isLoggedIn
                          ? "430px"
                          : "310px"
                        : isLoggedIn
                          ? "460px"
                          : "440px"}
                    padding="90px 0 0 0"
                  >
                    <VStack
                      spacing="30px"
                      minwidth="70%"
                      padding="12px 0 0 12px"
                      justify="flex-start"
                    >
                      {/* User Image, Name and Social Networks */}

                      <HStack>
                        {/* User image */}
                        <VStack maxwidth="96px" height="96px">
                          {user.isVerified ? (
                            <VerifiedIcon>
                              <IconImg
                                url={verified}
                                width="30px"
                                height="30px"
                              ></IconImg>
                            </VerifiedIcon>
                          ) : null}
                          <IconImg
                            url={user.urlProfile}
                            width="90px"
                            height="90px"
                            border="90px"
                            backsize="cover"
                            bordercolor="white"
                            bordersize="3px"
                            style={{
                              boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
                            }}
                          ></IconImg>
                        </VStack>

                        {/* Username and social networks    */}
                        <VStack alignment="flex-start">
                          <TitleBold27
                            textcolor={
                              userSettings?.dashboardMode === "dark"
                                ? "#363537"
                                : "#FAFAFA"
                            }
                          >
                            {user?.userName}
                          </TitleBold27>
                          <HStack spacing="12px" justify="flex-start">
                            {/* Instagram Button */}
                            {user?.instagram ? (
                              <CircleButton
                                image={instagramColor}
                                background={
                                  userSettings?.dashboardMode === "dark"
                                    ? "#20222D"
                                    : "white"
                                }
                                onClick={() =>
                                  (window.location.href = user.instagram)
                                }
                              ></CircleButton>
                            ) : null}

                            {/* Twitter Button  */}
                            {user?.twitter ? (
                              <CircleButton
                                image={twitterColor}
                                background={
                                  userSettings?.dashboardMode === "dark"
                                    ? "#20222D"
                                    : "white"
                                }
                                onClick={() =>
                                  (window.location.href = user.twitter)
                                }
                              ></CircleButton>
                            ) : null}

                            {/* Web Icon  */}
                            {user?.siteUrl ? (
                              <CircleButton
                                image={webColor}
                                background={
                                  userSettings?.dashboardMode === "dark"
                                    ? "#20222D"
                                    : "white"
                                }
                                onClick={() =>
                                  (window.location.href = user.siteUrl)
                                }
                              ></CircleButton>
                            ) : null}

                            {/* Wallet button  */}
                            {user?.XDCWallets?.length !== 0 ? (
                              <BubbleCopied
                                logo={walletBlue}
                                address={
                                  userDomain ? userDomain : user?.XDCWallets ? truncateAddress(user.XDCWallets[0]) : ""
                                }
                                addressCreator={
                                  user?.XDCWallets ? user.XDCWallets[0] : ""
                                }
                                icon={copyIcon}
                                background={
                                  userSettings?.dashboardMode === "dark"
                                    ? "#20222D"
                                    : "white"
                                }
                                textColor={
                                  userSettings?.dashboardMode === "dark"
                                    ? "#FAFAFA"
                                    : "#363537"
                                }
                              ></BubbleCopied>
                            ) : null}
                          </HStack>
                        </VStack>
                      </HStack>

                      {size.width < 769 
                        && (
                          <HStack>
                            <VStack
                              background={"rgba(0,0,0,0.42)"}
                              alignment="flex-start"
                              padding="26px 18px 26px 18px"
                              border="6px"
                              maxheight="235px"
                              blur="30px"
                            >
                              {newMessage ? (
                                <>
                                  <TextAreaStyled
                                    textplace="white"
                                    padding="0px"
                                    background="rgba(0,0,0,0)"
                                    textColor={
                                      userSettings?.dashboardMode === "dark"
                                        ? "#363537"
                                        : "#FAFAFA"
                                    }
                                    placeholder="Write new message only 90 characters"
                                    fontSize="21px"
                                    fontWeight="400"
                                    height="165px"
                                    resize="none"
                                    maxLength="90"
                                    letterSpacing="-0.03em"
                                    lineHeight="33px"
                                    onChange={(event) => {
                                      setNewStatus(event.target.value);
                                    }}
                                  ></TextAreaStyled>
                                  <HStack width="100%">
                                    <HStack
                                      width="100%"
                                      minheight="42px"
                                      background={({ theme }) => theme.backElement}
                                      border="6px"
                                      cursor="pointer"
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => setNewMessage(false)}
                                    >
                                      <BodyRegular cursor="pointer">
                                        Cancel
                                      </BodyRegular>
                                    </HStack>
                                    <HStack
                                      width="100%"
                                      minheight="42px"
                                      background="linear-gradient(166.99deg, #2868F4 37.6%, #0E27C1 115.6%)"
                                      border="6px"
                                      cursor="pointer"
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => {
                                        updateUserStatus();
                                      }}
                                    >
                                      <BodyRegular
                                        textcolor="white"
                                        cursor="pointer"
                                      >
                                        Publish New
                                      </BodyRegular>
                                    </HStack>
                                  </HStack>
                                </>
                              ) : (
                                <VStack width="100%">
                                  {/* Only 90 characters */}
                                  <TitleSemi21
                                    textcolor={
                                      userSettings?.dashboardMode === "dark"
                                        ? "#363537"
                                        : "#FAFAFA"
                                    }
                                  >
                                    {user?.statusRecord?.status
                                      ? user.statusRecord.status
                                      : "We just joined the XDSea NFT Marketplace 🤩 Stay tuned for more info related to our NFTs!"}
                                  </TitleSemi21>
                                  <HStack>
                                    <CaptionSmallRegular
                                      textcolor={
                                        userSettings?.dashboardMode === "dark"
                                          ? "#363537"
                                          : "#FAFAFA"
                                      }
                                    >
                                      {user?.statusRecord?.createdAt
                                        ? determineAgoTime(
                                            new Date(user.statusRecord.createdAt)
                                          )
                                        : determineAgoTime(new Date())}
                                    </CaptionSmallRegular>
                                    <Spacer></Spacer>
                                  </HStack>
                                  {isLoggedIn ? (
                                    <HStack
                                      background={
                                        userSettings?.dashboardMode === "dark"
                                          ? "#20222D"
                                          : "white"
                                      }
                                      padding="6px 12px"
                                      border="6px"
                                      height="39px"
                                      cursor="pointer"
                                      width="100%"
                                      whileTap={{ scale: 0.96 }}
                                      onClick={() => setNewMessage(true)}
                                    >
                                      <BodyRegular
                                        textcolor={
                                          userSettings?.dashboardMode === "dark"
                                            ? "#FAFAFA"
                                            : "#363537"
                                        }
                                        cursor="pointer"
                                      >
                                        New Status
                                      </BodyRegular>

                                      <IconImg
                                        url={editPencil}
                                        width="18px"
                                        height="18px"
                                      ></IconImg>
                                    </HStack>
                                  ) : null}
                                </VStack>
                              )}
                            </VStack>
                          </HStack>
                        )
                      }
                      {/* Filter Buttons */}

                      <HStack spacing="30px">
                        {/* Collections Button */}
                        <HStack
                          onClick={() => {
                            setSubMenu(1);
                          }}
                          cursor={"pointer"}
                          variants={selection}
                          animate={subMenu === 1 ? "active" : "faded"}
                        >
                          <TitleSemi18
                            cursor="pointer"
                            textcolor={
                              userSettings?.dashboardMode === "dark"
                                ? "#26272E"
                                : "white"
                            }
                          >
                            Collections
                          </TitleSemi18>
                          <VStack
                            width="auto"
                            minwidth="26px"
                            height="26px"
                            border="30px"
                            background={
                              userSettings?.dashboardMode === "dark"
                                ? "#20222D"
                                : "white"
                            }
                            cursor="pointer"
                          >
                            <BodyRegular
                              textcolor={
                                userSettings?.dashboardMode === "dark"
                                  ? "#FAFAFA"
                                  : "#363537"
                              }
                            >
                              {collections?.length}
                            </BodyRegular>
                          </VStack>
                        </HStack>

                        {/* Nft Button */}
                        <HStack
                          onClick={() => setSubMenu(0)}
                          cursor={"pointer"}
                          variants={selection}
                          animate={subMenu === 0 ? "active" : "faded"}
                        >
                          <TitleSemi18
                            cursor="pointer"
                            textcolor={
                              userSettings?.dashboardMode === "dark"
                                ? "#20222D"
                                : "white"
                            }
                          >
                            NFTs Purchased
                          </TitleSemi18>
                          <VStack
                            width="auto"
                            minwidth="26px"
                            height="26px"
                            border="30px"
                            background={
                              userSettings?.dashboardMode === "dark"
                                ? "#20222D"
                                : "white"
                            }
                            cursor="pointer"
                            padding="0px 9px"
                          >
                            <BodyRegular
                              textcolor={
                                userSettings?.dashboardMode === "dark"
                                  ? "#FAFAFA"
                                  : "#363537"
                              }
                            >
                              {totalNfts}
                            </BodyRegular>
                          </VStack>
                        </HStack>

                        <Spacer></Spacer>
                      </HStack>
                    </VStack>

                    {/* Sidebar Content */}
                    <VStack
                      minwidth="30%"
                      height="100%"
                      padding="12px 12px 0px 0"
                      alignment="flex-end"
                      justify="flex-start"
                      spacing="12px"
                    >
                      {/* Edit button for the logged-in user */}
                      {isLoggedIn ? (
                        <HStack
                          background={
                            userSettings?.dashboardMode === "dark"
                              ? "#20222D"
                              : "white"
                          }
                          border="30px"
                          cursor="pointer"
                          minheight="42px"
                          self="none"
                          spacing="6px"
                          padding="0 6px 0 9px"
                          onClick={() => setIsEditing(true)}
                        >
                          <BodyRegular
                            textcolor={
                              userSettings?.dashboardMode === "dark"
                                ? "#FAFAFA"
                                : "#363537"
                            }
                            cursor="pointer"
                          >
                            Edit Profile
                          </BodyRegular>
                          <IconImg
                            cursor="pointer"
                            url={editProfile}
                            width="30px"
                            height="30px"
                          ></IconImg>
                        </HStack>
                      ) : null}

                      {size.width > 768
                        ? <HStack>
                          <VStack
                            background={"rgba(0,0,0,0.42)"}
                            alignment="flex-start"
                            padding="26px 18px 26px 18px"
                            border="6px"
                            maxheight="235px"
                            blur="30px"
                          >
                            {newMessage ? (
                              <>
                                <TextAreaStyled
                                  textplace="white"
                                  padding="0px"
                                  background="rgba(0,0,0,0)"
                                  textColor={
                                    userSettings?.dashboardMode === "dark"
                                      ? "#363537"
                                      : "#FAFAFA"
                                  }
                                  placeholder="Write new message only 90 characters"
                                  fontSize="21px"
                                  fontWeight="400"
                                  height="165px"
                                  resize="none"
                                  maxLength="90"
                                  letterSpacing="-0.03em"
                                  lineHeight="33px"
                                  onChange={(event) => {
                                    setNewStatus(event.target.value);
                                  }}
                                ></TextAreaStyled>
                                <HStack width="100%">
                                  <HStack
                                    width="100%"
                                    minheight="42px"
                                    background={({ theme }) => theme.backElement}
                                    border="6px"
                                    cursor="pointer"
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setNewMessage(false)}
                                  >
                                    <BodyRegular cursor="pointer">
                                      Cancel
                                    </BodyRegular>
                                  </HStack>
                                  <HStack
                                    width="100%"
                                    minheight="42px"
                                    background="linear-gradient(166.99deg, #2868F4 37.6%, #0E27C1 115.6%)"
                                    border="6px"
                                    cursor="pointer"
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                      updateUserStatus();
                                    }}
                                  >
                                    <BodyRegular
                                      textcolor="white"
                                      cursor="pointer"
                                    >
                                      Publish New
                                    </BodyRegular>
                                  </HStack>
                                </HStack>
                              </>
                            ) : (
                              <VStack width="100%">
                                {/* Only 90 characters */}
                                <TitleSemi21
                                  textcolor={
                                    userSettings?.dashboardMode === "dark"
                                      ? "#363537"
                                      : "#FAFAFA"
                                  }
                                >
                                  {user?.statusRecord?.status
                                    ? user.statusRecord.status
                                    : "We just joined the XDSea NFT Marketplace 🤩 Stay tuned for more info related to our NFTs!"}
                                </TitleSemi21>
                                <HStack>
                                  <CaptionSmallRegular
                                    textcolor={
                                      userSettings?.dashboardMode === "dark"
                                        ? "#363537"
                                        : "#FAFAFA"
                                    }
                                  >
                                    {user?.statusRecord?.createdAt
                                      ? determineAgoTime(
                                          new Date(user.statusRecord.createdAt)
                                        )
                                      : determineAgoTime(new Date())}
                                  </CaptionSmallRegular>
                                  <Spacer></Spacer>
                                </HStack>
                                {isLoggedIn ? (
                                  <HStack
                                    background={
                                      userSettings?.dashboardMode === "dark"
                                        ? "#20222D"
                                        : "white"
                                    }
                                    padding="6px 12px"
                                    border="6px"
                                    height="39px"
                                    cursor="pointer"
                                    width="100%"
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => setNewMessage(true)}
                                  >
                                    <BodyRegular
                                      textcolor={
                                        userSettings?.dashboardMode === "dark"
                                          ? "#FAFAFA"
                                          : "#363537"
                                      }
                                      cursor="pointer"
                                    >
                                      New Status
                                    </BodyRegular>

                                    <IconImg
                                      url={editPencil}
                                      width="18px"
                                      height="18px"
                                    ></IconImg>
                                  </HStack>
                                ) : null}
                              </VStack>
                            )}
                          </VStack>
                        </HStack>
                        : null
                      }

                      {/* <Activity></Activity> */}
                    </VStack>
                  </HStack>

                  {subMenu === 0 && (
                    <StickySectionHeader top="120">
                      <HStack
                        background="rgb(0,0,0, 0.3)"
                        padding="6px"
                        border="9px"
                        width="100%"
                        blur="30px"
                        spacing="0px"
                      >
                        <HStack width={
                          size.width > 1024
                            ? "1200px"
                            : size.width - 12 + "px"
                        }>
                          <FiltersButton
                            isNftFilter={true}
                            onChange={handleChangeFilterNFT}
                            params={nftParams}
                            switched={subMenu === 1}
                            maxPrice={highestPrice}
                          ></FiltersButton>
                          {/* <Swiper
                            spaceBetween={0}
                            slidesPerView={"auto"}
                            grabCursor={true}
                            onSwiper={(swiper) => console.log(swiper)}
                            onSlideChange={() => console.log("slide change")}
                            style={{
                              width: "730px",
                              margin: "0 0 0 0",
                            }}
                            mousewheel={true}
                            modules={[Mousewheel]}
                          >
                            {collectionFilters.length !== 0
                              ? collectionFilters.map((collection, i) => (
                                  <SwiperSlide
                                    style={{
                                      width: "auto",
                                      padding: "0 12px",
                                      height: "50px",
                                      background: "transparent",
                                    }}
                                  >
                                    <CollectionTab
                                      image={collection.logo.v0}
                                      name={collection.name}
                                      onClick={handleChangeFilterNFT}
                                      params={nftParams}
                                      collectionId={collection._id}
                                      filterId={i}
                                      isSelected={isCollectionFilterSelected[i]}
                                      onSelect={handleCollectionFilter}
                                    ></CollectionTab>
                                  </SwiperSlide>
                                ))
                              : null}
                          </Swiper> */}
                          <SortButtonNFTS
                            onChange={handleChangeFilterNFT}
                            params={nftParams}
                          ></SortButtonNFTS>
                        </HStack>
                      </HStack>
                    </StickySectionHeader>
                  )}

                  {/* Collection or NFT Purchased  */}
                  <HStack>
                    <ZStack height="auto" width="100%" padding="0 0 12px 0">
                      {subMenu === 0 && (
                        <VStack
                          width="100%"
                          key={"Created"}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          id={"scrollableDiv"}
                        >
                          {loading ? (
                            <VStack padding="120px">
                              <LoopLogo></LoopLogo>
                            </VStack>
                          ) : nfts.length !== 0 ? (
                            <InfiniteScroll
                              dataLength={nfts.length}
                              next={fetchMoreNFTs}
                              hasMore={nfts.length < totalNfts}
                              scrollThreshold={0.6}
                              loader={
                                <HStack
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  height="190px"
                                >
                                  <LoopLogo></LoopLogo>
                                </HStack>
                              }
                              scrollableTarget="#scrollableDiv"
                              style={{ overflow: "hidden" }}
                            >
                              <Masonry
                                columnsCount={size.width > 1200 ? 4 : 3}
                                gutter={size.width > 1024
                                  ? "15px"
                                  : "12px"}
                                style={{
                                  width:
                                    size.width > 1200
                                      ? "1200px"
                                      : size.width - 12 + "px",
                                }}
                              >
                                {nfts.map((item, i) => (
                                  <VStack
                                    key={item._id}
                                    maxwidth="100%"
                                    minheight={item.height + "px"}
                                    border="6px"
                                    cursor="pointer"
                                    overflow="hidden"
                                    whileHover={{ scale: 1.009 }}
                                  >
                                    <ZStack
                                      cursor={"pointer"}
                                      border="6px"
                                      onClick={() => {
                                        props.redirect(
                                          `nft/${item.nftContract}/${item.tokenId}`
                                        );
                                      }}
                                      onHoverStart={() => {
                                        setOwnedNFTPlaying((prevState) => {
                                          prevState[i] = true;
                                          return [...prevState];
                                        });
                                      }}
                                      onHoverEnd={() => {
                                        setOwnedNFTPlaying((prevState) => {
                                          prevState[i] = false;
                                          return [...prevState];
                                        });
                                      }}
                                    >
                                      {item.hasOpenOffer ? (
                                        <BubbleOffers>
                                          <HStack
                                            background="linear-gradient(180deg, #FF5A5A 0%, rgba(255, 90, 90, 0.88) 100%)"
                                            width="26px"
                                            height="26px"
                                            border="300px"
                                            padding="0 6px"
                                            spacing="6px"
                                          >
                                            <CaptionBoldShort textcolor="white">
                                              !
                                            </CaptionBoldShort>
                                          </HStack>
                                        </BubbleOffers>
                                      ) : null}
                                      <ZItem>
                                        {isImage(item.fileType) ? (
                                          <IconImg
                                            url={item.urlFile.v0}
                                            width="100%"
                                            height="100%"
                                            backsize="cover"
                                            border="15px"
                                          ></IconImg>
                                        ) : isVideo(item.fileType) ? (
                                          <VStack
                                            width="100%"
                                            height="100%"
                                            border="9px"
                                            background="black"
                                            overflow="hidden"
                                            animate={{ scale: 2.02 }}
                                          >
                                            <ReactPlayer
                                              url={item.urlFile.v0}
                                              playing={ownedNFTPlaying[i]}
                                              volume={0}
                                              muted={true}
                                              loop={true}
                                              width="100%"
                                              height="160%"
                                            />
                                          </VStack>
                                        ) : isAudio(item.fileType) ? (
                                          <IconImg
                                            url={item.preview.v0}
                                            width="100%"
                                            height="100%"
                                            backsize="cover"
                                            border="15px"
                                          ></IconImg>
                                        ) : null}
                                      </ZItem>
                                      <ZItem
                                        {...longPress(() => {
                                          setOwnedNFTPlaying((prevState) => {
                                            const newOwnedNFTPlaying =
                                              new Array(
                                                ownedNFTPlaying.length
                                              ).fill(false);
                                            newOwnedNFTPlaying[i] =
                                              !newOwnedNFTPlaying[i];
                                            return [...newOwnedNFTPlaying];
                                          });
                                        })}
                                      >
                                        <VStack
                                          padding="15px"
                                          background="linear-gradient(180deg, rgba(0, 0, 0, 0) 54.41%, #000000 91.67%)"
                                          border="9px"
                                        >
                                          <Spacer></Spacer>
                                          <BodyRegular
                                            textcolor={appStyle.colors.white}
                                          >
                                            {item.name}
                                          </BodyRegular>
                                        </VStack>
                                      </ZItem>
                                    </ZStack>
                                  </VStack>
                                ))}
                              </Masonry>
                            </InfiniteScroll>
                          ) : (
                            <VStack
                              border="15px"
                              width="100%"
                              minheight="300px"
                              background={({ theme }) => theme.backElement}
                            >
                              <IconImg
                                url={emptyNFT}
                                width="60px"
                                height="60px"
                              ></IconImg>
                              <BodyRegular>
                                This creator does not have any NFT yet
                              </BodyRegular>
                            </VStack>
                          )}
                        </VStack>
                      )}
                      {subMenu === 1 && (
                        <HStack
                          flexwrap="wrap"
                          justify="flex-start"
                          padding="12px"
                        >
                          {loadingCollection ? (
                            <VStack padding="120px">
                              <LoopLogo></LoopLogo>
                            </VStack>
                          ) : collections?.length !== 0 ? (
                            collections?.map((item) => (
                              <ZStack
                                maxwidth={size.width > 1024
                                  ? "49.25%"
                                  : (size.width / 2) - 20 + "px"
                                }
                                minheight={
                                  size.width < 1112 ? "320px" : "590px"
                                }
                                height={size.width < 1112 ? "320px" : "590px"}
                                border="9px"
                                overflow="hidden"
                                style={{
                                  boxShadow:
                                    " 0px 11px 12px 0px rgba(0, 0, 0, 0.2)",
                                }}
                              >
                                <ZItem>
                                  <IconImg
                                    url={item.banner.v0}
                                    width="100%"
                                    height="100%"
                                    backsize="cover"
                                    border="9px"
                                  ></IconImg>
                                </ZItem>
                                <ZItem>
                                  <VStack
                                    background="linear-gradient(180deg, rgba(0, 0, 0, 0) 54.41%, #000000 91.67%)"
                                    width="100%"
                                    height="100%"
                                    border="12px"
                                    padding="0 0 30px 0"
                                  >
                                    <Spacer></Spacer>

                                    <IconImg
                                      url={item.logo.v0}
                                      width="90px"
                                      height="90px"
                                      backsize="cover"
                                      border="90px"
                                      bordersize="3px"
                                      bordercolor="white"
                                    ></IconImg>
                                    <TitleSemi21 textcolor="white">
                                      {item.name}
                                    </TitleSemi21>
                                    <HStack
                                      self="none"
                                      height="33px"
                                      border="30px"
                                      padding="0 15px "
                                      spacing="9px"
                                      background="linear-gradient(350.1deg, #0905C4 16.98%, #2D28FF 32.68%, #59E1FF 98.99%, #71FCF4 128.65%)"
                                    >
                                      <CaptionBoldShort textcolor="white">
                                        Volume Traded
                                      </CaptionBoldShort>
                                      <BodyRegular textcolor="white">
                                      {Number(item.volumeTrade) > 100000
                                        ? Intl.NumberFormat("en-US", {
                                            notation: "compact",
                                            maximumFractionDigits: 2,
                                          }).format(Number(item.volumeTrade))
                                        : Number(item.volumeTrade).toLocaleString(
                                            undefined,
                                            {
                                              maximumFractionDigits: 2,
                                            }
                                          ) || "0"}
                                      </BodyRegular>

                                      <IconImg
                                        url={logoWhiteX}
                                        width="18px"
                                        height="18px"
                                      ></IconImg>
                                    </HStack>
                                  </VStack>
                                </ZItem>
                              </ZStack>
                            ))
                          ) : (
                            <VStack
                              border="15px"
                              width="100%"
                              minheight="300px"
                              background={({ theme }) => theme.backElement}
                            >
                              <IconImg
                                url={emptyCollection}
                                width="60px"
                                height="60px"
                              ></IconImg>
                              <BodyRegular>
                                This creator has not yet created any collection
                              </BodyRegular>
                            </VStack>
                          )}
                        </HStack>
                      )}
                    </ZStack>
                  </HStack>
                </VStack>
              </Content>
            </ZItem>
          )}
        </ZStack>
      ) : (
        <VStack padding="96px 12px 12px 12px">
          <BannerPhone>
            <IconImg
              url={user?.urlCover || gradientBase}
              backsize="cover"
              width="100%"
              height="500px"
            ></IconImg>
          </BannerPhone>

          <VStack maxwidth="96px" maxheight="96px">
            {user?.isVerified ? (
              <VerifiedIcon>
                <IconImg url={verified} width="30px" height="30px"></IconImg>
              </VerifiedIcon>
            ) : null}
            <IconImg
              url={user?.urlProfile}
              width="90px"
              height="90px"
              border="90px"
              backsize="cover"
              bordercolor="white"
              bordersize="3px"
              style={{
                boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
              }}
            ></IconImg>
          </VStack>

          {/* Username and social networks    */}
          <VStack width="100%">
          <TitleBold27
            textcolor={
              userSettings?.dashboardMode === "dark"
                ? "#363537"
                : "#FAFAFA"
            }
          >
            {user?.userName}
          </TitleBold27>
            <HStack spacing="12px" justify="center">
              {/* Instagram Button */}
              {user?.instagram ? (
                <CircleButton
                  image={instagramColor}
                  background={
                    userSettings?.dashboardMode === "dark"
                      ? "#20222D"
                      : "white"
                  }
                  onClick={() =>
                    (window.location.href = user.instagram)
                  }
                ></CircleButton>
              ) : null}

              {/* Twitter Button  */}
              {user?.twitter ? (
                <CircleButton
                  image={twitterColor}
                  background={
                    userSettings?.dashboardMode === "dark"
                      ? "#20222D"
                      : "white"
                  }
                  onClick={() =>
                    (window.location.href = user.twitter)
                  }
                ></CircleButton>
              ) : null}

              {/* Web Icon  */}
              {user?.siteUrl ? (
                <CircleButton
                  image={webColor}
                  background={
                    userSettings?.dashboardMode === "dark"
                      ? "#20222D"
                      : "white"
                  }
                  onClick={() =>
                    (window.location.href = user.siteUrl)
                  }
                ></CircleButton>
              ) : null}

              {/* Wallet button  */}
              <CircleButton image={walletBlue}
                background={
                  userSettings?.dashboardMode === "dark"
                    ? "#20222D"
                    : "white"
                }
                onClick={() => {
                  navigator.clipboard.writeText(user?.XDCWallets.length !== 0 ? user.XDCWallets[0] : "")
                }}
              ></CircleButton>
            </HStack>
          </VStack>

          <HStack>
            <VStack
              background={"rgba(0,0,0,0.42)"}
              alignment="flex-start"
              padding="18px"
              border="6px"
              maxheight="auto"
              blur="30px"
            >
              <BodyRegular textcolor={
                  userSettings?.dashboardMode === "dark"
                    ? "#363537"
                    : "#FAFAFA"
                }
              >
                {user?.statusRecord?.status
                  ? user.statusRecord.status
                  : "We just joined the XDSea NFT Marketplace 🤩 Stay tuned for more info related to our NFTs!"}
              </BodyRegular>

              <CaptionSmallRegular textcolor={
                  userSettings?.dashboardMode === "dark"
                    ? "#363537"
                    : "#FAFAFA"
                }
              >
                {user?.statusRecord?.createdAt
                  ? determineAgoTime(
                      new Date(user.statusRecord.createdAt)
                    )
                  : determineAgoTime(new Date())}
              </CaptionSmallRegular>
            </VStack>
          </HStack>

          <HStack spacing="30px" height="90px" style={{"margin-top" : "-30px"}}>
            {/* Collections Button */}
            <HStack
              onClick={() => {
                setSubMenu(1);
              }}
              cursor={"pointer"}
              variants={selection}
              animate={subMenu === 1 ? "active" : "faded"}
            >
              <BodyRegular cursor="pointer" textcolor={
                userSettings?.dashboardMode === "dark"
                  ? "#26272E"
                  : "white"
              }>Collections</BodyRegular>
              <VStack
                width="auto"
                minwidth="26px"
                height="26px"
                border="30px"
                background={
                  userSettings?.dashboardMode === "dark"
                    ? "#20222D"
                    : "white"
                }
                cursor="pointer"
                padding="0px 9px"
              >
                <BodyRegular textcolor={
                  userSettings?.dashboardMode === "dark"
                    ? "#FAFAFA"
                    : "#363537"
                }>{collections?.length}</BodyRegular>
              </VStack>
            </HStack>

            {/* Nft Button  */}
            <HStack
              onClick={() => setSubMenu(0)}
              cursor={"pointer"}
              variants={selection}
              animate={subMenu === 0 ? "active" : "faded"}
              style={size.width > 320
                ? {}
                : {"margin-left" : "-15px"}}
            >
              {size.width > 320
                ? <BodyRegular cursor="pointer" textcolor={
                  userSettings?.dashboardMode === "dark"
                    ? "#26272E"
                    : "white"
                }>NFTs Purchased</BodyRegular>
                : <BodyRegular cursor="pointer" textcolor={
                  userSettings?.dashboardMode === "dark"
                    ? "#26272E"
                    : "white"
                }>NFTs Purchased</BodyRegular>
              }
              
              <VStack
                width="auto"
                minwidth="26px"
                height="26px"
                border="30px"
                background={
                  userSettings?.dashboardMode === "dark"
                    ? "#26272E"
                    : "white"
                }
                cursor="pointer"
                padding="0px 9px"
              >
                <BodyRegular textcolor={
                    userSettings?.dashboardMode === "dark"
                      ? "white"
                      : "#26272E"
                  }
                >
                {totalNfts}</BodyRegular>
              </VStack>
            </HStack>
          </HStack>

          {subMenu === 1 && (
              loadingCollection ? (
                <VStack padding="120px">
                  <LoopLogo></LoopLogo>
                </VStack>
              ) : collections?.length !== 0 ? (
                <Swiper
                    slidesPerView={size.width > 425 ? "3" : "1"}
                    spaceBetween={9}
                    centeredSlides={false}
                    loop={true}
                    style={{
                      "--swiper-navigation-color": "#fff",
                      "--swiper-pagination-color": "#fff",
                      height: "390px",
                    }}
                    navigation={true}
                    modules={[Grid, FreeMode, Navigation, Thumbs]}
                    onSwiper={(swiper) => {}}
                    onSlideChange={() => {}}
                    className="mySwiper2"
                  > 
                    {collections?.map((item) => (
                      <SwiperSlide
                        key={"newSlide_" + item._id}
                        style={{ cursor: "pointer", border: "6px" }}
                        onClick={() =>
                          props.redirect(`collection/${item.nickName}`)
                        }
                      >
                        <ZStack
                          height={"390px"}
                          border="6px"
                          padding="12px"
                          overflow="hidden"
                          style={{
                            boxShadow:
                              "0px 11px 12px 0px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          <ZItem>
                            <IconImg
                              url={item.banner.v0}
                              width="100%"
                              height="100%"
                              backsize="cover"
                              border="6px"
                            ></IconImg>
                          </ZItem>
                          <ZItem>
                            <VStack
                              background="linear-gradient(180deg, rgba(0, 0, 0, 0) 54.41%, #000000 91.67%)"
                              width="100%"
                              height="100%"
                              border="6px"
                              padding="0 0 30px 0"
                            >
                              <Spacer></Spacer>
                              <IconImg
                                url={item.logo.v0}
                                width="90px"
                                height="90px"
                                backsize="cover"
                                border="90px"
                                bordersize="3px"
                                bordercolor="white"
                              ></IconImg>
                              <TitleSemi18 textcolor="white">
                                {item.name}
                              </TitleSemi18>
                              <HStack
                                self="none"
                                height="33px"
                                border="30px"
                                padding="0 15px "
                                spacing="9px"
                                background="linear-gradient(350.1deg, #0905C4 16.98%, #2D28FF 32.68%, #59E1FF 98.99%, #71FCF4 128.65%)"
                              >
                                <CaptionBoldShort textcolor="white">
                                  Volume Traded
                                </CaptionBoldShort>
                                <BodyRegular textcolor="white">
                                  {Number(item.volumeTrade) > 100000
                                    ? Intl.NumberFormat("en-US", {
                                        notation: "compact",
                                        maximumFractionDigits: 2,
                                      }).format(Number(item.volumeTrade))
                                    : Number(item.volumeTrade).toLocaleString(
                                        undefined,
                                        {
                                          maximumFractionDigits: 2,
                                        }
                                      ) || "0"}
                                </BodyRegular>

                                <IconImg
                                  url={logoWhiteX}
                                  width="18px"
                                  height="18px"
                                ></IconImg>
                              </HStack>
                            </VStack>
                          </ZItem>
                        </ZStack>
                      </SwiperSlide>
                ))}
                </Swiper>
              ) : (
                <VStack
                  border="15px"
                  width="100%"
                  minheight="300px"
                  background={({ theme }) => theme.backElement}
                >
                  <IconImg
                    url={emptyCollection}
                    width="60px"
                    height="60px"
                  ></IconImg>
                  <BodyRegular align="center">
                    This creator has not yet created any collection
                  </BodyRegular>
                </VStack>
              )
          )}

          {subMenu === 0 && (
            <VStack
              width="100%"
              key={"Created"}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              id={"scrollableDiv"}
            >
              {loading ? (
                <VStack padding="120px">
                  <LoopLogo></LoopLogo>
                </VStack>
              ) : nfts.length !== 0 ? (
                <InfiniteScroll
                  dataLength={nfts.length}
                  next={fetchMoreNFTs}
                  hasMore={nfts.length < totalNfts}
                  scrollThreshold={0.6}
                  loader={
                    <HStack
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      height="190px"
                    >
                      <LoopLogo></LoopLogo>
                    </HStack>
                  }
                  scrollableTarget="#scrollableDiv"
                  style={{ overflow: "hidden" }}
                >
                  <Masonry
                    columnsCount={size.width > 1200 ? 4 : 3}
                    gutter={size.width > 425
                      ? "15px"
                      : "2px"}
                    style={{
                      width:
                        size.width > 1200
                          ? "1200px"
                          : size.width > 1023
                          ? "1024px"
                          : size.width > 425
                            ? "768px"
                            : size.width - 4 + "px",
                    }}
                  >
                    {nfts.map((item, i) => (
                      <VStack
                        key={item._id}
                        maxwidth="100%"
                        minheight={(item.height / 3) + "px"}
                        border={
                          size.width > 425
                            ? "6px"
                            : "0px"
                        }
                        cursor="pointer"
                        overflow="hidden"
                        whileHover={{ scale: 1.009 }}
                      >
                        <ZStack
                          cursor={"pointer"}
                          border={
                            size.width > 425
                              ? "6px"
                              : "0px"
                          }
                          onClick={() => {
                            props.redirect(
                              `nft/${item.nftContract}/${item.tokenId}`
                            );
                          }}
                          onHoverStart={() => {
                            setOwnedNFTPlaying((prevState) => {
                              prevState[i] = true;
                              return [...prevState];
                            });
                          }}
                          onHoverEnd={() => {
                            setOwnedNFTPlaying((prevState) => {
                              prevState[i] = false;
                              return [...prevState];
                            });
                          }}
                        >
                          {item.hasOpenOffer ? (
                            <BubbleOffers>
                              <HStack
                                background="linear-gradient(180deg, #FF5A5A 0%, rgba(255, 90, 90, 0.88) 100%)"
                                width="26px"
                                height="26px"
                                border="300px"
                                padding="0 6px"
                                spacing="6px"
                              >
                                <CaptionBoldShort textcolor="white">
                                  !
                                </CaptionBoldShort>
                              </HStack>
                            </BubbleOffers>
                          ) : null}
                          <ZItem>
                            {isImage(item.fileType) ? (
                              <IconImg
                                url={item.urlFile.v0}
                                width="100%"
                                height="100%"
                                backsize="cover"
                                border={
                                  size.width > 425
                                    ? "6px"
                                    : "0px"
                                }
                              ></IconImg>
                            ) : isVideo(item.fileType) ? (
                              <VStack
                                width="100%"
                                height="100%"
                                border={
                                  size.width > 425
                                    ? "6px"
                                    : "0px"
                                }
                                background="black"
                                overflow="hidden"
                                animate={{ scale: 2.02 }}
                              >
                                <ReactPlayer
                                  url={item.urlFile.v0}
                                  playing={ownedNFTPlaying[i]}
                                  volume={0}
                                  muted={true}
                                  loop={true}
                                  width="100%"
                                  height="160%"
                                />
                              </VStack>
                            ) : isAudio(item.fileType) ? (
                              <IconImg
                                url={item.preview.v0}
                                width="100%"
                                height="100%"
                                backsize="cover"
                                border={
                                  size.width > 425
                                    ? "6px"
                                    : "0px"
                                }
                              ></IconImg>
                            ) : null}
                          </ZItem>
                          <ZItem
                            {...longPress(() => {
                              setOwnedNFTPlaying((prevState) => {
                                const newOwnedNFTPlaying =
                                  new Array(
                                    ownedNFTPlaying.length
                                  ).fill(false);
                                newOwnedNFTPlaying[i] =
                                  !newOwnedNFTPlaying[i];
                                return [...newOwnedNFTPlaying];
                              });
                            })}
                          >
                            {size.width > 425
                              ? <VStack
                                padding="15px"
                                background="linear-gradient(180deg, rgba(0, 0, 0, 0) 54.41%, #000000 91.67%)"
                                border={
                                  size.width > 425
                                    ? "6px"
                                    : "0px"
                                }
                              >
                                <Spacer></Spacer>
                                <BodyRegular
                                  textcolor={appStyle.colors.white}
                                >
                                  {item.name}
                                </BodyRegular>
                              </VStack>
                              : null
                            }                              
                          </ZItem>
                        </ZStack>
                      </VStack>
                    ))}
                  </Masonry>
                </InfiniteScroll>
              ) : (
                <VStack
                  border="15px"
                  width="100%"
                  minheight="300px"
                  background={({ theme }) => theme.backElement}
                >
                  <IconImg
                    url={emptyNFT}
                    width="60px"
                    height="60px"
                  ></IconImg>
                  <BodyRegular align="center">
                    This creator does not have any NFTs yet
                  </BodyRegular>
                </VStack>
              )}
            </VStack>
          )}
        </VStack>
      )}
    </UserSection>
  );
};

export default MyNFT;

const UserSection = styled(motion.div)`
  padding: 0 0 0;
  width: 100%;
  background: ${({ theme }) => theme.background};
  z-index: 100;
`;

const Content = styled(motion.div)`
  padding: 0px 0;
  max-width: 1200px;
  margin: 0 auto;

  z-index: 30px;
`;

const CreatorTag = styled(motion.div)`
  position: absolute;
  top: 50px;
  right: 8px;
  background: white;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: bold;
  z-index: 1;
`;

const VerifiedIcon = styled(motion.div)`
  position: absolute;
  bottom: 0px;
  right: 0px;
  z-index: 10;
`;

const BubbleOffers = styled(motion.div)`
  top: 12px;
  right: 12px;
  position: absolute;
  z-index: 100;
`;

const UserProfileBack = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 420px;
  z-index: 30px;
`;

const Selector = styled(motion.div)`
  position: absolute;
  width: 240px;
  height: 42px;
`;

const OverImage = styled(motion.div)`
  position: absolute;
  width: 240px;
  height: 120px;
`;

const Controls = styled(motion.div)`
  position: absolute;
  bottom: 10px;

  z-index: 1;
  height: 42px;
`;

const BannerPhone = styled(motion.div)`
  position: absolute;
  top: 0px;
  width: 100%;
`;

const SliderActivity = styled(motion.div)`
  position: fixed;
  z-index: 3000;
  bottom: -503px;
  width: 100%;
`;

const FadedBack = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 100;
  background: ${appStyle.colors.darkgrey60};
`;
