import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import { nftaddress } from "../../config";
import { AnimatePresence, LayoutGroup } from "framer-motion/dist/framer-motion";
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
  TitleBold21,
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
import { Collection } from "../../styles/Collections/Collection";
import { DynaMenu } from "../../styles/DynaMenu/DynaMenu";
import exampleImage from "../../images/audioCover0.png";
import instagramColor from "../../images/instagramColor.png";
import twitterColor from "../../images/twitterColor.png";
import webColor from "../../images/webColor.png";
import walletBlue from "../../images/walletBlue.png";
import useWindowSize from "../../styles/useWindowSize";
import ButtonApp from "../../styles/Buttons";
import { TextAreaStyled } from "../../styles/TextAreaStyled";
import newBlue from "../../images/newBlue.png";
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
import { isXdc, toXdc, truncateAddress } from "../../common/common";
import { Navigation, Pagination, Scrollbar, A11y, Mousewheel } from "swiper";
import { StickySectionHeader } from "../../CustomModules/sticky/StickySectionHeader.js";
import { Grid, FreeMode, Thumbs } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import editPencil from "../../images/editPencil.png";
import editPencilWhite from "../../images/editPencilWhite.png";
import confirmation from "../../images/confirmation.png";
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from "react-share";
import linkSocial from "../../images/linkSocial.png";
import whatsSocial from "../../images/whatsSocial.png";
import telegramSocial from "../../images/telegramSocial.png";
import twitterSocial from "../../images/twitterSocial.png";
import facebookSocial from "../../images/facebookSocial.png";
import copiedLink from "../../images/oklink.png";
import { NftContainer } from "../../styles/NftContainer";
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
import { getXdcDomain, LS, LS_ROOT_KEY } from "../../constant";
import { anonymousLogin } from "../../API/access";
import { TabBar } from "../Discover/TabBar";
import { ShareModal } from "../../styles/ShareModal";
import { EditProfile } from "./EditProfile";
import { ShareBar } from "./ShareBar";
import { EmptyMessage } from "./EmptyMessage";
import { UserProfileBanner } from "./UserProfileBanner";
import { UIColorSelector } from "./UIColorSelector";

const MyNFT = (props) => {
  const { userId } = useParams();
  const size = useWindowSize();

  const [isShare, setIsShare] = useState(false);
  const [collections, setCollections] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [ownedNFTPlaying, setOwnedNFTPlaying] = useState([]);
  const [totalNfts, setTotalNfts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [nftParams, setNftParams] = useState({
    pageSize: 15,
    page: 1,
  });
  const [collectionParams, setCollectionParams] = useState({
    page: 1,
    sortBy: "volumeTrade",
    sortDirection: -1,
  });
  const [isSelected, setIsSelected] = useState(true);
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
  const [copied, setCopied] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [isStake, setIsStake] = useState(false);

  const heights = [260, 360, 300];

  const webLink = `https://www.xdsea.com/user/${userId}`;

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
            await getCollections({ ...collectionParams, userId: id })
          ).data;

          setCollections(collectionData.collections);
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
    setCollectionParams((prevState) => ({
      ...prevState,
      userId: id,
      page: prevState.page + 1,
    }));
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
   * Get the next page of created collections of the user
   */
  const fetchMoreCollections = async () => {
    let collectionData = await (await getCollections(collectionParams)).data;

    setCollections([...collections, ...collectionData.collections]);
    setCollectionParams({
      ...collectionParams,
      page: collectionParams.page + 1,
    });
  };

  /**
   * Get the filtered list of created collections of the user
   *
   * @param {*} params parameters used to filter the query results
   */
  const updateCollections = async (params) => {
    let collectionData = await (await getCollections(params)).data;

    setCollections(collectionData.collections);
    setCollectionParams({
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

  const handleNFTLongPress = (i, isNew) => {
    if (!isNew) {
      setOwnedNFTPlaying((prevState) => {
        prevState[i] = !prevState[i];
        return [...prevState];
      });
    } else {
      const newNftPlaying = new Array(ownedNFTPlaying.length).fill(false);
      newNftPlaying[i] = !newNftPlaying[i];
      setOwnedNFTPlaying([...newNftPlaying]);
    }
  };

  /**
   * React Hook to re-render the component when the userId state changes
   */
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsSelected(true);
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

  /**
   * Update Collection list based on the filters chosen by the user
   *
   * @param {*} params parameters used to filter query results
   */
  const handleChangeFilter = (params) => {
    setCollectionParams(params);
    updateCollections(params);
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
    let nickname = userId;
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
      nickname = updateSuccess.data.user.nickName;
    }
    if (userSettings?.dashboardMode !== (isDarkUI ? "dark" : "light")) {
      const updateSettingsSuccess = await updateUserSettings({
        dashboardMode: isDarkUI ? "dark" : "light",
      });
    }

    let userData = (await getUser(nickname)).data;
    setUser(userData.user);
    LS.removeAll();
    const { data } = await anonymousLogin(userData.user.XDCWallets[0]);
    LS.set(LS_ROOT_KEY, data);
    props?.getUser();
    setUserSettings(userData.settings);
    setIsProfileUpdated(false);
    setIsEditing(false);
    window.history.replaceState(
      { path: `/user/${nickname}` },
      "",
      `/user/${nickname}`
    );
  };

  const updateUserStatus = async () => {
    if (user.statusRecord?.status !== newStatus) {
      const updateSuccess = await await updateUser({
        newStatus,
      });
    }
    let userData = await (await getUser(user.nickName)).data;
    setUser(userData.user);
    setNewMessage(false);
  };

  return (
    <UserSection>
      {isShare && <ShareModal onClick={() => setIsShare(false)}></ShareModal>}

      <ZStack>
        <ZItem>
          <UserProfileBanner
            url={
              isEditing
                ? banner?.preview
                  ? banner.preview
                  : user.urlCover || gradientBase
                : user?.urlCover || gradientBase
            }
            height="250px"
          ></UserProfileBanner>
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

                {/* // Editing Mode */}
                <VStack spacing="30px" padding="0 0 190px 0">
                  <HStack
                    width="100%"
                    spacing="0%"
                    height="auto"
                    alignment="flex-start"
                    self="none"
                    padding="90px 0 0 0"
                  >
                    <VStack
                      width="100%"
                      height="auto"
                      alignment="flex-start"
                      padding="12px 12px 6px 5px"
                    >
                      <HStack>
                        {/* User image uploader*/}
                        <label htmlFor="upload-button">
                          <VStack
                            maxwidth="96px"
                            cursor="pointer"
                            overflow="visible"
                            spacing="6px"
                          >
                            <IconImg
                              whileTap={{ scale: 0.97 }}
                              cursor="pointer"
                              url={
                                profilePicture?.preview
                                  ? profilePicture.preview
                                  : user?.urlProfile
                              }
                              width={"82px"}
                              height="82px"
                              border="90px"
                              backsize="cover"
                              bordercolor="white"
                              bordersize="3px"
                              style={{
                                boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
                              }}
                            ></IconImg>
                            <input
                              type="file"
                              id="upload-button"
                              style={{ display: "none" }}
                              onChange={handleChange}
                            />
                            <HoverIcon>
                              <HStack
                                width="82px"
                                height="82px"
                                border="90px"
                                cursor="pointer"
                                background={({ theme }) => theme.faded30}
                              >
                                <IconImg
                                  url={uploadIcon}
                                  width="30px"
                                  height="30px"
                                  cursor="pointer"
                                ></IconImg>
                              </HStack>
                            </HoverIcon>

                            <CaptionBoldShort
                              textcolor={isDarkUI ? "#363537" : "#FAFAFA"}
                              align="center"
                            >
                              UPLOAD USER PROFILE
                            </CaptionBoldShort>
                          </VStack>
                        </label>

                        {/* Username and social networks selector    */}
                        <VStack alignment="flex-start">
                          <VStack
                            spacing="9px"
                            alignment="flex-start"
                            width={size > 660 ? "360px" : "300px"}
                          >
                            <CaptionBoldShort
                              textcolor={isDarkUI ? "#363537" : "#FAFAFA"}
                            >
                              EDIT CREATOR NAME
                            </CaptionBoldShort>

                            <InputStyled
                              placeholder={user?.userName}
                              fontsize={size.width > 660 ? "21px" : "18px"}
                              textcolor={isDarkUI ? "#363537" : "#FAFAFA"}
                              background={({ theme }) => theme.faded60}
                              onChange={(event) => {
                                setNewUserName(event.target.value);
                              }}
                              input={newUserName}
                            ></InputStyled>
                          </VStack>

                          <HStack spacing="6px" justify="flex-start">
                            {/* Wallet button  */}
                            <BubbleCopied
                              logo={walletBlue}
                              address={
                                userDomain
                                  ? userDomain
                                  : user?.XDCWallets
                                  ? truncateAddress(
                                      isXdc(user.XDCWallets[0])
                                        ? user.XDCWallets[0].toLowerCase()
                                        : toXdc(
                                            user.XDCWallets[0].toLowerCase()
                                          )
                                    )
                                  : ""
                              }
                              addressCreator={
                                user?.XDCWallets
                                  ? isXdc(user.XDCWallets[0])
                                    ? user.XDCWallets[0].toLowerCase()
                                    : toXdc(user.XDCWallets[0].toLowerCase())
                                  : ""
                              }
                              icon={copyIcon}
                              background={isDarkUI ? "#20222D" : "white"}
                              textColor={isDarkUI ? "#FAFAFA" : "#363537"}
                            ></BubbleCopied>
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
                          </HStack>
                        </VStack>
                      </HStack>
                    </VStack>

                    <VStack
                      height="auto"
                      width="100%"
                      alignment="flex-end"
                      padding="12px 12px 12px 0"
                    >
                      {/* Close button  */}

                      {size.width > 600 && (
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
                      )}

                      {size.width > 660 && (
                        <UIColorSelector
                          onClickDark={() => {
                            setIsDarkUI(true);
                          }}
                          onClickClean={() => {
                            setIsDarkUI(false);
                          }}
                        ></UIColorSelector>
                      )}
                    </VStack>
                  </HStack>

                  {size.width < 660 && (
                    <HStack padding="0 15px">
                      <UIColorSelector
                        width="100%"
                        widthTab="200px"
                        onClickDark={() => {
                          setIsDarkUI(true);
                        }}
                        onClickClean={() => {
                          setIsDarkUI(false);
                        }}
                      ></UIColorSelector>
                    </HStack>
                  )}

                  {/* Edit Options          */}
                  <HStack
                    width="100%"
                    background="white"
                    padding="21px"
                    border="6px"
                    responsive={true}
                  >
                    <VStack
                      width="100%"
                      minheight="100%"
                      padding={size.width > 660 ? "52px" : "21px"}
                      border="6px"
                      background={({ theme }) => theme.faded}
                    >
                      <VStack spacing="6px" padding="0 0 18px 0 ">
                        <BodyBold>Edit Your Social Networks</BodyBold>
                        <BodyRegular>
                          Provide your creators official social networks
                        </BodyRegular>
                      </VStack>

                      {/* Add instagram input */}
                      <HStack>
                        <InputStyled
                          icon={instagramColor}
                          background={({ theme }) => theme.faded30}
                          placeholder={
                            user?.instagram ? user.instagram : "Instagram URL"
                          }
                          textcolor={({ theme }) => theme.text}
                          iconRight=""
                          textplace={({ theme }) => theme.faded60}
                          iconLeft="15px"
                          padding="0 0 0 42px"
                          disabled={!isInstaAdded}
                          onChange={(event) => {
                            setNewInstagramUsername(event.target.value);
                          }}
                          input={newInstagramUsername}
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
                              background={({ theme }) => theme.faded60}
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
                          background={({ theme }) => theme.faded30}
                          placeholder={
                            user?.twitter ? user.twitter : "Twitter URL"
                          }
                          textcolor={({ theme }) => theme.text}
                          iconRight=""
                          textplace={({ theme }) => theme.faded60}
                          iconLeft="15px"
                          padding="0 0 0 42px"
                          disabled={!isTweetAdded}
                          onChange={(event) => {
                            setNewTwitterUsername(event.target.value);
                          }}
                          input={newTwitterUsername}
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
                              background={({ theme }) => theme.faded60}
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
                          background={({ theme }) => theme.faded30}
                          placeholder={
                            user?.siteUrl ? user.siteUrl : "Website URL"
                          }
                          textcolor={({ theme }) => theme.text}
                          iconRight=""
                          textplace={({ theme }) => theme.faded60}
                          iconLeft="15px"
                          padding="0 0 0 42px"
                          disabled={!isWebAdded}
                          onChange={(event) => {
                            setNewWebsite(event.target.value);
                          }}
                          input={newWebsite}
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
                              background={({ theme }) => theme.faded60}
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
                      <Spacer></Spacer>
                    </VStack>

                    <VStack
                      width="100%"
                      minheight="100%"
                      padding={size.width > 660 ? "52px" : "21px"}
                      border="6px"
                      background={({ theme }) => theme.faded}
                    >
                      <VStack spacing="6px" padding="0 0 18px 0">
                        <BodyBold align="center">
                          Edit Your User Profile Banner
                        </BodyBold>
                        <BodyRegular align="center">
                          Upload your creator banner image, best size is 1500px
                          by 300px
                        </BodyRegular>
                      </VStack>
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
                              banner?.preview ? banner.preview : user?.urlCover
                            }
                            width="100%"
                            height="120px"
                            border="6px"
                            backsize="cover"
                            cursor="pointer"
                          ></IconImg>

                          <HoverImage>
                            <VStack
                              background={({ theme }) => theme.faded}
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
                          </HoverImage>
                        </HStack>
                      </label>
                      <input
                        type="file"
                        id="upload-button-banner"
                        style={{ display: "none" }}
                        onChange={handleChangeBanner}
                      />
                      <Spacer></Spacer>
                    </VStack>
                  </HStack>

                  {/* Buttons */}
                  <HStack padding=" 0 15px">
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
                      onClick={updateUserProfile}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <BodyRegular cursor="pointer" textcolor="white">
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
          // Main User Profile
          <ZItem zindex="1">
            <Content>
              <VStack padding="0 0 190px 0">
                <VStack
                  spacing="39px"
                  width="100%"
                  padding="102px 0 0 12px"
                  justify="flex-start"
                >
                  {/* User Image, Name and Social Networks */}
                  <HStack>
                    {/* User image */}
                    <VStack maxwidth="82px" height="82px">
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
                        width="82px"
                        height="82px"
                        border="90px"
                        backsize="cover"
                        bordercolor="white"
                        bordersize="3px"
                        style={{
                          boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
                        }}
                      ></IconImg>
                    </VStack>

                    {/* Username and social networks desktop  */}
                    <VStack alignment="flex-start" spacing="0px">
                      <TitleBold21
                        textcolor={
                          userSettings?.dashboardMode === "dark"
                            ? "#363537"
                            : "#FAFAFA"
                        }
                      >
                        {user?.userName}
                      </TitleBold21>
                      <HStack
                        spacing="6px"
                        justify="flex-start"
                        padding="0 12px 0 0"
                      >
                        {/* Wallet button  */}
                        {user?.XDCWallets?.length !== 0 ? (
                          <BubbleCopied
                            logo={walletBlue}
                            address={
                              userDomain
                                ? userDomain
                                : user?.XDCWallets
                                ? truncateAddress(
                                    isXdc(user.XDCWallets[0])
                                      ? user.XDCWallets[0].toLowerCase()
                                      : toXdc(user.XDCWallets[0].toLowerCase())
                                  )
                                : ""
                            }
                            addressCreator={
                              user?.XDCWallets
                                ? isXdc(user.XDCWallets[0])
                                  ? user.XDCWallets[0].toLowerCase()
                                  : toXdc(user.XDCWallets[0].toLowerCase())
                                : ""
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

                        <Spacer></Spacer>

                        {/* Edit button for the logged-in user */}
                        {isLoggedIn ? (
                          <EditProfile
                            background={
                              userSettings?.dashboardMode === "dark"
                                ? "#20222D"
                                : "white"
                            }
                            textcolor={
                              userSettings?.dashboardMode === "dark"
                                ? "#FAFAFA"
                                : "#363537"
                            }
                            image={editProfile}
                            onClick={() => setIsEditing(true)}
                          ></EditProfile>
                        ) : null}
                      </HStack>
                    </VStack>
                  </HStack>

                  {/* Middle Bar Buttons */}
                  <HStack
                    style={{ alignSelf: "flex-start" }}
                    width="100%"
                    padding="0 12px 0 0"
                  >
                    <TabBar
                      width={size.width > 660 ? "366px" : "100%"}
                      initialTab={isSelected}
                      alignment="flex-start"
                      userProfile={true}
                      userSettings={userSettings}
                      collectionLength={collections?.length}
                      nftLength={totalNfts}
                      onClick={(status) => setIsSelected(status)}
                    ></TabBar>
                    <Spacer></Spacer>
                    {size.width > 660 ? (
                      <SocialAbsolute>
                        <ShareBar
                          url={webLink}
                          onClickCopied={() => {
                            navigator.clipboard.writeText(
                              user?.XDCWallets.length !== 0
                                ? user.XDCWallets[0]
                                : ""
                            );
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1500);
                          }}
                        ></ShareBar>
                      </SocialAbsolute>
                    ) : null}
                  </HStack>
                </VStack>

                {!isSelected && (
                  <StickySectionHeader top="120">
                    <HStack
                      padding="6px"
                      border="9px"
                      width="100%"
                      blur="30px"
                      spacing="0px"
                    >
                      <HStack
                        width={
                          size.width > 1024 ? "1200px" : size.width - 12 + "px"
                        }
                      >
                        <Swiper
                          spaceBetween={0}
                          slidesPerView={"auto"}
                          grabCursor={true}
                          onSwiper={(swiper) => console.log(swiper)}
                          onSlideChange={() => console.log("slide change")}
                          style={{
                            width: "100%",
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
                        </Swiper>
                      </HStack>
                    </HStack>
                  </StickySectionHeader>
                )}

                {/* Collection or NFT Purchased  */}
                <HStack>
                  <ZStack height="auto" width="100%" padding="0 0 12px 0">
                    {!isSelected && (
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
                              columnsCount={size.width > 1200 ? 4 : 1}
                              gutter={size.width > 1024 ? "15px" : "12px"}
                              style={{
                                width:
                                  size.width > 1200
                                    ? "1200px"
                                    : size.width - 24 + "px",
                              }}
                            >
                              {nfts.map((item, i) => (
                                <VStack
                                  key={item._id}
                                  minwidth="290px"
                                  minheight={item.height + "px"}
                                >
                                  <NftContainer
                                    hasStaking={item.isStakeable}
                                    isVerified={item.owner.isVerified}
                                    iconStatus={item.saleType.toLowerCase()}
                                    hasOffers={item.hasOpenOffer}
                                    creatorImage={item.owner.urlProfile}
                                    itemImage={item.urlFile.v0}
                                    itemPreview={item.preview.v0}
                                    price={item.price}
                                    collectionName={item.collectionId.name}
                                    itemNumber={item.name}
                                    fileType={item.fileType}
                                    background={({ theme }) =>
                                      theme.backElement
                                    }
                                    onClick={() =>
                                      props.redirect(
                                        `nft/${
                                          isXdc(item.nftContract)
                                            ? item.nftContract.toLowerCase()
                                            : toXdc(
                                                item.nftContract.toLowerCase()
                                              )
                                        }/${item.tokenId}`
                                      )
                                    }
                                    onClickCreator={() =>
                                      props.redirect(
                                        `user/${item.owner.nickName}`
                                      )
                                    }
                                    owner={true}
                                    usdPrice={props.xdc}
                                    collectionVerified={item.creator.isVerified}
                                    setIsPlaying={handleNFTLongPress}
                                    isPlaying={ownedNFTPlaying[i]}
                                    nftIndex={i}
                                    border="6px"
                                  ></NftContainer>
                                </VStack>
                              ))}
                            </Masonry>
                          </InfiniteScroll>
                        ) : (
                          <EmptyMessage
                            height={"390px"}
                            image={emptyNFT}
                            text={"This creator does not have any NFT yet"}
                          />
                        )}
                      </VStack>
                    )}
                    {isSelected && (
                      <HStack
                        flexwrap="wrap"
                        justify="flex-start"
                        padding="12px"
                      >
                        {collections?.length !== 0 ? (
                          collections?.map((item, i) => (
                            <LayoutGroup id="collection" key={i + item._id}>
                              <VStack
                                minwidth="360px"
                                maxwidth="360px"
                                height="360px"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <Collection
                                  key={item.name}
                                  isVerified={item.creator.isVerified}
                                  keyContent={item.name}
                                  keyID={item.addressCreator}
                                  collectionImage={item.banner.v0}
                                  creatorLogo={item.logo.v0}
                                  collectionName={item.name}
                                  collectionDescription={item.description}
                                  creatorName={item.creator.userName}
                                  onClickCollection={() =>
                                    props.redirect(
                                      `collection/${item.nickName}`
                                    )
                                  }
                                  floorprice={item.floorPrice}
                                  owners={item.owners}
                                  nfts={item.totalNfts}
                                  volumetraded={item.volumeTrade}
                                  onClickCreator={() =>
                                    props.redirect(
                                      `user/${item.creator.nickName}`
                                    )
                                  }
                                  sortVolume={true}
                                  xdc={props.xdc}
                                  isStake={isStake}
                                  stakeEnabled={item.isStakeable}
                                ></Collection>
                              </VStack>
                            </LayoutGroup>
                          ))
                        ) : (
                          <EmptyMessage
                            height={"390px"}
                            image={emptyCollection}
                            text={
                              "This creator has not yet created any collection"
                            }
                          />
                        )}
                      </HStack>
                    )}
                  </ZStack>
                </HStack>
              </VStack>
              <BottomStick>
                <DynaMenu
                  isCollections={isSelected}
                  handleFilterCollections={handleChangeFilter}
                  handleFilterNFTs={handleChangeFilterNFT}
                  collectionParams={collectionParams}
                  nftParams={nftParams}
                  isStake={isStake}
                  setIsStake={setIsStake}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  isStakingEnabled={true}
                ></DynaMenu>
              </BottomStick>
            </Content>
          </ZItem>
        )}
      </ZStack>

      {/* <ZStack>
          <ZItem>
            <VStack width="100%" height="250px" justify="flex-start">
              <IconImg
                url={
                  isEditing
                    ? banner?.preview
                      ? banner.preview
                      : user.urlCover || gradientBase
                    : user?.urlCover || gradientBase
                }
                backsize="cover"
                width="100%"
                height="100%"
              ></IconImg>
            </VStack>
          </ZItem>
          <ZItem zindex="1">
            <VStack
              background="green"
              padding="80px 12px 12px 12px"
              maxwidth="1200px"
            >
              <HStack spacing="0px" height={"130px"}>
                <VStack background="blue">
                  <HStack>
                    {user?.isVerified ? (
                      <VerifiedIcon>
                        <IconImg
                          url={verified}
                          width="30px"
                          height="30px"
                        ></IconImg>
                      </VerifiedIcon>
                    ) : null}
                    <IconImg
                      url={user?.urlProfile}
                      width="70px"
                      height="70px"
                      border="70px"
                      backsize="cover"
                      bordercolor="white"
                      bordersize="3px"
                      style={{
                        boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
                      }}
                    ></IconImg>
                    <TitleBold21
                      textcolor={
                        userSettings?.dashboardMode === "dark"
                          ? "#363537"
                          : "#FAFAFA"
                      }
                    >
                      {user?.userName}
                    </TitleBold21>
                    <Spacer></Spacer>

               
                    {isLoggedIn ? (
                      <EditProfile
                        background={
                          userSettings?.dashboardMode === "dark"
                            ? "#20222D"
                            : "white"
                        }
                        textcolor={
                          userSettings?.dashboardMode === "dark"
                            ? "#FAFAFA"
                            : "#363537"
                        }
                        image={editProfile}
                        onClick={() => setIsEditing(true)}
                      ></EditProfile>
                    ) : null}
                  </HStack>
                  <HStack justify="left" spacing="6px">
                    {user?.XDCWallets?.length !== 0 ? (
                      <BubbleCopied
                        logo={walletBlue}
                        address={
                          userDomain
                            ? userDomain
                            : user?.XDCWallets
                            ? truncateAddress(
                                isXdc(user.XDCWallets[0])
                                  ? user.XDCWallets[0].toLowerCase()
                                  : toXdc(user.XDCWallets[0].toLowerCase())
                              )
                            : ""
                        }
                        addressCreator={
                          user?.XDCWallets
                            ? isXdc(user.XDCWallets[0])
                              ? user.XDCWallets[0].toLowerCase()
                              : toXdc(user.XDCWallets[0].toLowerCase())
                            : ""
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
                    
                    {user?.instagram ? (
                      <CircleButton
                        image={instagramColor}
                        background={
                          userSettings?.dashboardMode === "dark"
                            ? "#20222D"
                            : "white"
                        }
                        onClick={() => (window.location.href = user.instagram)}
                      ></CircleButton>
                    ) : null}

                
                    {user?.twitter ? (
                      <CircleButton
                        image={twitterColor}
                        background={
                          userSettings?.dashboardMode === "dark"
                            ? "#20222D"
                            : "white"
                        }
                        onClick={() => (window.location.href = user.twitter)}
                      ></CircleButton>
                    ) : null}

                
                    {user?.siteUrl ? (
                      <CircleButton
                        image={webColor}
                        background={
                          userSettings?.dashboardMode === "dark"
                            ? "#20222D"
                            : "white"
                        }
                        onClick={() => (window.location.href = user.siteUrl)}
                      ></CircleButton>
                    ) : null}

                    <Spacer></Spacer>
                  </HStack>
                </VStack>
              </HStack>

              <TabBar
                width="100%"
                initialTab={isSelected}
                alignment="flex-start"
                userProfile={true}
                userSettings={userSettings}
                collectionLength={collections?.length}
                nftLength={totalNfts}
                onClick={(status) => setIsSelected(status)}
              ></TabBar>

              {isSelected && (
                <HStack flexwrap="wrap" justify="flex-start" padding="0">
                  {collections?.length !== 0 ? (
                    collections?.map((item, i) => (
                      <LayoutGroup id="collection" key={i + item._id}>
                        <VStack
                          minwidth="290px"
                          height="380px"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Collection
                            key={item.name}
                            isVerified={item.creator.isVerified}
                            keyContent={item.name}
                            keyID={item.addressCreator}
                            collectionImage={item.banner.v0}
                            creatorLogo={item.logo.v0}
                            collectionName={item.name}
                            collectionDescription={item.description}
                            creatorName={item.creator.userName}
                            onClickCollection={() =>
                              props.redirect(`collection/${item.nickName}`)
                            }
                            floorprice={item.floorPrice}
                            owners={item.owners}
                            nfts={item.totalNfts}
                            volumetraded={item.volumeTrade}
                            onClickCreator={() =>
                              props.redirect(`user/${item.creator.nickName}`)
                            }
                            sortVolume={true}
                            xdc={props.xdc}
                          ></Collection>
                        </VStack>
                      </LayoutGroup>
                    ))
                  ) : (
                    <VStack
                      border="15px"
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
                  )}
                </HStack>
              )}
              {!isSelected && (
                <VStack
                  key={"Created"}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  id={"scrollableDiv"}
                  width="100%"
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
                        columnsCount={size.width > 428 ? 3 : 2}
                        gutter={"12px"}
                        style={{ width: size.width - 24 + "px" }}
                      >
                        {nfts.map((item, i) => (
                          <VStack
                            key={item._id}
                            minheight={item.height / 3 + "px"}
                          >
                            <NftContainer
                              hasStaking={item.isStakeable}
                              isVerified={item.owner.isVerified}
                              iconStatus={item.saleType.toLowerCase()}
                              hasOffers={item.hasOpenOffer}
                              creatorImage={item.owner.urlProfile}
                              itemImage={item.urlFile.v0}
                              itemPreview={item.preview.v0}
                              price={item.price}
                              collectionName={item.collectionId.name}
                              itemNumber={item.name}
                              fileType={item.fileType}
                              background={({ theme }) => theme.backElement}
                              onClick={() =>
                                props.redirect(
                                  `nft/${
                                    isXdc(item.nftContract)
                                      ? item.nftContract.toLowerCase()
                                      : toXdc(item.nftContract.toLowerCase())
                                  }/${item.tokenId}`
                                )
                              }
                              onClickCreator={() =>
                                props.redirect(`user/${item.owner.nickName}`)
                              }
                              owner={true}
                              usdPrice={props.xdc}
                              collectionVerified={item.creator.isVerified}
                              setIsPlaying={handleNFTLongPress}
                              isPlaying={ownedNFTPlaying[i]}
                              nftIndex={i}
                              border="6px"
                            ></NftContainer>
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
            </VStack>
            <BottomStick>
              <DynaMenu
                isCollections={isSelected}
                handleFilterCollections={handleChangeFilter}
                handleFilterNFTs={handleChangeFilterNFT}
                collectionParams={collectionParams}
                nftParams={nftParams}
                isStake={isStake}
                setIsStake={setIsStake}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                isStakingEnabled={true}
              ></DynaMenu>
            </BottomStick>
          </ZItem>
        </ZStack> */}
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

  z-index: 30;
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

const HoverImage = styled(motion.div)`
  position: absolute;
  display: block;
  width: 240px;
  height: 120px;
  cursor: pointer;
`;

const HoverIcon = styled(motion.div)`
  position: absolute;
  display: block;
  width: 82px;
  height: 118px;
  cursor: pointer;
`;

const Controls = styled(motion.div)`
  position: absolute;
  bottom: 10px;
  cursor: pointer;
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

const SocialAbsolute = styled(motion.div)`
  bottom: 45px;
  right: 0px;
`;

const BottomStick = styled(motion.div)`
  position: fixed;
  bottom: 0%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;
